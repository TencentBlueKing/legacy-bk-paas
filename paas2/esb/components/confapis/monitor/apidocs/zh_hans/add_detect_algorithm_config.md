## 新增检测算法配置

### 请求地址

/v2/monitor/models/detect_algorithm_config/add/

### 请求方法

POST

### 功能描述

新增检测算法配置数据

### 请求参数

#### 通用参数

| 字段          | 类型   | 必选 | 描述                                                         |
| ------------- | ------ | ---- | ------------------------------------------------------------ |
| bk_app_code   | string | 是   | 应用ID                                                       |
| bk_app_secret | string | 是   | 安全密钥(应用 TOKEN)，可以通过 蓝鲸智云开发者中心 -> 点击应用ID -> 基本信息 获取 |
| bk_token      | string | 否   | 当前用户登录态，bk_token与bk_username必须一个有效，bk_token可以通过Cookie获取 |
| bk_username   | string | 否   | 当前用户用户名，应用免登录态验证白名单中的应用，用此字段指定当前用户 |

#### 接口参数

| 字段            | 类型   | 必选 | 描述                                                         |
| :-------------- | ------ | ---- | ------------------------------------------------------------ |
| monitor_item_id | int    | 否   | 监控策略id，默认为0                                          |
| algorithm_id    | int    | 否   | 算法id，1000(静态阈值)，1001(同比策略(简易))，1002(环比策略(简易))，1003(同比策略(高级))，1004(环比策略(高级))，1005(同比振幅)，1006(同比区间)，1007(环比振幅)，4000(关键字匹配)，5000(进程端口监控检测策略)，5001(系统重新启动监控策略)，6000(自定义字符型告警)，默认为0 |
| config          | string | 否   | 算法配置，默认为""                                           |

##### config

| 字段      | 类型   | 描述                                                         |
| --------- | ------ | ------------------------------------------------------------ |
| threshold | int    | 阈值                                                         |
| message   | string | 告警模版                                                     |
| method    | string | 比较方法，大于或等于gte，大于gt，小于或等于lte，小于lt，等于eq，不等neq |

### 请求参数示例

```
{
    "bk_app_code":"esb_test",
    "bk_app_secret":"xxx",
    "bk_token":"xxx",
    "config": "{\"threshold\":200,\"message\":\"\",\"method\":\"gte\"}",
    "algorithm_id": 1000,
    "monitor_item_id": 618
}
```

### 返回结果示例

```
{
    "message": "OK",
    "code": "0",
    "data": {
        "is_enabled": true,
        "update_time": "2019-03-11 12:14:32+0800",
        "update_user": "",
        "monitor_item_id": 618,
        "create_user": "",
        "create_time": "2019-03-11 12:14:32+0800",
        "algorithm_id": 1000,
        "is_deleted": false,
        "config": "{\"threshold\":200,\"message\":\"\",\"method\":\"gte\"}",
        "id": 786
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

| 字段            | 类型   | 描述                                                         |
| :-------------- | ------ | ------------------------------------------------------------ |
| id              | int    | 检测算法配置id                                               |
| monitor_item_id | int    | 监控策略id                                                   |
| algorithm_id    | int    | 算法id，1000(静态阈值)，1001(同比策略(简易))，1002(环比策略(简易))，1003(同比策略(高级))，1004(环比策略(高级))，1005(同比振幅)，1006(同比区间)，1007(环比振幅)，4000(关键字匹配)，5000(进程端口监控检测策略)，5001(系统重新启动监控策略)，6000(自定义字符型告警) |
| config          | string | 算法配置                                                     |
| create_user     | string | 创建人                                                       |
| update_user     | string | 最后修改人                                                   |
| create_time     | time   | 创建时间                                                     |
| update_time     | time   | 最后修改时间                                                 |
| is_deleted      | bool   | 是否删除                                                     |
| is_enabled      | bool   | 是否启用                                                     |

##### data.config

| 字段      | 类型   | 描述                                                         |
| --------- | ------ | ------------------------------------------------------------ |
| threshold | int    | 阈值                                                         |
| message   | string | 告警模版                                                     |
| method    | string | 比较方法，大于或等于gte，大于gt，小于或等于lte，小于lt，等于eq，不等neq |

