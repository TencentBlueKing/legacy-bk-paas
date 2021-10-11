### 功能描述

接入系统权限申请

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| system_id |  字符串  | 是   | 系统id |
| actions |  数组   | 是   | 申请权限的操作 |

#### actions

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| id    |  字符串  | 是   | 操作id |
| related_resource_types |  数组 | 是 | 操作关联的资源类型 |

#### actions.related_resource_types

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| system_id |  字符串  | 是   | 资源类型的系统id |
| type | 字符串 | 是 | 资源类型 |
| instances | 数组[数组] | 否 | 资源实例 |
| attributes | 数组 | 否 | 属性 |

#### actions.related_resource_types.instances

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| type |  字符串  | 是   | 资源类型 |
| id | 字符串 | 是 | 资源实例id |
| name | 字符串 | 是 | 资源实例名称 |

#### actions.related_resource_types.attributes

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| id | 字符串 | 是 | 属性key |
| name | 字符串 | 是 | 属性key名称 |
| values | 数组 | 是 | 属性的可选值 |

#### actions.related_resource_types.attributes.values

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| id | 字符串 | 是 | 属性value |
| name | 字符串 | 是 | 属性value名称 |

### 请求参数示例

```python
{
  "system_id": "bk_job",  # 权限的系统
  "actions": [
    {
      "id": "execute_job",  # 操作id
      "related_resource_types": [  # 关联的资源类型, 无关联资源类型的操作, 可以为空
        {
          "system_id": "bk_job",  # 资源类型所属的系统id
          "type": "job",  # 资源类型
          "instances": [  # 申请权限的资源实例
            [  # 带层级的实例表示
              {
                "type": "job",  # 层级节点的资源类型
                "id": "job1",  # 层级节点的资源实例id
                "name": "作业1"  # 层级节点的资源名称
              }
            ]
          ]
        },
        {
          "system_id": "bk_cmdb",  # 资源类型所属的系统id
          "type": "host",  # 操作依赖的另外一个资源类型
          "instances": [
            [
              {
                "type": "biz",
                "id": "biz1",
                "name": "业务1"
              }, {
                "type": "set",
                "id": "set1",
                "name": "集群1"
              }, {
                "type": "module",
                "id": "module1",
                "name": "模块1"
              }, {
                "type": "host",
                "id": "host1",
                "name": "主机1"
              }
            ]
          ],
          "attributes": [  # 支持配置实例的属性值
            {
              "id": "os",  # 属性的key
              "name": "操作系统",
              "values": [
                {
                  "id": "linux",  # 属性的value, 可以有多个
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

### 返回结果示例

```python
{
  "data": {
    "url": "https://paas.bk.com/o/bk_iam_app/perm-apply?system_id=bk_job&tid=09d432dccac74ec4aa17629f5f83715f"  # 链接有效期10分钟
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
| url   | 字符串     | 权限申请重定向URL |