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

package server

import (
	"fmt"
	"log"
	"strconv"

	"github.com/labstack/echo"
	"github.com/labstack/echo/engine/standard"
	"github.com/spf13/viper"

	"paasagent/core"
	"paasagent/job"
)

// DeployData used for app deployment
type DeployData struct {
	AppCode      string                 `json:"app_code"`
	Mode         string                 `json:"mode"`
	Envs         map[string]interface{} `json:"envs"`
	EventID      string                 `json:"event_id"`
	DeployToken  string                 `json:"deploy_token"`
	DeployVars   map[string]interface{} `json:"deploy_vars"`
	SaaSSettings map[string]interface{} `json:"saas_settings"`
}

func validateAgentAuth(c echo.Context) (bool, string) {
	XID := c.Request().Header().Get("X-ID")
	XTOKEN := c.Request().Header().Get("X-TOKEN")

	sid := viper.GetString("auth.sid")
	token := viper.GetString("auth.token")

	if sid == XID && token == XTOKEN {
		return true, ""
	}
	return false, "sid or token is not valid, please check"
}

func controllerStatus(controllerServerURL string) error {
	url := controllerServerURL + "/v1/healthz"
	_, _, errs := core.DoGet(url)
	return errs
}

func appJobHandler(c echo.Context, handle string) error {
	valid, msg := validateAgentAuth(c)
	if !valid {
		log.Println(msg)
		return ForbiddenResponse(c, msg)
	}

	jobData := new(DeployData)
	if err := c.Bind(jobData); err != nil {
		return JsonResponse(c, map[string]interface{}{"error": 1, "msg": "envs params loads error"})
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
				Handle:       handle,
			}
			appJob.OfflineJob()
		} else {
			appJob := job.AppJob{
				AppCode:      jobData.AppCode,
				Mode:         jobData.Mode,
				Envs:         jobData.Envs,
				EventID:      jobData.EventID,
				DeployToken:  jobData.DeployToken,
				DeployVars:   jobData.DeployVars,
				SaaSSettings: jobData.SaaSSettings,
				Handle:       handle,
			}
			appJob.OnlineJob()
		}
	}(handle)

	return JsonResponse(c, map[string]int{"error": 0})
}

func appOnlineHandler(c echo.Context) error {
	return appJobHandler(c, "ON")
}

func appOfflineHandler(c echo.Context) error {
	return appJobHandler(c, "OFF")
}

func healthzHandler(c echo.Context) error {
	valid, msg := validateAgentAuth(c)
	if !valid {
		log.Println(msg)
		return ForbiddenResponse(c, msg)
	}
	macAddrs, _ := core.GetMacAddrs()
	if len(macAddrs) > 0 {
		return JsonResponse(c, map[string]interface{}{"error": 0, "mac": macAddrs[0]})
	}
	return JsonResponse(c, map[string]interface{}{"error": 0, "mac": ""})
}

func healthzCheckHandler(c echo.Context) error {
	return StringResponse(c, "paasagent is alive")
}

func Run() error {
	controllerServerURL := viper.GetString("settings.CONTROLLER_SERVER_URL")
	if err := controllerStatus(controllerServerURL); err != nil {
		return fmt.Errorf("paasagent start failed, please make sure %s has been enabled, "+
			"and normal access to the service from this machine can be achieved.\n%s",
			controllerServerURL, err)
	}

	e := echo.New()
	e.POST("/v1/app/online", appOnlineHandler)
	e.POST("/v1/app/offline", appOfflineHandler)
	e.GET("/v1/app/healthz", healthzHandler)
	// check if paasagent is alive
	e.GET("/healthz", healthzCheckHandler)

	port := viper.GetInt("port")
	ip := viper.GetString("ip")
	log.Println("Start agent Now listen on ", ip, port)
	return e.Run(standard.New(ip + ":" + strconv.Itoa(port)))
}
