### 功能描述

查询指定部门成员信息

### 请求参数

{{ common_args_desc }}


#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| id | 整数 | 是 | 部门 ID |
| recursive | choice 字符串 | 否 | 是否递归，默认值 no，当为 yes 返回递归数据 |
| page | 整数 | 否 | 分页，默认 1|
| page_size | 整数 | 否 | 分页大小，默认 10|


### 请求参数示例

``` json
{
    "id": 4,
    "recursive": "yes"
}
```

### 返回结果示例

```json
{
    "message": "Success",
    "code": 0,
    "data": {
        "total": 1,
        "data": [
            {
                "status": "NORMAL",
                "username": "88888888888888888",
                "uid": "1a234218b8f7423c98cab58bc79ed2f7",
                "language": "ZH_CN",
                "display_name": "555555",
                "time_zone": "Asia/Shanghai",
                "telephone": "12300000000",
                "role": 3,
                "logo_url": "https://domain.com:443/logo/88888888888888888.png",
                "email": "123@qq.com"
            }
        ],
        "page": 1,
        "page_size": 10
    },
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

### data
| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
|status| string| 用户状态 |
|username| string| 用户名 |
|uid| string| 用户 UID |
|language| string| 默认 zh-cn，可选 zh-cn、en |
|display_name| string| 用户的显示名称 |
|time_zone| string| 默认 Asia/Shanghai ||telephone| string| 用户状态 |
|telephone| string| 用户电话号码 |
|role|int| 角色，默认 0 。0 普通用户, 1 超级管理员, 2 开发者, 3 职能化用户, 4 审计员|
|logo_url| string| 用户 logo 的 url 地址 |
|email| string| 用户邮箱 |
