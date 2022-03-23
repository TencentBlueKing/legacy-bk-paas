### description

Query user info

### request parameter

{{ common_args_desc }}


#### interface parameters

| field      |  type      | required   |  description      |
|-----------|------------|--------|------------|
| id | string | yes | query username, e.g. "admin" |
| lookup_field | string | no | lookup on which field, 'username' as default, only key field only, which contain: username, id|
| fields | string | no | response fields, e.g. "username,id" |


### sample request parameters

Query a profile which has 'admin' as username, only return selected fields (`username`, `id`)

``` json
{
  "bk_app_code": "xxx",
  "bk_app_secret": "xxx",
  "bk_token": "xxx",
  "bk_username": "xxx",
  "id": "admin",
  "lookup_field": "username",
  "fields": "username,id"
}
```

### sample return results

```json
{
    "message": "Success",
    "code": 0,
    "data": {
      "id":1,
      "username":"admin",
      "departments":[],
      "extras":{},
      "leader":[]
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

| field      | type     | description     |
|-----------|-----------|-----------|
|id| int | user ID |
|username|string| username |
|departments|array| related departments |
|extras| dict | extras fields |
|leader| array| related leaders |
