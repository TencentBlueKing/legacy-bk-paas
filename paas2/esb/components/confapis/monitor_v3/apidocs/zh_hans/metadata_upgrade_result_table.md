### 功能描述

修改一个单业务结果表，使之升级为全业务结果表


{{ common_args_desc }}

#### 接口参数

| 字段           | 类型   | 必选 | 描述        |
| -------------- | ------ | ---- | ----------- |
| table_id  | string | 是   | 结果表ID |
| operator | string | 是 | 操作者  | 

#### 请求示例

```json
{
	"table_id_list": ["2_system.cpu", "3_system.cpu"],
}
```

### 返回结果

#### 结果示例

```json
{
    "message":"OK",
    "code":"0",
    "data": null,
    "result":true,
    "request_id":"408233306947415bb1772a86b9536867"
}
```
