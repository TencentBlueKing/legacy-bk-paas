### 功能描述

资源拓扑授权回收

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| asynchronous |  布尔  | 是   | 是否异步调用, 默认 否, 当前只支持同步 |
| operate |  字符串   | 是   | grant或revoke |
| system |  字符串  | 是   | 系统id |
| action |  字符串   | 是   | 操作 |
| subject |  字符串   | 是   | 授权对象 |
| resources |  数组[对象]   | 是   | 资源拓扑 |

#### action

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| id    |  字符串  | 是   | 操作ID |

#### subject

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| type    |  字符串  | 是   | 授权对象类型, 当前只支持 user |
| id    |  字符串  | 是   | 授权对象ID |

#### resources

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| system |  字符串  | 是   | 资源系统ID |
| type |  字符串  | 是   | 资源类型ID |
| path | 数组[对象] | 是 | 资源的拓扑 |

#### resources.path

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| type |  字符串  | 是   | 拓扑节点类型ID |
| id | 字符串 | 是 | 拓扑节点实例ID |
| name | 字符串 | 是 | 拓扑节点实例名称 |

### 请求参数示例

```python
{
  "asynchronous": false,  # 默认false, 当前只支持同步
  "operate": "grant",   # grant 授权 revoke 回收
  "system": "bk_cmdb",
  "action": {
    "id": "edit_host"
  },
  "subject": {  # 当前只能对user授权
    "type": "user",
    "id": "admin"
  },
  "resources": [  # 操作依赖多个资源类型的情况下, 表示一个组合资源
    {
      "system": "bk_cmdb",
      "type": "host",
      "path": [
        {
          "type": "biz",
          "id": "1",
          "name": "biz1"
        },{
          "type": "set",
          "id": "*",
          "name": ""
        }
      ]
    }
  ]
}
```

### 返回结果示例

```python
{
  "data": {
    "policy_id": 1,
    "expression": {  # 表达式是整个action的所有条件的组合, 包括用户已有的权限与新增的path授权的条件
      "op": "OR",
      "content": [
        {  # 表达式中新增的路径授权
          "field": "host._bk_iam_path_",
          "op": "starts_with",
          "value": [
            "/biz,1/set,*/"
          ]
        },
        {
          "field": "host.id",
          "op": "in",
          "value": [
            "host1",
            "host2"
          ]
        }
      ]
    }
  },
  "result": true,
  "code": 0,
  "message": "OK"
}
```

### 返回结果参数说明

#### data

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| policy_id   | 数值     | 权限策略id |
| expression   | 对象     | 权限表达式 |
