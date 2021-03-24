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

package server

import (
	"fmt"
	"log"
	"net"
	"strconv"

	"github.com/labstack/echo"
	"github.com/labstack/echo/engine/standard"
	"github.com/spf13/viper"

	"paasagent/core"
	"paasagent/core/errcodes"
	"paasagent/job"
)

// DeployData be used
type DeployData struct {
	AppCode      string                 `json:"app_code"`
	Mode         string                 `json:"mode"`
	Envs         map[string]interface{} `json:"envs"`
	EventID      string                 `json:"event_id"`
	ISMaster     bool                   `json:"is_master"`
	DeployToken  string                 `json:"deploy_token"`
	DeployVars   map[string]interface{} `json:"deploy_vars"`
	SaaSSettings map[string]interface{} `json:"saas_settings"`
	Language     string                 `json:"language"`
}

// CertiData be used
type CertiData struct {
	Certificate string `json:"certificate"`
	PlatForm    string `json:"platform"`
	Time        string `json:"requesttime"`
}

func controllerStatus(controllerServerURL string) error {
	url := controllerServerURL + "/v1/healthz"
	_, _, errs := core.DoGet(url)
	return errs
}

func appOnlineHandler(c echo.Context) error {
	return appJobHandler(c, "ON")
}

func appOfflineHandler(c echo.Context) error {
	return appJobHandler(c, "OFF")
}

func appJobHandler(c echo.Context, handle string) error {
	jobData := new(DeployData)
	if err := c.Bind(jobData); err != nil {
		return JsonResponse(c, map[string]interface{}{"error": 1, "msg": "envs params loads error"})
	}

	checkRet, checkMsg := CheckLicense()
	if !checkRet {
		job.PostEventLog(jobData.AppCode, jobData.EventID,
			&job.EventLog{Status: core.FAILURE, Log: fmt.Sprintf("%s", checkMsg)})
		return JsonResponse(c, map[string]interface{}{"error": 1, "msg": checkMsg})
	}

	valid, msg := validateAgentAuth(c)
	if !valid {
		log.Println(errcodes.E1305102_TOKEN_INVALID, msg)
		job.PostEventLog(jobData.AppCode, jobData.EventID,
			&job.EventLog{Status: core.FAILURE, Log: fmt.Sprintf("%s", msg)})
		return ForbiddenResponse(c, msg)
	}

	go func(handle string) {
		log.Println("RunJob start ... ...")
		if handle == "OFF" {
			appJob := job.AppJob{
				AppCode:      jobData.AppCode,
				Mode:         jobData.Mode,
				Envs:         map[string]interface{}{"BK_VERSION": "2.0"},
				EventID:      jobData.EventID,
				DeployToken:  jobData.DeployToken,
				DeployVars:   jobData.DeployVars,
				SaaSSettings: jobData.SaaSSettings,
				Language:     jobData.Language,
				Handle:       handle,
			}
			appJob.OfflineJob()
		} else {
			appJob := job.AppJob{
				AppCode:      jobData.AppCode,
				Mode:         jobData.Mode,
				Envs:         jobData.Envs,
				ISMaster:     jobData.ISMaster,
				EventID:      jobData.EventID,
				DeployToken:  jobData.DeployToken,
				DeployVars:   jobData.DeployVars,
				SaaSSettings: jobData.SaaSSettings,
				Language:     jobData.Language,
				Handle:       handle,
			}
			appJob.OnlineJob()
		}
	}(handle)

	return JsonResponse(c, map[string]int{"error": 0})
}

func healthzHandler(c echo.Context) error {
	valid, msg := validateAgentAuth(c)
	if !valid {
		log.Println(errcodes.E1305102_TOKEN_INVALID, msg)
		return ForbiddenResponse(c, msg)
	}

	macAddrs, _ := core.GetMacAddrs()
	if len(macAddrs) > 0 {
		return JsonResponse(c, map[string]interface{}{"error": 0, "mac": macAddrs[0]})
	}
	return JsonResponse(c, map[string]interface{}{"error": 0, "mac": ""})
}

func healthzCheckHandler(c echo.Context) error {
	resp := map[string]interface{}{
		"code":    errcodes.E1305000_DEFAULT_CODE,
		"ok":      true,
		"message": "",
		"data":    map[string]string{},
	}
	return JsonResponse(c, resp)
}

func getPortHandler(c echo.Context) error {
	valid, msg := validateAgentAuth(c)
	if !valid {
		log.Println(errcodes.E1305102_TOKEN_INVALID, msg)
		return ForbiddenResponse(c, msg)
	}

	port := c.Param("port")
	_, err := strconv.ParseUint(port, 10, 16)
	if err != nil {
		return JsonResponse(c, map[string]interface{}{"error": 1, "msg": fmt.Sprintf("Invalid port: %[1]s", port)})
	}
	alreadyUse := false
	ln, err := net.Listen("tcp", ":"+port)
	if err != nil {
		alreadyUse = true
		log.Println(errcodes.E1305104_PORT_ERROR, "Can't listen on port", port, err)
	}
	err = ln.Close()
	if err != nil {
		alreadyUse = true
		log.Println(errcodes.E1305104_PORT_ERROR, "Couldn't stop listening on port", port, err)
	}
	return JsonResponse(c, map[string]interface{}{"error": 0, "already_use": alreadyUse})
}

func Run() error {
	checkRet, checkMsg := CheckLicense()
	if !checkRet {
		return fmt.Errorf("%s certificate verification failed: %s", errcodes.E1305101_LICENSE_INVALID, checkMsg)
	}

	controllerServerURL := viper.GetString("settings.CONTROLLER_SERVER_URL")
	if err := controllerStatus(controllerServerURL); err != nil {
		return fmt.Errorf("%s paasagent start failed, please make sure %s has been enabled, "+
			"and normal access to the service from this machine can be achieved.\n%s", errcodes.E1305103_PAAS_UNREACHABLE,
			controllerServerURL, err)
	}

	e := echo.New()
	e.POST("/v1/app/online", appOnlineHandler)
	e.POST("/v1/app/offline", appOfflineHandler)
	e.GET("/v1/app/healthz", healthzHandler)
	e.GET("/v1/app/ports/:port", getPortHandler)
	e.GET("/healthz", healthzCheckHandler)

	port := viper.GetInt("port")
	ip := viper.GetString("ip")
	log.Println("Start agent Now listen on ", ip, port)
	return e.Run(standard.New(ip + ":" + strconv.Itoa(port)))
}
