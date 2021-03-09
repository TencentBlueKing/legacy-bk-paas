### description

Query department info

### request parameter

{{ common_args_desc }}


#### interface parameters

| field      |  type      | required   |  description      |
|-----------|------------|--------|------------|
| lookup_field | string | no | lookup on which field, 'id' as default|
| fields | string | no | response fields, e.g. "name,id" |


### sample request parameters

``` json
{
  "fields": "name,id"
}
```

### sample return results

```json
{
    "message": "Success",
    "code": 0,
    "data": {
        "id": 4,
        "username": "PaaS",
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

