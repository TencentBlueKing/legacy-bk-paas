### 功能描述

服务流程详情查询，支持根据指定的服务流程ID查询服务流程详情

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段         | 类型  | 必选  | 描述   |
| ---------- | --- | --- | ---- |
| workflow_id | int | 是   | 服务流程id，从`服务详情查询`接口中的`data["workflow_id"]`字段获取 |

### 请求参数示例

```json
{  
    "bk_app_secret": "xxxx", 
    "bk_app_code": "xxxx", 
    "bk_token": "xxxx", 
    "workflow_id": 1
}  
```

### 返回结果示例

```json
{
    "message": "success",
    "code": 0,
    "data": {
        "name": "问题跟进",
        "flow_type": "other",
        "desc": "问题跟进流程",
        "version_number": "20191105212408",
        "states": [
            {
                "processors_type": "OPEN",
                "can_deliver": false,
                "id": 27,
                "is_terminable": false,
                "processors": "",
                "api_instance_id": 0,
                "type": "START",
                "assignors": "",
                "workflow": 4,
                "delivers_type": "EMPTY",
                "delivers": "",
                "distribute_type": "PROCESS",
                "name": "开始",
                "fields": [],
                "assignors_type": "EMPTY"
            },
            {
                "processors_type": "STARTER",
                "can_deliver": false,
                "id": 32,
                "is_terminable": false,
                "processors": "",
                "api_instance_id": 0,
                "type": "NORMAL",
                "assignors": "",
                "workflow": 4,
                "delivers_type": "PERSON",
                "delivers": "",
                "distribute_type": "PROCESS",
                "name": "实施验收",
                "fields": [
                    36
                ],
                "assignors_type": "EMPTY"
            },
            {
                "processors_type": "GENERAL",
                "can_deliver": true,
                "id": 31,
                "is_terminable": true,
                "processors": "4",
                "api_instance_id": 0,
                "type": "NORMAL",
                "assignors": "",
                "workflow": 4,
                "delivers_type": "PERSON",
                "delivers": "zhangsan",
                "distribute_type": "PROCESS",
                "name": "实施计划",
                "fields": [
                    38
                ],
                "assignors_type": "EMPTY"
            },
            {
                "processors_type": "GENERAL",
                "can_deliver": false,
                "id": 30,
                "is_terminable": false,
                "processors": "2",
                "api_instance_id": 0,
                "type": "NORMAL",
                "assignors": "",
                "workflow": 4,
                "delivers_type": "PERSON",
                "delivers": "",
                "distribute_type": "CLAIM_THEN_PROCESS",
                "name": "问题定位",
                "fields": [],
                "assignors_type": "EMPTY"
            },
            {
                "processors_type": "OPEN",
                "can_deliver": false,
                "id": 28,
                "is_terminable": false,
                "processors": "",
                "api_instance_id": 0,
                "type": "NORMAL",
                "assignors": "",
                "workflow": 4,
                "delivers_type": "PERSON",
                "delivers": "",
                "distribute_type": "PROCESS",
                "name": "提单",
                "fields": [
                    34,
                    42,
                    43,
                    47
                ],
                "assignors_type": "EMPTY"
            },
            {
                "processors_type": "OPEN",
                "can_deliver": false,
                "id": 29,
                "is_terminable": false,
                "processors": "",
                "api_instance_id": 0,
                "type": "END",
                "assignors": "",
                "workflow": 4,
                "delivers_type": "PERSON",
                "delivers": "",
                "distribute_type": "PROCESS",
                "name": "结束",
                "fields": [],
                "assignors_type": "EMPTY"
            }
        ],
        "transitions": [
            {
                "from_state": 30,
                "to_state": 31,
                "workflow": 4,
                "name": "默认",
                "condition_type": "default",
                "id": 11,
                "condition": {
                    "expressions": [
                        {
                            "expressions": [
                                {
                                    "key": "G_INT_1",
                                    "condition": "==",
                                    "value": 1
                                }
                            ],
                            "type": "and"
                        }
                    ],
                    "type": "and"
                }
            },
            {
                "from_state": 28,
                "to_state": 30,
                "workflow": 4,
                "name": "默认",
                "condition_type": "default",
                "id": 10,
                "condition": {
                    "expressions": [
                        {
                            "expressions": [
                                {
                                    "key": "G_INT_1",
                                    "condition": "==",
                                    "value": 1
                                }
                            ],
                            "type": "and"
                        }
                    ],
                    "type": "and"
                }
            },
            {
                "from_state": 32,
                "to_state": 29,
                "workflow": 4,
                "name": "默认",
                "condition_type": "default",
                "id": 13,
                "condition": {
                    "expressions": [
                        {
                            "expressions": [
                                {
                                    "key": "G_INT_1",
                                    "condition": "==",
                                    "value": 1
                                }
                            ],
                            "type": "and"
                        }
                    ],
                    "type": "and"
                }
            },
            {
                "from_state": 31,
                "to_state": 32,
                "workflow": 4,
                "name": "默认",
                "condition_type": "default",
                "id": 12,
                "condition": {
                    "expressions": [
                        {
                            "expressions": [
                                {
                                    "key": "G_INT_1",
                                    "condition": "==",
                                    "value": 1
                                }
                            ],
                            "type": "and"
                        }
                    ],
                    "type": "and"
                }
            },
            {
                "from_state": 32,
                "to_state": 31,
                "workflow": 4,
                "name": "验收不通过",
                "condition_type": "by_field",
                "id": 14,
                "condition": {
                    "expressions": [
                        {
                            "expressions": [
                                {
                                    "value": "BUTONGGUO",
                                    "source": "field",
                                    "key": "YANSHOUJIEGUO",
                                    "choiceList": [],
                                    "type": "SELECT",
                                    "condition": "=="
                                }
                            ],
                            "type": "and",
                            "checkInfo": false
                        }
                    ],
                    "type": "and"
                }
            },
            {
                "from_state": 27,
                "to_state": 28,
                "workflow": 4,
                "name": "",
                "condition_type": "default",
                "id": 8,
                "condition": {
                    "expressions": [
                        {
                            "expressions": [
                                {
                                    "key": "G_INT_1",
                                    "condition": "==",
                                    "value": 1
                                }
                            ],
                            "type": "and"
                        }
                    ],
                    "type": "and"
                }
            }
        ],
        "fields": [
            {
                "workflow_id": 4,
                "meta": {},
                "id": 38,
                "regex": "EMPTY",
                "api_instance_id": 0,
                "type": "TEXT",
                "source_uri": "",
                "validate_type": "REQUIRE",
                "source_type": "CUSTOM",
                "key": "SHISHIJIHUA",
                "choice": [],
                "desc": "实施计划描述",
                "name": "实施计划",
                "is_readonly": false,
                "custom_regex": "",
                "state_id": 31
            },
            {
                "workflow_id": 4,
                "meta": {},
                "id": 47,
                "regex": "EMPTY",
                "api_instance_id": 3,
                "type": "SELECT",
                "source_uri": "",
                "validate_type": "REQUIRE",
                "source_type": "API",
                "key": "JIQUNXINXI",
                "choice": [],
                "desc": "选择集群信息",
                "name": "集群信息",
                "is_readonly": false,
                "custom_regex": "",
                "state_id": 28
            },
            {
                "workflow_id": 4,
                "meta": {},
                "id": 42,
                "regex": "EMPTY",
                "api_instance_id": 0,
                "type": "TEXT",
                "source_uri": "",
                "validate_type": "REQUIRE",
                "source_type": "CUSTOM",
                "key": "WENTIMIAOSHU",
                "choice": [],
                "desc": "问题的详细描述",
                "name": "问题描述",
                "is_readonly": false,
                "custom_regex": "",
                "state_id": 28
            },
            {
                "workflow_id": 4,
                "meta": {},
                "id": 43,
                "regex": "EMPTY",
                "api_instance_id": 0,
                "type": "SELECT",
                "source_uri": "",
                "validate_type": "REQUIRE",
                "source_type": "CUSTOM",
                "key": "WENTILAIYUAN",
                "choice": [
                    {
                        "name": "人工",
                        "key": "RENGONG"
                    },
                    {
                        "name": "自动",
                        "key": "ZIDONG"
                    }
                ],
                "desc": "问题的发现来源",
                "name": "问题来源",
                "is_readonly": false,
                "custom_regex": "",
                "state_id": 28
            },
            {
                "workflow_id": 4,
                "meta": {},
                "id": 34,
                "regex": "EMPTY",
                "api_instance_id": 0,
                "type": "STRING",
                "source_uri": "",
                "validate_type": "REQUIRE",
                "source_type": "CUSTOM",
                "key": "title",
                "choice": [],
                "desc": "请输入标题",
                "name": "标题",
                "is_readonly": false,
                "custom_regex": "",
                "state_id": 28
            },
            {
                "workflow_id": 4,
                "meta": {},
                "id": 36,
                "regex": "EMPTY",
                "api_instance_id": 0,
                "type": "SELECT",
                "source_uri": "",
                "validate_type": "REQUIRE",
                "source_type": "CUSTOM",
                "key": "YANSHOUJIEGUO",
                "choice": [
                    {
                        "name": "通过",
                        "key": "TONGGUO"
                    },
                    {
                        "name": "不通过",
                        "key": "BUTONGGUO"
                    }
                ],
                "desc": "实施计划的验收结果",
                "name": "验收结果",
                "is_readonly": false,
                "custom_regex": "",
                "state_id": 32
            }
        ]
    },
    "result": true
}
```

### 返回结果参数说明

| 字段      | 类型        | 描述                                          |
| ------- | --------- | ------------------------------------------- |
| result  | bool      | 返回结果，true为成功，false为失败                       |
| code    | int       | 返回码，0表示成功，其他值表示失败                           |
| message | string    | 错误信息                                        |
| data    | object    | 返回数据 |

### data

| 字段           | 类型     | 描述   |
| ------------ | ------ | ---- |
| name         | string | 流程名称 |
| flow_type    | string | 流程类型 |
| desc         | string | 流程描述 |
| states       | array  | 流程节点列表 |
| transitions  | array  | 流程连线列表 |
| fields       | array  | 流程字段列表 |

### states

| 字段            | 类型     | 描述      |
| ------------- | ------ | ------- |
| id            | int    | 字段id    |
| key           | string | 字段唯一标识  |
| type          | string | 字段类型    |
| name          | string | 字段名称    |
| desc          | string | 字段描述    |


### transitions

| 字段            | 类型     | 描述      |
| ------------- | ------ | ------- |
| id            | int    | 字段id    |
| key           | string | 字段唯一标识  |
| type          | string | 字段类型    |
| name          | string | 字段名称    |
| desc          | string | 字段描述    |


### fields

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
