### 功能描述

单据详情查询，支持根据单号查询单据的详情（携带基本信息和提单信息）

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段        | 类型     | 必选  | 描述                         |
| --------- | ------ | --- | -------------------------- |
| sn        | string | 是   | 单号                       |

### 请求参数示例

```json
{  
    "bk_app_secret": "xxxx", 
    "bk_app_code": "xxxx", 
    "bk_token": "xxxx", 
    "sn": "NO2019090XXXXXXXX"
}  
```

### 返回结果示例

```json
{
    "message": "success",
    "code": 0,
    "data": {
        "id": 176,
        "catalog_id": 30,
        "service_id": 18,
        "flow_id": 61,
        "sn": "NO2019090414050083",
        "title": "xxxxx",
        "service_type": "change",
        "create_at": "2019-09-04 14:05:00",
        "current_status": "RUNNING",
        "current_steps": [
                {
                    "action_type": "TRANSITION",
                    "name": "审核意见",
                    "processors": "admin",
                    "processors_type": "PERSON",
                    "state_id": 8,
                    "status": "RUNNING"
                }        
        ],
        "comment_id": "",
        "is_commented": false,
        "updated_by": "xxxx",
        "update_at": "2019-09-04 14:05:01",
        "end_at": null,
        "creator": "xxx(xxx)",
        "is_biz_need": false,
        "bk_biz_id": 2,
        "fields": [{
                "id": 1024,
                "key": "title",
                "type": "STRING",
                "name": "标题",
                "value": "xx",
                "display_value": "xx",
                "desc": "请输入标题",
            },{
                "id": 1025,
                "key": "bk_biz_id",
                "type": "SELECT",
                "name": "标题",
                "value": "2",
                "display_value": "蓝鲸",
                "desc": "请输入标题",
            }
        ]
    },
    "result": true
}
```

### 返回结果参数说明

| 字段      | 类型        | 描述                      |
| ------- | --------- | ----------------------- |
| result  | bool      | 返回结果，true为成功，false为失败   |
| code    | int       | 返回码，0表示成功，其他值表示失败       |
| message | string    | 错误信息                    |
| data    | object    | 返回数据 |

### data

| 字段                     | 类型     | 描述       |
| ---------------------- | ------ | -------- |
| id                     | int    | 单据id     |
| catalog_id             | int    | 服务目录id   |
| service_id             | int    | 服务id     |
| flow_id                | int    | 流程版本id   |
| sn                     | string | 单号     |
| title                  | string | 单据标题     |
| current_status         | string | 单据当前状态，RUNNING（处理中）/FINISHED（已结束）/TERMINATED（被终止）   |
| current_steps          | array  | 单据当前步骤   |
| comment_id             | string | 单据评价id   |
| is_commented           | bool   | 单据是否已评价  |
| updated_by             | string | 最近更新者    |
| update_at              | string | 最近更新时间   |
| end_at                 | string | 结束时间     |
| creator                | string | 提单人      |
| create_at             | string | 创建时间    |
| is_biz_need            | bool   | 是否与业务关联  |
| bk_biz_id              | int    | 业务id     |
| fields              | array    | 提单节点字段    |

### current_steps（当前步骤）

| 字段              | 类型         | 描述         |
| --------------- | ---------- | ---------- |
| name            | string    | 步骤名称    |
| action_type     | string    | 操作类型：TRANSITION（审批）/DISTRIBUTE（分派）/CLAIM（认领）/AUTOMATIC（自动处理）    |
| processors      | string | 处理人列表  |
| processors_type | string | 处理人类型：CMDB（cmdb角色）/GENERAL（通用角色）/PERSON（个人）/STARTER（提单人）/OPEN（不限）    |
| state_id        | int | 节点ID    |
| status          | string | 节点状态    |


### status（节点状态）

| 字段              | 类型         | 描述         |
| --------------- | ---------- | ---------- |
| WAIT  |   待处理     |
| RUNNING   |   处理中     |
| RECEIVING     |   待认领     |
| DISTRIBUTING  |   待分派     |
| TERMINATED    |   被终止     |
| FINISHED  |   已结束     |
| FAILED    |   执行失败        |
| SUSPEND   |   被挂起     |


### fields

| 字段              | 类型         | 描述         |
| --------------- | ---------- | ---------- |
| id            | int    | 字段id    |
| key           | string | 字段唯一标识  |
| type          | string | 字段类型    |
| name          | string | 字段名称    |
| desc          | string | 字段描述    |
| value           | string | 字段值        |
| display_value   | string | 字段展示值        |
