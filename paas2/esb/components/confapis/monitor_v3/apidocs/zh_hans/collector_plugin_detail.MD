### 功能描述

查询插件详情

### 请求参数

{{ common_args_desc }}

#### 

| 字段       | 类型   | 描述     |
| ---------- | ------ | -------- |
| plugin_id | string | 插件id |


#### 示例数据
`路径参数`

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "plugin_id": "sss_script",
}
```

### 响应参数

| 字段    | 类型   | 描述         |
| ------- | ------ | ------------ |
| result  | bool   | 请求是否成功 |
| code    | int    | 返回的状态码 |
| message | string | 描述信息     |
| data    | dict   | 插件信息     |


#### 插件信息

| 字段        | 类型 | 描述         |
| ----------- | ---- | ------------ |
| plugin_id       | string  | 插件id |
| plugin_display_name | string  | 插件展示名 |
| plugin_type       | string  | 插件类型 |
| tag       | string  | 插件标签 |
| bk_biz_id       | int  | 业务id |
| related_conf_count       | int  | 关联采集配置数 |
| status       |  string  | 插件状态 |
| create_user       | string  | 创建人 |
| create_time       | string  | 创建时间 |
| update_user       | string  | 更新人 |
| update_time       | string  | 更新时间 |
| config_version       | int  | 插件配置版本 |
| info_version       | int  | 插件信息版本 |
| description_md       | string  | 描述 |
| edit_allowed       | bool  | 是否允许编辑 |
| is_support_remote       | bool  | 是否支持远程采集 |
| label       | string  | 标签 |
| logo       | string  | logo |
| is_official       | bool  | 是否官方 |
| is_safety       | bool  | 是否未被改动(签名校验)|
| stage       | string  | 版本阶段 |
| collector_json       | dict  | 采集器配置 |
| config_json | dict  | 参数配置 |
| metric_json | dict  | 指标配置 |
| os_type_list | list  | 系统列表(如["linux","windows","linux_aarch64"]) |


#### collector_json详情
> 字段与格式取决于实际插件类型

#### config_json详情

| 字段        | 类型 | 描述         |
| ----------- | ---- | ------------ |
| default       | string  | 默认值 |
| description       | string  | 描述|
| type       | string  | 值类型|
| name       | string  |参数名|
| mode       | string  |参数类型|
#### metric_json详情

| 字段        | 类型 | 描述         |
| ----------- | ---- | ------------ |
| table_name       | string  | 表名 |
| table_desc       | string  | 表描述|
| fields       | list  | 字段列表|

#### fields详情

| 字段        | 类型 | 描述         |
| ----------- | ---- | ------------ |
| description       | string  | 描述信息 |
| dimensions       | list  | 维度列表，如["id","record_type"]|
| is_active       | bool  | 是否启用|
| is_diff_metric       | bool  | 是否为差值指标|
| monitor_type | string  | 指标类型|
| name       | string  | 指标名|
| source_name       | string  | 原指标名|
| type       | string  | 字段类型|
| unit       | string  | 单位|

#### 示例数据

```json
{
  "result": true,
  "code": 200,
  "message": "OK",
  "data": {
    "plugin_id": "bk_collector",
    "plugin_display_name": "apm-rum接收",
    "plugin_type": "Pushgateway",
    "tag": "",
    "label": "os",
    "status": "normal",
    "logo": "",
    "collector_json": {},
    "config_json": [
      {
        "default": "",
        "mode": "collector",
        "type": "text",
        "name": "metrics_url",
        "description": "采集URL"
      }
    ],
    "metric_json": [
      {
        "table_name": "Group1",
        "table_desc": "分组1",
        "fields": [
          {
            "description": "",
            "type": "double",
            "monitor_type": "metric",
            "unit": "none",
            "name": "bk_collector_exporter_sent_duration_in_ms_sum",
            "is_diff_metric": false,
            "is_active": true,
            "source_name": "",
            "dimensions": []
          }
          
        ]
      }
    ],
    "description_md": "### 依赖说明...",
    "config_version": 1,
    "info_version": 2,
    "stage": "release",
    "bk_biz_id": 2,
    "signature": "dcssdscds...",
    "is_support_remote": true,
    "is_official": false,
    "is_safety": true,
    "create_user": "admin",
    "update_user": "admin",
    "os_type_list": [
      "linux",
      "windows",
      "linux_aarch64"
    ],
    "create_time": "2023-02-15 15:16:05+0800",
    "update_time": "2023-02-15 15:16:22+0800",
    "related_conf_count": 0,
    "edit_allowed": true
  }
}

```
