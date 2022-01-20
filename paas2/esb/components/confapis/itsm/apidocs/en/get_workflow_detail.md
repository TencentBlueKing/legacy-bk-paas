### Functional description

query service's workflow detail

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field         | Type  | Required  | Description   |
| ---------- | --- | --- | ---- |
| workflow_id | int | YES   | service's workflow id, Get from the `data["workflow_id"]` field in the `get_service_detail` interface |

### Request Parameters Example

```json
{  
    "bk_app_secret": "xxxx", 
    "bk_app_code": "xxxx", 
    "bk_token": "xxxx", 
    "workflow_id": 1
}  
```

### Return Result Example

```json
{
    "message": "success",
    "code": 0,
    "data": {
        "name": "node1",
        "flow_type": "other",
        "desc": "",
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
                "name": "start",
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
                "name": "node2",
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
                "name": "node3",
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
                "name": "node4",
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
                "name": "request",
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
                "name": "end",
                "fields": [],
                "assignors_type": "EMPTY"
            }
        ],
        "transitions": [
            {
                "from_state": 30,
                "to_state": 31,
                "workflow": 4,
                "name": "default",
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
                "name": "default",
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
                "name": "default",
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
                "name": "default",
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
                "name": "failed",
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
                "desc": "",
                "name": "plan",
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
                "desc": "",
                "name": "set info",
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
                "desc": "",
                "name": "problem",
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
                        "name": "man",
                        "key": "RENGONG"
                    },
                    {
                        "name": "script",
                        "key": "ZIDONG"
                    }
                ],
                "desc": "",
                "name": "source",
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
                "desc": "",
                "name": "title",
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
                        "name": "ok",
                        "key": "TONGGUO"
                    },
                    {
                        "name": "failed",
                        "key": "BUTONGGUO"
                    }
                ],
                "desc": "",
                "name": "result",
                "is_readonly": false,
                "custom_regex": "",
                "state_id": 32
            }
        ]
    },
    "result": true
}
```

### Return Result Description

| Field      | Type        | Description                                          |
| ------- | --------- | ------------------------------------------- |
| result  | bool      | true/false, indicate success or failure                       |
| code    | int       | return code. 0 indicates success, other values indicate failure                           |
| message | string    | error message returned when result is false                                        |
| data    | object    | data returned when result is true, details are described below |

### data

| Field           | Type     | Description   |
| ------------ | ------ | ---- |
| name         | string | workflow name |
| flow_type    | string | workflow type |
| desc         | string | workflow description |
| states       | array  | workflow state list |
| transitions  | array  | workflow transition list |
| fields       | array  | workflow field list |

### states

| Field            | Type     | Description      |
| ------------- | ------ | ------- |
| id            | int    | field id    |
| key           | string | field key  |
| type          | string | field type    |
| name          | string | field name    |
| desc          | string | field description    |


### transitions

| Field            | Type     | Description      |
| ------------- | ------ | ------- |
| id            | int    | field id    |
| key           | string | field key  |
| type          | string | field type    |
| name          | string | field name    |
| desc          | string | field description    |


### fields

| Field            | Type     | Description      |
| ------------- | ------ | ------- |
| id            | int    | field id    |
| key           | string | field key  |
| type          | string | field type    |
| name          | string | field name    |
| desc          | string | field description    |
| choice        | array  | field choices      |
| validate_type | string | field validation type    |
| regex         | string | field regex validation expression  |
| meta          | object   | field meta info |

### type（field type）

| Key of Field Type            | Type     |
| ------------- | ------ |
| STRING            | input    |
| STRING  |  input|
| TEXT  |  text|
| INT  |  number|
| DATE  |  date|
| DATETIME  |  datetime|
| TABLE  |  table|
| SELECT  |  single select|
| MULTISELECT  |  multi select|
| CHECKBOX  |  checkbox|
| RADIO  |  radio|
| MEMBERS  |  member select|
| RICHTEXT  |  rich text|
| FILE  |  file attachments|
| CUSTOMTABLE  |  custom table|
| TREESELECT  |  tree select|
| CASCADE  |  cascade|

### meta

| Field      | Type    | Description  |
| ------- | ----- | --- |
| columns | array | column list   |

### columns

| Field      | Type     | Description   |
| ------- | ------ | ---- |
| choice  | array  | field choices   |
| display | string | display ui type |
| key     | string | column key |
| name    | string | column name   |
