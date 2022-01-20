### Functional description

query service detail info

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field         | Type  | Required  | Description   |
| ---------- | --- | --- | ---- |
| service_id | int | YES   | service id, Get from the `data["id"]` field in the `get_services` interface |

### Request Parameters Example

```json
{  
    "bk_app_secret": "xxxx", 
    "bk_app_code": "xxxx", 
    "bk_token": "xxxx", 
    "service_id": 1
}  
```

### Return Result Example

```json
{
    "message": "success",
    "code": 0,
    "data": {
        "service_id": 5,
        "workflow_id": 15,
        "name": "test3",
        "service_type": "event",
        "desc": "",
        "fields": [
            {
                "id": 1,
                "key": "title",
                "type": "STRING",
                "name": "title",
                "desc": "input title",
                "choice": [],
                "validate_type": "REQUIRE",
                "regex": "",
                "meta": {}
            },
            {
                "id": 96,
                "key": "CESHILEIXING",
                "type": "SELECT",
                "name": "test type",
                "desc": "",
                "choice": [
                    {
                        "name": "change",
                        "key": "BIANGENG"
                    },
                    {
                        "name": "request",
                        "key": "QINGQIU"
                    }
                ],
                "validate_type": "REQUIRE",
                "regex": "EMPTY",
                "meta": {}
            },
            {
                "id": 97,
                "key": "ZIDINGYIBIAOGE",
                "type": "CUSTOMTABLE",
                "name": "custom table",
                "desc": "",
                "choice": [],
                "validate_type": "REQUIRE",
                "regex": "EMPTY",
                "meta": {
                    "columns": [
                        {
                            "choice": [],
                            "display": "input",
                            "key": "TEST",
                            "name": "test"
                        },
                        {
                            "choice": [
                                {
                                    "name": "a",
                                    "key": "A"
                                },
                                {
                                    "name": "b",
                                    "key": "B"
                                }
                            ],
                            "display": "select",
                            "key": "TEST2",
                            "name": "test2"
                        }
                    ]
                }
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
| service_id   | int    | service id |
| workflow_id  | int    | service's workflow id |
| name         | string | service name |
| service_type | string | service type |
| desc         | string | service description |
| fields       | array  | ticket fields |

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
