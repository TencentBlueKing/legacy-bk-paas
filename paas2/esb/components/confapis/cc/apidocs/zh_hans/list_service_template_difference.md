### 功能描述

列出服务模版和服务实例之间的差异 (v3.9.19)

- 该接口专供GSEKit使用，在ESB文档中为hidden状态

### 请求参数

{{ common_args_desc }}

#### 接口参数

|字段|类型|必填|描述|
|---|---|---|---|
| bk_biz_id  | int64       | Yes      | 业务ID |
|bk_module_ids|int64 array|Yes|模块ID列表|


### 请求参数示例

``` json
{
    "bk_module_ids": [
        60,
        61
    ],
    "bk_biz_id": 3
}
```

### 返回结果示例
``` json
{
    "result": true,
    "bk_error_code": 0,
    "bk_error_msg": "success",
    "permission": null,
    "data": [
        {
            "bk_module_id": 61,
            "unchanged": [],
            "changed": [
                {
                    "process_template_id": 48,
                    "process_template_name": "pr1",
                    "service_instance_count": 3,
                    "service_instances": [
                        {
                            "service_instance": {
                                "id": 3,
                                "name": "192.168.15.13_pr1"
                            },
                            "process": null,
                            "changed_attributes": [
                                {
                                    "id": 55,
                                    "property_id": "description",
                                    "property_name": "备注",
                                    "property_value": "",
                                    "template_property_value": {
                                        "value": "aaa",
                                        "as_default_value": true
                                    }
                                }
                            ]
                        },
                        {
                            "service_instance": {
                                "id": 5,
                                "name": "192.168.15.12_pr1"
                            },
                            "process": null,
                            "changed_attributes": [
                                {
                                    "id": 55,
                                    "property_id": "description",
                                    "property_name": "备注",
                                    "property_value": "",
                                    "template_property_value": {
                                        "value": "aaa",
                                        "as_default_value": true
                                    }
                                }
                            ]
                        },
                        {
                            "service_instance": {
                                "id": 4,
                                "name": "192.168.15.11_pr1"
                            },
                            "process": null,
                            "changed_attributes": [
                                {
                                    "id": 55,
                                    "property_id": "description",
                                    "property_name": "备注",
                                    "property_value": "",
                                    "template_property_value": {
                                        "value": "aaa",
                                        "as_default_value": true
                                    }
                                }
                            ]
                        }
                    ]
                }
            ],
            "added": [],
            "removed": [],
            "changed_attributes": [],
            "has_difference": true
        },
        {
            "bk_module_id": 60,
            "unchanged": [],
            "changed": [
                {
                    "process_template_id": 48,
                    "process_template_name": "pr1",
                    "service_instance_count": 2,
                    "service_instances": [
                        {
                            "service_instance": {
                                "id": 1,
                                "name": "192.168.15.10_pr1"
                            },
                            "process": null,
                            "changed_attributes": [
                                {
                                    "id": 55,
                                    "property_id": "description",
                                    "property_name": "备注",
                                    "property_value": "",
                                    "template_property_value": {
                                        "value": "aaa",
                                        "as_default_value": true
                                    }
                                }
                            ]
                        },
                        {
                            "service_instance": {
                                "id": 2,
                                "name": "192.168.15.1_pr1"
                            },
                            "process": null,
                            "changed_attributes": [
                                {
                                    "id": 55,
                                    "property_id": "description",
                                    "property_name": "备注",
                                    "property_value": "",
                                    "template_property_value": {
                                        "value": "aaa",
                                        "as_default_value": true
                                    }
                                }
                            ]
                        }
                    ]
                }
            ],
            "added": [],
            "removed": [],
            "changed_attributes": [],
            "has_difference": true
        }
    ]
}
```

### 返回结果参数说明

| 名称  | 类型  | 描述 |
|---|---|--- |
| result | bool | 请求成功与否。true:请求成功；false请求失败 |
| code | int | 错误编码。 0表示success，>0表示失败错误 |
| message | string | 请求失败返回的错误信息 |

- data 字段说明

| 名称  | 类型  | 描述 |
|---|---|--- |
|bk_module_id|int|模块ID|
|unchanged|object array|无变化的进程实例列表信息|
|changed|object array|有变化的进程实例列表信息|
|added|object array|增加的进程实例列表信息|
|removed|object array|移除的进程实例列表信息|
|changed_attributes|object array|服务模版属性和所应用的模块属性改变列表|
|has_difference|bool|服务模版所应用的模块对应的进程信息是否有差异|
