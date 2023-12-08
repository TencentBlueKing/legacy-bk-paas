### Function Description

Get dangerous rule list

### Request Parameters

{{ common_args_desc }}

#### Interface parameters

| Fields               | Type   | Required | Description                                                  |
| -------------------- | ------ | -------- | ------------------------------------------------------------ |
| expression           | string | no       | Expression                                                   |
| script_language_list | array  | no       | Script language:1 - shell, 2 - bat, 3 - perl, 4 - python, 5 - powershell, 6 - sql |
| description          | string | no       | Rule description                                             |
| action               | int    | no       | Processing actions: 1- Scan, 2- Intercept                    |


### Example of request

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "script_language_list": [1],
    "action": 2
}
```

### Example of responses

```json
{
    "code": 0,
    "result": true,
    "data": [
        {
            "id": 1,
            "expression": "rm",
            "script_language_list": [1],
            "description": "drangerous!!!"
            "action": 2,
            "status": 0,
            "creator": "admin",
            "create_time": 1695193968000,
            "last_modify_user": "admin",
            "last_modify_time": 1695302417000
       }
    ]
}
```

### Response Description

#### response

| Fields     | Type   | Description                                                  |
| ---------- | ------ | ------------------------------------------------------------ |
| result     | bool   | Whether the request succeeded or not. True: request succeeded;False: request failed |
| code       | int    | Error code. 0 indicates success, >0 indicates failure        |
| message    | string | Error message                                                |
| data       | object | Data returned by request                                     |
| permission | object | Permission information                                       |

#### data

| Fields               | Type   | Description                                                  |
| -------------------- | ------ | ------------------------------------------------------------ |
| id                   | long   | Rule id                                                      |
| expression           | string | expression                                                   |
| script_language_list | array  | Script language:1 - shell, 2 - bat, 3 - perl, 4 - python, 5 - powershell, 6 - sql |
| description          | string | Description                                                  |
| action               | int    | Processing actions: 1- Scan, 2- Intercept                    |
| status               | int    | Enabling status: 0- disabled, 1- enabled                     |
| creator              | string | Creator                                                      |
| create_time          | long   | Created time, Unix timestamp                                 |
| last_modify_user     | string | Last modify user                                             |
| last_modify_time     | long   | Last modified time, Unix timestamp                           |
