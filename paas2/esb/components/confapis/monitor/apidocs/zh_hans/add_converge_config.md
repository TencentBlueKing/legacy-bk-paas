## 新增收敛配置

### 请求地址

/v2/monitor/models/converge_config/add/

### 请求方法

POST

### 功能描述

新增收敛配置数据

### 请求参数

#### 通用参数

| 字段          | 类型   | 必选 | 描述                                                         |
| ------------- | ------ | ---- | ------------------------------------------------------------ |
| bk_app_code   | string | 是   | 应用ID                                                       |
| bk_app_secret | string | 是   | 安全密钥(应用 TOKEN)，可以通过 蓝鲸智云开发者中心 -> 点击应用ID -> 基本信息 获取 |
| bk_token      | string | 否   | 当前用户登录态，bk_token与bk_username必须一个有效，bk_token可以通过Cookie获取 |
| bk_username   | string | 否   | 当前用户用户名，应用免登录态验证白名单中的应用，用此字段指定当前用户 |

#### 接口参数


| 字段            | 类型   | 必选 | 描述              |
| --------------- | ------ | ---- | ----------------- |
| config          | string | 否   | 配置，默认为''    |
| alarm_source_id | int    | 否   | 告警源id，默认为0 |
| converge_id     | int    | 否   | 收敛id，默认为0   |

##### config

| 字段         | 类型 | 描述                         |
| ------------ | ---- | ---------------------------- |
| count        | int  | 满足{count}次检测算法        |
| alarm_window | int  | {alarm_window}分钟内不再告警 |
| check_window | int  | {check_window}个周期内       |

###### 注：{check_window}个周期内，满足{count}次检测算法, 且告警产生后未恢复，{alarm_window}分钟内不再告警

### 请求参数示例

```
{
    "bk_app_code":"esb_test",
    "bk_app_secret":"xxx",
    "bk_token":"xxx",
    "alarm_source_id": 598,
    "config": "{\"count\":1,\"alarm_window\":1440,\"check_window\":5}",
    "converge_id": 0
}
```

### 返回结果示例

```
{
    "message": "OK",
    "code": "0",
    "data": {
        "is_enabled": true,
        "update_time": "2019-03-14 12:01:37+0800",
        "update_user": "admin",
        "converge_id": 0,
        "create_user": "admin",
        "create_time": "2019-03-14 12:01:37+0800",
        "is_deleted": false,
        "alarm_source_id": 598,
        "config": "{\"count\":1,\"alarm_window\":1440,\"check_window\":5}",
        "id": 670
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

| 字段            | 类型   | 描述              |
| :-------------- | ------ | ----------------- |
| id              | int    | 收敛配置id        |
| config          | string | 配置，默认为''    |
| alarm_source_id | int    | 告警源id，默认为0 |
| converge_id     | int    | 收敛id            |
| create_user     | string | 创建人            |
| update_user     | string | 最后修改人        |
| create_time     | time   | 创建时间          |
| update_time     | time   | 最后修改时间      |
| is_deleted      | bool   | 是否删除          |
| is_enabled      | bool   | 是否启用          |

##### data.config

| 字段         | 类型 | 描述                         |
| ------------ | ---- | ---------------------------- |
| count        | int  | 满足{count}次检测算法        |
| alarm_window | int  | {alarm_window}分钟内不再告警 |
| check_window | int  | {check_window}个周期内       |
