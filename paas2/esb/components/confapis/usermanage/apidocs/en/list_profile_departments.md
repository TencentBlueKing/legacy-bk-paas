### description

List certain user's departments

### request parameter

{{ common_args_desc }}


#### interface parameters

| field      |  type      | required   |  description      |
|-----------|------------|--------|------------|
| lookup_field | string | no | lookup on which field, 'username' as default |
| with_family | bool | no | result with deparment family, false as default |


### sample request parameters

``` json
{
  "with_family": true
}
```

### sample return results

```json
{
    "message": "Success",
    "code": 0,
    "data": [{
        "id": 4,
        "name": "PaaS",
        "family": [
           {"id": 5, "name": "BlueKing1"},
           {"id": 6, "name": "BlueKing2"},
        ]
    }],
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

