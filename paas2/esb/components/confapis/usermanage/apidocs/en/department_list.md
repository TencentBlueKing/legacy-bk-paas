### description

Query department list

### request parameter

{{ common_args_desc }}

| field      |  type      | required   |  description      |
|-----------|------------|--------|------------|
| type | string | no | By default, only root departments are returned, and when type=all, a list of all departments is returned|

### sample request parameters

``` json
{
    "type": "all"
}
```

### sample return results

```json
{
    "message": "Success",
    "code": 0,
    "data": [
        {
            "id": 1,
            "name": "parent company",
            "order": 1,
            "parent": null,
            "children": [
                {
                    "id": 3,
                    "name": "subdivision",
                    "parent": 1,
                    "order": 1,
                    "has_children": false
                },
                {
                    "id": 4,
                    "name": "subdivision2",
                    "parent": 1,
                    "order": 2,
                    "has_children": false
                }
            ],
            "has_children": true
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
|id| int| department ID |
|name| string| department name |
|order| int| order of department show |
|parent| int| direct parent department ID |
|has_children| bool| has a sub department or not |
|children| list| list of subdepartments, data format consistent with superior departments except children|
