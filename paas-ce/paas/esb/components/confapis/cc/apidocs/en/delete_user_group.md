### Functional description

delete user group

### Request Parameters

{{ common_args_desc }}

#### General Parameters

| Field                |  Type       | Required	   |  Description       |
|---------------------|-------------|--------|-------------|
| bk_supplier_account | string      | Yes     | Supplier account  |
| group_id            | string      | Yes     | Group ID      |


### Request Parameters Example

```python

{
    "bk_supplier_account": "0",
    "delete":{
        "group_id": "test"    
    }
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
