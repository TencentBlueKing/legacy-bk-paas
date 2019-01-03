### Functional description

delete instance

### Request Parameters

{{ common_args_desc }}

#### Request Parameters Example

| Field                |  Type       | Required	   |  Description                            |
|---------------------|-------------|--------|----------------------------------|
| bk_supplier_account | string      | Yes     | Supplier account                       |
| bk_obj_id           | string      | Yes     | Object ID，the deleted object is cloud, that is 'plat' |
| bk_inst_id          | int         | Yes     | instance ID，the deleted cloud is cloud ID  |


### Request Parameters Example

```python

{
    "bk_supplier_account": "0",
    "bk_obj_id": "test",
    "delete":{
    "bk_inst_id": 0
    }
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
