### Functional description

resource creator action authorization

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| system | string | Yes | system id |
| type  | string | Yes | resource type id |
| creator | string | Yes | resource instance creator |
| attributes | array(object) | YES | resource attribute list, The permission logic between multiple attributes is AND |

#### attributes

| Field      |  Type      | Required   |  Description      |
| id | string | Yes | resource attribute id |
| name | string | Yes | resource attribute name |
| values | array(object) | Yes | resource attribute values，support multiple values, The permission logic between multiple attribute values is OR |


#### values

| Field      |  Type      | Required   |  Description      |
| id | string | Yes | resource attribute value id |
| name | string | Yes | resource attribute value name |


### Request Parameters Example

```json
{
    "system": "bk_sops",
    "type":"task",
    "creator":"admin",
    "attributes": [
        {
            "id":"owner",
            "name":"任务所属者",
            "values": [
                {
                    "id": "admin",
                    "name": "admin(管理员)"
                }
            ]
        }
    ]
}
```


### Return Result Example

```json
{
  "data": [
    {
        "action": {
            "id": "edit"
        },
        "policy_id": 1
    },
    {
        "action": {
            "id": "list"
        },
        "policy_id": 2
    },
    {
        "action": {
            "id": "delete"
        },
        "policy_id": 3
    },
    {
        "action": {
            "id": "view"
        },
        "policy_id": 4
    }
  ],
  "result": true,
  "code": 0,
  "message": "OK"
}
```

### Return Result Parameters Description

#### array element of data

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| action |  object | creator authorized action |
| policy_id | int | creator authorized policy id |


#### action

| Field      |  Type      | Description      |
|-----------|------------|------------|
| id    |  string | action id |
