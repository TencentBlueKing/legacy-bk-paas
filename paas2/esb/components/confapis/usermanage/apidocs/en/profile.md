### description

Query member details

### request parameter

{{ common_args_desc }}


#### interface parameters

| field      |  type      | required   |  description      |
|-----------|------------|--------|------------|
| id | string | yes | User UID |

### sample request parameters


``` json
{
    "id": "576701f6114a4cf3ba95e98cb71a2bb9"
}
```

### sample return results

```json
{
    "message": "Success",
    "code": 0,
    "data": {
        "uid": "576701f6114a4cf3ba95e98cb71a2bb9",
        "username": "asd",
        "display_name": "asdasdasd",
        "telephone": "13222222222",
        "email": "asd@qq.com",
        "wx_id": "",
        "position": "",
        "role": 0,
        "department": [
            {
                "id": 4,
                "name": "subdivision2",
                "has_children": false
            }
        ],
        "leader": [],
        "extattr": [],
        "status": "NORMAL",
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
|uid| string| user UID |
|username| string| username |
|display_name| string| display name for user |
|telephone| string| telephone for user |
|email| string| email |
|wx_id| string| wechat ID |
|position| string| position string for user |
|role|int| 0 ordinary users, 1 super administrators, 2 developers, 3 functional users, 4 auditors|
|department| list| Department list is part of department list, name represents department name |
|leader| list| List of user names for leader list superiors |
|status| string| Status string user status |
|extattr| list| Extattr list extension fields |
