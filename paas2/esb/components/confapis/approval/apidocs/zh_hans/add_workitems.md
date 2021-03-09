### 功能描述

新增审批单据

### 请求参数

{{ common_args_desc }}


#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| workitems | 数组 | 是 | 审批单列表 详情请参考`审批单`一节 |

__审批单（workitem）__

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| process_inst_id |  string | 是 | 流程实例标识。通常是其对应子系统的单据的流水号 |
| approvers |  string | 是 | 当前审批单据的处理人 多用户用英文逗号`,`分割 | 
| title |  string | 是 | 审批单据的标题，这会展示在审批人的待办列表中 |
| applicant | string | 是 | 申请人 | 
| attachments | 数组 | 否 | 附件 详情请参考`附件`一节 |
| from_url | string | 否 | 子系统据的访问地址 | 
| callback_url | string | 否| 回调地址。当审批人在审批中心提交了单据后，审批中心会调用此地址告知子系统审批的结果 |
| enable_quick | string | 否| 是否允许快速审批  | 		
| enable_batch | string | 否| 是否允许批量审批 | 		
| approval_history | 数组 | 否 | 审批历史 详情请参考`审批历史`一节 | 	
| callback_data | 数组 | 否 | 单据变量 详情请参考`单据变量`一节 | 	
| list_view | 数组 | 否 | 列表视图 详情请参考`列表视图`一节 | 	
| detail_view | 数组 | 否| 详情视图 详情请参考`详情视图`一节 | 	


__附件（attachments）__

	目前仅支持附件链接。即单据所需要提交的附件需要url可访问，附件字段存储了该附件的url链接地址。

| 字段名 | 类型 | 描述 |
|-----------|------------|-------|
| name | string |附件的名称 |
| url | string| 附件的url地址 |
| type | string | 附件类型，比如pdf,txt,jpg等,指定类型后，会在前端渲染出类型图标 |


__审批历史（approval_history）__

	审批历史记录了该单据过往的全部审批流程，例如一个需要流程化审批的单据,后面的审批者可以看见之前的审批动作。

| 字段名 | 类型 | 描述 |
|-----------|------------|-------|
| approved_by | string | 审批者 |
| result     | int | 审批者的审批动作，0: 驳回 1: 同意 |
| step | int | 流程中的第几步审批 |
| opinion | string | 审批者的意见 |
| approved_at    | int | 审批的时间(时间戳) |


__单据变量（callback_data ）__

	单据变量用于业务系统的数据传递。具体来说，单据变量由子系统提交给审批中心，审批中心在子业务系统的回调函数时将单据变量数据原样返回。

| 字段名 | 类型 | 描述 |
|-----------|------------|-------|
| key | string | 字段标识，业务系统自定义的字段名称 |
| value | 数组[string] | 字段的值，数组类型 |

__列表视图（list_view）__

	待办列表中展示。如果此字段没有定义，则会使用详情视图的数据来进行填充，该字段定义了在列表视图下展示的内容

| 字段名 | 类型 | 描述 |
|-----------|------------|-------|
| key | string | 字段的名称 |
| value | string | 字段的值 |

__详情视图（detail_view）__

	详情页中展示，该字段定义了在详情视图下展示的内容

| 字段名 | 类型 | 描述 |
|-----------|------------|-------|
| key | string | 字段的名称 |
| value | string | 字段的值 |

### 请求参数示例

``` json
{
    "workitems": [{
        "process_inst_id": "12",
        "approvers": "admin",
        "title": "this is a test",
        "applicant": "admin",
        "from_url": "http://test.xxx.com/from/",
        "callback_url": "http://test.xxx.com/callback/",
        "enable_quick": 1,
        "enable_batch": 1,
        "approval_history": [{
            "approved_by": "ddddd",
            "approved_at":  1546930449,
            "result":  1,  
            "step":  1,  
            "opinion": "同意"
        }],
        "callback_data":  [{"key": "zzzz", "value": [1]}],
        "list_view":  [{"key": "属性1", "value": "1"},{"key": "属性2", "value": "2"}],
        "detail_view":  [{"key": "属性3", "value": "3"},{"key": "属性4", "value": "4"}],
        "attachments":  [{"name": 1, "url": "http://test.xxx.com/from/", "type": "img"}]
    }]
}

```

### 返回结果示例

```json
{
    "result": true,
    "code": 0,
    "message":"success",
    "data": [{
        "process_inst_id": "12",
        "approvers": "admin",
        "title": "this is a test",
        "applicant": "admin",
        "from_url": "http://test.xxx.com/from/",
        "callback_url": "http://test.xxx.com/callback/",
        "enable_quick": 1,
        "enable_batch": 1,
        "approval_history": [
            {
                "approved_at": 1546930449,
                "step": 1,
                "approved_by": "ddddd",
                "result": 1,
                "opinion": "同意"
            }
        ],
        "callback_data": [
            {
                "value": [
                    1
                ],
                "key": "zzzz"
            }
        ],
        "list_view": [
            {
                "value": "1",
                "key": "属性1"
            },
            {
                "value": "2",
                "key": "属性2"
            }
        ],
        "detail_view": [
            {
                "value": "3",
                "key": "属性3"
            },
            {
                "value": "4",
                "key": "属性4"
            }
        ],
        "attachments": [
            {
                "url": "http://test.xxx.com/from/",
                "type": "img",
                "name": 1
            }
        ],
        "apply_at": 1546940203
    }]
}
```

### 返回结果参数说明

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
|result| bool | 返回结果，true为成功，false为失败 |
|code|int|返回码，0表示成功，其他值表示失败|
|message|string|错误信息
|data| array| 结果 |