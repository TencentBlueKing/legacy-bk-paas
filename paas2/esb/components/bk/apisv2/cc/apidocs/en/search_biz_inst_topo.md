### Functional description

query business instance topology

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| bk_supplier_account |  string  | No     | supplier account code |
| bk_biz_id           |  int     | Yes     | the business id |
| level               |  int     | No     | the topology level, read full topology when set to -1 |

### Request Parameters Example

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_supplier_account": "123456789",
    "bk_biz_id": 1,
}
```

### Return Result Example

```python
{
    "result": true,
    "code": 0,
    "message": "success",
    "data": [
        {
            "bk_inst_id": 2,
            "bk_inst_name": "blueking",
            "bk_obj_id": "biz",
            "bk_obj_name": "business",
            "child": [
                {
                    "bk_inst_id": 3,
                    "bk_inst_name": "job",
                    "bk_obj_id": "set",
                    "bk_obj_name": "set",
                    "child": [
                        {
                            "bk_inst_id": 5,
                            "bk_inst_name": "job",
                            "bk_obj_id": "module",
                            "bk_obj_name": "module",
                            "child": []
                        }
                    ]
                }
            ]
        }
    ]
}
```

### Return Result Parameters Description

#### data

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| bk_inst_id    | int       | the inst ID |
| bk_inst_name  | string    | the name of the instance is used to display |
| bk_obj_icon   | string    | the object&#39;s icon |
| bk_obj_id     | string    | Object ID |
| bk_obj_name   | string    | the name of the object is used to display |
| child         | array     | Collection of all instances under the current node |

#### child

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| bk_inst_id    | int       | the inst ID |
| bk_inst_name  | string    | the name of the instance is used to display |
| bk_obj_icon   | string    | the object&#39;s icon |
| bk_obj_id     | string    | Object ID |
| bk_obj_name   | string    | the name of the object is used to display |
| child         | array     | Collection of all instances under the current node |
