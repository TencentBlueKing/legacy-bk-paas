### Functional description

update instance

### Request Parameters

{{ common_args_desc }}

#### General Parameters

| Field                |  Type      | Required	   |  Description                            |
|---------------------|------------|--------|----------------------------------|
| bk_supplier_account | string     | Yes     | Supplier account                       |
| bk_obj_id           | string     | Yes     | Object ID, update the cloud area for "plat"       |
| bk_inst_id          | int        | Yes     | Instance ID,update the cloud for "bk_cloud_id" |
| bk_inst_name        | string     | No     | Field instance ID,also it can be used for custom   |
| bk_cloud_name       | string     | No     |  Cloud name, when updating cloud     |


### Request Parameters Example(General instance example)

```python
{
    "bk_supplier_account": "0",
    "bk_obj_id": "1",
    "bk_inst_id": 0,
    "bk_inst_name": "test",
    "bk_cloud_name":"test"
 }
```

### Request Parameters Example(Cloud example)

```python
  {
	"bk_cloud_name": "cloud1"
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
