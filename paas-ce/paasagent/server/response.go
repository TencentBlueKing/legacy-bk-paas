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
	"net/http"

	"github.com/labstack/echo"
)

func StringResponse(c echo.Context, msg string) error {
	return c.String(http.StatusOK, msg)
}

func JsonResponse(c echo.Context, data interface{}) error {
	return c.JSON(http.StatusOK, data)
}

func ForbiddenResponse(c echo.Context, msg string) error {
	return c.JSON(http.StatusForbidden, map[string]interface{}{"error": 20100, "msg": msg})
}
