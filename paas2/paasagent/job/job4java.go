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
	"fmt"
	"os"
	"strings"
	"text/template"

	"github.com/spf13/viper"

	"paasagent/core"
)

func (appJob AppJob) genConf4Java() error {
	baseAppPath := appJob.getBaseAppPath()
	cfgHome := fmt.Sprintf("%[1]s%[2]s", baseAppPath, "apps/projects/"+appJob.AppCode+"/conf")

	if core.IsDirExists(cfgHome) == false {
		err := os.MkdirAll(cfgHome, os.ModePerm)
		if err != nil {
			return err
		}
	}

	sfout, err := os.Create(cfgHome + "/supervisord.conf")
	if err != nil {
		return err
	}
	defer sfout.Close()

	context := map[string]string{
		"app_code": appJob.AppCode}

	templatePath := viper.GetString("settings.TEMPLATE_PATH")
	templatePath = templatePath + "/javadocker"
	if strings.HasPrefix(templatePath, "/") == false {
		templatePath = baseAppPath + templatePath
	}
	superTmpl, err := template.ParseFiles(templatePath + "/supervisord.conf")
	if err != nil {
		return err
	}
	err = superTmpl.Execute(sfout, context)
	if err != nil {
		return err
	}
	return nil
}

func (appJob AppJob) getEnvs4Java() map[string]string {
	envMap := make(map[string]string)
	baseAppPath := appJob.getBaseAppPath()

	if appJob.isSaaSDeploy() {
		envMap["SaaS_PATH"] = fmt.Sprintf("%[1]s%[2]s", baseAppPath, "saasapp")
		tokens := strings.Split(appJob.SaaSSettings["url"].(string), "/")
		envMap["FILE_NAME"] = tokens[len(tokens)-1]
	}

	envMap["IMAGE_NAME"] = viper.GetString("java_settings.IMAGE_NAME")
	envMap["LOCAL_PACKAGES_PATH"] = fmt.Sprintf("%[1]s%[2]s", baseAppPath, "apps/JavaEnvs")
	buildType := "javadocker"
	envMap["BUILD_ENTRY"] = fmt.Sprintf("/%[1]s/build", buildType)
	envMap["BUILDER_PATH"] = fmt.Sprintf("%[1]s/%[2]s", appJob.getBuildPath(), buildType)

	return envMap
}
