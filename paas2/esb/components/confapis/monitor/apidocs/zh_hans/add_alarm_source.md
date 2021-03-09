## 新增告警源

### 请求地址

/v2/monitor/models/alarm_source/add/

### 请求方法

POST

### 功能描述

新增告警源

### 请求参数

#### 通用参数

| 字段          | 类型   | 必选 | 描述                                                         |
| ------------- | ------ | ---- | ------------------------------------------------------------ |
| bk_app_code   | string | 是   | 应用ID                                                       |
| bk_app_secret | string | 是   | 安全密钥(应用 TOKEN)，可以通过 蓝鲸智云开发者中心 -> 点击应用ID -> 基本信息 获取 |
| bk_token      | string | 否   | 当前用户登录态，bk_token与bk_username必须一个有效，bk_token可以通过Cookie获取 |
| bk_username   | string | 否   | 当前用户用户名，应用免登录态验证白名单中的应用，用此字段指定当前用户 |

#### 接口参数

| 字段              | 类型   | 必选 | 描述                                   |
| :---------------- | ------ | ---- | -------------------------------------- |
| biz_id            | int    | 是   | 业务id                                 |
| title             | string | 是   | 标题                                   |
| description       | string | 否   | 描述，默认为""                         |
| scr_type          | string | 否   | 监控源分类，默认为"JA"                 |
| scenario          | string | 否   | 监控场景，默认为"custom"               |
| monitor_target    | string | 否   | 监控指标，默认为""                     |
| source_info       | string | 否   | 告警来源信息，默认为""                 |
| monitor_level     | int    | 否   | 监控等级，1致命，2预警，3提醒，默认为3 |
| alarm_cleaning_id | int    | 否   | 清洗策略id，默认为0                    |
| alarm_notice_id   | int    | 否   | 通知策略id，默认为0                    |
| alarm_attr_id     | int    | 否   | 监控源id，默认为0                      |
| alarm_collect_id  | int    | 否   | 汇总策略id，默认为0                    |
| alarm_solution_id | int    | 否   | 处理策略id，默认为0                    |
| condition         | string | 否   | 告警范围，默认为""                     |
| timeout           | int    | 否   | 超时时间，默认为40                     |
| alarm_type        | string | 否   | 告警分类，默认为"Custom"               |

##### source_info

| 字段                    | 类型   | 必选 | 描述                                 |
| ----------------------- | ------ | ---- | ------------------------------------ |
| count_freq              | int    | 否   | 监控源数据统计周期                   |
| dimensions              | list   | 否   | 监控源数据维度字段名                 |
| aggregator              | string | 否   | 监控源数据统计方式                   |
| monitor_field           | string | 否   | 监控值字段                           |
| unit_conversion         | float  | 否   | 监控字段单位转换方式                 |
| monitor_result_table_id | string | 否   | 监控结果表id，由业务id和结果表名组成 |
| unit                    | string | 否   | 监控字段单位                         |

### 请求参数示例

```
{
    "bk_app_code":"esb_test",
    "bk_app_secret":"xxx",
    "bk_token":"xxx",
    "monitor_target": "3",
    "source_info": "{\"count_freq\":60,\"dimensions\":[\"ip\",\"plat_id\",\"company_id\"],\"aggregator\":\"max\",\"monitor_field\":\"load5\",\"unit_conversion\":1.0,\"monitor_result_table_id\":\"2_system_load\",\"unit\":\"\"}",
    "monitor_level": 2,
    "title": "5分钟平均负载",
    "alarm_cleaning_id": 0,
    "src_type": "JA",
    "alarm_notice_id": 628,
    "description": "5分钟平均负载测试新增",
    "alarm_type": "cpu",
    "alarm_attr_id": "506",
    "alarm_collect_id": 1,
    "alarm_solution_id": 0,
    "condition": "[[]]",
    "biz_id": 2,
    "scenario": "performance",
    "timeout": 40
}
```

### 返回结果示例

```
{
    "message": "OK",
    "code": "0",
    "data": {
        "update_user": "",
        "create_user": "",
        "create_time": "2019-03-11 10:55:49+0800",
        "monitor_target": "3",
        "id": 620,
        "source_info": "{\"count_freq\":60,\"dimensions\":[\"ip\",\"plat_id\",\"company_id\"],\"aggregator\":\"max\",\"monitor_field\":\"load5\",\"unit_conversion\":1.0,\"monitor_result_table_id\":\"2_system_load\",\"unit\":\"\"}",
        "monitor_level": 2,
        "title": "5分钟平均负载",
        "alarm_cleaning_id": 0,
        "src_type": "JA",
        "alarm_notice_id": 628,
        "is_enabled": true,
        "update_time": "2019-03-11 10:55:49+0800",
        "description": "5分钟平均负载测试新增",
        "alarm_type": "cpu",
        "alarm_attr_id": "506",
        "alarm_collect_id": 1,
        "alarm_solution_id": 0,
        "condition": "[[]]",
        "bk_biz_id": 2,
        "is_deleted": false,
        "scenario": "performance",
        "timeout": 40
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

| 字段              | 类型   | 描述                          |
| :---------------- | ------ | ----------------------------- |
| id                | int    | 告警源id                      |
| bk_biz_id         | int    | 业务id                        |
| title             | string | 标题                          |
| description       | string | 描述                          |
| scr_type          | string | 监控源分类                    |
| scenario          | string | 监控场景                      |
| monitor_target    | string | 监控指标                      |
| source_info       | string | 告警来源信息                  |
| monitor_level     | int    | 监控等级，1致命，2预警，3提醒 |
| alarm_cleaning_id | int    | 清洗策略id                    |
| alarm_notice_id   | int    | 通知策略id                    |
| alarm_attr_id     | int    | 监控源id                      |
| alarm_collect_id  | int    | 汇总策略id                    |
| alarm_solution_id | int    | 处理策略id                    |
| condition         | string | 告警范围                      |
| timeout           | int    | 超时时间                      |
| alarm_type        | string | 告警分类                      |
| create_user       | string | 创建人                        |
| update_user       | string | 最后修改人                    |
| create_time       | time   | 创建时间                      |
| update_time       | time   | 最后修改时间                  |
| is_deleted        | bool   | 是否删除                      |
| is_enabled        | bool   | 是否启用                      |

##### data.source_info

| 字段                    | 类型   | 描述                                 |
| ----------------------- | ------ | ------------------------------------ |
| count_freq              | int    | 监控源数据统计周期                   |
| dimensions              | list   | 监控源数据维度字段名                 |
| aggregator              | string | 监控源数据统计方式                   |
| monitor_field           | string | 监控值字段                           |
| unit_conversion         | float  | 监控字段单位转换方式                 |
| monitor_result_table_id | string | 监控结果表id，由业务id和结果表名组成 |
| unit                    | string | 监控字段单位                         |

