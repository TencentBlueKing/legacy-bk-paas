### 功能描述

获取单据

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| sns        | array   | 否     | 根据单号列表过滤 |
| creator   | string    | 否 | 根据单据创建人过滤 |
| create_at__lte | string | 否 | 创建时间大于或等于，格式："YYYY-MM-DD hh:mm:ss" |
| create_at__gte | string | 否 | 创建时间小于或等于，格式："YYYY-MM-DD hh:mm:ss" |
| page         | int    | 否   | 请求页码，默认为1     |
| page_size    | int    | 否   | 每页数据量，默认为10，最大10000 |
| username    | string    | 否   | 过滤该用户的待办，每页数据量，默认为10，最大10000 |

### 请求参数示例

``` json
{
    "bk_app_secret": "xxxx",
    "bk_app_code": "xxxx",
    "bk_token": "xxxx",
    "sns": ["NO2019091610001755"],
    "creator": "admin",
    "create_at__lte": "2019-09-16 10:00:00",
    "create_at__gte": "2020-09-16 10:00:00",
    "page": 1,
    "page_size": "10",
    "username": "admin"
}
```
### 返回结果示例

```json
{
    "message": "success",
    "code": 0,
    "data": {
        "page": 1,
        "total_page": 1,
        "count": 1,
        "next": null,
        "previous": null,
        "items": [
            {
                "id": 1,
                "sn": "NO2019091610001755",
                "title": "a",
                "catalog_id": 3,
                "service_id": 1,
                "service_type": "request",
                "flow_id": 1,
                "current_status": "RUNNING",
                "comment_id": "",
                "is_commented": false,
                "updated_by": "admin",
                "update_at": "2019-09-16 10:01:07",
                "end_at": null,
                "creator": "admin",
                "create_at": "2019-09-16 10:00:17",
                "bk_biz_id": -1,
                "ticket_url": "xxxx"
            }
        ]
    },
    "result": true
}
```

### 返回结果参数说明

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
|result| bool | 返回结果，true为成功，false为失败 |
|code|int|返回码，0表示成功，其他值表示失败|
|message|string|错误信息
|data| object| 返回数据 |

### data

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
|count| int | 返回数量 |
|next|string|下一页链接|
|previous|string|前一页链接|
|items| array| 单据数据列表 |
|page| int| 页码 |
|total_page| int| 总页数 |

### items

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| id                     | int    | 单据id     |
| catalog_id             | int    | 服务目录id   |
| service_id             | int    | 服务id     |
| flow_id                | int    | 流程版本id   |
| sn                     | string | 单号     |
| title                  | string | 单据标题     |
| current_status         | string | 单据当前状态   |
| current_steps          | array  | 单据当前步骤   |
| comment_id             | string | 单据评价id   |
| is_commented           | bool   | 单据是否已评价  |
| updated_by             | string | 最近更新者    |
| update_at              | string | 最近更新时间   |
| end_at                 | string | 结束时间     |
| creator                | string | 提单人      |
| create_at                | string | 创建时间      |
| is_biz_need            | bool   | 是否与业务关联  |
| bk_biz_id              | int    | 业务id     |
