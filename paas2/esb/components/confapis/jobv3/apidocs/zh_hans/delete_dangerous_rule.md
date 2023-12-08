### 功能描述

删除高危语句检测规则。

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段 | 类型 | 必选 | 描述           |
| ---- | ---- | ---- | -------------- |
| id   | long | 是   | 高危语句规则ID |


### 请求参数示例

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "id": 1
}
```

### 返回结果示例

```json
{
    "code": 0,
    "result": true
}
```

### 返回结果参数说明

#### response

| 字段       | 类型   | 描述                                       |
| ---------- | ------ | ------------------------------------------ |
| result     | bool   | 请求成功与否。true:请求成功；false请求失败 |
| code       | int    | 错误编码。 0表示success，>0表示失败错误    |
| message    | string | 请求失败返回的错误信息                     |
| data       | object | 请求返回的数据                             |
| permission | object | 权限信息                                   |

#### data

无
