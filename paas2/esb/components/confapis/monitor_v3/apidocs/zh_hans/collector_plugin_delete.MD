### 功能描述

删除插件

### 请求参数

{{ common_args_desc }}

#### 

| 字段         | 类型   | 描述     |
|------------| ------ |--------|
| plugin_ids | string | 插件id列表 |


#### 示例数据
`路径参数`

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "plugin_ids": ["sss_script"]
}
```

### 响应参数
| 字段    | 类型     | 描述  |
| ------- |--------|-----|
| result  | bool   | 请求是否成功 |
| code    | int    | 返回的状态码 |
| message | string | 描述信息 | 
| data    | dict   | 结果 |


#### 示例数据

```json
{
  "result": true,
  "code": 200,
  "message": "OK",
  "data": {"result": true}
}
```
