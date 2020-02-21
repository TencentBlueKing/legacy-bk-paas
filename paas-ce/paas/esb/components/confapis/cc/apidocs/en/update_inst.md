### Functional description

update instance

### Request Parameters

{{ common_args_desc }}

#### General Parameters

| Field                |  Type      | Required	   |  Description                            |
|---------------------|------------|--------|----------------------------------|
| bk_supplier_account | string     | Yes     | Supplier account                       |
| bk_obj_id           | string     | Yes     | Object ID       |
| bk_inst_id          | int        | Yes     | Instance ID |
| bk_inst_name        | string     | No     | Field instance ID,also it can be used for custom   |


### Request Parameters Example(General instance example)

```python
{
    "bk_supplier_account": "0",
    "bk_obj_id": "1",
    "bk_inst_id": 0,
    "bk_inst_name": "test"
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
