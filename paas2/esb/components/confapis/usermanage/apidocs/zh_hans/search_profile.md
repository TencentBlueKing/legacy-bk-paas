### 功能描述

搜索成员

### 请求参数

{{ common_args_desc }}


#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| keyword | 字符串 | 是 | 搜索关键字 |


### 请求参数示例


``` json
{
    "keyword": "a"
}
```

### 返回结果示例

```json
{
    "message": "Success",
    "code": 0,
    "data": [
        {
            "username": "1111222",
            "display_name": "asdasda",
            "logo_url": "https://domain.com/api/logo/1111222.png",
            "uid": "217644ef0e5140e4bca9fb0ae1bca985"
        },
        {
            "username": "11112223",
            "display_name": "asdasda",
            "logo_url": "https://domain.com/api/logo/11112223.png",
            "uid": "b803ea85359c48c5abe634b80da14cb2"
        }
    ],
    "result": true
}
```

### 返回结果参数说明

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
|result| bool | 返回结果，true为成功，false为失败 |
|code|int|返回码，0表示成功，其他值表示失败|
|message|string|错误信息
|data| array| 结果数据 |

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
|username| string| 用户名 |
|display_name| string| 用户显示的名称 |
|logo_url| string| 用户的 logo 地址 |
|uid| string| 用户UID |
