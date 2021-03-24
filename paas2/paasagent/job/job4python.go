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
	"net/url"
	"os"
	"strings"
	"text/template"

	"github.com/spf13/viper"

	"paasagent/core"
)

func (appJob AppJob) env4supervisor(appContainerPath string) string {
	environment := "BK_ENV=\"production\""
	if appJob.Mode == "test" {
		environment = "BK_ENV=\"testing\""
	}

	environment = environment + ",BK_LOG_DIR=\"" + appContainerPath + "logs/" + "\""

	for key, value := range appJob.Envs {
		if key == "DB_PASSWORD" {
			value = strings.Replace(value.(string), "%", "%%", -1)
		}
		environment = fmt.Sprintf("%[1]s,%[2]s=\"%[3]s\"", environment, key, value)
	}
	return environment
}

func (appJob AppJob) genConf4Python() error {
	baseAppPath := appJob.getBaseAppPath()
	templatePath := viper.GetString("settings.TEMPLATE_PATH")

	templatePath += "/docker"

	if strings.HasPrefix(templatePath, "/") == false {
		templatePath = baseAppPath + templatePath
	}

	hostLogPath := fmt.Sprintf("%[1]s%[2]s", baseAppPath, "apps/logs")
	cfgHome := fmt.Sprintf("%[1]s%[2]s", baseAppPath, "apps/projects/"+appJob.AppCode+"/conf")
	appContainerPath := "/data/app/"

	if core.IsDirExists(cfgHome) == false {
		err := os.MkdirAll(cfgHome, os.ModePerm)
		if err != nil {
			return err
		}
	}

	isUseCelery := "false"
	if _, ok := appJob.Envs["IS_USE_CELERY"]; ok {
		isUseCelery = appJob.Envs["IS_USE_CELERY"].(string)
	}

	isUseCeleryBeat := "false"
	if appJob.ISMaster {
		if _, ok := appJob.Envs["IS_USE_CELERY_BEAT"]; ok {
			isUseCeleryBeat = appJob.Envs["IS_USE_CELERY_BEAT"].(string)
		}
	}

	isUseCeleryWithGevent := "false"
	if isUseGevent, ok := appJob.Envs["BKAPP_IS_USE_CELERY_WITH_GEVENT"]; ok {
		if isUseGevent.(string) == "True" {
			isUseCeleryWithGevent = "true"
		}
	}

	environment := appJob.env4supervisor(appContainerPath)

	hostname, _ := os.Hostname()
	context := map[string]string{
		"app_code":                  appJob.AppCode,
		"base_app_path":             baseAppPath + "apps",
		"app_project_path":          baseAppPath + "apps/projects",
		"app_container_path":        appContainerPath,
		"environment":               environment,
		"log_home":                  hostLogPath,
		"node_name":                 appJob.AppCode + hostname,
		"IS_USE_CELERY":             isUseCelery,
		"IS_USE_CELERY_BEAT":        isUseCeleryBeat,
		"IS_USE_CELERY_WITH_GEVENT": isUseCeleryWithGevent,
	}

	uwsgiTmpl, err := template.ParseFiles(templatePath + "/uwsgi.ini")
	if err != nil {
		return err
	}
	ufout, err := os.Create(fmt.Sprintf("%[1]s/%[2]s.ini", cfgHome, appJob.AppCode))
	if err != nil {
		return err
	}
	defer ufout.Close()
	err = uwsgiTmpl.Execute(ufout, context)
	if err != nil {
		return err
	}

	superTmpl, err := template.ParseFiles(templatePath + "/supervisord.conf")
	if err != nil {
		return err
	}
	sfout, err := os.Create(cfgHome + "/supervisord.conf")
	if err != nil {
		return err
	}
	defer sfout.Close()
	err = superTmpl.Execute(sfout, context)
	if err != nil {
		return err
	}

	return nil
}

func (appJob AppJob) getEnvs4Python() map[string]string {
	envMap := make(map[string]string)

	baseAppPath := appJob.getBaseAppPath()

	envMap["USE_PYPI"] = viper.GetString("settings.USE_PYPI")
	envMap["IMAGE_NAME"] = viper.GetString("settings.IMAGE_NAME")
	envMap["PYTHON3_IMAGE_NAME"] = viper.GetString("python3_settings.IMAGE_NAME")
	envMap["LOCAL_PACKAGES_PATH"] = fmt.Sprintf("%[1]s%[2]s", baseAppPath, "support-files/pkgs/")
	envMap["PYPI_SERVER_URL"] = viper.GetString("settings.PYTHON_PIP")

	envMap["CERTIFICATE_SERVER_URL"] = viper.GetString("settings.CERTIFICATE_SERVER_URL")

	pypiURL, _ := url.Parse(envMap["PYPI_SERVER_URL"])
	envMap["PYPI_SERVER_HOST"] = pypiURL.Host

	buildFile := "build"
	buildType := "docker"
	if appJob.isSaaSDeploy() {
		buildType += "/saas"
		buildFile = "buildsaas"
		saasSettings := appJob.SaaSSettings
		envMap["SaaS_PATH"] = fmt.Sprintf("%[1]s%[2]s", baseAppPath, "saasapp")
		envMap["YUM_LIST"] = fmt.Sprintf("\"%[1]s\"", saasSettings["yum"])
		envMap["PIP_LIST"] = fmt.Sprintf("\"%[1]s\"", saasSettings["pip"])

		tokens := strings.Split(saasSettings["url"].(string), "/")
		envMap["FILE_NAME"] = tokens[len(tokens)-1]
	}
	envMap["BUILD_ENTRY"] = fmt.Sprintf("/%[1]s/%[2]s", buildType, buildFile)
	envMap["BUILDER_PATH"] = fmt.Sprintf("%[1]s/%[2]s", appJob.getBuildPath(), buildType)

	appContainerPath := "/data/app/"
	envMap["ENVIRONMENT"] = appJob.env4supervisor(appContainerPath)

	hostname, _ := os.Hostname()
	envMap["NODE_NAME"] = appJob.AppCode + hostname

	isUseCeleryBeat := "false"
	if appJob.ISMaster {
		if _, ok := appJob.Envs["IS_USE_CELERY_BEAT"]; ok {
			isUseCeleryBeat = appJob.Envs["IS_USE_CELERY_BEAT"].(string)
		}
	}
	envMap["USE_CELERY_BEAT"] = isUseCeleryBeat

	return envMap
}
