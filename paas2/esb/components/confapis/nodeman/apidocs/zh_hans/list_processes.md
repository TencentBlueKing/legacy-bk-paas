### 功能描述

查询插件列表

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段     | 类型       | 必选 |描述                  |
|----------|------------|----------|-----------------------------|
| category | string | 是 | 插件类型 |

### 返回结果示例
```
{
    "message": "",
    "code": 0,
    "data": [
        {
            "category": "official",
            "auto_launch": true,
            "config_file": "basereport.conf",
            "description": "基础性能采集器",
            "scenario": "负责采集CMDB上的实时数据，蓝鲸监控里的主机监控，包含CPU，内存，磁盘等",
            "scenario_en": "",
            "description_en": "",
            "is_binary": true,
            "use_db": false,
            "config_format": "yaml",
            "id": 7,
            "name": "basereport"
        },
        {
            "category": "official",
            "auto_launch": false,
            "config_file": "bkunifylogbeat.conf",
            "description": "高性能日志采集",
            "scenario": "数据平台，蓝鲸监控，日志检索等和日志相关的数据. 首次使用插件管理进行操作前，先到日志检索/数据平台等进行设置插件的功能项",
            "scenario_en": "",
            "description_en": "",
            "is_binary": true,
            "use_db": false,
            "config_format": "yaml",
            "id": 6,
            "name": "bkunifylogbeat"
        }
    ],
    "result": true,
    "request_id": "1fab28be9d364302b2a23df156ca3f40"
}
```
