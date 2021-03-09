### 功能描述

脚本采集器配置导出

{{ common_args_desc }}

#### 接口参数

| 字段      | 类型   | 必选 | 描述                 |
| --------- | ------ | ---- | -------------------- |
| bk_biz_id | int    | 是   | 业务id               |
| ids       | string | 否   | 多个id用英文逗号隔开 |

### 请求参数示例

导出业务id为2的脚本采集器配置信息

```
{
	"bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_biz_id": 2
}
```

### 返回参数示例

```
{
    "message": "OK",
    "code": 200,
    "data": [
            {
                "collector_conf": {
                    "table_name": "t_shell_tow",
                    "table_desc": "測試2",
                    "charset": "UTF8",
                    "shell_content": "IyMg5pys5paH5Lu25Li6U2hlbGzohJrmnKzvvIzor7fkvb/nlKhTaGVsbOagvOW8j+WujOaIkOaVsOaNruS4iuaKpQojIyDor7fkvb/nlKhTaGVsbOiEmuacrOWvueaMh+agh+WSjOe7tOW6pui1i+WAvApzaXplPTMyICAj5aSn5bCP77yM5oyH5qCHCgoKIyMg5Lul5LiL5YaF5a656buY6K6k5peg6ZyA6LCD5pW0CiMjIOWwhuS4iui/sOWPmOmHj+S7pSJLZXkgVmFsdWUi5pa55byP5L2c5Li66aKE572u5ZG95Luk77yISU5TRVJUX0RJTUVOU0lPTuOAgUlOU0VSVF9NRVRSSUPvvInnmoTlj4LmlbDku6XkuIrmiqXmlbDmja4KIyMgSU5TRVJUX01FVFJJQyAi5oyH5qCH5a2X5q615ZCNIiDmjIfmoIflrZfmrrXlgLwgIDsgSU5TRVJUX0RJTUVOU0lPTiAi57u05bqm5a2X5q615ZCNIiDnu7TluqblrZfmrrXlgLwKSU5TRVJUX01FVFJJQyAic2l6ZSIgJHtzaXplfQoKQ09NTUlUCg==",
                    "collect_interval": 1,
                    "raw_data_interval": 30,
                    "trend_data_interval": 90,
                    "fields": [
                        {
                            "name": "size",
                            "type": "long",
                            "description": "大小",
                            "unit": "",
                            "monitor_type": "metric"
                        }
                    ]
                },
                "target_conf": {
                    "bk_biz_id": 0,
                    "ips": [],
                    "scope": null
                },
                "monitor_conf": []
            },
            {
                "collector_conf": {
                    "table_name": "shell_one",
                    "table_desc": "测试一",
                    "charset": "UTF8",
                    "shell_content": "IyMg5pys5paH5Lu25Li6U2hlbGzohJrmnKzvvIzor7fkvb/nlKhTaGVsbOagvOW8j+WujOaIkOaVsOaNruS4iuaKpQojIyDor7fkvb/nlKhTaGVsbOiEmuacrOWvueaMh+agh+WSjOe7tOW6pui1i+WAvApzaXplPTEyICAj5aSn5bCP77yM5oyH5qCHCgoKIyMg5Lul5LiL5YaF5a656buY6K6k5peg6ZyA6LCD5pW0CiMjIOWwhuS4iui/sOWPmOmHj+S7pSJLZXkgVmFsdWUi5pa55byP5L2c5Li66aKE572u5ZG95Luk77yISU5TRVJUX0RJTUVOU0lPTuOAgUlOU0VSVF9NRVRSSUPvvInnmoTlj4LmlbDku6XkuIrmiqXmlbDmja4KIyMgSU5TRVJUX01FVFJJQyAi5oyH5qCH5a2X5q615ZCNIiDmjIfmoIflrZfmrrXlgLwgIDsgSU5TRVJUX0RJTUVOU0lPTiAi57u05bqm5a2X5q615ZCNIiDnu7TluqblrZfmrrXlgLwKSU5TRVJUX01FVFJJQyAic2l6ZSIgJHtzaXplfQoKQ09NTUlUCg==",
                    "collect_interval": 1,
                    "raw_data_interval": 30,
                    "trend_data_interval": 90,
                    "fields": [
                        {
                            "name": "size",
                            "type": "long",
                            "description": "大小",
                            "unit": "",
                            "monitor_type": "metric"
                        }
                    ]
                },
                "target_conf": {
                    "bk_biz_id": 0,
                    "ips": [],
                    "scope": null
                },
                "monitor_conf": []
            }
        ],
    "result": true
}
```

### 返回结果参数说明

| 字段    | 类型   | 描述                                   |
| ------- | ------ | -------------------------------------- |
| result  | bool   | 返回结果，true为成功，false为失败      |
| code    | int    | 返回码，200表示成功，其他值表示失败    |
| message | string | 错误信息                               |
| data    | list   | 结果；日志采集器配置列表 |

#### conf

| 字段           | 类型 | 描述           |
| -------------- | ---- | -------------- |
| collector_conf | dict | 采集器基础配置 |
| target_conf    | dict | 下发配置       |
| monitor_conf   | list | 监控策略配置   |

#### conf.collector_conf

| 字段                | 类型   | 描述                 |
| ------------------- | ------ | -------------------- |
| table_name          | string | data_set名称         |
| table_desc          | string | 中文描述             |
| charset             | string | 编码                 |
| shell_content       | string | 脚本内容             |
| collect_intercal    | int    | 采集周期(分钟)       |
| raw_data_intercal   | int    | 原始数据保存周期(天) |
| trend_data_interval | int    | 趋势数据保存周期(天) |
| fields              | list   | 表字段               |

#### conf.collector_conf.fields

| 字段         | 类型   | 描述              |
| ------------ | ------ | ----------------- |
| name         | string | 字段名            |
| type         | string | 字段类型          |
| monitor_type | string | metric或dimension |
| unit         | string | 单位              |
| description  | string | 字段描述          |

#### conf.target_conf

| 字段      | 字段类型 | 描述                           |
| --------- | -------- | ------------------------------ |
| bk_biz_id | int      | 业务id                         |
| ips       | list     | 下发机器信息列表，导出为空列表 |

