

### 功能描述

删除一个自定义时序分组
给定一个自定义时序分组ID，删除之


{{ common_args_desc }}

#### 接口参数

| 字段           | 类型   | 必选 | 描述        |
| -------------- | ------ | ---- | ----------- |
| time_series_group_id  | int | 是   | 自定义时序分组ID |
| operator  | string | 是   | 操作者 |

#### 请求示例

```json
{
	"time_series_group_id": 123,
	"operator": "admin"
}
```

### 返回结果

#### 结果示例

```json
{
    "message":"OK",
    "code":"0",
    "data": { },
    "result":true,
    "request_id":"408233306947415bb1772a86b9536867"
}
```
