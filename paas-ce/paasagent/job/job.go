// Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
// Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
// Licensed under the MIT License (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// 	http://opensource.org/licenses/MIT
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
	AppJob struct {
		AppCode      string
		Mode         string
		EventID      string
		Handle       string
		DeployToken  string
		Envs         map[string]interface{}
		DeployVars   map[string]interface{}
		SaaSSettings map[string]interface{}
	}

	// EventLog
	EventLog struct {
		Status string `json:"status"`
		Log    string `json:"log"`
	}
)

// postEventLog to the Engine API
func postEventLog(appCode string, eventID string, data *EventLog) {
	controllerServerURL := viper.GetString("settings.CONTROLLER_SERVER_URL")
	eventUrl := controllerServerURL + "/v1/apps/" + appCode + "/events/" + eventID
	core.DoPost(eventUrl, data)
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

func (appJob AppJob) getCtx4Conf() map[string]string {
	isUseCelery := "false"
	if _, ok := appJob.Envs["IS_USE_CELERY"]; ok {
		isUseCelery = appJob.Envs["IS_USE_CELERY"].(string)
	}
	isUseCeleryBeat := "false"
	if _, ok := appJob.Envs["IS_USE_CELERY_BEAT"]; ok {
		isUseCeleryBeat = appJob.Envs["IS_USE_CELERY_BEAT"].(string)
	}
	environment := "BK_ENV=\"production\""
	if appJob.Mode == "test" {
		environment = "BK_ENV=\"testing\""
	}

	baseAppPath := appJob.getBaseAppPath()
	hostLogPath := fmt.Sprintf("%s%s", baseAppPath, "apps/logs")
	environment = environment + ",BK_LOG_DIR=\"" + hostLogPath + "/\""
	for key, value := range appJob.Envs {
		environment = fmt.Sprintf("%s,%s=\"%s\"", environment, key, value)
	}
	context := map[string]string{
		"app_code":           appJob.AppCode,
		"base_app_path":      baseAppPath + "apps",
		"app_project_path":   baseAppPath + "apps/projects",
		"environment":        environment,
		"log_home":           hostLogPath,
		"IS_USE_CELERY":      isUseCelery,
		"IS_USE_CELERY_BEAT": isUseCeleryBeat,
	}
	return context
}

func (appJob AppJob) generateConfig() error {
	baseAppPath := appJob.getBaseAppPath()
	cfgHome := fmt.Sprintf("%s%s", baseAppPath, "apps/projects/"+appJob.AppCode+"/conf")
	if !core.IsDirExists(cfgHome) {
		err := os.MkdirAll(cfgHome, os.ModePerm)
		if err != nil {
			return err
		}
	}

	templatePath := viper.GetString("settings.TEMPLATE_PATH")
	if strings.HasPrefix(templatePath, "/") == false {
		templatePath = baseAppPath + templatePath
	}

	context := appJob.getCtx4Conf()

	err := core.RenderTemplate(templatePath+"/uwsgi.ini", fmt.Sprintf("%s/%s.ini", cfgHome, appJob.AppCode), context)
	if err != nil {
		return err
	}

	err = core.RenderTemplate(templatePath+"/supervisord.conf", cfgHome+"/supervisord.conf", context)
	return err
}

// getEnvs generates environment variables for app runtime
func (appJob AppJob) getEnvs() map[string]string {
	envMap := make(map[string]string)
	if appJob.Handle == "ON" {
		for key, value := range appJob.Envs {
			envMap[key] = fmt.Sprintf("%s", value)
		}
		for key, value := range appJob.DeployVars {
			envMap[key] = fmt.Sprintf("%s", value)
		}
		if envMap["VCS_TYPE"] == "git" {
			vcsUsername, vcsPassword := url.QueryEscape(envMap["VCS_USERNAME"]),
				url.QueryEscape(envMap["VCS_PASSWORD"])
			if strings.HasPrefix(envMap["VCS_PATH"], "http") {
				pathArray := strings.Split(envMap["VCS_PATH"], "//")
				envMap["VCS_PATH"] = fmt.Sprintf("%s//%s:%s@%s",
					pathArray[0], vcsUsername, vcsPassword, pathArray[1])
			}
		}
	}

	baseAppPath := appJob.getBaseAppPath()
	hostLogPath := fmt.Sprintf("%s%s", baseAppPath, "apps/logs")
	envMap["BASE_PATH"] = viper.GetString("settings.BASE_PATH")
	envMap["BASE_APP_PATH"] = baseAppPath
	envMap["APP_PATH"] = fmt.Sprintf("%s%s", baseAppPath, "apps/projects/"+appJob.AppCode)
	envMap["APP_CODE"] = appJob.AppCode
	envMap["HANDLE"] = appJob.Handle
	envMap["LOG_PATH"] = fmt.Sprintf("%s/%s", hostLogPath, appJob.AppCode)
	envMap["BK_LOG_DIR"] = hostLogPath
	envMap["PYPI_SERVER_URL"] = viper.GetString("settings.PYTHON_PIP")
	pypiURL, _ := url.Parse(envMap["PYPI_SERVER_URL"])
	envMap["PYPI_SERVER_HOST"] = pypiURL.Host

	envMap["BK_ENV"] = "production"
	if appJob.Mode == "test" {
		envMap["BK_ENV"] = "testing"
	}

	// user app and s-mart app use different build scripts
	envMap["BUILD_ENTRY"] = "/virtualenv/build"
	if appJob.isSaaSDeploy() {
		envMap["BUILD_ENTRY"] = "/virtualenv/saas/buildsaas"
		saasSettings := appJob.SaaSSettings
		envMap["YUM_LIST"] = fmt.Sprintf("%s", saasSettings["yum"])
		envMap["PIP_LIST"] = fmt.Sprintf("%s", saasSettings["pip"])
		envMap["SaaS_PATH"] = fmt.Sprintf("%s%s", baseAppPath, "saasapp")

		urlSplitArray := strings.Split(saasSettings["url"].(string), "/")
		envMap["FILE_NAME"] = urlSplitArray[len(urlSplitArray)-1]
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
		return fmt.Errorf("error occurred in downloading file %s: %s", fileName, err)
	}
	// compute tar md5
	fileMd5, err := core.ComputeMd5(saasPath + "/" + fileName)
	if err != nil {
		return fmt.Errorf("error occurred in calculating file %s MD5 value: %s", fileName, err)
	}
	if fmt.Sprintf("%x", fileMd5) != saasSettings["md5"].(string) {
		log.Println(fmt.Sprintf("%s incomplete or has been modified", fileName))
	}
	return nil
}

// getJobStatus will deprecated
func (appJob AppJob) getJobStatus(line string) string {
	isSuccess := strings.Contains(line, "Job Done")
	if isSuccess {
		return core.SUCCESS
	}

	isFail := strings.Contains(line, "spawn error") || strings.Contains(line, "fail") ||
		strings.Contains(line, "Job Fail")
	if isFail {
		return core.FAILURE
	}

	return core.STARTED
}

func (appJob AppJob) runCmd(envMap map[string]string) error {
	env := os.Environ()
	cmdEnv := make([]string, 0, len(envMap))
	for k, v := range envMap {
		cmdEnv = append(cmdEnv, fmt.Sprintf("%s=%s", k, v))
	}

	binary, err := exec.LookPath(appJob.getBuildPath() + envMap["BUILD_ENTRY"])
	if err != nil {
		log.Println("exec.LookPath error", err)
		return err
	}
	cmd := exec.Command(binary)
	cmd.SysProcAttr = &syscall.SysProcAttr{Setpgid: true}
	cmd.Env = append(env, cmdEnv...)
	cmdOut, _ := cmd.StdoutPipe()
	// cmdErr, _ := cmd.StderrPipe()
	scanner := bufio.NewScanner(cmdOut)
	done := make(chan error)
	syncDone := make(chan struct{})

	startTime := time.Now()

	// execute build or buildsaas script to build app runtime environment and start app
	if err = cmd.Start(); err != nil {
		log.Println("cmd.Start error", err)
		return err
	}

	go func() {
		<-syncDone
		done <- cmd.Wait()
	}()

	// scan the output of the running script and post to open_paas
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
				postEventLog(appJob.AppCode, appJob.EventID, &EventLog{Status: status, Log: line + taskTime})
			} else {
				postEventLog(appJob.AppCode, appJob.EventID, &EventLog{Status: status, Log: line})
			}
		}
		syncDone <- struct{}{}
	}()

	// if the build script task times out, it will be killed
	timeOutSeconds := viper.GetInt("settings.EXECUTE_TIME_LIMIT")
	select {
	case <-time.After(time.Second * time.Duration(timeOutSeconds)):
		timeoutStr := fmt.Sprintf("Task execution timeout, and the time is limited to %d seconds\r\n", timeOutSeconds)
		postEventLog(appJob.AppCode, appJob.EventID, &EventLog{Status: core.FAILURE, Log: timeoutStr})
		log.Println("Deployment task execution timeout")
		return core.KillCmdProcess(cmd.Process.Pid)
	case err = <-done:
		if err != nil {
			postEventLog(appJob.AppCode, appJob.EventID, &EventLog{Status: core.FAILURE, Log: ""})
			log.Println("error waiting for Cmd", err)
		} else {
			log.Println("RunJob end ... ...")
		}
		return err
	}

}

func (appJob AppJob) OnlineJob() error {
	err := appJob.generateConfig()
	if err != nil {
		log.Println("generateConfig error", err)
		postEventLog(appJob.AppCode, appJob.EventID,
			&EventLog{Status: core.FAILURE,
				Log: fmt.Sprintf("An error occurred while generating configuration file: %s", err)})
		return err
	}

	envMap := appJob.getEnvs()

	if appJob.isSaaSDeploy() {
		err := appJob.downLoadSaaSApp(envMap["FILE_NAME"], envMap["SaaS_PATH"])
		if err != nil {
			log.Println(err)
			postEventLog(appJob.AppCode, appJob.EventID,
				&EventLog{Status: core.FAILURE,
					Log: err.Error()})
			return err
		}
	}

	return appJob.runCmd(envMap)

}

func (appJob AppJob) OfflineJob() error {
	envMap := appJob.getEnvs()
	return appJob.runCmd(envMap)
}
