### 功能描述

修改一个单业务结果表，使之升级为全业务结果表

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段           | 类型   | 必选 | 描述        |
| -------------- | ------ | ---- | ----------- |
| table_id_list | list | 是   | 结果表ID列表 |
| operator | string | 是 | 操作者  |

#### 请求示例

```json
{
    "bk_app_code": "xxx",
  	"bk_app_secret": "xxxxx",
  	"bk_token": "xxxx",
    "operator": "admin",
	"table_id_list": ["2_system.cpu", "3_system.cpu"],
}
```

### 返回结果

| 字段       | 类型   | 描述         |
| ---------- | ------ | ------------ |
| result     | bool   | 请求是否成功 |
| code       | int    | 返回的状态码 |
| message    | string | 描述信息     |
| data       | null   | 数据         |
| request_id | string | 请求ID       |

#### 结果示例

```json
{
    "message":"OK",
    "code": 200,
    "data": null,
    "result":true,
    "request_id":"408233306947415bb1772a86b9536867"
}
```
