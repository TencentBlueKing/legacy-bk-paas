### Functional description

update a topo graphics

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| bk_supplier_account | string     | No     | supplier account code |
| scope_type          |  string    | Yes     | the graphical scope type, could be global, biz, cls |
| scope_id            |  string    | Yes     | the id under the graphical scope, should be 0 when socope type is global   |
| action              |  string    | Yes     | modify action, could be update--only update the specified node, override--override the graphics with the specified node   |
| data                |  list      | No     | update data   |

#### data

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| node_type   | string | Yes | node type, could be obj, inst |
| bk_obj_id   | string | Yes | the object identifier |
| bk_inst_id  | int    | Yes | the inst ID |
| position    | dict   | No | the node position in the graphics |
| ext         | dict   | No | the extention field for frondend |
| bk_obj_icon | string | No | the object icon |


**Note**：

- scope_type,scope_id uniquely determined a graphics

- node_type,bk_obj_id,bk_inst_id, the three uniquely determine one node of each graph, so it is required

### Request Parameters Example

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_supplier_account": "123456789",
    "scope_type": "global",
    "scope_id": 0,
    "action": "update",
    "data": [
        {
            "node_type": "obj",
            "bk_obj_id": "switch",
            "bk_inst_id": 0,
            "position": {
                "x": 100,
                "y": 100
            },
            "ext": {},
            "bk_obj_icon": "icon-cc-switch2"
        }
    ]
}
```

### Return Result Example

```python

{
    "result": true,
    "code": 0,
    "message": "success",
    "data": "success"
}
```
