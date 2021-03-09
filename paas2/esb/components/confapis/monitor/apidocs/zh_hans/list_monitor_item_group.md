## 批量查询监控策略组

### 请求地址

/v2/monitor/models/monitor_item_group/search/

### 请求方法

GET

### 功能描述

查询监控策略组数据

### 请求参数

#### 通用参数

| 字段          | 类型   | 必选 | 描述                                                         |
| ------------- | ------ | ---- | ------------------------------------------------------------ |
| bk_app_code   | string | 是   | 应用ID                                                       |
| bk_app_secret | string | 是   | 安全密钥(应用 TOKEN)，可以通过 蓝鲸智云开发者中心 -> 点击应用ID -> 基本信息 获取 |
| bk_token      | string | 否   | 当前用户登录态，bk_token与bk_username必须一个有效，bk_token可以通过Cookie获取 |
| bk_username   | string | 否   | 当前用户用户名，应用免登录态验证白名单中的应用，用此字段指定当前用户 |

#### 接口参数

| 字段             | 类型   | 描述                          |
| :--------------- | ------ | ----------------------------- |
| bk_biz_id        | int    | 业务id                        |
| monitor_id       | int    | 监控项id                      |
| monitor_item_id  | int    | 监控策略id                    |
| monitor_group_id | int    | 监控组id                      |
| monitor_level    | int    | 监控等级，1致命，2预警，3提醒 |
| create_user      | string | 创建人                        |
| update_user      | string | 最后修改人                    |
| is_enabled       | bool   | 是否启用                      |

### 请求参数示例

```
{
    "bk_app_code":"esb_test",
    "bk_app_secret":"xxx",
    "bk_token":"xxx",
    "monitor_id": 506
}
```

### 返回结果示例

```
{
    "message": "OK",
    "code": "0",
    "data": [
        {
            "is_enabled": true,
            "bk_biz_id": 2,
            "update_time": "2019-03-04 09:45:00+0800",
            "update_user": "",
            "monitor_id": 506,
            "monitor_item_id": 597,
            "create_user": "",
            "create_time": "2019-03-04 09:45:00+0800",
            "monitor_level": 2,
            "is_deleted": false,
            "id": 474,
            "monitor_group_id": 597
        }
        ......
    ],
    "result": true,
    "_meta": {
        "count": 6,
        "previous": null,
        "next": null
    }
}
```

### 返回结果参数说明

| 字段    | 类型   | 描述                              |
| ------- | ------ | --------------------------------- |
| result  | bool   | 返回结果，true为成功，false为失败 |
| code    | int    | 返回码，0表示成功，其他值表示失败 |
| message | string | 错误信息                          |
| data    | dict   | 结果                              |

#### data

| 字段             | 类型   | 描述                          |
| :--------------- | ------ | ----------------------------- |
| id               | int    | 监控策略组id                  |
| bk_biz_id        | int    | 业务id                        |
| monitor_id       | int    | 监控项id                      |
| monitor_item_id  | int    | 监控策略id                    |
| monitor_group_id | int    | 监控组id                      |
| monitor_level    | int    | 监控等级，1致命，2预警，3提醒 |
| create_user      | string | 创建人                        |
| update_user      | string | 最后修改人                    |
| create_time      | time   | 创建时间                      |
| update_time      | time   | 最后修改时间                  |
| is_deleted       | bool   | 是否删除                      |
| is_enabled       | bool   | 是否启用                      |

