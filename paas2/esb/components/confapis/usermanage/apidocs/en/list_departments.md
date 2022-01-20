### description

List all departments

### request parameter

{{ common_args_desc }}


#### interface parameters

| field      |  type      | required   |  description      |
|-----------|------------|--------|------------|
| lookup_field | string | no | lookup on which field, 'id' as default|
| page | int | no | page num |
| page_size | int | no | page size |
| fields | string | no | response fields, e.g. "username,id" |
| exact_lookups | string | no | exact lookup list, e.g. "jack,pony" |
| fuzzy_lookups | string | no | fuzzy lookup list, e.g. "jack,pony" |


### sample request parameters

``` json
{
  "bk_app_code": "xxx",
  "bk_app_secret": "xxx",
  "bk_token": "xxx",
  "bk_username": "xxx",
  "fields": "name,id",
  "lookup_field": "id",
  "page": 1,
  "page_size": 5,
  "exact_lookups": "jack,pony",
  "fuzzy_lookups": "jack,pony"
}
```

### sample return results

```json
{
    "message": "Success",
    "code": 0,
    "data": [{
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
    }],
    "result": true
}
```

### resulting parameters

| field      | type      | description      |
|-----------|-----------|-----------|
|result| bool | returns a result, true for success and false for failure |
|code|int|The return code, 0 for success, and other values for failure|
|message|string|error message|
|data| array| result, please refer to sample results |

