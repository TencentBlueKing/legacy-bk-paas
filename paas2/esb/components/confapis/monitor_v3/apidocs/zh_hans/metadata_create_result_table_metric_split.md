

### 功能描述

创建一个结果表CMDB拆分任务
根据给定的数据源ID，返回这个结果表的具体信息

### 请求参数

{{ common_args_desc }}

#### 通用参数

| 字段          | 类型   | 必选 | 描述                                                         |
| ------------- | ------ | ---- | ------------------------------------------------------------ |
| bk_app_code   | string | 是   | 应用ID                                                       |
| bk_app_secret | string | 是   | 安全密钥(应用 TOKEN)，可以通过 蓝鲸智云开发者中心 -> 点击应用ID -> 基本信息 获取 |
| bk_token      | string | 否   | 当前用户登录态，bk_token与bk_username必须一个有效，bk_token可以通过Cookie获取 |
| bk_username   | string | 否   | 当前用户用户名，应用免登录态验证白名单中的应用，用此字段指定当前用户 |

#### 接口参数

| 字段           | 类型   | 必选 | 描述        |
| -------------- | ------ | ---- | ----------- |
| table_id  | string | 是   | 结果表ID |
| cmdb_level | string | 是 | CMDB拆分层级名 |
| operator | string | 是 | 操作者 |


#### 请求示例

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "table_id": "system.cpu_summary",
    "cmdb_level": "set",
    "operator": "admin"
}
```

### 返回结果

| 字段       | 类型   | 描述         |
| ---------- | ------ | ------------ |
| result     | bool   | 请求是否成功 |
| code       | int    | 返回的状态码 |
| message    | string | 描述信息     |
| data       | dict   | 数据         |
| request_id | string | 请求ID       |

#### data字段说明

| 字段                | 类型   | 描述     |
| ------------------- | ------ | -------- |
| bk_data_id | int | 新创建的数据源ID  |
| table_id | string | 新创建的结果表ID | 


#### 结果示例

```json
{
    "message": "OK",
    "code": 200,
    "data": {
    	"bk_data_id": 1001,
    	"table_id": "system.cpu_summary_cmdb_level"
    },
    "result": true,
    "request_id": "408233306947415bb1772a86b9536867"
}
```
