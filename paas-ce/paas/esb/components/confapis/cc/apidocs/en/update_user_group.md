### Functional description

update uesr group

### Request Parameters

{{ common_args_desc }}

#### General Parameters


| Field                |  Type   | Required	   |  Description                     |
|---------------------|---------|--------|--------------------------|
| bk_supplier_account | string  | Yes     | Supplier account                |
| group_id            | string  | Yes     | Group ID                    |
| group_name          | string  | No     | Group name                     |
| user_list           | string  | No     | User list, separated by ';' |


### Request Parameters Example

```python
{
    "bk_supplier_account":"0",
    "group_id":"0",
    "group_name":"administrators",
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
