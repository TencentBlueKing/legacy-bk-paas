

### Function description

get storage list
According to the given filter parameters (no currently available), return a list of result tables that meet the conditions

### Request parameters

{{ common_args_desc }}

#### Interface parameters
No request parameters

| Field | Type | Required | Description |
| -------------- | ------ | ---- | ----------- |
| datasource_type | string | No | The result table type to be filtered, such as system |
| bk_biz_id | int | No | Get the result table information under the specified business |
| is_public_include | int | No | Whether to include the full business result table, 0 means not included, non-0 means include the full business result table |
| is_config_by_user | bool | no | whether to include non-user-config result table content |

#### Request example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "bk_biz_id": 123,
    "is_public_include": 1,
    "datasource_type": "system"
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
| result_table_id | int | result table ID |
| table_name_zh | string | Chinese name of the result table |
| is_custom_table | bool | Whether to customize the result table |
| schema_type | string | Result table schema configuration scheme, free (no schema configuration), dynamic (dynamic schema), fixed (fixed schema) |
| default_storage | string | Default storage scheme |
| storage_list | array | All storage list, element is string |
| creator | string | creator |
| create_time | string | Create time, the format is [2018-10-10 10:00:00]|
| last_modify_user | string | last modified by |
| last_modify_time | string | Last modification time [2018-10-10 10:00:00]|
| field_list | list | field list |

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
| unit | string | field unit |

#### Example results

```json
{
    "message":"OK",
    "code":200,
    "data":[{
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
            "is_config_by_user": true,
            "unit": "Field Unit"
        }],
        "bk_biz_id": 0,
        "label": "OS"
    }],
    "result":true,
    "request_id":"408233306947415bb1772a86b9536867"
}
```
