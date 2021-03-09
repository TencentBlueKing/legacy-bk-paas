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
| action |  object   | Yes   | permission action |
| subject |  object   | Yes   | authorized object |
| resources |  array[object]   | Yes   | resource instance |

#### action

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
| id | string | Yes | resource instance id |
| name | string | Yes | resource instance name |

### Request Parameters Example

```python
{
  "asynchronous": false,
  "operate": "grant",
  "system": "bk_cmdb",
  "action": {
    "id": "edit_host"
  },
  "subject": {
    "type": "user",
    "id": "admin"
  },
  "resources": [{
    "system": "bk_cmdb",
    "type": "host",
    "id": "host1",
    "name": "host1"
  }]
}
```

### Return Result Example

```python
{
  "data": {
    "policy_id": 1,
    "expression": {
      "field": "host.id",
      "op": "in",
      "value": ["host1", "host2"]
    }
  },
  "result": true,
  "code": 0,
  "message": "OK"
}
```

### Return Result Parameters Description

#### data

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| policy_id   | int     | permission policy id |
| expression   | object     | permission expression |
