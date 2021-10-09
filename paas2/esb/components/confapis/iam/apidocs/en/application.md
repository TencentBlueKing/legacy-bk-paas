### Functional description

application for access system

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| system_id |  string  | Yes   | system id |
| actions |  array   | Yes   | permission actions |

#### actions

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| id    |  string  | Yes   | action id                                                  |
| related_resource_types |  array | Yes | action related resource type |

#### actions.related_resource_types

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| system_id |  string  | Yes   | resource type system id                            |
| type | string | Yes | resource type id        |
| instances | array[array] | Yes | resource instance |
| attributes | array | No | attribute |

#### actions.related_resource_types.instances

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| type |  string  | Yes   | resource type id                            |
| id | string | Yes | resource instance id |
| name | string | Yes | resource instance name |

#### actions.related_resource_types.attributes

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| id | string | Yes | attribute key |
| name | string | Yes | attribute key name |
| values | array | Yes | attribute values |

#### actions.related_resource_types.attributes.values

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| id | string | Yes | attribute value |
| name | string | Yes | attribute value name |

### Request Parameters Example

```python
{
  "system_id": "bk_job",
  "actions": [
    {
      "id": "execute_job",
      "related_resource_types": [
        {
          "system_id": "bk_job",
          "type": "job",
          "instances": [
            [
              {
                "type": "job",
                "id": "job1",
                "name": "job1"
              }
            ]
          ]
        },
        {
          "system_id": "bk_cmdb",
          "type": "host",
          "instances": [
            [
              {
                "type": "biz",
                "id": "biz1",
                "name": "biz1"
              }, {
                "type": "set",
                "id": "set1",
                "name": "set1"
              }, {
                "type": "module",
                "id": "module1",
                "name": "module1"
              }, {
                "type": "host",
                "id": "host1",
                "name": "host1"
              }
            ]
          ],
          "attributes": [
            {
              "id": "os",
              "name": "os",
              "values": [
                {
                  "id": "linux",
                  "name": "linux"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

### Return Result Example

```python
{
  "data": {
    "url": "https://paas.bk.com/o/bk_iam_app/perm-apply?system_id=bk_job&tid=09d432dccac74ec4aa17629f5f83715f"
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
| url   | str     | permission request redirect url |