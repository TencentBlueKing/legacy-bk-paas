### Functional description

resource instance authorization

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| asynchronous |  bool  | Yes   | whether to call asynchronously |
| operate |  string   | Yes   | grant or revoke |
| system |  string  | Yes   | system id |
| actions |  array[object]   | Yes   | batch action |
| subject |  object   | Yes   | authorized object |
| resources |  array[object]   | Yes   | resource instance |

#### actions

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| id    |  string  | Yes   | action id |

#### subject

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| type    |  string  | Yes   | subject type |
| id    |  string  | Yes   | subject id |

#### resources

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| system |  string  | Yes   | resource system id |
| type |  string  | Yes   | resource type id |
| paths | array[[object]] | Yes | batch resource topological |

#### resources.paths

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| type |  string  | Yes   | topological node type |
| id | string | Yes | topological node id |
| name | string | Yes | topological node name |

### Request Parameters Example

```python
{
  "asynchronous": false,
  "operate": "grant",
  "system": "bk_cmdb",
  "actions": [
    {
      "id": "edit_host"
    }
  ],
  "subject": {
    "type": "user",
    "id": "admin"
  },
  "resources": [
    {
      "system": "bk_cmdb",
      "type": "host",
      "paths": [
        [
          {
            "type": "biz",
            "id": "1",
            "name": "biz1"
          },
          {
            "type": "set",
            "id": "*",
            "name": ""
          }
        ]
      ]
    }
  ]
}
```

### Return Result Example

```python
{
  "code": 0,
  "message": "ok",
  "data": [
    {
      "action": {
        "id": "edit_host"
      },
      "policy_id": 1
    }
  ]
}
```

### Return Result Parameters Description

#### data

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| policy_id   | int     | permission policy id |
| action   | object     | action information |
