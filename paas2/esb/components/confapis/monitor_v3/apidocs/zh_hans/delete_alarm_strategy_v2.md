### 功能描述

删除策略配置

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      | 类型 | 必选 | 描述           |
| :-------- | ---- | ---- | -------------- |
| bk_biz_id | int  | 是   | 业务ID         |
| ids       | list | 是   | 告警策略ID列表 |


#### 示例数据

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "bk_biz_id": 7,
    "ids": [49]
}
```

### 响应参数

| 字段    | 类型   | 描述               |
| ------- | ------ | ------------------ |
| result  | bool   | 请求是否成功       |
| code    | int    | 返回的状态码       |
| message | string | 描述信息           |
| data    | list   | 已删除的策略id列表 |

#### 示例数据

```json
{
    "result": true,
    "code": 200,
    "message": "OK",
    "data": [
        49
    ]
}
```
