

### 功能描述

批量筛选组件  
根据指定的过滤条件和分页参数来筛选组件列表


{{ common_args_desc }}

#### 接口参数

| 字段      | 类型   | 必选 | 描述     |
| --------- | ------ | ---- | -------- |
| id        | int    |      | ID       |
| ip        | string |      | 实例IP   |
| component | string |      | 组件名称 |
| bk_biz_id    | int    |      | 业务ID   |
| bk_cloud_id   | int    |      | 云区域ID |


#### 请求参数

```
{
    "id": 2
}
```

### 返回结果

#### 字段说明

| 字段 | 类型 | 描述     |
| ---- | ---- | -------- |
| data | list | 组件列表 |

#### 结果示例

```json
{
    "code":"0",
    "_meta":{
        "count":1,
        "previous":null,
        "next":null
    },
    "result":true,
    "request_id":"c9cb1a973dc542508cf057822c8dc2c5",
    "message":"OK",
    "data":[
        {
            "update_time":"2018-11-01 13:35:55+0800",
            "update_user":"admin",
            "ip":"x.x.x.x",
            "component":"jmx",
            "create_user":"admin",
            "create_time":"2018-11-01 13:35:55+0800",
            "bk_biz_id":2,
            "bk_cloud_id":"0",
            "id":2,
            "is_deleted":false,
            "config":"NcYXc9rkryoeorg2+MPAe3iOIc1hDe4KcrIOhsvo\/YqR6on08RJ8ikeUUqmWwG+d1h7lQDxr25jJfzkvr8\/KJPhRpAc0iK\/x9+bt6tTsRKN\/zfOI6K1TOjTUeqcndTI0pwBbKGz9yP\/LvIGtgvtWGA=="
        }
    ]
}
```