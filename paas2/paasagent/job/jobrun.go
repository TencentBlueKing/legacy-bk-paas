// Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
// Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
// Licensed under the MIT License (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://opensource.org/licenses/MIT
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package job

import (
	"bufio"
	"fmt"
	"log"
	"net/url"
	"os"
	"os/exec"
	"strings"
	"syscall"
	"time"

	"github.com/spf13/viper"

	"paasagent/core"
)

type (
	// AppJob used
	AppJob struct {
		AppCode      string
		Mode         string
		EventID      string
		Handle       string
		DeployToken  string
		Language     string
		ISMaster     bool
		Envs         map[string]interface{}
		DeployVars   map[string]interface{}
		SaaSSettings map[string]interface{}
	}

	// EventLog used
	EventLog struct {
		Status string `json:"status"`
		Log    string `json:"log"`
	}
)

func (appJob AppJob) genConfig() error {
	if appJob.Language == "java" {
		return appJob.genConf4Java()
	}
	return appJob.genConf4Python()
}

func (appJob AppJob) getBaseAppPath() string {
	baseAppPath := viper.GetString("settings.BASE_APP_PATH")
	if strings.HasSuffix(baseAppPath, "/") == false {
		baseAppPath = baseAppPath + "/"
	}
	return baseAppPath
}

func (appJob AppJob) getBuildPath() string {
	buildPath := viper.GetString("settings.BUILD_PATH")
	if strings.HasPrefix(buildPath, "/") == false {
		buildPath = appJob.getBaseAppPath() + buildPath
	}
	return buildPath
}

func (appJob AppJob) getEnvs() map[string]string {
	envCommanMap := appJob.getCommonEnvs()
	envMap := make(map[string]string)
	if appJob.Language == "java" {
		envMap = appJob.getEnvs4Java()
	} else {
		envMap = appJob.getEnvs4Python()
	}
	for key, value := range envCommanMap {
		envMap[key] = fmt.Sprintf("%[1]s", value)
	}
	return envMap
}

func (appJob AppJob) getCommonEnvs() map[string]string {
	envMap := make(map[string]string)

	if appJob.Handle == "ON" {
		for key, value := range appJob.Envs {
			envMap[key] = fmt.Sprintf("%[1]s", value)
		}
		if _, ok := envMap["BKAPP_CONTAINER_MEM"]; !ok {
			envMap["BKAPP_CONTAINER_MEM"] = "512"
		}
		for key, value := range appJob.DeployVars {
			if value == nil {
				value = ""
			}
			envMap[key] = fmt.Sprintf("%[1]s", value)
		}
		// check if VCS_CHECKOUT_TARGET in DeployVars
		if _, ok := envMap["VCS_CHECKOUT_TARGET"]; !ok {
			envMap["VCS_CHECKOUT_TARGET"] = ""
		}

		if envMap["VCS_TYPE"] == "git" {
			vcsUsername, vcsPassword := url.QueryEscape(envMap["VCS_USERNAME"]),
				url.QueryEscape(envMap["VCS_PASSWORD"])
			if strings.HasPrefix(envMap["VCS_PATH"], "http") {
				pathArray := strings.Split(envMap["VCS_PATH"], "//")
				envMap["VCS_PATH"] = fmt.Sprintf("%[1]s//%[2]s:%[3]s@%[4]s", pathArray[0], vcsUsername, vcsPassword, pathArray[1])
			}
		}
	}

	envMap["APP_CODE"] = appJob.AppCode
	envMap["APP_ID"] = appJob.AppCode
	envMap["HANDLE"] = appJob.Handle
	envMap["APPS_UID"] = viper.GetString("settings.UID")
	envMap["APPS_GID"] = viper.GetString("settings.GID")
	baseAppPath := appJob.getBaseAppPath()
	envMap["APP_PATH"] = fmt.Sprintf("%[1]s%[2]s/", baseAppPath, "apps/projects/"+appJob.AppCode)
	hostLogPath := fmt.Sprintf("%[1]s%[2]s", baseAppPath, "apps/logs")
	envMap["HOST_LOG_PATH"] = fmt.Sprintf("%[1]s/%[2]s/", hostLogPath, appJob.AppCode)

	appContainerPath := "/data/app/"
	envMap["APP_CONTAINER_PATH"] = appContainerPath
	envMap["LOG_PATH"] = appContainerPath + "logs"
	envMap["BK_LOG_DIR"] = appContainerPath + "logs"
	// envMap["DOCKER_BIN_PATH"] = fmt.Sprintf("%[1]s%[2]s", baseAppPath, "bin")
	envMap["BK_ENV"] = "production"
	if appJob.Mode == "test" {
		envMap["BK_ENV"] = "testing"
	}

	if appJob.ISMaster == true {
		envMap["IS_MASTER"] = "true"
	}

	return envMap
}

func (appJob AppJob) isSaaSDeploy() bool {
	saasSettings := appJob.SaaSSettings
	isSaaS := "false"
	if _, ok := saasSettings["is_saas"]; ok {
		isSaaS = saasSettings["is_saas"].(string)
	}
	if isSaaS == "false" {
		return false
	}
	return true
}

