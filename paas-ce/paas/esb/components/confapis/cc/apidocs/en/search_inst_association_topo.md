### Functional description

search instance association topology

### Request Parameters

{{ common_args_desc }}

#### General Parameters

| Field                |  Type      | Required	   |  Description                       |
|---------------------|------------|--------|-----------------------------|
|bk_supplier_account  |string|Yes |Supplier account|
|bk_obj_id            |string|Yes |Object ID|
|bk_inst_id           |int|Yes |Instance ID|


### Request Parameters Example

``` python
{
    "bk_supplier_account":"0",
    "bk_obj_id":"test",
    "bk_inst_id":"test"
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
           "curr": {
               "bk_inst_id": 17,
               "bk_inst_name": "192.168.1.1",
               "bk_obj_icon": "icon-cc-host",
               "bk_obj_id": "host",
               "bk_obj_name": "host",
               "children": [],
               "count": 0
           },
           "next": [
               {
                   "bk_inst_id": 0,
                   "bk_inst_name": "",
                   "bk_obj_icon": "icon-cc-subnet",
                   "bk_obj_id": "plat",
                   "bk_obj_name": "cloud",
                   "children": [
                       {
                           "bk_inst_id": 0,
                           "bk_inst_name": "default area",
                           "bk_obj_icon": "",
                           "bk_obj_id": "plat",
                           "bk_obj_name": "",
                           "id": "0"
                       }
                   ],
                   "count": 1
               }
           ],
           "prev": [
               {
                   "bk_inst_id": 0,
                   "bk_inst_name": "",
                   "bk_obj_icon": "icon-cc-business",
                   "bk_obj_id": "rel",
                   "bk_obj_name": "association",
                   "children": [
                       {
                           "bk_inst_id": 162,
                           "bk_inst_name": "test1",
                           "bk_obj_icon": "",
                           "bk_obj_id": "rel",
                           "bk_obj_name": ""
                       }
                   ],
                   "count": 1
               }
           ]
       }
   ]
}
```

### Return Result Parameters Description

#### data

| Field      | Type         | Description                 |
|-----------|--------------|----------------------|
| curr      | object       | The current instance node information   |
| next      | object array | The subnode set of the current node |
| prev      | object array | Parent node integration of the current node |


#### curr

| Field         | Type         | Description                          |
|--------------|--------------|-------------------------------|
| bk_inst_id   | int          | Instance ID                        |
| bk_inst_name | string       | Instance name for display            |
| bk_obj_icon  | string       | Object icon name                |
| bk_obj_id    | string       | Object ID                        |
| bk_obj_name  | string       | Object name for display            |
| children     | object array | The set of associated instances under this model|
| count        | int          | Children     include node's number   |


#### next

| Field         | Type         | Description                           |
|--------------|--------------|--------------------------------|
| bk_inst_id   | int          | Instance ID|the inst ID             |
| bk_inst_name | string       | Instance name for display             |
| bk_obj_icon  | string       | Object icon name                 |
| bk_obj_id    | string       | Object ID                         |
| bk_obj_name  | string       | Object name for display             |
| children     | object array | The set of associated instances under this model |
| count        | int          | Children include node's number         |

#### next/children

| Field         | Type      | Description               |
|--------------|-----------|--------------------|
| bk_inst_id   |int        | Instance ID             |
| bk_inst_name |string     | Instance name for display |
| bk_obj_icon  |string     | Object icon name     |
| bk_obj_id    |string     | Object ID             |
| bk_obj_name  |string     | Object name for display |



#### prev

| Field         | Type         | Description                           |
|--------------|--------------|--------------------------------|
| bk_inst_id   | int          | Instance ID|the inst ID             |
| bk_inst_name | string       | Instance name for display             |
| bk_obj_icon  | string       | Object icon name                 |
| bk_obj_id    | string       | Object ID                         |
| bk_obj_name  | string       | Object name for display             |
| children     | object array | The set of associated instances under this model |
| count        | int          | Children include node's number        |

#### prev/children Field说明

| Field        | Type   | Description               |
|-------------|--------|--------------------|
|bk_inst_id   | int    | Instance ID|the inst ID |
|bk_inst_name | string | Instance name for display |
|bk_obj_icon  | string | Object icon name     |
|bk_obj_id    | string | Object ID             |
|bk_obj_name  | string | Object name for display |
