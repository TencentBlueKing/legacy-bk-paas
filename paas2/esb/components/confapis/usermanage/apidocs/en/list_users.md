### description

List all users

### request parameter

{{ common_args_desc }}


#### interface parameters

| field      |  type      | required   |  description      |
|-----------|------------|--------|------------|
| lookup_field | string | no | lookup on which field, 'username' as default |
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
  "lookup_field": "username",
  "page": 1,
  "page_size": 0,
  "fields": "username,id",
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
      "username":"admin",
      "departments":[],
      "extras":{},
      "leader":[]
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
|data| array| result |

**data** fields（The specific field depends on the parameter `fields`）

| field      | type     | description     |
|-----------|-----------|-----------|
|id| int | user ID |
|username|string| username |
|departments|array| related departments |
|extras| dict | extras fields |
|leader| array| related leaders |
