
### 功能描述

导入插件

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      | 类型 | 必选 | 描述     |
| --------- | ---- | ---- | -------- |
| file_data | file | 是   | 插件文件 |
| bk_biz_id | int  | 是   | 业务id |

#### 请求参数示例
`Content-Type multipart/form-data`
```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "bk_biz_id": "2",
    "file_data":"二进制"
}
```

### 返回结果

| 字段      | 类型     | 描述                    |
|---------|--------|-----------------------|
| result  | bool   | 返回结果，true为成功，false为失败 |
| code    | int    | 返回码，200表示成功，其他值表示失败   |
| message | string | 错误信息                  |
| data    | bool   | 结果                    |

#### 返回结果示例

```json
{
    "result": true,
    "code": 200,
    "message": "OK",
    "data": true
}
```
