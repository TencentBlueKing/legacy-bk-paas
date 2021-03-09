### 功能描述

日志查询接口

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| indices         |  string    | 是     | 索引列表 |
| scenario_id         |  string    | 否     | ES接入场景(非必填） 默认为log，蓝鲸数据平台：bkdata 原生ES：es 日志采集：log |
| storage_cluster_id  |  int   | 否     | 当scenario_id为es或log时候需要传入 |
| time_field  |  string   | 否     | 时间字段（非必填，bkdata内部为dtEventTimeStamp，外部如果传入时间范围需要指定时间字段） |
| start_time  |  string   | 否     | 开始时间 |
| end_time  |  string   | 否     | 结束时间 |
| time_range  |  string  | 否     | 时间标识符符["15m", "30m", "1h", "4h", "12h", "1d", "customized"]（非必填，默认15m） |
| query_string  |  string   | 否     | 搜索语句query_string(非必填，默认为*) |
| filter  |  list   | 否     | 搜索过滤条件（非必填，默认为没有过滤，默认的操作符是is） 操作符支持 is、is one of、is not、is not one of |
| start  |  int   | 否     | 起始位置（非必填，类似数组切片，默认为0） |
| size  |  int   | 否     | 条数（非必填，控制返回条目，默认为500） |
| aggs  |  dict   | 否     | ES的聚合参数 |
| highlight  |  dict   | 否     | 高亮参数 |


### 请求参数示例

```json
{
    "indices": "index_a,index_b,",
    "scenario_id": "bkdata",
    "start_time": "2019-06-11 00:00:00",
    "end_time": "2019-06-12 11:11:11",
    "time_range": "customized",
    "keyword": "error",
    "filter": [
        {
            "field": "ip",
            "operator": "is",
            "value": "127.0.0.1"
        }
    ],
    "sort_list": [
        ["field_a", "desc"],
        ["field_b", "asc"]
    ],
    "start": 0,
    "size": 15,
    "aggs": {
        "docs_per_minute": {
            "date_histogram": {
                "field": "dtEventTimeStamp",
                "interval": "1m",
                "time_zone": "+08: 00"
            }
        },
        "top_ip": {
            "terms": {
                "field": "ip",
                "size": 5
            }
        }
    },
    "highlight": {
        "pre_tags": [
            "<mark>"
        ],
        "post_tags": [
            "</mark>"
        ],
        "fields": {
            "*": {
            }
        },
        "require_field_match": false
    }
}
```

### 返回结果示例

```json
{
    "result": true,
    "message": "查询成功",
    "data": {
        "hits": {
            "hits": [
                {
                    "_score": 2,
                    "_type": "xx",
                    "_id": "xxx",
                    "_source": {
                        "dtEventTimeStamp": 1565453112000,
                        "report_time": "2019-08-11 00:05:12",
                        "log": "xxxxxx",
                        "ip": "127.0.0.1",
                        "gseindex": 5857918,
                        "_iteration_idx": 3,
                        "path": "xxxxx"
                    },
                    "_index": "xxxxxxxx"
                },
                {
                    "_score": 2,
                    "_type": "xxxx",
                    "_id": "xxxxx",
                    "_source": {
                        "dtEventTimeStamp": 1565453113000,
                        "report_time": "2019-08-11 00:05:13",
                        "log": "xxxxxxx",
                        "ip": "127.0.0.1",
                        "gseindex": 5857921,
                        "_iteration_idx": 2,
                        "path": "xxxxxxxxx"
                    },
                    "_index": "xxxxxxx"
                }
            ],
            "total": 8429903,
            "max_score": 2
        },
        "_shards": {
            "successful": 9,
            "failed": 0,
            "total": 9
        },
        "took": 136,
        "timed_out": false
    },
    "code": 0
}
```
