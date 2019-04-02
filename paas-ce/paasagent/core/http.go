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

package core

import (
	"strings"

	"github.com/parnurzeal/gorequest"
	"github.com/pkg/errors"
	"github.com/spf13/viper"
)

// newReqAgent be used
func newReqAgent(method string, url string) *gorequest.SuperAgent {
	sid := viper.GetString("auth.sid")
	token := viper.GetString("auth.token")
	request := gorequest.New()
	request = request.CustomMethod(method, url)
	return request.Set("Content-Type", "application/json").Set("X-ID", sid).Set("X-TOKEN", token)
}

// DoGet be used
func DoGet(url string) (gorequest.Response, string, error) {
	reqAgent := newReqAgent("GET", url)
	resp, body, errs := reqAgent.End()
	return resp, body, errorsJoin(errs)

}

// DoPost be used
func DoPost(url string, data interface{}) (gorequest.Response, string, error) {
	reqAgent := newReqAgent("POST", url)
	resp, body, errs := reqAgent.Send(data).End()
	return resp, body, errorsJoin(errs)
}

func errorsJoin(errs []error) error {
	if errs != nil {
		var errStrings []string
		for _, err := range errs {
			errStrings = append(errStrings, err.Error())
		}
		return errors.New(strings.Join(errStrings, ";"))
	}
	return nil
}
