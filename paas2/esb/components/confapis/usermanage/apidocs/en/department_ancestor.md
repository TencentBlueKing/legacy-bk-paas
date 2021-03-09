### description

Query department ancestor, include self

### request parameter

{{ common_args_desc }}


#### interface parameters

| field      |  type      | required   |  description      |
|-----------|------------|--------|------------|
| id | integer | yes | department ID |


### sample request parameters


``` json
{
    "id": 296
}
```

### sample return results

```json
{
    "message": "Success",
    "code": 0,
    "data": [
        {
            "id": 291,
            "name": "Digital company",
            "has_children": true
        },
        {
            "id": 296,
            "name": "Development Team",
            "has_children": false
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
|has_children| bool| has a subdivision or no|
|id| int| department id |


