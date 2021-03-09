### Functional description

register process information

### Request Parameters

{{ common_args_desc }}


#### Interface Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| name | string | Yes | 插件名 |
| description | string | Yes | desc |
| scenario | string | Yes | 使用场景 |
| category | string | Yes | 类别 |
| config_file | string | Yes | 配置文件名 |
| config_file_format | string | Yes | 配置文件格式 |
| use_db | string | Yes | 是否使用db |
| is_binary | string | Yes | 是否二进制 |

### Request Parameters Example

``` json
{
    "name": "xxxxx",
    "description": "用于采集主机基础性能，包含CPU内存，磁盘，网络等数据的程序",
    "scenario": "CMDB上的实时数据，蓝鲸监控里的主机监控中的基础性能数据",
    "category": "offical",
    "config_file": "config.json",
    "config_file_format": 'json',
    "use_db": 0,
    "is_binary" 0 
}
```

### Return Result Example

```json
{
    "result": true,
    "code": 0,
    "message":"success",
    "data": []
}
```

### Return Result Parameters Description

| Field      | Type      | Description      |
|-----------|-----------|-----------|
|result| bool | return result, true for success, false for failed |
|code|int| return code. 0 indicates success, other values indicate failure  |
|message|string| error message |
|data| array|  result |