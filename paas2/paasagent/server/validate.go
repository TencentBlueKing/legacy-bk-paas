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
	"io/ioutil"
	"time"

	"github.com/bitly/go-simplejson"
	"github.com/labstack/echo"
	"github.com/spf13/viper"

	"paasagent/core"
)

var version string

func CheckLicense() (bool, string) {
	if version != "ee" {
		return true, "Skip Certificate verification"
	}

	certiFilePath := viper.GetString("settings.CERTIFICATE_FILE_PATH")
	rawString, err := ioutil.ReadFile(certiFilePath + "/platform.cert")
	if err != nil {
		return false, "platform.cert does not exist or has been damaged"
	}

	certiData := &CertiData{Certificate: string(rawString), PlatForm: "paas_agent", Time: fmt.Sprintf("%[1]s", time.Now())}
	certificateServerURL := viper.GetString("settings.CERTIFICATE_SERVER_URL")
	ret, err := core.DoHTTPSPost(certificateServerURL, certiFilePath+"/platform.cert", certiFilePath+"/platform.key", certiData)
	if err != nil {
		return false, fmt.Sprintf("%[1]s", err)
	}
	jsonBody, err := simplejson.NewJson([]byte(ret))
	if err != nil {
		return false, fmt.Sprintf("%[1]s", err)
	}
	if !jsonBody.Get("status").MustBool() {
		return false, jsonBody.Get("message").MustString()
	}
	retCode := jsonBody.Get("result").MustInt()
	if retCode != 0 {
		return false, jsonBody.Get("message").MustString()
	}
	return true, "Certificate verification succeeded"
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
