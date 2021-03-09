### 功能描述

关闭审批单据

### 请求参数

{{ common_args_desc }}


#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| workitems | 数组 | 是 | 审批单列表 详情请参考`审批单`一节 |

__审批单（workitem）__

| 字段| 类型 | 必选 | 描述 |
|-----------|------------|--------|------------|
| process_inst_id |  string | 是 | 对应的业务单据的流水号 |
| approved_by |  string | 是 | 当前审批单据的处理人 | 
| result|  int | 是 | 操作 0: 驳回 1: 同意| 
| opinion|  string | 否 | 审批意见 | 	


### 请求参数示例

``` json
{
    "workitems": [{
	    "process_inst_id": "12",
	    "approved_by": "admin",
	    "result": 1,
	    "opinion": "sdfsdf"
	}]
}
```

### 返回结果示例

```json
{
    "result": true,
    "code": 0,
    "message":"success",
    "data": null
}
```

### 返回结果参数说明

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
|result| bool | 返回结果，true为成功，false为失败 |
|code|int|返回码，0表示成功，其他值表示失败|
|message|string|错误信息
|data| array| 结果 |