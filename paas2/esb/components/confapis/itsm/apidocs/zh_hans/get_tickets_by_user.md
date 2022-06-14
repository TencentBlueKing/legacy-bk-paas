### 功能描述

获取指定用户和工单类型的单据列表

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段           | 类型   | 必选 | 描述                                                         |
| -------------- | ------ | ---- | ------------------------------------------------------------ |
| user           | string | 是   | 根据用户名来过滤，格式为用户英文id                           |
| view_type      | string | 是   | 根据工单类型来过滤                                           |
| catalog_id     | int    | 否   | 根据服务目录id来过滤                                           |
| service_id     | int    | 否   | 根据服务id来过滤                                           |
| create_at__gte | string | 否   | 创建时间大于或等于，格式："YYYY-MM-DD hh:mm:ss"              |
| create_at__lte | string | 否   | 创建时间小于或等于，格式："YYYY-MM-DD hh:mm:ss"，如要使用该过滤条件，请同时配置create_at_lte和create_at_gte两个参数 |
| page           | int    | 否   | 请求页码，默认为1                                            |
| page_size      | int    | 否   | 每页数据量，默认为10，最大10000                              |

**view_type**

| 参数         | 描述                   |
| ------------ | ---------------------- |
| my_todo      | 用户的待办单据         |
| my_created   | 用户创建的单据         |
| my_history   | 用户的历史单据         |
| my_approval  | 用户的待审批单据       |
| my_attention | 用户关注的单据         |
| my_dealt     | 用户拥有查看权限的单据 |

### 请求参数示例

```
GET {{API_URL}}/?view_type=my_todo&user=admin&create_at__gte=2021-10-24+17:00:00&create_at__lte=2021-10-26+17:00:00
```
```json
{
    "app_secret": "xxxx",
    "app_code": "xxxx",
    "bk_token": "xxxx"
}
```

### 返回结果示例

```json
{
    "result": true,
    "code": 0,
    "message": "success",
    "data": {
        "page": 1,
        "total_page": 1,
        "count": 1,
        "next": null,
        "previous": null,
        "items": [
            {
                "sn": "REQ20211025000001",
                "id": 19,
                "title": "test",
                "service_id": 6,
                "service_type": "request",
                "meta": {
                    "priority": {
                        "key": "1",
                        "name": "低",
                        "order": 1
                    }
                },
                "bk_biz_id": -1,
                "current_status": "RUNNING",
                "create_at": "2021-10-25 17:14:52",
                "creator": "admin",
                "is_supervise_needed": false,
                "flow_id": 14,
                "supervise_type": "EMPTY",
                "supervisor": "",
                "service_name": "test",
                "current_status_display": "处理中",
                "current_steps": [
                    {
                        "id": 42,
                        "tag": "DEFAULT",
                        "name": "test"
                    }
                ],
                "priority_name": "低",
                "current_processors": "",
                "can_comment": false,
                "can_operate": false,
                "waiting_approve": true,
                "followers": [],
                "comment_id": "",
                "can_supervise": false,
                "can_withdraw": true,
                "sla": [],
                "sla_color": ""
            }
        ]
    }
}
```

### 返回结果参数说明

| 字段    | 类型   | 描述                              |
| ------- | ------ | --------------------------------- |
| result  | bool   | 返回结果，true为成功，false为失败 |
| code    | int    | 返回码，0表示成功，其他值表示失败 |
| message | string | 错误信息                          |
| data    | object | 返回数据                          |

### data

| 字段       | 类型   | 描述         |
| ---------- | ------ | ------------ |
| count      | int    | 返回数量     |
| next       | string | 下一页链接   |
| previous   | string | 前一页链接   |
| items      | array  | 单据数据列表 |
| page       | int    | 页码         |
| total_page | int    | 总页数       |

### items

| 字段                   | 类型   | 描述                        |
| ---------------------- | ------ | --------------------------- |
| sn                     | string | 单号                        |
| id                     | int    | 单据id                      |
| title                  | string | 单据标题                    |
| service_id             | int    | 服务id                      |
| service_type           | string | 服务类型                    |
| service_name           | string | 服务名称                    |
| bk_biz_id              | int    | 业务id，无业务关联为-1      |
| catalog_id             | int    | 服务目录id                  |
| current_status         | string | 单据当前状态                |
| current_status_display | string | 单据当前状态                |
| current_steps          | array  | 单据当前步骤                |
| flow_id                | int    | 流程版本id                  |
| comment_id             | string | 单据评价id                  |
| is_commented           | bool   | 单据是否已评价              |
| updated_by             | string | 最近更新者                  |
| update_at              | string | 最近更新时间                |
| end_at                 | string | 结束时间                    |
| creator                | string | 提单人                      |
| create_at              | string | 创建时间                    |
| is_biz_need            | bool   | 是否与业务关联              |
| is_supervise_needed    | bool   | 是否需要督办                |
| supervise_type         | string | 督办人类型                  |
| supervisor             | string | 督办人                      |
| can_supervise          | bool   | 是否督办                    |
| priority_name          | string | 优先级                      |
| can_comment            | bool   | 是否可以评论                |
| can_operate            | bool   | 是否可以操作                |
| waiting_approve        | bool   | 是否为待审批状态            |
| can_withdraw           | bool   | 是否可以撤销                |
| followers              | array  | 关注人                      |
| sla                    | array  | 配置的sla名称               |
| sla_color              | string | 触发sla后，在前端响应的颜色 |
