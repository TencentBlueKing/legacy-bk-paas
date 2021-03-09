### description

Query for information about specified department members

### request parameter

{{ common_args_desc }}


#### interface parameters

| field      |  type      | required   |  description      |
|-----------|------------|--------|------------|
| id | integer | yes | department ID |
| recursive | choice string | no | recursion or not, default no， When recursive data is returned for yes|
| page | integer | no | paging num，default 1|
| page_size | integer | no | paging size，default 10|

### sample request parameters

``` json
{
    "id": "4",
    "recursive": "yes"
}
```

### sample return results

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

### resulting parameters

| field      | type      | description      |
|-----------|-----------|-----------|
|result| bool | returns a result, true for success and false for failure |
|code|int|The return code, 0 for success, and other values for failure|
|message|string|error message|
|data| array| result |
| status | string | user status |
| username | string | user name |
| uid | string | user UID |
| language | string | default zh-cn,. Zh-cn and en are optional. |
| display_name | string | display name of the user |
| time_zone | string | default Asia/Shanghai | telephone | string | user status |
| telephone | string | user phone number |
| role | int | role. Default is 0. 0 ordinary users, 1 Super Admin, 2 developers, 3 functional users, 4 auditors |
| logo_url | string | url address of user logo |
| email | string | user email |