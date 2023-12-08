### 功能描述

保存（新建或更新）规则组

### 请求参数

{{ common_args_desc }}

#### 接口请求参数参数

| 字段        | 类型         | 是否必须 | 描述               |
|-----------|------------|------|------------------|
| id        | int        | 否    | 分派组ID， 没有新建，有则保存 |
| bk_biz_id | int        | 是    | 业务ID             |
| name      | string     | 是    | 名称               |
| priority  | int        | 是    | 优先级              |
| rules     | list[rule] | 否    | 规则组列表            |


####  `rule` 字段说明

| 字段              | 类型              | 是否必填 | 描述                                  |
|-----------------|-----------------|------|-------------------------------------|
| id              | int             | 否    | 规则ID ，有修改，没有新增                      |
| is_enabled      | bool            | 是    | 是否启用                                |
| user_groups     | list[ group_id] | 是    | 通知组ID列表                             |
| conditions      | list[condition] | 是    | 适配规则                                |
| actions         | list[action]    | 是    | 通知配置                                |
| alert_severity  | int             | 否    | 默认为0（维持不变），1,2,3分别对应 `致命` `预警` `提醒` |
| additional_tags | list[tag]       | 否    | 添加标签                                |

#### `tag` 字段说明

| 字段            | 类型     | 是否必填 | 描述              |
|---------------|--------|------|-----------------|
| key           | string | 是    | 标签key， 可参考页面配置项 |
| value         | string | 是    | 标签value值        |
| display_key   | string | 是    | key的翻译显示        |
| display_value | string | 是    | value的翻译显示      |

#### `condition` 字段说明

| 字段     | 类型           | 是否必填 | 描述                                                        |
|--------|--------------|------|-----------------------------------------------------------|
| field  | string       | 是    | 适配字段key， 可参考页面配置项                                         |
| value  | list[string] | 是    | 表达式value值                                                 |
| method | string       | 否    | 表达式方法 `eq`（默认） `neq`  `include`, `exclude`, `reg`, `nreg` |

#### `action` 字段说明

| 字段             | 类型     | 是否必须       | 描述                             |
|----------------|--------|------------|--------------------------------|
| action_type    | string | 是          | 处理套餐类型 `notice(通知)` `itsm(流程)` |
| upgrade_config | dict   | 否          | 升级配置（通知的时候才有效）                 |
| is_enabled     | bool   | 是          | 是否生效，通知默认为`True`               |
| action_id      | int    | 否（流程的时候必须） | 流程套餐ID（流程的时候必须）                |

#### `upgrade_config` 字段说明

| 字段               | 类型        | 是否必须 | 描述                       |
|------------------|-----------|------|--------------------------|
| user_groups      | list[int] | 是    | 告警升级接收通知组（不可与当前规则的负责人重复） |
| upgrade_interval | int       | 否    | 升级周期，单位分钟，默认60 min       |
| is_enabled       | bool      | 否    | 是否生效，通知默认为`True`         |

#### 请求示例数据

```json
{
  "bk_app_code": "xxx",
  "bk_app_secret": "xxxxx",
  "bk_token": "xxxx",
  "name": "分派测试11112",
  "bk_biz_id": 2,
  "priority": 10002,
  "settings": {},
  "rules": [
    {
      "id": 9,
      "bk_biz_id": 2,
      "assign_group_id": 7,
      "is_enabled": true,
      "user_groups": [
        62
      ],
      "conditions": [
        {
          "field": "bcs_cluster_id",
          "value": [
            "123"
          ],
          "method": "eq",
          "condition": "and"
        }
      ],
      "actions": [
        {
          "action_type": "notice",
          "upgrade_config": {
            "is_enabled": true,
            "user_groups": [
              68
            ],
            "upgrade_interval": 1440
          },
          "is_enabled": true
        }
      ],
      "alert_severity": 1,
      "additional_tags": [
        {
          "key": "key1",
          "value": "123value",
          "display_key": "",
          "display_value": ""
        }
      ]
    },
    {
      "id": 10,
      "bk_biz_id": 2,
      "assign_group_id": 7,
      "is_enabled": true,
      "user_groups": [
        62
      ],
      "conditions": [
        {
          "field": "bcs_cluster_id",
          "value": [
            "567890"
          ],
          "method": "eq",
          "condition": "and"
        }
      ],
      "actions": [
        {
          "action_type": "notice",
          "upgrade_config": {
            "is_enabled": true,
            "user_groups": [
              68
            ],
            "upgrade_interval": 1440
          },
          "is_enabled": true
        },
        {
          "action_type": "itsm",
          "action_id": 1309,
          "is_enabled": true
        }
      ],
      "alert_severity": 1,
      "additional_tags": [
        {
          "key": "key1",
          "value": "123value",
          "display_key": "",
          "display_value": ""
        }
      ]
    }
  ]
}
```

### 返回数据格式

| 字段      | 类型     | 描述     |
|---------|--------|--------|
| result  | bool   | 请求是否成功 |
| code    | int    | 返回的状态码 |
| message | string | 描述信息   |
| data    | object | 分派组    |

### data格式

| 字段              | 类型   | 描述        |
|-----------------|------|-----------|
| bk_biz_id       | int  | 业务ID      |
| assign_group_id | int  | 分派组ID     |
| rules           | list | 当前分派组规则ID |
| aborted_rules   | list | 删除的规则ID   |


#### 返回示例数据

```json
{
    "result": true,
    "code": 200,
    "message": "OK",
    "data":  {
            "bk_biz_id": 2,
            "assign_group_id": 1,
            "rules": [9, 10],
            "aborted_rules": []
        },
    "request_id": "b8cf17b82cd949e984011d890ac554df"
}
```

