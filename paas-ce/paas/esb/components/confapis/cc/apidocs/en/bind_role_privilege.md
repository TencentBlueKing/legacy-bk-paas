### Functional description

bind role privilege

### Request Parameters

{{ common_args_desc }}

#### General Parameters

| Field       |  Type    | Required	   |  Description         |
|------------|----------|--------|---------------|
| hostupdate | string   | No     | Host update      |
| hosttrans  | string   | No     | Host transfer   |
| topoupdate | string   | No     | Host topology update   |
| customapi  | string   | No     | Custom api     |
| proconfig  | string   | No     | Process configuration      |
| bk_supplier_account  | string     | Yes     | Supplier account            |
| bk_obj_id            | string     | Yes     | Object ID                |
| bk_property_id       | string     | Yes     | The user property ID of model |


### Request Parameters Example

```python
{
    "data":[
        "hostupdate",
        "hosttrans",
        "topoupdate",
        "customapi",
        "proconfig"
    ],
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
    "data":""
}
```
