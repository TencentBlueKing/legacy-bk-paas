### Functional description

get role privilege

### Request Parameters

{{ common_args_desc }}

#### Request Parameters Example

| Field                 |  Type      | Required	   |  Description                 |
|----------------------|------------|--------|-----------------------|
| bk_supplier_account  | string     | Yes     | Supplier account            |
| bk_obj_id            | string     | Yes     | Object ID                |
| bk_property_id       | string     | Yes     | The user property ID of model |

### Request Parameters Example

``` python
{
    "bk_supplier_account":"0",
    "bk_obj_id":"test",
    "bk_property_id":"test"
}
```

### Return Result Example

```python

{
    "result": true,
    "code": 0,
    "message": "",
    "data":[
        "hostupdate",
        "hosttrans",
        "topoupdate",
        "customapi",
        "proconfig"
    ]
}
```

### Return Result Parameters Description

#### data

| Field       | Type     | Description         |
|------------|----------|--------------|
| hostupdate | string   | Host update      |
| hosttrans  | string   | Host transfer     |
| topoupdate | string   | Host topou udpate |
| customapi  | string   | Custom api    |
| proconfig  | string   | Process configuration     |
