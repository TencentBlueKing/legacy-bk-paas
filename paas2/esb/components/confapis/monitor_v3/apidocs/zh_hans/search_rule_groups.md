### 功能描述

查询规则组列表

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段       | 类型 | 必选 | 描述 |
| --------- | ---- | ---- |--|
| bk_biz_id | list | 否   | 业务ID |
| group_ids       | list | 否   | 分派组 |

#### 示例数据

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "bk_biz_ids": [2],
    "group_ids": [7]
}
```

### 响应参数

| 字段    | 类型           | 描述     |
| ------- |--------------|--------|
| result  | bool         | 请求是否成功 |
| code    | int          | 返回的状态码 |
| message | string       | 描述信息   |
| data    | list[object] | 分派组    |

####  `data` 元素字段说明

| 字段            | 类型         | 描述              |
| --------------- |------------|-----------------|
| id              | int        | 分派组ID           |
| bk_biz_id       | int        | 业务ID            |
| name            | string     | 名称              |
| priority         | int        | 优先级             |
| rules | list[rule] | 通知人列表           |
| settings      | dict       | 前端快捷操作配置，API可忽略 |


####  `rule` 字段说明
| 字段            | 类型              | 描述                                  |
| --------------- |-----------------|-------------------------------------|
| id              | int             | 规则ID                                |
| bk_biz_id       | int             | 业务ID，与组业务ID一致                       |
| assign_group_id            | int             | 对应分派组ID                             |
| is_enabled         | bool            | 是否启用                                |
| user_groups | list[ group_id] | 通知组ID列表                             |
| conditions      | list[condition] | 适配规则                                |
| actions      | list[action]    | 通知配置                                |
| alert_severity      | int             | 默认为0（维持不变），1,2,3分别对应 `致命` `预警` `提醒` |
| additional_tags      | list[tag]       | 添加标签                                |


####  `tag` 字段说明
| 字段            | 类型     | 描述              |
|---------------|--------|:----------------|
| key           | string | 标签key， 可参考页面配置项 |
| value         | string | 标签value值        |
| display_key   | string | key的翻译显示        |
| display_value | string | value的翻译显示      |

####  `condition` 字段说明
| 字段         | 类型        | 描述                                                    |
|------------|-----------|:------------------------------------------------------|
| field      | string    | 适配字段key， 可参考页面配置项                                     |
| value      | list[string] | 适配value值                                              |
| method     | string       | 表达式方法 `eq` `neq`  `include`, `exclude`, `reg`, `nreg` |
| condition | string       | 连接条件，当前仅支持`and`                                       |

#### `action` 字段说明
| 字段             | 类型     | 描述                             |
|----------------|--------|--------------------------------|
| action_type    | string | 处理套餐类型 `notice(通知)` `itsm(流程)` |
| upgrade_config | dict   | 升级配置（通知的时候才有效）                 |
| is_enabled     | bool   | 是否生效，通知默认为`True`               |
| action_id      | int    | 流程套餐ID（notice情况下不需要）           |

#### `upgrade_config` 字段说明
| 字段             | 类型        | 描述                       |
|----------------|-----------|--------------------------|
| user_groups    | list[int] | 告警升级接收通知组（不可与当前规则的负责人重复） |
| upgrade_interval | int       | 升级周期，单位分钟                |
| is_enabled     | bool      | 是否生效，通知默认为`True`         |


#### 示例数据

```json
{
    "result": true,
    "code": 200,
    "message": "OK",
    "data": [
        {
            "id": 7,
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
    ],
    "request_id": "b8cf17b82cd949e984011d890ac554df"
}
```

