### Functional description

resource creator action authorization

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| system | string | Yes | system id |
| type  | string | Yes | resource type id |
| id | string | Yes | resource instance id |
| name | string | Yes | resource isntance name |
| creator | string | Yes | resource instance creator |
| ancestors | array(object) | No | resource instance ancestors，not required, If there may be different topology levels for resource instances and some actions need to be authenticated according to the topology level, this field needs to be filled in. |

#### ancestors
| Field      |  Type      | Required   |  Description      |
| system | string | Yes | system id |
| type | string | Yes | ancestor resource type |
| id | string | Yes | ancestor resource instance id |


### Request Parameters Example

- without ancestors
```json
{
    "system": "bk_job",
    "type":"job",
    "id":"job1",
    "name":"first job",
    "creator":"admin"
}
```

- with ancestors
```json
{
    "system": "bk_sops",
    "type":"mini_app",
    "id":"mini_app1",
    "name":"first mini_app",
    "creator":"admin",
    "ancestors":[
        {
            "system": "bk_sops",
            "type":"project",
            "id":"project1"
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
