### 功能描述
导入拨测节点

{{ common_args_desc }}

## 请求参数示例
```
{"conf_list":[{
    "node_conf": {
        "carrieroperator": "内网",
        "location": {
            "country": "中国",
            "city": "广东"
        },
        "name": "中国广东内网",
        "is_common": false
    },
    "target_conf": {
        "bk_biz_id": 2,
        "bk_cloud_id": 0,
        "ip": "x.x.x.x"
    }
},{
    "node_conf": {
        "carrieroperator": "内网",
        "location": {
            "country": "中国",
            "city": "广东"
        },
        "name": "中国广东内网",
        "is_common": false
    },
    "target_conf": {
        "bk_biz_id": 2,
        "bk_cloud_id": 0,
        "ip": "x.x.x.x"
    }
}]}
```

# 请求参数
| 字段  | 类型  | 必选  | 描述  |
| ------|-------|-------|-------|
| conf_list | list | 是 | 节点列表 |

# 1 任务列表--conf_list
| 字段  | 类型  | 必选  | 描述  |
| ------|-------|-------|-------|
| target_conf | dict | 是 | 节点下发配置 |
| node_conf | dict | 是 | 节点基本配置 |


# 1.1 节点下发配置--target_conf
| 字段  | 类型  | 必选  | 描述  |
| ------|-------|-------|-------|
| ip | str | 是 | IP |
| bk_cloud_id | int | 是 | 云区域ID |
| bk_biz_id | int | 是 | 业务id |


## 1.2 节点基本配置--node_conf
字段  | 类型  | 必选  | 描述  |
------|-------|-------|-------|
is_common | bool | 否 | 是否为通用节点，默认false |
name | str | 是 | 节点名称 |
location | dict | 是 | 节点所在地区 |
carrieroperator | str | 是 | 运营商，最大长度50(内网、联通、移动、其他) |

## 1.2.1 节点所在地区--node_conf.location
字段  | 类型  | 必选  | 描述  |
------|-------|-------|-------|
country | str | 是 | 国家 |
city | str | 是 | 城市 |


## 返回结果示例

```
{
    "message": "OK",
    "code": "0",
    "data": {
        "failed": {
            "total": 1,
            "detail": [
                    "target_conf": {
                        "bk_biz_id": 2,
                        "ip": "x.x.x.x",
                        "bk_cloud_id": 0
                    },
                    "error_mes": "业务下不存在该主机"
                }]
        },
        "success": {
            "total": 2,
            "detail": [
                {
                    "target_conf": {
                        "bk_biz_id": 2,
                        "ip": "x.x.x.x",
                        "bk_cloud_id": 0
                    },
                    "node_id": 30
                },
                {
                    "target_conf": {
                        "bk_biz_id": 2,
                        "ip": "x.x.x.x",
                        "bk_cloud_id": 0
                    },
                    "node_id": 31
                }
            ]
        }
    },
    "result": true
}
```
## 返回结果参数说明
| 字段    | 类型   | 描述 |
| ------- | ------ | ----------------------------------- |
| result  | bool   | 返回结果，true为成功，false为失败   |
| code    | int    | 返回码，200表示成功，其他值表示失败 |
| message | string | 错误信息                            |
| data    | list   | 结果                                |

## 2 data
| 字段    | 类型   | 描述 |
| ------- | ------ | ----------------------------------- |
failed | dict | 导入失败相关信息 |
success | dict | 导入成功相关信息 |

## 2.1 导入失败相关信息--data.failed
| 字段    | 类型   | 描述 |
| ------- | ------ | ----------------------------------- |
total | int | 导入失败数量 |
detail | list | 导入失败详情 |

## 2.1.1 导入失败详情--data.failed.detail
| 字段    | 类型   | 描述 |
| ------- | ------ | ----------------------------------- |
| target_conf | dict | 节点下发配置 |
| error_mes | str | 导入失败原因 |

## 2.2 导入成功相关信息--data.success
| 字段    | 类型   | 描述 |
| ------- | ------ | ----------------------------------- |
| total | int | 导入成功数量 |
| detail | list | 导入成功详情 |

## 2.2.1 导入成功相关信息--data.success.datail
| 字段    | 类型   | 描述 |
| ------- | ------ | ----------------------------------- |
| target_conf | dict | 节点下发配置 |
| node_id | int | 导入成功的节点id |
