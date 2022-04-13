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
      "children":[],
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

**data** fields（The specific field depends on the parameter `fields`）

| field      | type     | description      |
|-----------|-----------|-----------|
|id| int | department ID |
|name|string| department name |
|has_children|bool| if include children departments |
|full_name| string | full route of department |
|children| array| related children departments |
|parent| object | parent department |
