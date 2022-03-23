### description

Get user info by department

### request parameter

{{ common_args_desc }}


#### interface parameters

|  field    |  type      |  require  |  description      |
|-----------|------------|--------|------------|
| id | string | yes | department ID |
| lookup_field | string | no | default is 'id' |
| recursive | bool | no | defualt is false |



### sample request parameters

``` json
{
  "bk_app_code": "xxx",
  "bk_app_secret": "xxx",
  "bk_token": "xxx",
  "bk_username": "xxx",
  "id": 1,
  "lookup_field": "id",
  "recursive": true
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

