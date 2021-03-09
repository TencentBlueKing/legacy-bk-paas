## 修改监控项

### 请求地址

/v2/monitor/models/monitor_source/update/

### 请求方法

POST

### 功能描述

修改监控项数据

### 请求参数

#### 通用参数

| 字段          | 类型   | 必选 | 描述                                                         |
| ------------- | ------ | ---- | ------------------------------------------------------------ |
| bk_app_code   | string | 是   | 应用ID                                                       |
| bk_app_secret | string | 是   | 安全密钥(应用 TOKEN)，可以通过 蓝鲸智云开发者中心 -> 点击应用ID -> 基本信息 获取 |
| bk_token      | string | 否   | 当前用户登录态，bk_token与bk_username必须一个有效，bk_token可以通过Cookie获取 |
| bk_username   | string | 否   | 当前用户用户名，应用免登录态验证白名单中的应用，用此字段指定当前用户 |

#### 接口参数

| 字段             | 类型   | 必选 | 描述                       |
| ---------------- | ------ | ---- | -------------------------- |
| id               | int    | 是   | 监控源id                   |
| biz_id           | int    | 否   | 业务id                     |
| title            | string | 否   | 标题                       |
| description      | string | 否   | 描述，默认为""             |
| scr_type         | string | 否   | 监控源分类，默认为"JA"     |
| scenario         | string | 否   | 监控场景，默认为"custom"   |
| monitor_type     | string | 否   | 监控分类，默认为"online"   |
| monitor_target   | string | 否   | 监控指标，默认为"custom"   |
| stat_source_type | string | 否   | 统计源分类，默认为"BKDATA" |
| stat_source_info | string | 否   | 统计源信息(JSON)，默认为"" |

### 请求参数示例

```
{
    "bk_app_code":"esb_test",
    "bk_app_secret":"xxx",
    "bk_token":"xxx",
    "id": 514,
    "description": "test_edit"
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
        "update_time": "2019-03-11 11:57:36+0800",
        "update_user": "",
        "description": "test_edit",
        "scenario": "performance",
        "title": "5分钟平均负载",
        "stat_source_info": "{\"count_freq\":60,\"dimensions\":[\"ip\",\"plat_id\",\"company_id\"],\"aggregator\":\"max\",\"monitor_field\":\"load5\",\"unit_conversion\":1.0,\"monitor_result_table_id\":\"2_system_load\",\"unit\":\"\"}",
        "monitor_type": "cpu",
        "create_user": "",
        "create_time": "2019-03-11 11:54:42+0800",
        "monitor_target": "3",
        "src_type": "BKMONITOR",
        "is_deleted": false,
        "id": 514,
        "stat_source_type": "TSDATA"
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

| 字段             | 类型   | 描述             |
| ---------------- | ------ | ---------------- |
| id               | int    | 监控项id         |
| bk_biz_id        | int    | 业务id           |
| title            | string | 标题             |
| description      | string | 描述             |
| scr_type         | string | 监控源分类       |
| scenario         | string | 监控场景         |
| monitor_type     | string | 监控分类         |
| monitor_target   | string | 监控指标         |
| stat_source_type | string | 统计源分类       |
| stat_source_info | string | 统计源信息(JSON) |
| create_user      | string | 创建人           |
| update_user      | string | 最后修改人       |
| create_time      | time   | 创建时间         |
| update_time      | time   | 最后修改时间     |
| is_deleted       | bool   | 是否删除         |
| is_enabled       | bool   | 是否启用         |

##### data.stat_source_info

| 字段                    | 类型   | 描述                                 |
| ----------------------- | ------ | ------------------------------------ |
| count_freq              | int    | 监控源数据统计周期                   |
| dimensions              | list   | 监控源数据维度字段名                 |
| aggregator              | string | 监控源数据统计方式                   |
| monitor_field           | string | 监控值字段                           |
| unit_conversion         | float  | 监控字段单位转换方式                 |
| monitor_result_table_id | string | 监控结果表id，由业务id和结果表名组成 |
| unit                    | string | 监控字段单位                         |

