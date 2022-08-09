### 功能描述

导入服务，数据获取方式: 元数据在服务列表，导出服务即可。

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| key        | array   | 是     | 服务类型 |
| name   | string    | 是 | 服务名称 |
| catalog_id | int | 是 | 服务关联的目录ID |
| desc | string | 否 | 服务描述|
| owners         | string    | 否   | 服务负责人     |
| can_ticket_agency    | bool    | 是   | 是否可以代提单 |
| is_valid    | bool    | 是   | 是否启用，不传默认为false |
| display_type    | string    | 是   | 显示类型  |
| display_role    | string    | 是   | 显示角色，display_type 为open是值为空|
| source    | string    | 是   | 来源|
| project_key    | string    | 是   | 项目key|
| workflow    | json    | 是   | 流程数据|



### 请求参数示例

``` json
{
  "key": "request",
  "name": "测试服务",
  "catalog_id":38,
  "desc": "",
  "owners": "admin",
  "can_ticket_agency": false,
  "is_valid": true,
  "display_type": "OPEN",
  "display_role": "",
  "source": "custom",
  "project_key": "0",
  "workflow":{}
}
```
### 返回结果示例

```json
{
    "result": true,
    "code": 0,
    "message": "success",
    "data": {
        "id": 94,
        "name": "测试服务",
        "service_type": "request",
        "desc": ""
    }
}
```

### 返回结果参数说明

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
|result| bool | 返回结果，true为成功，false为失败 |
|code|int|返回码，0表示成功，其他值表示失败|
|message|string|错误信息
|data| object| 返回数据 |

### data

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
|id| int | 服务id |
|name|string|服务名|
|service_type|string|服务类型|
|desc| string| 服务描述 |
