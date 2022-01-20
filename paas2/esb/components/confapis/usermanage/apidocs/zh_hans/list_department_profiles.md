### 功能描述

请求某部门的用户信息

### 请求参数

{{ common_args_desc }}


#### 接口参数 

|  字段     |  类型      |  必须  |  描述      |
|-----------|------------|--------|------------|
| id | 字符串 | 是 | 部门 ID |
| lookup_field | 字符串 | 否 | 查询字段, 默认为 'id' |
| recursive | 布尔 | 否 | 是否级联查询部门用户,默认为否 |



### 请求参数示例

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

### 返回结果示例

仅示意，请以实际请求结果为准
```json
{
    "message": "Success",
    "code": 0,
    "data": [{
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
    }],
    "result": true
}
```

### 返回结果参数说明

| 字段      | 类型     | 描述      |
|-----------|-----------|-----------|
|result| bool | 返回结果，true为成功，false为失败 |
|code|int|返回码，0表示成功，其他值表示失败|
|message|string|错误信息|
|data| array| 结果，根据请求参数动态返回，可以参考上述返回结果示例 |
