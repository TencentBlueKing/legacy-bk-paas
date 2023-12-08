### Function Description

High risk script detection

### Request Parameters

{{ common_args_desc }}

#### Interface parameters

| Fields          | Type   | Required | Description                                                  |
| --------------- | ------ | -------- | ------------------------------------------------------------ |
| script_language | int    | yes      | Script language:1 - shell, 2 - bat, 3 - perl, 4 - python, 5 - powershell, 6 - sql |
| content         | string | yes      | Script content, requiring Base64 encoding                    |


### Example of request

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "script_language": 1,
    "content": "cm0gLXJmIC8="
}
```

### Example of responses

```json
{
    "code": 0,
    "result": true,
    "data": [
        {
            "line": 1,
            "line_content": "rm /tmp",
            "match_content": "rm /tmp",
            "level": 1,
            "description": "The first line of the script does not define a valid script type, for example: #!/bin/bash"
        },
        {
            "line": 1,
            "line_content": "rm /tmp",
            "match_content": "rm",
            "level": 3,
            "description": "dangerous！！！"
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

| Fields        | Type   | Description                                         |
| ------------- | ------ | --------------------------------------------------- |
| line          | int    | Number of rows where the error occurred             |
| line_content  | string | The content of the line where the script is located |
| match_content | string | Matching Content                                    |
| level         | int    | Error level: 1- Warning, 2- Error, 3- Fatal         |
| description   | string | Description                                         |
