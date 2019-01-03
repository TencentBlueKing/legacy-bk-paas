### Functional description

search object topology graphics

### Request Parameters

{{ common_args_desc }}

#### General Parameters

| Field                |  Type      | Required	   |  Description                       |
|---------------------|------------|--------|-----------------------------|
|scope_type |string|Yes|Graphics range type,global,biz,cls(global)|
|scope_id |string|Yes|ID of graphics range type, if it's global, fill in '0'|


### Request Parameters Example

``` python
{
    "scope_type": "global",
    "scope_id": "0"
}
```

### Return Result Example

```python

{
    "result": true,
    "code": 0,
    "message": "",
    "data": [
       {
           "node_type": "obj",
           "bk_obj_id": "switch",
           "bk_inst_id": 0,
           "node_name": "switch",
           "position": {
               "x": 100,
               "y": 100
           },
           "ext": {},
           "bk_obj_icon": "icon-cc-switch2",
           "scope_type": "global",
           "scope_id": "",
           "bk_biz_id": 1,
           "bk_supplier_account": "0",
           "assts": [
               {
                   "bk_asst_type": "singleasst",
                   "node_type": "obj",
                   "bk_obj_id": "host",
                   "bk_inst_id": 0,
                   "bk_object_att_id": "host_id",
                   "lable": {}
               }
           ]
       }
    ]
}
```

### Return Result Parameters Description

#### data

| Field                | Type     | Description                  |
|---------------------|----------|-----------------------|
| node_type           | string   | Node type, obj, inst |
| bk_obj_id           | string   | Object ID          |
| bk_inst_id          | int      | Instance ID                |
| node_name           | string   | Node name, when node_type is obj, node name is object name. when node_type is inst, node name is object name|
| position            | string   | The position of node in graphic      |
| ext                 | object   | Front extension field          |
| bk_obj_icon         | string   | Object icon        |
| scope_type          | string   | Graphics range type,global,biz,cls(gloabl)|
| scope_id            | string   | ID of graphics range type, if it'sglobal, fill in '0'          |
| bk_biz_id           | int      | Business ID                                         |
| bk_supplier_account | string   | Supplier account                                     |
| assts               | array    | Association node                                        |

#### assts

| Field             | Type   | Description                  |
|------------------|--------|-----------------------|
| bk_asst_type     | string | Association type               |
| node_type        | string | Node type, obj, inst |
| bk_obj_id        | string | Object ID          |
| bk_inst_id       | int    | Instance ID                |
| bk_object_att_id | string | object attribution            |
| lable            | obj ect| Label,extension field, not enabled |
