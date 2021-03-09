### 功能描述

注册插件信息

### 请求参数

{{ common_args_desc }}




#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| name | string | 是 | 插件名 |
| description | string | 是 | desc |
| scenario | string | 是 | 使用场景 |
| category | string | 是 | 类别 |
| config_file | string | 是 | 配置文件名 |
| config_file_format | string | 是 | 配置文件格式 |
| use_db | string | 是 | 是否使用db |
| is_binary | string | 是 | 是否二进制 |

### 请求参数示例

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

### 返回结果示例

```json
{
    "result": true,
    "code": 0,
    "message":"success",
    "data": []
}
```

### 返回结果参数说明

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
|result| bool | 返回结果，true为成功，false为失败 |
|code|int|返回码，0表示成功，其他值表示失败|
|message|string|错误信息
|data| array| 结果 |