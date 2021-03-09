### 功能描述

获取操作日志

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      | 类型   | 必选 | 描述                         |
| --------- | ------ | ---- | ---------------------------- |
| condition | object | 否   | 查询条件                     |
| start     | int    | 否   | 记录开始位置                 |
| limit     | int    | 是   | 每页限制条数，最大200 |
| sort      | string | 否   | 排序字段                     |

#### condition 字段说明

| 字段           | 类型         | 必选 | 描述                       |
| -------------- | ------------ | ---- | -------------------------- |
| audit_type     | string       | 否   | 操作的资源类型大类         |
| user           | string       | 否   | 操作人                     |
| resource_type  | string array | 否   | 操作的具体资源类型         |
| action         | string array | 否   | 操作类型                   |
| operate_from   | string       | 否   | 操作的来源                 |
| operation_time | string array | 否   | 操作开始和结束时间成对出现 |
| bk_biz_id      | int          | 否   | 业务ID                     |
| resource_id    | int          | 否   | 资源ID                     |
| resource_name  | string       | 否   | 资源名称                   |
| category       | string       | 否   | 前端使用的资源分类         |
| label          | string array | 否   | 资源标签                   |


### 请求参数示例

```json
{
    "bk_supplier_account": "0",
    "condition": {
        "audit_type": "business_resource",
        "user": "admin",
        "resource_type": [
            "business",
            "module"
        ],
        "action": [
            "create",
            "update"
        ],
        "operate_from": "user",
        "operation_time": [
            "2020-04-03 00:00:00",
            "2020-04-03 18:00:00"
        ],
        "bk_biz_id": 6,
        "resource_id": 120,
        "resource_name": "test",
        "category": "business",
        "label": [
            "biz_topology"
        ]
    },
    "start": 0,
    "limit": 10,
    "sort": "-operation_time"
}
```

### 返回结果示例

```json
{
    "result": true,
    "code": 0,
    "message": null,
    "data": {
        "count": 1,
        "info": [
            {
                "audit_type": "business_resource",
                "bk_supplier_account": "0",
                "user": "admin",
                "resource_type": "module",
                "action": "create",
                "operate_from": "user",
                "operation_detail": {
                    "bk_biz_id": 6,
                    "bk_biz_name": "test_biz",
                    "resource_id": 120,
                    "resource_name": "test",
                    "details": {
                        "pre_data": null,
                        "cur_data": {
                            "bk_bak_operator": "",
                            "bk_biz_id": 6,
                            "bk_childid": null,
                            "bk_module_id": 120,
                            "bk_module_name": "test",
                            "bk_module_type": "1",
                            "bk_parent_id": 51,
                            "bk_set_id": 51,
                            "bk_supplier_account": "0",
                            "create_time": "2020-04-03T09:55:30.574+08:00",
                            "default": 0,
                            "last_time": "2020-04-03T09:55:30.574+08:00",
                            "operator": ""
                        },
                        "properties": [
                            {
                                "bk_property_id": "bk_biz_id",
                                "bk_property_name": "业务ID"
                            },
                            {
                                "bk_property_id": "bk_set_id",
                                "bk_property_name": "集群ID"
                            },
                            {
                                "bk_property_id": "bk_module_name",
                                "bk_property_name": "模块名"
                            },
                            {
                                "bk_property_id": "bk_childid",
                                "bk_property_name": ""
                            },
                            {
                                "bk_property_id": "bk_module_type",
                                "bk_property_name": "模块类型"
                            },
                            {
                                "bk_property_id": "operator",
                                "bk_property_name": "主要维护人"
                            },
                            {
                                "bk_property_id": "bk_bak_operator",
                                "bk_property_name": "备份维护人"
                            }
                        ]
                    },
                    "bk_obj_id": "module"
                },
                "operation_time": "2020-04-03 09:55:30",
                "label": {
                    "biz_topology": ""
                }
            }
        ]
    }
}
```

### 返回结果参数说明

| 名称    | 类型   | 描述                                       |
| ------- | ------ | ------------------------------------------ |
| result  | bool   | 请求成功与否。true:请求成功；false请求失败 |
| code    | int    | 错误编码。 0表示success，>0表示失败错误    |
| message | string | 请求失败返回的错误信息                     |
| data    | object | 请求返回的数据                             |

#### data 字段说明：

| 名称  | 类型         | 描述               |
| ----- | ------------ | ------------------ |
| count | int          | 请求记录条数       |
| info  | object array | 请求记录数据       |

#### info 字段说明：

| 名称                | 类型   | 描述               |
| ------------------- | ------ | ------------------ |
| audit_type          | string | 操作的资源类型大类 |
| user                | string | 操作人             |
| bk_supplier_account | string | 开发商ID           |
| resource_type       | string | 操作的具体资源类型 |
| action              | string | 操作类型           |
| operate_from        | string | 操作的来源         |
| operation_detail    | object | 实际操作内容       |
| operation_time      | string | 操作时间           |
| label               | object | 资源标签           |