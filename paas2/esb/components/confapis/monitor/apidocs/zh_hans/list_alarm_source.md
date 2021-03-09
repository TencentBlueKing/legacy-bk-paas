## 批量查询告警源

### 请求地址

/v2/monitor/models/alarm_source/search

### 请求方法

GET

### 功能描述

批量查询告警源数据

### 请求参数

#### 通用参数

| 字段          | 类型   | 必选 | 描述                                                         |
| ------------- | ------ | ---- | ------------------------------------------------------------ |
| bk_app_code   | string | 是   | 应用ID                                                       |
| bk_app_secret | string | 是   | 安全密钥(应用 TOKEN)，可以通过 蓝鲸智云开发者中心 -> 点击应用ID -> 基本信息 获取 |
| bk_token      | string | 否   | 当前用户登录态，bk_token与bk_username必须一个有效，bk_token可以通过Cookie获取 |
| bk_username   | string | 否   | 当前用户用户名，应用免登录态验证白名单中的应用，用此字段指定当前用户 |

#### 接口参数

| 字段              | 类型   | 描述                          |
| :---------------- | ------ | ----------------------------- |
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
| alarm_attr_id     | int    | 监控项id                      |
| alarm_collect_id  | int    | 汇总策略id                    |
| alarm_solution_id | int    | 处理策略id                    |
| condition         | string | 告警范围                      |
| timeout           | int    | 超时时间                      |
| alarm_type        | string | 告警分类                      |
| create_user       | string | 创建人                        |
| update_user       | string | 最后修改人                    |
| is_enabled        | bool   | 是否启用                      |

### 请求参数示例

```
{
    "bk_app_code":"esb_test",
    "bk_app_secret":"xxx",
    "bk_token":"xxx",
    "monitor_target": "task_duration"
}
```

### 返回结果示例

```
{
    "message": "OK",
    "code": "0",
    "data": [
        {
            "update_user": "admin",
            "create_user": "admin",
            "create_time": "2019-03-07 03:51:28+0800",
            "monitor_target": "task_duration",
            "id": 616,
            "source_info": "{\"count_freq\":60,\"dimensions\":[\"task_id\",\"url\"],\"aggregator\":\"avg\",\"monitor_field\":\"task_duration\",\"unit_conversion\":1.0,\"where_sql\":\" ((task_id='103'))\",\"monitor_result_table_id\":\"2_uptimecheck_http\",\"unit\":\"ms\"}",
            "monitor_level": 2,
            "title": "testQQ_响应时间",
            "alarm_cleaning_id": 0,
            "src_type": "JA",
            "alarm_notice_id": 646,
            "is_enabled": true,
            "update_time": "2019-03-07 03:52:13+0800",
            "description": "testQQ_响应时间",
            "alarm_type": "uptimecheck",
            "alarm_attr_id": "510",
            "alarm_collect_id": 1,
            "alarm_solution_id": 0,
            "condition": "[[]]",
            "bk_biz_id": 2,
            "is_deleted": false,
            "scenario": "uptimecheck",
            "timeout": 40
        },
        {
            "update_user": "admin",
            "create_user": "admin",
            "create_time": "2019-03-08 06:48:50+0800",
            "monitor_target": "task_duration",
            "id": 618,
            "source_info": "{\"count_freq\":60,\"dimensions\":[\"task_id\",\"url\"],\"aggregator\":\"avg\",\"monitor_field\":\"task_duration\",\"unit_conversion\":1.0,\"where_sql\":\" ((task_id='104'))\",\"monitor_result_table_id\":\"2_uptimecheck_http\",\"unit\":\"ms\"}",
            "monitor_level": 2,
            "title": "导入测试2_响应时间",
            "alarm_cleaning_id": 0,
            "src_type": "JA",
            "alarm_notice_id": 648,
            "is_enabled": true,
            "update_time": "2019-03-08 07:51:45+0800",
            "description": "导入测试2_响应时间",
            "alarm_type": "uptimecheck",
            "alarm_attr_id": "512",
            "alarm_collect_id": 1,
            "alarm_solution_id": 0,
            "condition": "[[]]",
            "bk_biz_id": 2,
            "is_deleted": false,
            "scenario": "uptimecheck",
            "timeout": 40
        }
    ],
    "result": true,
    "_meta": {
        "count": 2,
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
| alarm_attr_id     | int    | 监控项id                      |
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

