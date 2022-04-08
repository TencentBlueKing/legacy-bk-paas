### description

List certain user's departments

### request parameter

{{ common_args_desc }}


#### interface parameters

| field      |  type      | required   |  description      |
|-----------|------------|--------|------------|
| lookup_field | string | no | lookup on which field, 'username' as default |
| with_family | bool | no | result with deparment family, false as default |


### sample request parameters

``` json
{
  "bk_app_code": "xxx",
  "bk_app_secret": "xxx",
  "bk_token": "xxx",
  "bk_username": "xxx",
  "id": 1,
  "with_family": true,
  "lookup_field": "username"
}
```

### sample return results

```json
{
    "message": "Success",
    "code": 0,
    "data": [{
        "id": 4,
        "name": "admin",
        "children": []
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

| field      | type     | description      |
|-----------|-----------|-----------|
|id| int | department ID |
|name|string| department name |
|has_children|bool| if include children departments |
|full_name| string | full route of department |
|children| array| related children departments |
|parent| object | parent department |
