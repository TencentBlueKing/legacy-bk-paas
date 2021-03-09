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
    "bk_biz_id": 2，
    "ids": "1,2"
}
```

### 返回参数示例

```
{
    "message": "OK",
    "code": "0",
    "data": [
        {
            "script_content_base64": "IyEvYmluL2Jhc2gKCkasdas1o=",
            "description": "测试2",
            "raw_data_interval": 30,
            "script_run_cmd": "sh $bk_script_name",
            "fields": [
                {
                    "name": "size",
                    "type": "long",
                    "description": "大小",
                    "unit": "",
                    "monitor_type": "metric"
                }
            ],
            "charset": "UTF8",
            "collect_interval": 1,
            "start_cmd": null,
            "script_type": "file",
            "params_schema": [],
            "script_ext": "shell",
            "name": "t_shell_tow"
        },
        {
            "script_content_base64": "IyEvYmluL2Jhc2gKCk1o=",
            "description": "测试1",
            "raw_data_interval": 30,
            "script_run_cmd": "${bk_script_name}",
            "fields": [
                {
                    "name": "size",
                    "type": "long",
                    "description": "大小",
                    "unit": "",
                    "monitor_type": "metric"
                }
            ],
            "charset": "UTF8",
            "collect_interval": 1,
            "start_cmd": null,
            "script_type": "file",
            "params_schema": [],
            "script_ext": "shell",
            "name": "shell_one"
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
| data    | list   | 结果；日志采集器配置列表            |

#### data[]

| 字段                  | 类型   | 必选 | 描述                                                         |
| --------------------- | ------ | ---- | ------------------------------------------------------------ |
| name                  | string | 是   | 数据表名，必须唯一                                           |
| description           | string | 是   | 数据表中文含义                                               |
| charset               | string | 否   | 字符集；默认值：UTF8，可选值（UTF8,GBK）                     |
| fields                | list   | 是   | 表字段信息，详情见下表                                       |
| script_type           | string | 否   | 脚本类型；默认值：file，可选值（file,cmd）                   |
| script_ext            | string | 否   | 脚本格式；默认值：shell，可选值（shell,bat,python,perl,powershell,vbs,custom） |
| params_schema         | list   | 否   | 脚本参数模型，详情见下表                                     |
| script_run_cmd        | string | 否   | 启动命令（脚本模式）                                         |
| script_content_base64 | string | 否   | 脚本内容（base64编码）                                       |
| start_cmd             | string | 否   | 启动命令（命令行模式）                                       |
| collect_interval      | int    | 否   | 采集周期(分钟)；默认值：1                                    |
| raw_data_interval     | int    | 否   | 原始数据保存周期(天)；默认值：30                             |
