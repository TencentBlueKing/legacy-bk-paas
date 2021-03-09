# 蓝鲸智云 API 网关 SDK 使用文档

- 第一部分: API 组件的访问方式
- 第二部分: API 组件的版本说明

# 目录

[TOC]

----------------------------------------------------------

# 第一部分: API 组件的访问方式

有两种方式访问组件，shortcuts或ComponentClient。使用示例如下：

## 1. 使用shortcuts

### 1.1 get_client_by_request

```
from blueking.component.shortcuts import get_client_by_request
# 从环境配置获取APP信息，从request获取当前用户信息
client = get_client_by_request(request)
kwargs = {'bk_biz_id': 1}
result = client.cc.get_app_host_list(kwargs)
```

### 1.2 get_client_by_user

```
from blueking.component.shortcuts import get_client_by_user
# 从环境配置获取APP信息，从user获取当前用户信息，user为User对象或User中username数据
user = 'xxx'
client = get_client_by_user(user)
kwargs = {'bk_biz_id': 1}
result = client.cc.get_app_host_list(kwargs)
```


## 2. 使用ComponentClient

```
from blueking.component.client import ComponentClient
# APP信息
bk_app_code = 'xxx' 
bk_app_secret = 'xxx' 
# 用户信息
common_args = {'bk_token': 'xxx'}
# APP信息bk_app_code, bk_app_secret如未提供，从环境配置获取
client = ComponentClient(
    bk_app_code=bk_app_code, 
    bk_app_secret=bk_app_secret, 
    common_args=common_args
)
kwargs = {'bk_biz_id': 1}
result = client.cc.get_app_host_list(kwargs)
```


# 第二部分: API 组件的版本说明

蓝鲸官方提供的 API，包括 v1、v2 两个版本，推荐使用 v2 版本；
为保持兼容，SDK 同时支持访问 v1、v2 两个版本的 API。

SDK 使用 settings 中的变量 **DEFAULT_BK_API_VER** 设置访问的默认 API 版本，可选值为: "v2"（v2 版本），""（v1 版本），默认值为"v2"。

如果需要访问非默认版本的 API，可通过明确指定版本号的方式实现，如：
```
# client = get_client_by_request(request)
client = ComponentClient(xxx, xxx)
# 指定访问 v1 版本的 API
client.set_bk_api_ver("")
result = client.cc.get_app_host_list(xxx)

# 指定访问 v2 版本的 API
client.set_bk_api_ver("v2")
result = client.cc.search_host(xxx)
```
