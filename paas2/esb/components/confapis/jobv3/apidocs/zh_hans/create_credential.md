### 功能描述

新建凭据。

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段             |  类型      | 必选   |  描述       |
|-----------------|------------|--------|------------|
| bk_biz_id       |  long      | 是     | 业务 ID     |
| name            |  string    | 是     | 凭据名称 |
| type            |  string    | 是     | 凭据类型，取值可为ACCESS_KEY_SECRET_KEY,PASSWORD,USERNAME_PASSWORD,SECRET_KEY |
| description     |  string    | 否     | 凭据描述 |
| access_key      |  string    | 否     | 凭据类型为ACCESS_KEY_SECRET_KEY时填写 |
| secret_key      |  string    | 否     | 凭据类型为ACCESS_KEY_SECRET_KEY/SECRET_KEY时填写 |
| username        |  string    | 否     | 凭据类型为USERNAME_PASSWORD时填写 |
| password        |  string    | 否     | 凭据类型为USERNAME_PASSWORD/PASSWORD时填写 |


### 请求参数示例

```json
{
  "bk_app_code": "esb_test",
  "bk_app_secret": "xxx",
  "bk_token": "xxx",
  "bk_biz_id": 1,
  "name": "testCredential",
  "type": "USERNAME_PASSWORD",
  "description": "This is a test credential",
  "username": "admin",
  "password": "password"
}
```

### 返回结果示例

```json
{
  "result": true,
  "code": 0,
  "message": "success",
  "data": {
    "id": "06644309e10e4068b3c7b32799668210"   
  }
}
```

### 返回结果参数说明

#### data

| 字段      | 类型    |字段是否一定存在  | 描述      |
|-----------|-------|---------------|---------|
| id        | string |是             | 凭据ID |
