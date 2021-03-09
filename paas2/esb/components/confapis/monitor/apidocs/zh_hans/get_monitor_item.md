## 查询监控策略

### 请求地址

/v2/monitor/models/monitor_item/

### 请求方法

GET

### 功能描述

查询监控策略数据

### 请求参数

#### 通用参数

| 字段          | 类型   | 必选 | 描述                                                         |
| ------------- | ------ | ---- | ------------------------------------------------------------ |
| bk_app_code   | string | 是   | 应用ID                                                       |
| bk_app_secret | string | 是   | 安全密钥(应用 TOKEN)，可以通过 蓝鲸智云开发者中心 -> 点击应用ID -> 基本信息 获取 |
| bk_token      | string | 否   | 当前用户登录态，bk_token与bk_username必须一个有效，bk_token可以通过Cookie获取 |
| bk_username   | string | 否   | 当前用户用户名，应用免登录态验证白名单中的应用，用此字段指定当前用户 |

#### 接口参数

| 字段 | 类型 | 必选 | 描述       |
| ---- | ---- | ---- | ---------- |
| id   | int  | 否   | 监控策略id |

### 请求参数示例

```
{
    "bk_app_code":"esb_test",
    "bk_app_secret":"xxx",
    "bk_token":"xxx",
    "id": 614
}
```

### 返回结果示例

```
{
    "message": "OK",
    "code": "0",
    "data": {
        "is_enabled": true,
        "bk_biz_id": 2,
        "update_time": "2019-03-07 03:52:13+0800",
        "alarm_def_id": 615,
        "update_user": "admin",
        "description": "",
        "is_classify_notice": false,
        "title": "testQQ_可用率",
        "monitor_id": 509,
        "is_none_option": "{\"continuous\":0}",
        "create_user": "admin",
        "create_time": "2019-03-07 03:51:27+0800",
        "is_none": 0,
        "monitor_level": 2,
        "is_deleted": false,
        "id": 614,
        "condition": "[[]]",
        "is_recovery": false
    },
    "result": true
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

| 字段               | 类型   | 描述           |
| ------------------ | ------ | -------------- |
| id                 | int    | 监控策略id     |
| bk_biz_id          | int    | 业务id         |
| title              | string | 标题           |
| description        | string | 描述           |
| is_classify_notice | bool   | 分级告警开关   |
| monitor_id         | int    | 监控项id       |
| alarm_def_id       | int    | 告警源id       |
| is_none_option     | string | 无数据配置     |
| is_none            | int    | 无数据告警开关 |
| condition          | string | 监控范围       |
| is_recovery        | bool   | 恢复告警开关   |
| monitor_level      | int    | 监控等级       |
| create_user        | string | 创建人         |
| update_user        | string | 最后修改人     |
| create_time        | time   | 创建时间       |
| update_time        | time   | 最后修改时间   |
| is_deleted         | bool   | 是否删除       |
| is_enabled         | bool   | 是否启用       |

