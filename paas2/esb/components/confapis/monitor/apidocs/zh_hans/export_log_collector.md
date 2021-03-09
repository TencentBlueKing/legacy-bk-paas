### 功能描述

日志采集器配置导出

{{ common_args_desc }}

#### 接口参数

| 字段      | 类型   | 必选 | 描述                                                         |
| --------- | ------ | ---- | ------------------------------------------------------------ |
| bk_biz_id | int    | 是   | 业务id                                                       |
| ids       | string | 否   | 需要导出的配置id，多个id之间用英文逗号隔开；若不传，导出该业务和类型下的所有配置 |

### 请求参数示例

导出业务id等于2的业务下日志采集器配置id为2的配置

```
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_biz_id": 2,
    "ids": "2"
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
                        "data_set": "test_log_collect",
                        "data_desc": "测试日志采集",
                        "data_encode": "UTF-8",
                        "sep": "|",
                        "log_path": "/tmp/log.txt",
                        "conditions": [],
                        "fields": [
                            {
                                "description": "时间",
                                "time_zone": "+8",
                                "time_format": "1",
                                "alis": "",
                                "type": "string",
                                "name": "time"
                            },
                            {
                                "description": "指标",
                                "time_zone": "",
                                "time_format": "",
                                "alis": "",
                                "type": "long",
                                "name": "value"
                            }
                        ]
                    },
                    "target_conf": {
                        "bk_biz_id": 0,
                        "ips": []
                    },
                    "monitor_conf":[]
                }
            ],
    "result": true
}
```

### 返回结果参数说明

| 字段    | 类型   | 描述                                |
| ------- | ------ | ----------------------------------- |
| result  | bool   | 返回结果，true为成功，false为失败   |
| code    | int    | 返回码，200表示成功，其他值表示失败 |
| message | string | 错误信息                            |
| data    | list   | 日志采集器配置列表                                |


#### conf

| 字段           | 类型 | 描述           |
| -------------- | ---- | -------------- |
| collector_conf | dict | 采集器基础配置 |
| target_conf    | dict | 下发配置       |
| monitor_conf   | list | 监控策略配置   |

#### conf.collector_conf

| 字段        | 类型   | 描述         |
| ----------- | ------ | ------------ |
| data_set    | string | data_set名称 |
| data_desc   | string | 中文描述     |
| data_encode | string | 编码         |
| sep         | string | 分隔符       |
| log_path    | string | 日志路径     |
| conditions  | list   | 采集范围     |
| fields      | list   | 表字段       |

#### conf.collector_conf.fields

| 字段        | 类型   | 描述                                                         |
| ----------- | ------ | ------------------------------------------------------------ |
| name        | string | 字段名                                                       |
| type        | string | 字段类型                                                     |
| alis        | string | “”                                                           |
| time_format | string | 时间格式，若是时间字段则为“1”，为1的时间格式为yyyy-MM-dd HH:mm:ss；若非时间字段则为“” |
| time_zone   | string | 时区                                                         |
| description | string | 字段描述                                                     |

#### conf.target_conf

| 字段      | 类型 | 描述           |
| --------- | ---- | -------------- |
| bk_biz_id | int  | 业务id         |
| ips       | list | 下发机器ip列表 |