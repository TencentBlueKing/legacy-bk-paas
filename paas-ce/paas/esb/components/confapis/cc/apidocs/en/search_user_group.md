### Functional description

search user group

### Request Parameters

{{ common_args_desc }}

#### General Parameters

| Field                 |  Type      | Required	   |  Description                     |
|----------------------|------------|--------|---------------------------|
| bk_supplier_account  | string     | Yes     | Supplier account                |
| group_name           | string     | No     | Group name                     |
| user_list            | string     | No     | User group list, separated by ';' |

body is empty object then return all the group

### Request Parameters Example

```python
{
    "bk_supplier_account":"0",
    "group_name":"Administrators",
    "user_list":"owen;tt"
}
```

### Return Result Example

```python

{
    "result": true,
    "code": 0,
    "message": "",
    "data":[
        {
            "group_name":"Administrators",
            "user_list":"owen;tt",
            "group_id":1
        }
    ]
}
```

### Return Result Parameters Description

#### data

| Field          | Type      | Description     |
|---------------|-----------|----------|
| group_name    | string    | Group name    |
| user_list     | string    | User list  |
| group_id      | string    | Group ID   |
