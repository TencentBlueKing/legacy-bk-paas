### Functional description

create instance

### Request Parameters

{{ common_args_desc }}

#### General Parameters

| Field                       |  Type      | Required	   |  Description                                      |
|----------------------------|------------|--------|--------------------------------------------|
| bk_obj_id                  | string     | Yes     | Object ID, new cloud is a plat                 |
| bk_supplier_account        | string     | No     | Supplier account, please fill '0' by independent deployment                |
| bk_inst_name/bk_cloud_name | string     | Yes     | Instance ID,when new object is a cloud,it is bk_cloud_name |
| bk_biz_id                  | int        | No     | Business ID                                     |



### Request Parameters Example

```python
{
    "bk_inst_name": "example18",
    "bk_supplier_account": "0",
    "bk_biz_id": 0
}
```

### Return Result Example

```python

{
    "result": true,
    "code": 0,
    "message": "",
    "data": {
        "bk_inst_id": 67
    }
}
```

### Return Result Parameters Description

#### data

| Field       | Type      | Description     |
|----------- |-----------|----------|
| bk_inst_id | int       | Instance ID   |
