

### 功能描述

返回指定组件  
返回指定id的组件实例


{{ common_args_desc }}

#### 接口参数

| 字段   | 类型 | 必选 | 描述 |
|--------|------|------|------|
| id          | int    | ID       |


#### 请求参数
```
{
    "id": 2
}
```

### 返回结果
#### 字段说明

| 字段        | 类型   | 描述     |
| ----------- | ------ | -------- |
| id          | int    | ID       |
| update_time | time   | 更新时间 |
| update_user | string | 更新用户 |
| ip          | string | 实例IP   |
| component   | string | 组件名称 |
| create_user | string | 创建用户 |
| create_time | time   | 创建时间 |
| bk_biz_id      | int    | 业务ID   |
| bk_cloud_id     | int    | 云区域ID |

#### 结果示例
```json
{
    "message":"OK",
    "code":"0",
    "data":{
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
    },
    "result":true,
    "request_id":"0f321b86ff124cc98bc07ced8e96ab74"
}
```
