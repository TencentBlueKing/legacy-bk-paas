### 功能描述

删除规则组及对应的规则

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段       | 类型 | 必选 | 描述 |
| --------- | ---- | ---- |--|
| bk_biz_id | list | 否   | 业务ID |
| group_ids       | list | 否   | 分派组 |

#### 示例数据

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "bk_biz_ids": [2],
    "group_ids": [7]
}
```

### 响应参数

| 字段    | 类型     | 描述     |
| ------- |--------|--------|
| result  | bool   | 请求是否成功 |
| code    | int    | 返回的状态码 |
| message | string | 描述信息   |
| data    | object | 分派组    |

#### 示例数据

```json
{
    "result": true,
    "code": 200,
    "message": "OK",
    "data": {"deleted_group_ids": [7]},
    "request_id": "b8cf17b82cd949e984011d890ac554df"
}
```

