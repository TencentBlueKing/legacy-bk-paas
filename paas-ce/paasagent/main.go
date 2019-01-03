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

package main

import (
	"fmt"
	"log"
	"os"
	"path/filepath"

	"github.com/spf13/viper"

	"paasagent/core"
	"paasagent/server"
)

func config() error {
	viper.SetConfigName("paas_agent_config")
	viper.AddConfigPath(core.GetProjPath() + "/etc")
	return viper.ReadInConfig()
}

func initLog() error {
	logPath := viper.GetString("settings.AGENT_LOG_PATH")
	logFile, logErr := os.OpenFile(filepath.Clean(logPath), os.O_CREATE|os.O_RDWR|os.O_APPEND, 0666)
	if logErr != nil {
		return logErr
	}
	log.SetOutput(logFile)
	log.SetFlags(log.Ldate | log.Ltime | log.Lshortfile)
	return nil
}

func main() {
	err := config()
	if err != nil {
		panic(fmt.Errorf("Fatal error config file: %s \n", err))
	}

	err = initLog()
	if err != nil {
		panic(fmt.Errorf("Generating log file failed: %s \n", err))
	}

	if err = server.Run(); err != nil {
		log.Fatal(err)
	}
}
