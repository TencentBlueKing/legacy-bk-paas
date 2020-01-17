### 功能描述

回调指定的节点

### 请求参数

{{ common_args_desc }}

#### 接口参数

|   字段   |    参数类型  |  必须  |     参数说明     |
| ------------ | ------------ | ------ | ---------------- |
|   bk_biz_id    |   string     |   是   |  所属业务ID |
|   task_id     |   string   |   是   |  任务ID     |
|   node_id        | string     | 是         | 节点 ID                        |
|   callback_data        | dict     | 否         | 回调数据           |           |

### 请求参数示例

```
{
    "app_code": "app_code",
    "app_secret": "app_secret",
    "access_token": "access_token",
    "bk_biz_id": "2",
    "task_id": "10",
    "node_id": "node0df0431f8f553925af01a94854bd",
    "callback_data": {"data": "data"}
}
```

### 返回结果示例

```
{
    "message": "success",
    "result": true
}
```

### 返回结果参数说明

|      名称     |     类型   |               说明             |
| ------------  | ---------- | ------------------------------ |
|  result       | bool       | true/false 成功与否            |
|  message      | string     | result=false 时错误信息        |
