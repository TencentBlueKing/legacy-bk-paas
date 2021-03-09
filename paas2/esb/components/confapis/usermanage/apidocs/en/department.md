### description

Query for department information

### request parameter

{{ common_args_desc }}


#### interface parameters

| field      |  type      | required   |  description      |
|-----------|------------|--------|------------|
| id | integer | yes | department ID |

### sample request parameters

``` json
{
    "id": "4"
}
```

### sample return results

```json
{
    "message": "Success",
    "code": 0,
    "data": {
        "id": 4,
        "name": "subdivision2",
        "order": 2,
        "parent": 1,
        "children": [],
        "has_children": false
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
|id| int| department ID |
|name| string| department name |
|order| int| order of department show |
|parent| int| direct parent department ID |
|children| list| list of subdepartments, data format consistent with superior departments |
|has_children| bool| has a sub department or not |
