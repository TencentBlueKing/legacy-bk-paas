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
    "keyword": "parent"
}
```

### sample return results

```json
{
    "message": "Success",
    "code": 0,
    "data": [
        {
            "name": "parent_company",
            "id": 37
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
|name| string| department name |
|id| int| department id |


