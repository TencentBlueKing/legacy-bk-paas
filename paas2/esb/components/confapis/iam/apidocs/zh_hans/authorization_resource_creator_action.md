### 功能描述

新建关联授权接口

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| system | string | 是 系统唯一标识 |
| type | string | 是 | 资源类型的唯一标识 |
| id | string | 是 | 资源实例的唯一标识 |
| name | string  是 | 资源实例的名称 |
| creator | string | 是 | 资源实例的创建者 |
| ancestors | array(object) | 否 | 资源的祖先，非必填，对于资源实例可能存在不同拓扑层级且某些操作需要按照拓扑层级鉴权时，该字段则需要填写 |


#### ancestors

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| system | string | 是 | 系统唯一标识 |
| type | string | 是 | 祖先资源类型的唯一标识 |
| id | string | 是 | 祖先资源实例的唯一标识 |


### 请求参数示例

- 无ancestors
```json
{
    "system": "bk_job",
    "type":"job",
    "id":"job1",
    "name":"第一个作业",
    "creator":"admin"
}
```

- 有ancestors
```json
{
    "system": "bk_sops",
    "type":"mini_app",
    "id":"mini_app1",
    "name":"第一个轻应用",
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

### 返回结果示例

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

### 返回结果参数说明

#### data

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| action | object | creator被授权对应的Action |
| policy_id | int | creator被授权对应的策略ID |

#### action

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| id    |  string | action id |
