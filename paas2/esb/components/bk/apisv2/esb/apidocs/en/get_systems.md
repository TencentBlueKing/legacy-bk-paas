### Functional description

Get the list of systems accessing the ESB

### Request Parameters

{{ common_args_desc }}

### Request Parameters Example

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx"
}
```

### Return Result Example

```python
{
    "result": true,
    "code": 0,
    "message": "OK",
    "data": [
         {
             "id": 1,
             "name": "BK_LOGIN",
             "label": "Login System",
             "remark": "BlueKing Login System, managing user login authentication and user information"
         },
         {
             "id": 2,
             "name": "BK_PAAS",
             "label": "Developer Center",
             "remark": "Developer Center"
         }
    ]
}
```

### Return Result Description

| Field      | Type      | Description      |
|-----------|----------|-----------|
|  result   |    bool    |      return result, true for success, false for failure  |
|  code     |    int     |      return code, 0 for success, other values for failure |
|  message  |    string  |      error message |
|  data     |    array   |      result data, details are described below  |

####  data

| Field      | Type      | Description      |
|-----------|----------|-----------|
|  id        |    int       |    system id    |
|  label     |    string    |    system label  |
|  name      |    string    |    system name   |
|  remark    |    string    |    remark   |
