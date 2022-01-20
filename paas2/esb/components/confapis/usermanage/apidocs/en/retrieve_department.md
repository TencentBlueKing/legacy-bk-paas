### description

Query department info

### request parameter

{{ common_args_desc }}


#### interface parameters

| field      |  type      | required   |  description      |
|-----------|------------|--------|------------|
| id | string | yes | query department id, e.g. 1122 |
| fields | string | no | response fields, e.g. "name,id" |


### sample request parameters

``` json
{
  "bk_app_code": "xxx",
  "bk_app_secret": "xxx",
  "bk_token": "xxx",
  "bk_username": "xxx",
  "id": 1122,
  "fields": "name,id"
}
```

### sample return results

```json
{
    "message": "Success",
    "code": 0,
    "data": {
      "id":1,
      "name":"总公司",
      "has_children":true,
      "full_name":"总公司",
      "order":1,
      "extras":{},
      "enabled":true,
      "children":[{
        "id":316,
        "name":"子部门",
        "full_name":"总公司/子公司",
        "has_children":true
      }],
      "code":null,
      "category_id":1,
      "lft":1,
      "rght":6900,
      "tree_id":1004,
      "level":0,
      "parent":null
    },
    "result": true
}
```

### resulting parameters

| field      | type      | description      |
|-----------|-----------|-----------|
|result| bool | returns a result, true for success and false for failure |
|code|int|The return code, 0 for success, and other values for failure|
|message|string|error message|
|data| array| result |