func (appJob AppJob) downLoadSaaSApp(fileName string, saasPath string) error {
	saasSettings := appJob.SaaSSettings
	fileURL := saasSettings["url"].(string)
	controllerServerURL := viper.GetString("settings.CONTROLLER_SERVER_URL")
	err := core.DownLoadFile(controllerServerURL+fileURL, saasPath)
	if err != nil {
		PostEventLog(appJob.AppCode, appJob.EventID,
			&EventLog{Status: core.FAILURE, Log: fmt.Sprintf("Error occurred in downloading file %[1]s: %[2]s", fileName, err)})
		return err
	}
	// compute tar md5
	fileMd5, err := core.ComputeMd5(saasPath + "/" + fileName)
	if err != nil {
		PostEventLog(appJob.AppCode, appJob.EventID,
			&EventLog{Status: core.FAILURE, Log: fmt.Sprintf("Error occurred in calculating file %[1]s MD5 value: %[2]s", fileName, err)})
		return err
	}
	if fmt.Sprintf("%[1]x", fileMd5) != saasSettings["md5"].(string) {
		log.Println(fmt.Sprintf("%[1]s incomplete or has been modified", fileName))
	}
	return nil
}

// getJobStatus will deprecated
func (appJob AppJob) getJobStatus(line string) string {
	switch {
	case strings.Contains(line, "spawn error"):
		return core.FAILURE
	case strings.Contains(line, "FAILURE:"):
		return core.FAILURE
	case strings.Contains(line, "FATAL"):
		return core.FAILURE
	case strings.Contains(line, "JOB SUCCESS"):
		return core.SUCCESS
	case strings.Contains(line, "SUCCESS: Online Job"):
		return core.SUCCESS
	case strings.Contains(line, "SUCCESS: Offline Job"):
		return core.SUCCESS
	default:
		return core.STARTED
	}
}

func (appJob AppJob) runCmd(envMap map[string]string) error {
	env := os.Environ()
	cmdEnv := make([]string, 0, len(envMap))
	var containerEnv string
	for k, v := range envMap {
		cmdEnv = append(cmdEnv, fmt.Sprintf("%[1]s=%[2]s", k, v))
		containerEnv += fmt.Sprintf(" --env %[1]s=%[2]s", k, v)
	}
	cmdEnv = append(cmdEnv, fmt.Sprintf("ContainerEnvs=%[1]s", containerEnv))

	binary, err := exec.LookPath(appJob.getBuildPath() + envMap["BUILD_ENTRY"])
	if err != nil {
		log.Println("exec.LookPath error", err)
		return err
	}
	cmd := exec.Command(binary)
	cmd.SysProcAttr = &syscall.SysProcAttr{Setpgid: true}
	cmd.Env = append(env, cmdEnv...)
	cmdOut, _ := cmd.StdoutPipe()
	scanner := bufio.NewScanner(cmdOut)
	done := make(chan error)
	syncDone := make(chan struct{})

	startTime := time.Now()

	if err = cmd.Start(); err != nil {
		log.Println("cmd.Start error", err)
		return err
	}

	go func() {
		<-syncDone
		done <- cmd.Wait()
	}()

	go func() {
		status := core.PENDING
		var line string

		for scanner.Scan() {
			line = scanner.Text()
			status = appJob.getJobStatus(line)
			line += "\r\n"
			log.Println(line)

			if status == core.SUCCESS {
				taskTime := fmt.Sprintf("Task execution is completed, and total time consumed is %d seconds\r\n",
					int(time.Now().Sub(startTime).Seconds()))
				PostEventLog(appJob.AppCode, appJob.EventID, &EventLog{Status: status, Log: line + taskTime})
			} else {
				PostEventLog(appJob.AppCode, appJob.EventID, &EventLog{Status: status, Log: line})
			}
		}
		syncDone <- struct{}{}
	}()

	timeOutSeconds := viper.GetInt("settings.EXECUTE_TIME_LIMIT")
	select {
	case <-time.After(time.Second * time.Duration(timeOutSeconds)):
		timeoutStr := fmt.Sprintf("Task execution timeout, and the time is limited to %d seconds\r\n", timeOutSeconds)
		PostEventLog(appJob.AppCode, appJob.EventID, &EventLog{Status: core.FAILURE, Log: timeoutStr})
		log.Println("Deployment task execution timeout")
		core.KillCmdProcess(cmd.Process.Pid)
		err = <-done
		return err
	case err = <-done:
		if err != nil {
			PostEventLog(appJob.AppCode, appJob.EventID, &EventLog{Status: core.FAILURE, Log: ""})
			log.Println("error waiting for Cmd", err)
		} else {
			log.Println("RunJob end ... ...")
		}
		return err
	}

}

func (appJob AppJob) OnlineJob() error {
	err := appJob.genConfig()
	if err != nil {
		log.Println("genConfig error", err)
		PostEventLog(appJob.AppCode, appJob.EventID,
			&EventLog{Status: core.FAILURE, Log: fmt.Sprintf("An error occurred while generating configuration file: %s", err)})
		return err
	}

	envMap := appJob.getEnvs()

	if appJob.isSaaSDeploy() {
		err = appJob.downLoadSaaSApp(envMap["FILE_NAME"], envMap["SaaS_PATH"])
		if err != nil {
			log.Println(err)
			PostEventLog(appJob.AppCode, appJob.EventID, &EventLog{Status: core.FAILURE, Log: err.Error()})
			return err
		}
	}

	return appJob.runCmd(envMap)

}

func (appJob AppJob) OfflineJob() error {
	envMap := appJob.getEnvs()
	return appJob.runCmd(envMap)
}

// postEventLog to the Engine API
func PostEventLog(appCode string, eventID string, data *EventLog) {
	controllerServerURL := viper.GetString("settings.CONTROLLER_SERVER_URL")
	eventUrl := controllerServerURL + "/v1/apps/" + appCode + "/events/" + eventID
	core.DoPost(eventUrl, data)
}
