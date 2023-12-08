### 功能描述

查询插件列表

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段       | 类型   | 描述     |
| ---------- | ------ | -------- |
| search_key | string | 查询字段 |
| search_type | string | 插件类型 |
| labels | string | 分类 |
| order | string | 排序字段 |
| status | string | 插件状态 |
| bk_biz_id  | int    | 业务ID   |
| page       | int    | 页数     |
| page_size  | int    | 每页数量 |

#### 示例数据
`query_string`

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "bk_biz_id": 1,
    "search_key": "xxxexporter",
    "search_type": "Script",
    "labels": "",
    "order": "-status",
    "page": 1,
    "page_size": 10
}
```

### 响应参数

| 字段    | 类型   | 描述         |
| ------- | ------ | ------------ |
| result  | bool   | 请求是否成功 |
| code    | int    | 返回的状态码 |
| message | string | 描述信息     |
| data    | list   | data数据     |

#### data详情

| 字段        | 类型 | 描述         |
| ----------- | ---- | ------------ |
| count       | dict  | 插件类型数量 |
| list | list | 插件列表 |
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
| edit_allowed       | bool  | 是否允许编辑 |
| delete_allowed       | bool  | 是否允许删除 |
| export_allowed       | bool  | 是否允许导出 |
| logo       | string  | logo |
| is_official       | bool  | 是否官方 |
| is_safety       | bool  | 是否未被改动(签名校验)|
| label_info       | dict  | 标签信息 |


#### label_info详情

| 字段        | 类型 | 描述         |
| ----------- | ---- | ------------ |
| first_label       | string  | 插件标签 |
| first_label_name       | string  | 插件标签名|
| second_label       | string  | 插件标签|
| second_label_name       | string  |插件标签名|

#### 示例数据

```json
{
  "result": true,
  "code": 200,
  "message": "OK",
  "data": {
    "count": {
      "Exporter": 8,
      "Script": 34,
      "JMX": 0,
      "DataDog": 0,
      "Pushgateway": 1,
      "Built-In": 0,
      "Log": 0,
      "Process": 0,
      "SNMP_Trap": 0,
      "SNMP": 3
    },
    "list": [
      {
        "plugin_id": "bk_collector",
        "plugin_display_name": "apm-rum接收",
        "plugin_type": "Pushgateway",
        "tag": "",
        "bk_biz_id": 2,
        "related_conf_count": 0,
        "status": "normal",
        "create_user": "admin",
        "create_time": "2023-02-15 15:12:29",
        "update_user": "admin",
        "update_time": "2023-02-15 15:16:22",
        "config_version": 1,
        "info_version": 2,
        "edit_allowed": true,
        "delete_allowed": true,
        "export_allowed": true,
        "label_info": {
          "first_label": "hosts",
          "first_label_name": "主机&云平台",
          "second_label": "os",
          "second_label_name": "操作系统"
        },
        "logo": "",
        "is_official": false,
        "is_safety": true
      }
    ]
  }
}
```
