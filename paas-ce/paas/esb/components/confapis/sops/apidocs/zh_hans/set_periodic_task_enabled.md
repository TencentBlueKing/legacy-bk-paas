### 功能描述

设置某个周期任务是否激活

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段          |  类型       | 必选   |  描述             |
|---------------|------------|--------|------------------|
|   task_id    |   string     |   是   |  周期任务ID |
|   bk_biz_id    |   string     |   是   |  任务所属业务ID |
|   enabled    |   bool     |   否   | 该周期任务是否激活，不传则为 false |

### 请求参数示例

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_biz_id": "2",
    "task_id": "8",
    "enabled": false
}
```

### 返回结果示例

```python
{
    "data": {
        "enabled": false
    },
    "result": true
}
```

### 返回结果参数说明

|   名称   |  类型  |           说明             |
| ------------ | ---------- | ------------------------------ |
|  result      |    bool    |      true/false 操作是否成功     |
|  data        |    dict      |      result=true 时成功数据，详细信息请见下面说明     |
|  message        |    string      |      result=false 时错误信息     |

#### data

|   名称   |  类型  |           说明             |
| ------------ | ---------- | ------------------------------ |
|  enabled      |    bool    |      当前周期任务是否已经激活    |
