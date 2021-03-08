### Functional description

delete instance

### Request Parameters

{{ common_args_desc }}

#### Request Parameters Example

| Field                |  Type       | Required	   |  Description                            |
|---------------------|-------------|--------|----------------------------------|
| bk_supplier_account | string      | Yes     | Supplier account                       |
| bk_obj_id           | string      | Yes     | Object ID |
| bk_inst_id          | int         | Yes     | instance ID  |


### Request Parameters Example

```python

{
    "bk_supplier_account": "0",
    "bk_obj_id": "test",
    "bk_inst_id": 0
}
```


### Return Result Example

```python

{
    "result": true,
    "code": 0,
    "message": "",
    "data": "success"
}
```
