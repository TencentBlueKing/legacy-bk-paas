### description

Query for department information

### request parameter

{{ common_args_desc }}


#### interface parameters

| field      |  type      | required   |  description      |
|-----------|------------|--------|------------|
| id_list | array | yes | department ID list|

### sample request parameters

``` json
{
	"id_list": [37, 38, 39]
}
```

### sample return results

```json
{
    "message": "Success",
    "code": 0,
    "data": [
        {
            "id": 37,
            "name": "parent_company",
            "order": 1,
            "parent": null,
            "children": [
                {
                    "id": 38,
                    "name": "asdasd",
                    "parent": 37,
                    "order": 1,
                    "has_children": true
                },
                {
                    "id": 40,
                    "name": "asdasdas",
                    "parent": 37,
                    "order": 2,
                    "has_children": false
                }
            ],
            "has_children": true,
            "ancestor_name": "parent_company"
        },
        {
            "id": 38,
            "name": "asdasd",
            "order": 1,
            "parent": 37,
            "children": [
                {
                    "id": 39,
                    "name": "asdasdasd",
                    "parent": 38,
                    "order": 1,
                    "has_children": false
                }
            ],
            "has_children": true,
            "ancestor_name": "parent_company/asdasd"
        },
        {
            "id": 39,
            "name": "asdasdasd",
            "order": 1,
            "parent": 38,
            "children": [],
            "has_children": false,
            "ancestor_name": "parent_company/asdasd/asdasdasd"
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
|children| list| list of subdepartments, data format consistent with superior departments |
|has_children| bool| has a sub department or not |
|ancestor_name| string| name of department containing all ancestors |