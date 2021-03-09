### 功能描述

日志采集器配置导入下发接口

{{ common_args_desc }}

#### 接口参数

| 字段      | 类型 | 必选 | 描述                                                         |
| --------- | ---- | ---- | ------------------------------------------------------------ |
| conf_list | list | 是   | 配置列表                                                     |
| bk_biz_id | int  | 否   | 通用业务id，如果传了该参数，在conf_list中没有配置bk_biz_id的配置将使用该bk_biz_id作为业务id |

#### conf_list

| 字段           | 类型 | 必选 | 描述           |
| -------------- | ---- | ---- | -------------- |
| collector_conf | dict | 是   | 采集器基础配置 |
| target_conf    | dict | 是   | 下发配置       |
| monitor_conf   | list | 否   | 监控策略配置   |

#### collector_conf

| 字段        | 字段类型 | 必选 | 描述               |
| ----------- | -------- | ---- | ------------------ |
| data_set    | string   | 是   | 表名称             |
| data_desc   | string   | 是   | 描述               |
| data_encode | string   | 是   | 编码(UTF-8，GBK) |
| sep         | string   | 是   | 分隔符             |
| log_path    | string   | 是   | 日志路径           |
| conditions  | list     | 否   | 采集范围           |
| fields      | list     | 是   | 表字段             |

#### collector_conf.fields

| 字段        | 类型   | 必选 | 描述                                                         |
| ----------- | ------ | ---- | ------------------------------------------------------------ |
| name        | string | 是   | 字段名                                                       |
| type        | string | 是   | 字段类型                                                     |
| alis        | string | 否   | 默认填“”                                                     |
| time_format | string | 否   | 时间格式，若是时间字段则填“1”，为1的时间格式为yyyy-MM-dd HH:mm:ss；若非时间字段则填“”或不传 |
| time_zone   | string | 否   | 时区 ，一般为“+8”                                            |
| description | string | 是   | 字段描述                                                     |

#### target_conf

| 字段      | 字段类型 | 描述       |
| --------- | -------- | ---------- |
| bk_biz_id | int      | 业务id     |
| ips       | list     | 目标机器ip |

### 请求参数示例

导入一个采集/tmp/log.txt日志的日志采集器

```
{
	"bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
	"conf_list": [
		{
			"collector_conf":{
                "data_set": "test_rt_three",
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
            "target_conf":{
            "bk_biz_id":2,
            "ips":["10.0.2.47"]
    		}
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
                            "ips": [
                                "10.0.2.47"
                            ]
                        },
                        "collector_conf": {
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
                            ],
                            "data_encode": "UTF-8",
                            "sep": "|",
                            "log_path": "/tmp/log.txt",
                            "data_set": "test_rt_three",
                            "data_desc": "测试日志采集",
                            "conditions": [],
                            "file_frequency": "157680000"
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