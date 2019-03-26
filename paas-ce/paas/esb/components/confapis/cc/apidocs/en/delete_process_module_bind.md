### Functional description

delete process module bind relationship

### Request Parameters

{{ common_args_desc }}

#### Request Parameters Example

| Field  |  Type       | Required	   |  Description                         |
|-------|-------------|--------|-------------------------------|
| id    | int         | No     | The unique identifier ID of the deleted data record  |
| bk_supplier_account | string   | Yes     | Supplier account      |
| bk_biz_id  | int   | Yes     | Bussiness ID      |
| bk_process_id | int   | Yes     | Process ID  |
| bk_module_name  | string   | yes     | ModuleName     |


### Request Parameters Example

```python


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
