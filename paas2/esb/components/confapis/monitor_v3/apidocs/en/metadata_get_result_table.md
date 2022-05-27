

### Function description

Query information about a result table
According to the given result table ID, return the specific information of the result table

### Request parameters

{{ common_args_desc }}

#### Interface parameters

| Field | Type | Required | Description |
| -------------- | ------ | ---- | ----------- |
| table_id | string | yes | result table ID |


#### Request example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "table_id": "system.cpu"
}
```

### Return result

| Field | Type | Description |
| ---------- | ------ | ------------ |
| result | bool | Whether the request was successful |
| code | int | Returned status code |
| message | string | Description |
| data | dict | data |
| request_id | string | Request ID |

#### Data field description

| Field | Type | Description |
| ------------------- | ------ | -------- |
| table_id | int | result table ID |
| table_name_zh | string | Chinese name of the result table |
| is_custom_table | bool | Whether to customize the result table |
| schema_type | string | Result table schema configuration scheme, free (no schema configuration), dynamic (dynamic schema), fixed (fixed schema) |
| default_storage | string | Default storage scheme |
| storage_list | list | All storage list, element is string |
| creator | string | creator |
| create_time | string | Create time, the format is [2018-10-10 10:00:00]|
| last_modify_user | string | last modified by |
| last_modify_time | string | Last modification time [2018-10-10 10:00:00]|
| field_list | list | field list |
| label | string | result table label |

##### Data.field_list specific parameter description

| key value | type | description |
| ----------------- | ------ | --------------------------------------------------- |
| field_name | string | field name |
| field_type | string | The field type, which can be float, string, boolean and timestamp |
| description | string | Field description information |
| tag | string | Field tag, can be metric, dimemsion, timestamp, group |
| alias_name | string | Inbound alias |
| option | string | Field option configuration, key is option name, value is option configuration |
| is_config_by_user | bool | Whether the user enables this field configuration |

#### Example results

```json
{
    "message":"OK",
    "code":200,
    "data":{
        "table_id": "system.cpu",
        "table_name_en": "Result table name",
        "is_custom_table": false,
        "scheme_type": "fixed",
        "default_storage": "influxdb",
        "storage_list": ["influxdb"],
        "creator": "username",
        "create_time": "2018-10-10 10:10:10",
        "last_modify_user": "username",
        "last_modify_time": "2018-10-10 10:10:10",
        "field_list": [{
            "field_name": "usage",
            "field_type": "float",
            "tag": "dimension",
            "description": "CPU usage",
            "is_config_by_user": true
        }],
        "bk_biz_id": 0,
        "label": "OS"
    },
    "result":true,
    "request_id":"408233306947415bb1772a86b9536867"
}
```
