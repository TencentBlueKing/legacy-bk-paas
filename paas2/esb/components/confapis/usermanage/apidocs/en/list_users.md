### description

List all users

### request parameter

{{ common_args_desc }}


#### interface parameters

| field      |  type      | required   |  description      |
|-----------|------------|--------|------------|
| lookup_field | string | no | lookup on which field, 'username' as default |
| page | int | no | page num |
| ~~no_page~~ | bool | no | deprecated, please remove this param |
| page_size | int | no | page size |
| fields | string | no | response fields, e.g. "username,id" |
| exact_lookups | string | no | exact lookup list, e.g. "jack,pony" |
| fuzzy_lookups | string | no | fuzzy lookup list, e.g. "jack,pony" |


### sample request parameters

``` json
{
  "fields": "username,id"
}
```

### sample return results

```json
{
    "message": "Success",
    "code": 0,
    "data": [{
        "id": 4,
        "username": "jackma",
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

