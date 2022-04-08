### 功能描述

单据状态查询，支持根据单号查询单据的状态（携带基本信息）

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段        | 类型     | 必选  | 描述                         |
| --------- | ------ | --- | -------------------------- |
| sn        | string | 是   | 单号                       |

### 请求参数示例

```json
{  
    "bk_app_secret": "xxxx", 
    "bk_app_code": "xxxx", 
    "bk_token": "xxxx", 
    "sn": "NO2019090XXXXXXXX"
}  
```

### 返回结果示例

```json
{
    "message": "success",
    "code": 0,
    "data": {
        "ticket_url": "https://blueking.com/#/commonInfo?id=6&activeNname=all&router=request",
        "operations": [
            {
                "can_operate": true,
                "name": "撤单",
                "key": "WITHDRAW"
            },
            {
                "can_operate": true,
                "name": "恢复",
                "key": "UNSUSPEND"
            }
        ],
        "current_status": "SUSPENDED",
        "current_steps": [
            {
                "name": "法务审批",
                "state_id": 4,
                "status": "RUNNING",
                "action_type": "TRANSITION",
                "processors_type": "PERSON",
                "processors": "zhangsan",
                "operations": [
                    {
                        "can_operate": true,
                        "name": "提交",
                        "key": "TRANSITION"
                    },
                    {
                        "can_operate": true,
                        "name": "转单",
                        "key": "DELIVER"
                    },
                    {
                        "can_operate": true,
                        "name": "终止",
                        "key": "TERMINATE"
                    }
                ],
                "fields": [
                    {
                        "workflow_id": 1,
                        "meta": {},
                        "id": 8,
                        "regex": "EMPTY",
                        "api_instance_id": 0,
                        "type": "RADIO",
                        "source_uri": "",
                        "validate_type": "REQUIRE",
                        "source_type": "CUSTOM",
                        "key": "SHENPIJIEGUO",
                        "choice": [
                            {
                                "name": "同意",
                                "key": "TONGYI"
                            },
                            {
                                "name": "拒绝",
                                "key": "JUJUE"
                            }
                        ],
                        "desc": "",
                        "name": "审批结果",
                        "is_readonly": false,
                        "custom_regex": "",
                        "state_id": 4
                    },
                    {
                        "workflow_id": 1,
                        "meta": {},
                        "id": 9,
                        "regex": "EMPTY",
                        "api_instance_id": 0,
                        "type": "TEXT",
                        "source_uri": "",
                        "validate_type": "REQUIRE",
                        "source_type": "CUSTOM",
                        "key": "SHENPIBEIZHU",
                        "choice": [],
                        "desc": "",
                        "name": "审批备注",
                        "is_readonly": false,
                        "custom_regex": "",
                        "state_id": 4
                    }
                ]
            }
        ],
        "is_commented": false
    },
    "result": true
}
```

### 返回结果参数说明

| 字段      | 类型        | 描述                      |
| ------- | --------- | ----------------------- |
| result  | bool      | 返回结果，true为成功，false为失败   |
| code    | int       | 返回码，0表示成功，其他值表示失败       |
| message | string    | 错误信息                    |
| data    | object | 返回数据 |

### data

| 字段                     | 类型     | 描述       |
| ---------------------- | ------ | -------- |
| current_status         | string | 单据当前状态，RUNNING（处理中）/FINISHED（已结束）/TERMINATED（被终止）/ SUSPENDED（被挂起）/ REVOKED（被撤销） |
| current_steps          | array  | 单据当前步骤列表   |
| operations          | array  | 单据当前支持的操作列表   |
| is_commented           | bool   | 单据是否已评价  |
| ticket_url           | string   | 单据详情链接  |


### operations（单据支持的操作）

| 字段            | 类型     | 描述      |
| ------------- | ------ | ------- |
| key           | string | 操作标识，包括：SUSPEND（挂起）/UNSUSPEND（恢复）/WITHDRAW（撤销）/TERMINATE（终止节点和单据） |
| name          | string | 操作名称  |
| can_operate   | string | 可否操作（扩展字段，始终为true）  |

### current_steps（当前步骤）

| 字段              | 类型         | 描述         |
| --------------- | ---------- | ---------- |
| name            | string    | 步骤名称    |
| action_type     | string    | 操作类型：TRANSITION（审批）/DISTRIBUTE（分派）/CLAIM（认领）/AUTOMATIC（自动处理）    |
| processors      | string | 处理人列表  |
| processors_type | string | 处理人类型：CMDB（cmdb角色）/GENERAL（通用角色）/PERSON（个人）/STARTER（提单人）/OPEN（不限）    |
| state_id        | int | 节点ID    |
| status          | string | 节点状态    |
| operations      | array  | 单据当前步骤支持的操作列表   |
| fields          | array  | 单据当前步骤的表单字段列表 |

### operations（节点支持的操作）

| 字段            | 类型     | 描述      |
| ------------- | ------ | ------- |
| key           | string | 操作标识，包括： TRANSITION（审批）/CLAIM（认领）/DISTRIBUTE（派单）/DELIVER（转单）/TERMINATE（终止节点和单据） |
| name          | string | 操作名称  |
| can_operate   | string | 可否操作（扩展字段，始终为true）  |


### fields（节点字段）

| 字段            | 类型     | 描述      |
| ------------- | ------ | ------- |
| id            | int    | 字段id    |
| key           | string | 字段唯一标识  |
| type          | string | 字段类型    |
| name          | string | 字段名称    |
| desc          | string | 字段描述    |
| choice        | array  | 选项      |
| validate_type | string | 校验规则    |
| regex         | string | 正则校验规则  |
| meta          | object   | 自定义表格格式 |


### type（字段类型）

| 类型Key            | 类型     |
| ------------- | ------ |
| STRING            | 单行文本    |
| STRING  |  单行文本|
| TEXT  |  多行文本|
| INT  |  数字|
| DATE  |  日期|
| DATETIME  |  时间|
| DATETIMERANGE  |  时间间隔|
| TABLE  |  表格|
| SELECT  |  单选下拉框|
| MULTISELECT  |  多选下拉框|
| CHECKBOX  |  复选框|
| RADIO  |  单选框|
| MEMBERS  |  多选人员选择|
| RICHTEXT  |  富文本|
| FILE  |  附件上传|
| CUSTOMTABLE  |  自定义表格|
| TREESELECT  |  树形选择|
| CASCADE  |  级联|

### meta

| 字段      | 类型    | 描述  |
| ------- | ----- | --- |
| columns | array | 列   |

### columns

| 字段      | 类型     | 描述   |
| ------- | ------ | ---- |
| choice  | array  | 选项   |
| display | string | 展现形式 |
| key     | string | 唯一标识 |
| name    | string | 名字   |


### status（节点状态）

| 字段              | 类型         | 描述         |
| --------------- | ---------- | ---------- |
| WAIT  |   待处理     |
| RUNNING   |   处理中     |
| RECEIVING     |   待认领     |
| DISTRIBUTING  |   待分派     |
| TERMINATED    |   被终止     |
| FINISHED  |   已结束     |
| FAILED    |   执行失败        |
| SUSPEND   |   被挂起     |
