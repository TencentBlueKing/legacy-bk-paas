### 功能描述

脚本采集器配置导入

{{ common_args_desc }}

#### 接口参数

| 字段      | 类型 | 必选 | 描述                                                         |
| --------- | ---- | ---- | ------------------------------------------------------------ |
| conf_list | list | 是   | 配置列表                                                     |
| bk_biz_id | int  | 否   | 通用业务id，如果传了该参数，在conf_list中没有配置bk_biz_id的配置将使用该业务id作为bk_biz_id |

#### conf_list

| 字段           | 类型 | 必选 | 描述           |
| -------------- | ---- | ---- | -------------- |
| collector_conf | dict | 是   | 采集器基础配置 |
| target_conf    | dict | 是   | 下发配置       |
| monitor_conf   | list | 否   | 监控策略配置   |

#### collector_conf

| 字段                | 类型   | 必选 | 描述                           |
| ------------------- | ------ | ---- | ------------------------------ |
| table_name          | string | 是   | data_set名称                   |
| table_desc          | string | 是   | 中文描述                       |
| charset             | string | 是   | 编码：UTF8,GBK                 |
| shell_content       | string | 是   | 脚本内容                       |
| collect_interval    | int    | 否   | 采集周期(分钟)，默认1分钟      |
| raw_data_intevcal   | int    | 否   | 原始数据保存周期(天)，默认30天 |
| trend_data_interval | int    | 否   | 趋势数据保存周期(天)，默认90天 |
| fields              | list   | 是   | 表字段                         |

#### fields

| 字段         | 类型   | 描述              |
| ------------ | ------ | ----------------- |
| name         | string | 字段名            |
| type         | string | 字段类型          |
| monitor_type | string | metric或dimension |
| unit         | string | 单位              |
| description  | string | 字段描述          |

#### target_conf

| 字段      | 字段类型 | 描述                                |
| --------- | -------- | ----------------------------------- |
| bk_biz_id | int      | 业务id                              |
| ips       | list     | 主机信息列表,格式 “ip\|bk_cloud_id” |

### 请求参数示例

往ip为x.x.x.x,bk_cloud_id为0的机器下发一个脚本采集器

```
{
	"conf_list": [
            {
                "collector_conf": {
                    "table_name": "t_shell_four",
                    "table_desc": "測試5",
                    "charset": "UTF8",
                    "shell_content": "IyMg5pys5paH5Lu25Li6U2hlbGzohJrmnKzvvIzor7fkvb/nlKhTaGVsbOagvOW8j+WujOaIkOaVsOaNruS4iuaKpQojIyDor7fkvb/nlKhTaGVsbOiEmuacrOWvueaMh+agh+WSjOe7tOW6pui1i+WAvApzaXplPTMyICAj5aSn5bCP77yM5oyH5qCHCgoKIyMg5Lul5LiL5YaF5a656buY6K6k5peg6ZyA6LCD5pW0CiMjIOWwhuS4iui/sOWPmOmHj+S7pSJLZXkgVmFsdWUi5pa55byP5L2c5Li66aKE572u5ZG95Luk77yISU5TRVJUX0RJTUVOU0lPTuOAgUlOU0VSVF9NRVRSSUPvvInnmoTlj4LmlbDku6XkuIrmiqXmlbDmja4KIyMgSU5TRVJUX01FVFJJQyAi5oyH5qCH5a2X5q615ZCNIiDmjIfmoIflrZfmrrXlgLwgIDsgSU5TRVJUX0RJTUVOU0lPTiAi57u05bqm5a2X5q615ZCNIiDnu7TluqblrZfmrrXlgLwKSU5TRVJUX01FVFJJQyAic2l6ZSIgJHtzaXplfQoKQ09NTUlUCg==",
                    "collect_interval": 1,
                    "raw_data_interval": 30,
                    "trend_data_interval": 90,
                    "fields": [
                        {
                            "monitor_type": "metric",
                            "type": "long",
                            "name": "size",
                            "unit": "",
                            "description": "大小"
                        }
                    ]
                },
                "target_conf": {
                    "bk_biz_id": 2,
                    "ips": ["x.x.x.x|0"],
                    "scope": null
                },
                "monitor_conf": []
            }
        ]
}
```

### 返回结果示例

```
{
    "message": "OK",
    "code": "0",
    "data": {
        "failed": {
            "total": 0,
            "detail": []
        },
        "successed": {
            "total": 1,
            "detail": [
                {
                    "origin_conf": {
                        "target_conf": {
                            "bk_biz_id": 2,
                            "ip_list": [
                                {
                                    "ip": "10.0.2.47",
                                    "bk_cloud_id": "0"
                                }
                            ]
                        },
                        "collector_conf": {
                            "collect_interval": 1,
                            "fields": [
                                {
                                    "description": "大小",
                                    "type": "long",
                                    "name": "size",
                                    "unit": "",
                                    "monitor_type": "metric"
                                }
                            ],
                            "charset": "UTF8",
                            "shell_content": "IyMg5pys5paH5Lu25Li6U2hlbGzohJrmnKzvvIzor7fkvb/nlKhTaGVsbOagvOW8j+WujOaIkOaVsOaNruS4iuaKpQojIyDor7fkvb/nlKhTaGVsbOiEmuacrOWvueaMh+agh+WSjOe7tOW6pui1i+WAvApzaXplPTMyICAj5aSn5bCP77yM5oyH5qCHCgoKIyMg5Lul5LiL5YaF5a656buY6K6k5peg6ZyA6LCD5pW0CiMjIOWwhuS4iui/sOWPmOmHj+S7pSJLZXkgVmFsdWUi5pa55byP5L2c5Li66aKE572u5ZG95Luk77yISU5TRVJUX0RJTUVOU0lPTuOAgUlOU0VSVF9NRVRSSUPvvInnmoTlj4LmlbDku6XkuIrmiqXmlbDmja4KIyMgSU5TRVJUX01FVFJJQyAi5oyH5qCH5a2X5q615ZCNIiDmjIfmoIflrZfmrrXlgLwgIDsgSU5TRVJUX0RJTUVOU0lPTiAi57u05bqm5a2X5q615ZCNIiDnu7TluqblrZfmrrXlgLwKSU5TRVJUX01FVFJJQyAic2l6ZSIgJHtzaXplfQoKQ09NTUlUCg==",
                            "table_desc": "測試6",
                            "step": 5,
                            "trend_data_interval": 90,
                            "table_name": "t_shell_six"
                        }
                    },
                    "message": ""
                }
            ]
        }
    },
    "result": true
}
```

### 返回结果参数说明

| 字段    | 类型   | 描述                              |
| ------- | ------ | --------------------------------- |
| result  | bool   | 返回结果，true为成功，false为失败 |
| code    | int    | 返回码，0表示成功，其他值表示失败 |
| message | string | 错误信息                          |
| data    | dict   | 结果                              |

#### data.failed

| 字段   | 类型 | 描述                                           |
| ------ | ---- | ---------------------------------------------- |
| total  | bool | 导入失败的采集器总数                           |
| detail | int  | 详情。origin_conf：配置信息；message：失败信息 |

#### data.successed

| 字段   | 类型 | 描述                                           |
| ------ | ---- | ---------------------------------------------- |
| total  | bool | 导入成功的采集器总数                           |
| detail | int  | 详情。origin_conf：配置信息；message：成功信息 |