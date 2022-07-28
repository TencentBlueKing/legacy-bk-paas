### Functional description

Log Query

### Request Parameters


| Field      |  Type     | Required   |  Description      |
|-----------|------------|--------|------------|
| indices         |  string    | Yes     | index list |
| scenario_id         |  string    | No    | access scenario (optional) The default is log. native ES:es, log collection:log |
| storage_cluster_id  |  int   | No     | when scenario_id is es or log, it needs to be passed in |
| time_field  |  string   | No     | Time field (not required), if a time range is passed in, you need to specify a time field)|
| start_time  |  string   | No     | start time |
| end_time  |  string   | No     | end time |
| time_range  |  string  | No     | time identifier["15m", "30m", "1h", "4h", "12h", "1d", "customized"](optional, default 15m)|
| query_string  |  string   | No     | search statement query_string (optional, default is *) |
| filter  |  list   | No     | filter conditions (not required, the default is no filter, the default operator is 'is'). supports 'is', 'is one of', 'is not', 'is not one of' |
| start  |  int   | No     | start position (optional, similar to array slice, default is 0) |
| size  |  int   | No     | number of items (optional, control the number of returned items) |
| aggs  |  dict   | No     | aggregate parameters for ES |
| highlight  |  dict   | No     | highlight parameters |


### Request Parameters Example

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

### Response Parameters

| Field    | Type   | Description         |
| ------- | ------ | ------------ |
| result  | bool   | true or false, indicate success or failure |
| code    | int    | status code |
| message | string | error message returned when result is false     |
| data    | dict   | log content  |
| request_id | string   | esb request id |


### Response "data" fields

|  Field   | Type   | Description         |
| ------- | ------ | ------------ |
| took  | int   | duration |
| timed_out    | bool    | true or false, timeout |
| _shards | dict | shards status     |
| hits    | dict   | raw log content  |


### Response Example

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