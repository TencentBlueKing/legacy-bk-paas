### 功能描述

更新定时作业状态，如启动或暂停

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段        |  类型      | 必选   |  描述      |
|----------- |------------|--------|------------|
| bk_biz_id  |  long      | 是     | 业务 ID |
| id         |  long      | 是     | 定时作业 ID |
| status     |  int       | 是     | 定时状态，1.启动、2.暂停 |

### 请求参数示例

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_biz_id": 1,
    "id": 2,
    "status": 1
}
```

### 返回结果示例

```json
{
    "result": true,
    "code": 0,
    "message": "success",
    "data": 2
}
```