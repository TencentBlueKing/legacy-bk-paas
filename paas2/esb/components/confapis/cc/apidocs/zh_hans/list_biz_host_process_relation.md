### 功能描述

查询业务下的主机和进程信息

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段                  |  类型      | 必选	   |  描述                  |
|----------------------|------------|--------|-----------------------|
| bk_biz_id            | int        | 是     | 业务ID                 |
| bk_host_ids          | int array  | 否     | 主机ID                 |
| page                 | object     | 是     | 分页参数                |

#### page
| 字段   | 类型   | 必选 | 描述                    |
| ----- | ------ | --- | ---------------------- |
| start | int    | 是   | 记录开始位置             |
| limit | int    | 是   | 每页限制条数,最大值为1000 |
| sort  | string | 否   | 排序字段,'-'代表倒序      |

### 请求参数示例

```json
{
    "bk_biz_id": 2,
    "page": {
        "start": 0,
        "limit": 1,
        "sort": "-bk_host_id"
    },
    "bk_host_ids": [
        11,
        12
    ]
}
```

### 返回结果示例

```json
{
    "result": true,
    "code": 0,
    "message": "success",
    "permission": null,
    "data": {
        "count": 1,
        "info": [
            {
                "bk_biz_id": 2,
                "bk_host_id": 11,
                "bk_process_id": 43,
                "port": "81",
                "bind_ip": "127.0.0.1",
                "protocol": "1"
            }
        ]
    }
}
```

### 返回结果参数说明

#### response

| 名称     | 类型    | 描述                                  |
| ------- | ------ | ------------------------------------- |
| result  | bool   | 请求成功与否。true:请求成功；false请求失败 |
| code    | int    | 错误编码。 0表示success，>0表示失败错误   |
| message | string | 请求失败返回的错误信息                   |
| data    | object | 请求返回的数据                          |

#### data 字段说明

| 字段   | 类型    | 说明     | 
| ----- | ------- | ------- | 
| count | integer | 总数    | 
| info  | array   | 返回结果 |

#### info 字段说明

| 字段           | 类型   | 说明                           |
| ------------- | ------ | ----------------------------- |
| bk_biz_id     | int    | 业务ID                         |
| bk_host_id    | int    | 主机ID                         |
| bk_process_id | int    | 进程ID                         |
| port          | string | 进程绑定端口                    |
| bind_ip       | string | 进程绑定ip                      |
| protocol      | string | 进程绑定协议, "1"为TCP, "2"为UDP |