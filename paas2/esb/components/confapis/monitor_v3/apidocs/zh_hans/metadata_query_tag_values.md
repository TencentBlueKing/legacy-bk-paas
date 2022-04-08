

### 功能描述

查询数据源指定指定tag/dimension的可选值

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段           | 类型   | 必选 | 描述        |
| -------------- | ------ | ---- | ----------- |
| table_id  | string | 是   | 结果表ID |
| tag_name | string | 是 | tag/dimension字段名 |


#### 请求示例

```json
{
    "bk_app_code": "xxx",
  	"bk_app_secret": "xxxxx",
  	"bk_token": "xxxx",
	"table_id": "2_bkmonitor_time_series_1500514.base",
	"tag_name": "target"
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
| tag_values | list | tag/dimension的值  |

####  结果示例

```json
{
    "message":"OK",
    "code": 200,
    "data": {
    	"tag_values": ["target1", "target2"]
    },
    "result":true,
    "request_id":"408233306947415bb1772a86b9536867"
}
```
