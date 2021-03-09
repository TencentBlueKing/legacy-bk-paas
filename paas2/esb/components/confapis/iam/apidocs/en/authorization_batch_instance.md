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
| instances | array[object] | Yes | batch resource information |

#### resources.instances

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| id | string | Yes | resource instance id |
| name | string | Yes | resource instance name |

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
      "instances": [
        {
          "id": "1",
          "name": "host1"
        }
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
