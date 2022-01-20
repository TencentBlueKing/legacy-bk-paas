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
      "password_valid_days":-1,
      "departments":[{
        "id":1,
        "name":"总公司",
        "order":1,
        "full_name":"总公司"
      }],
      "extras":{
        "date":null,
        "gender":"1",
        "level":"1",
        "dingding":null
      },
      "leader":[{
        "id":1335,
        "username":"foo",
        "display_name":"foo"
      }],
      "last_login_time":"2021-12-23T20:43:25.164441Z",
      "create_time":"2020-10-23T10:48:42.155327Z",
      "update_time":"2021-11-29T20:11:44.922731Z",
      "qq":"",
      "email":"admin@test.com",
      "telephone":"13111112222",
      "wx_userid":"",
      "wx_openid":"",
      "code":null,
      "domain":"default.local",
      "category_id":1,
      "display_name":"admin",
      "logo":"null",
      "status":"NORMAL",
      "staff_status":"IN",
      "password_update_time":"2021-10-12T11:03:36.713819Z",
      "position":0,
      "time_zone":"Asia/Shanghai",
      "language":"zh-cn",
      "country_code":"86",
      "iso_code":"CN",
      "enabled":true,
      "type":"",
      "role":1
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

