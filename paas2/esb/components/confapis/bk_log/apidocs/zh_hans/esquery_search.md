### 功能描述

日志查询接口

### 请求参数

#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| indices         |  string    | 是     | 索引列表 |
| scenario_id         |  string    | 否     | ES接入场景(非必填） 默认为log，原生ES：es 日志采集：log |
| storage_cluster_id  |  int   | 否     | 当scenario_id为es或log时候需要传入 |
| time_field  |  string   | 否     | 时间字段（非必填，bkdata内部为dtEventTimeStamp，外部如果传入时间范围需要指定时间字段） |
| start_time  |  string   | 否     | 开始时间 |
| end_time  |  string   | 否     | 结束时间 |
| time_range  |  string  | 否     | 时间标识符符["15m", "30m", "1h", "4h", "12h", "1d", "customized"]（非必填，默认15m） |
| query_string  |  string   | 否     | 搜索语句query_string(非必填，默认为*) |
| filter  |  list   | 否     | 搜索过滤条件（非必填，默认为没有过滤，默认的操作符是is） 操作符支持 is、is one of、is not、is not one of |
| start  |  int   | 否     | 起始位置（非必填，类似数组切片，默认为0） |
| size  |  int   | 否     | 条数（非必填，控制返回条目） |
| aggs  |  dict   | 否     | ES的聚合参数 |
| highlight  |  dict   | 否     | 高亮参数 |


### 请求参数示例

```json
{
    "bk_app_code": "replace_me_with_bk_app_code",
    "bk_app_secret": "replace_me_with_bk_app_secret",
    "bk_username": "replace_me_with_bk_username",

    "indices": "2_bklog.bk_log_search_api",
    "scenario_id": "log",
    "storage_cluster_id": 3,
    "use_time_range": true,
    "time_range": "customized",
    "time_field": "dtEventTimeStamp",
    "start_time": "2022-03-14 18:26:33",
    "end_time": "2022-03-14 18:41:33",
    "query_string": "*",
    "filter": [],
    "sort_list": [
        [
            "dtEventTimeStamp",
            "desc"
        ],
        [
            "gseIndex",
            "desc"
        ],
        [
            "iterationIndex",
            "desc"
        ]
    ],
    "start": 0,
    "size": 1,
    "aggs": {},
    "highlight": {
        "pre_tags": [
            "<mark>"
        ],
        "post_tags": [
            "</mark>"
        ],
        "fields": {
            "*": {
                "number_of_fragments": 0
            }
        },
        "require_field_match": false
    }
}
```

### 响应参数

| 字段    | 类型   | 描述         |
| ------- | ------ | ------------ |
| result  | bool   | 请求是否成功 |
| code    | int    | 返回的状态码 |
| message | string | 描述信息     |
| data    | dict   | 返回日志内容  |
| request_id | string   | 请求ID |


### 返回日志内容字段
| 字段    | 类型   | 描述         |
| ------- | ------ | ------------ |
| took  | int   | 耗时 |
| timed_out    | bool    | 是否超时 |
| _shards | dict | shards请求状态     |
| hits    | dict   | ES中原始日志内容  |


### 返回结果示例

```json
{
    "result": true,
    "data": {
        "took": 17,
        "timed_out": false,
        "_shards": {
            "total": 3,
            "successful": 3,
            "skipped": 0,
            "failed": 0
        },
        "hits": {
            "total": 13606,
            "max_score": null,
            "hits": [
                {
                    "_index": "v2_2_bklog_bk_log_search_api_20220310_0",
                    "_type": "_doc",
                    "_id": "1603fe2e851dd02b76cff2681052e0da",
                    "_score": null,
                    "_source": {
                        "cloudId": 0,
                        "dtEventTimeStamp": "1647254492000",
                        "gseIndex": 41041,
                        "iterationIndex": 9,
                        "log": "i am log message",
                        "path": "/host/path/log/type.log",
                        "serverIp": "127.0.0.1",
                        "time": "1647254492000"
                    },
                }
            ]
        }
    },
    "code": 0,
    "message": "",
    "request_id": "ce9d1b034d9a423cb736af285041b978"
}
```