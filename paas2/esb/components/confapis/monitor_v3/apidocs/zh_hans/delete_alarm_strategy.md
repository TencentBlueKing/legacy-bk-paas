### 功能描述

删除告警策略

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      | 类型 | 必选 | 描述       |
| :-------- | ---- | ---- | ---------- |
| bk_biz_id | int  | 是   | 业务ID     |
| id        | int  | 是   | 告警策略ID |

#### 示例数据

```json
{
  "bk_biz_id": 2,
  "id": 1
}
```

### 响应参数

```json
{
  "message": "OK",
  "code": "0",
  "data": null,
  "result": true
}
```
