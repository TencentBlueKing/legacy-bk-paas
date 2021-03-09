## 修改通知配置

### 请求地址

/v2/monitor/models/notice_config/update/

### 请求方法

POST

### 功能描述

修改通知配置数据

### 请求参数

#### 通用参数

| 字段          | 类型   | 必选 | 描述                                                         |
| ------------- | ------ | ---- | ------------------------------------------------------------ |
| bk_app_code   | string | 是   | 应用ID                                                       |
| bk_app_secret | string | 是   | 安全密钥(应用 TOKEN)，可以通过 蓝鲸智云开发者中心 -> 点击应用ID -> 基本信息 获取 |
| bk_token      | string | 否   | 当前用户登录态，bk_token与bk_username必须一个有效，bk_token可以通过Cookie获取 |
| bk_username   | string | 否   | 当前用户用户名，应用免登录态验证白名单中的应用，用此字段指定当前用户 |

#### 接口参数

| 字段             | 类型   | 必选 | 描述              |
| :--------------- | ------ | ---- | ----------------- |
| id               | int    | 是   | 通知配置id        |
| title            | string | 否   | 标题              |
| description      | string | 否   | 描述，默认为""    |
| alarm_start_time | time   | 否   | 告警开始时间      |
| alarm_end_time   | time   | 否   | 告警结束时间      |
| notify_config    | string | 否   | 配置，默认为"{}"  |
| alarm_source_id  | int    | 否   | 告警源id，默认为0 |

##### notify_config

| 字段             | 类型   | 必选 | 描述                                                         |
| ---------------- | ------ | ---- | ------------------------------------------------------------ |
| alarm_start_time | string | 否   | 告警开始时间                                                 |
| alarm_end_time   | string | 否   | 告警结束时间                                                 |
| responsible      | string | 否   | 其他通知人                                                   |
| role_list        | list   | 否   | 通知角色列表                                                 |
| group_list       | list   | 否   | 通知群组列表                                                 |
| notify_mail      | bool   | 否   | 是否邮件通知，类似还有notify_sms，notify_phone，notify_wechat |
| phone_receiver   | string | 否   | 电话通知人                                                   |

### 请求参数示例

```
{
    "bk_app_code":"esb_test",
    "bk_app_secret":"xxx",
    "bk_token":"xxx",
    "id": 650,
    "notify_config": "{\"alarm_end_time\":\"23:59\",\"responsible\":\"\",\"group_list\":[],\"notify_mail\":true,\"phone_receiver\":\"\",\"alarm_start_time\":\"00:00\",\"role_list\":[\"Developer\",\"Tester\",\"ProductPm\"]}"
}
```

### 返回结果示例

```
{
    "message": "OK",
    "code": "0",
    "data": {
        "is_enabled": true,
        "update_time": "2019-03-11 14:20:32+0800",
        "update_user": "",
        "description": "test_add",
        "title": "CPU使用率通知方式",
        "alarm_end_time": "23:59:00",
        "create_user": "",
        "create_time": "2019-03-11 14:18:44+0800",
        "alarm_start_time": "00:00:00",
        "notify_config": "{\"alarm_end_time\":\"23:59\",\"responsible\":\"\",\"group_list\":[],\"notify_mail\":true,\"phone_receiver\":\"\",\"alarm_start_time\":\"00:00\",\"role_list\":[\"Developer\",\"Tester\",\"ProductPm\"]}",
        "is_deleted": false,
        "alarm_source_id": 619,
        "id": 650
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

| 字段             | 类型   | 描述         |
| :--------------- | ------ | ------------ |
| id               | int    | 通知配置id   |
| title            | string | 标题         |
| description      | string | 描述         |
| alarm_start_time | time   | 告警开始时间 |
| alarm_end_time   | time   | 告警结束时间 |
| notify_config    | string | 配置         |
| alarm_source_id  | int    | 告警源id     |
| create_user      | string | 创建人       |
| update_user      | string | 最后修改人   |
| create_time      | time   | 创建时间     |
| update_time      | time   | 最后修改时间 |
| is_deleted       | bool   | 是否删除     |
| is_enabled       | bool   | 是否启用     |

##### data.notify_config

| 字段             | 类型   | 描述                                                         |
| ---------------- | ------ | ------------------------------------------------------------ |
| alarm_start_time | string | 告警开始时间                                                 |
| alarm_end_time   | string | 告警结束时间                                                 |
| responsible      | string | 其他通知人                                                   |
| role_list        | list   | 通知角色列表                                                 |
| group_list       | list   | 通知群组列表                                                 |
| notify_mail      | bool   | 是否邮件通知，类似还有notify_sms，notify_phone，notify_wechat |
| phone_receiver   | string | 电话通知人                                                   |

