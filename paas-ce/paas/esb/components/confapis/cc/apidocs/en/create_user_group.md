### Functional description

create user group

### Request Parameters

{{ common_args_desc }}

#### Request Parameters Example

| Field                 |  Type      | Required	   |  Description                     |
|----------------------|------------|--------|---------------------------|
| bk_supplier_account  | string     | Yes     | Supplier account                |
| group_name           | string     | Yes   | Group name                     |
| user_list            | string     | Yes     |  User list, separated by ';' |


### Request Parameters Example

```python
{
    "bk_supplier_account": "0",
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
    "data":""
}
```
