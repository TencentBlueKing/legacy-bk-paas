### description

search for members or departments

### request parameter

{{ common_args_desc }}


#### interface parameters

| field      |  type      | required   |  description      |
|-----------|------------|--------|------------|
| keyword | string | yes | search keyword |


### sample request parameters


``` json
{
    "keyword": "a"
}
```

### sample return results

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

### resulting parameters

| field      | type      | description      |
|-----------|-----------|-----------|
|result| bool | returns a result, true for success and false for failure |
|code|int|The return code, 0 for success, and other values for failure|
|message|string|error message|
|data| array| result |
|username| string| user name |
|name| string| department name |
|uid| string| uid of user |
|id| int| department id |


