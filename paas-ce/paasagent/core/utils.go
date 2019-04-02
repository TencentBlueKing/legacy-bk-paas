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
	"crypto/md5"
	"fmt"
	"io"
	"log"
	"net"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"syscall"
	"text/template"
)

// IsDirExists be used
func IsDirExists(path string) bool {
	fi, err := os.Stat(path)
	if err != nil {
		return os.IsExist(err)
	}
	return fi.IsDir()
}

// KillCmdProcess be used
func KillCmdProcess(pid int) error {
	err := syscall.Kill(-pid, syscall.SIGKILL)
	if err != nil {
		log.Println("failed to kill: ", err)
	}
	return err
}

// GetMacAddrs be used
func GetMacAddrs() ([]string, error) {
	macAddrs := []string{}
	interfaces, err := net.Interfaces()
	if err != nil {
		log.Println("GetMacAddr fail: ", err.Error())
		return macAddrs, err
	}
	for _, inter := range interfaces {
		macString := inter.HardwareAddr.String()
		if macString != "" {
			macAddrs = append(macAddrs, strings.ToUpper(macString))
		}
	}
	return macAddrs, nil
}

// DownLoadFile be used
func DownLoadFile(url string, dstPath string) error {
	tokens := strings.Split(url, "/")
	fileName := tokens[len(tokens)-1]
	if !IsDirExists(dstPath) {
		err := os.MkdirAll(dstPath, os.ModePerm)
		if err != nil {
			return fmt.Errorf("DownLoadFile fail: creating %s-%s", dstPath, err)
		}
	}
	output, err := os.Create(dstPath + "/" + fileName)
	if err != nil {
		return fmt.Errorf("DownLoadFile fail: creating %s-%s", fileName, err)
	}
	defer output.Close()
	tr := &http.Transport{DisableCompression: true}
	client := &http.Client{Transport: tr}
	response, err := client.Get(url)
	if err != nil {
		return fmt.Errorf("DownLoadFile fail: downloading %s-%s", url, err)
	}
	defer response.Body.Close()
	if response.StatusCode != 200 {
		return fmt.Errorf("DownLoadFile fail: file address %s return %d", url, response.StatusCode)
	}
	_, err = io.Copy(output, response.Body)
	if err != nil {
		return fmt.Errorf("DownLoadFile fail: copy body %s-%s", fileName, err)
	}
	return nil
}

// ComputeMd5 be used
func ComputeMd5(filePath string) ([]byte, error) {
	var result []byte
	file, err := os.Open(filePath)
	if err != nil {
		return result, err
	}
	defer file.Close()
	hash := md5.New()
	if _, err := io.Copy(hash, file); err != nil {
		return result, err
	}
	return hash.Sum(result), nil
}

// GetProjPath be used
func GetProjPath() string {
	dir, err := filepath.Abs(filepath.Dir(os.Args[0]))
	if err != nil {
		log.Fatal(err)
	}
	curlPath := strings.Replace(dir, "\\", "/", -1)
	return curlPath[:strings.LastIndex(curlPath, "/")]
}

func RenderTemplate(templateFile string, destFile string, context map[string]string) error {
	tmpl, err := template.ParseFiles(templateFile)
	if err != nil {
		return err
	}
	fout, err := os.Create(destFile)
	if err != nil {
		return err
	}
	defer fout.Close()
	return tmpl.Execute(fout, context)
}
