### 功能描述

脚本采集器任务下发

{{ common_args_desc }}

#### 接口参数

| 字段        | 类型 | 必选 | 描述                         |
| ----------- | ---- | ---- | ---------------------------- |
| target_conf | list | 是   | 脚本采集实例配置 |
| config_id   | int  | 是   | 脚本采集配置id                       |

#### target_conf

| 字段        | 类型   | 必选 | 描述                                          |
| ----------- | ------ | ---- | --------------------------------------------- |
| ip          | string | 是   | ip地址                                        |
| bk_cloud_id | int    | 是   | 云区域id                                      |
| params      | dict   | 否   | 脚本参数{key: value}，默认值{} |


### 请求参数示例

```
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "target_conf": [
        {
            "ip": "x.x.x.x",
            "bk_cloud_id": 0
        }
    ],
    "script_collector_id": 8
}
```

### 返回结果示例

```
{
    "message": "OK",
    "code": "0",
    "data": {
        "failed": [],
        "success": [
            {
                "ip": "x.x.x.x",
                "message": null,
                "bk_cloud_id": 0
            }
        ]
    },
    "result": true
}
```


### 返回结果参数说明

| 字段    | 类型   | 描述                                |
| ------- | ------ | ----------------------------------- |
| result  | bool   | 返回结果，true为成功，false为失败   |
| code    | int    | 返回码，200表示成功，其他值表示失败 |
| message | string | 错误信息                            |
| data    | dict   | 结果                                |

#### data.success & data.failed

| 字段        | 类型   | 描述         |
| ----------- | ------ | ------------ |
| ip          | string | ip地址       |
| bk_cloud_id | int    | 云区域id     |
| message     | string 