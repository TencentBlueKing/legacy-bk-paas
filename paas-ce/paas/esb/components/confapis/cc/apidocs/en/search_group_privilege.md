### Functional description

search group privilege

### Request Parameters

{{ common_args_desc }}

#### General Parameters

| Field                 |  Type      | Required	   |  Description       |
|----------------------|------------|--------|-------------|
| bk_supplier_account  | string     | Yes     | Supplier account  |
| group_id             | string     | Yes     | Group ID      |

### Request Parameters Example

``` python
{
    "bk_supplier_account":"0",
    "group_id":"test"
}
```

### Return Result Example

```python

{
    "result": true,
    "code": 0,
    "message": "",
    "data": {
         "group_id":1,
         "sys_config":{
             "global_busi":[
                 "resource"
             ],
             "back_config":[
                 "event",
                 "model",
                 "audit"
             ]
         },
         "model_config":{
             "network":{
                 "router":[
                     "update",
                     "delete"
                 ]
             }
         }
    }
}
```

### Return Result Parameters Description

#### data

| Field          | Type     | Description     |
|---------------|----------|----------|
| group_id      | string   | Group ID   |
| sys_config    | object   | System configuration |
| back_config   | object   | Backstage configuration |
| model_config  | object   | Model configuration |


#### sys_config  only with global_busi

| name     | Type   | Description       |
|---------|--------|------------|
| resource| string | Host resource |

#### back_config

| name    | Type   | Description         |
|---------|--------|--------------|
| event   | string | Event configuration |
| model   | string | Model configuration     |
| audit   | string | Audit configuration     |

#### model_config

| name   | Type   | Description |
|--------|--------|------|
| create | string | Create  |
| update | string | Update  |
| delete | string | Delete  |
| search | string | Search  |
