### Functional description

get process bind module

### Request Parameters

{{ common_args_desc }}

#### Request Parameters Example

| Field                 |  Type      | Required	   |  Description                 |
|----------------------|------------|--------|-----------------------|
| bk_supplier_account  | string     |Yes     | Supplier account       |
| bk_biz_id            | int     | Yes     |    Bussiness ID   |
| bk_process_id       | int     | Yes    | Process ID |


### Request Parameters Example

```python


```

### Return Result Example

```python

{
    "result":true,
    "bk_error_code":0,
    "bk_error_msg":"",
    "data":[
        {
            "bk_module_name":"db",
            "set_num":10,
            "is_bind":0
        },
        {
            "bk_module_name":"gs",
            "set_num":5,
            "is_bind":1
        }
    ]
}
```

### Return Result Parameters Description

| Field       | Type     | Description         |
|------------|----------|--------------|
| result | bool |request result true or false|
| bk_error_code | int  |error code. 0 represent success, >0 represent failure code |
| bk_error_msg | string |error message from failed request|
| data | object  |the data response|

#### data ：

| Field       | Type     | Description         |
|------------|----------|--------------|
| bk_module_name| string| Module Name |
| set_num| int | set number |
| is_bind| int | is bind with |


