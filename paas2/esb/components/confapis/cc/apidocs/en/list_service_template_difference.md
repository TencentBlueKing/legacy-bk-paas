### Functional description

list difference between the service template and service instances (v3.9.19)

- only used for GSEKit，is hidden in ESB doc

#### General Parameters

{{ common_args_desc }}

### Request Parameters

| Field      | Type      | Required | Description                                                  |
| ---------- | --------- | -------- | ------------------------------------------------------------ |
| bk_biz_id  | int64       | Yes      | Business ID                                                  |
|bk_module_id|int64 array|Yes|module id array|

### Request Parameters Example

```json
{
    "bk_module_ids": [
        60,
        61
    ],
    "bk_biz_id": 3
}
```

### Return Result Example

```json
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
                                    "property_name": "remark",
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
                                    "property_name": "remark",
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
                                    "property_name": "remark",
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
                                    "property_name": "remark",
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
                                    "property_name": "remark",
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

### Return Result Parameters Description

#### data

| Field | Type  | Description       |
| ----- | ----- | ----------------- |
|bk_module_id|int|module ID|
|unchanged|object array|unchanged processes info|
|changed|object array|changed processes info|
|added|object array|added processes info|
|removed|object array|removed processes info|
|changed_attributes|object array|the changed attributes between service template and module instance|
|has_difference|bool|whether the processes under module has any difference with service template|
