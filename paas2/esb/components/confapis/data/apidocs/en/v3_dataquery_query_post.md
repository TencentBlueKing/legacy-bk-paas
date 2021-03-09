### Functional description

the interface to get data from data platform

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| bkdata_authentication_method  |  string   | YES    | BKData authentication method, default Token |
| bkdata_data_token  |  string   | YES     | BKData authentication token, apply for it on BKData platform please |
| sql         |  string    | YES     | query sql |
| prefer_storage  |  string   | NO     | the storage to query |


### Request Parameters Example

```python
{
    "bk_app_code": "your_app_code",
    "bk_app_secret": "your_app_secret",
    "bk_token": "xxxxxx",

    "bkdata_authentication_method": "token",
    "bkdata_data_token":"your_data_token",
    "sql":"select dteventtimestamp as ts,count from 477_ja_set_login where thedate=20160920 AND cc_set='4005' AND biz_id='477' limit 1"
}


if prefer_storage is es, the request parameters:
{
    "bk_app_code": "your_app_code",
    "bk_app_secret": "your_app_secret",
    "bk_token": "xxxxxx",

    "bkdata_authentication_method": "token",
    "bkdata_data_token":"your_data_token",
    "sql": "{\"body\": {\"query\": {\"bool\": {\"must\": {\"match\": {\"operator\": {\"query\": \"\\u4e2d\\u56fd\\u8054\\u901a\", \"type\": \"phrase\"}}}}}, \"from\": 0, \"size\": 1},  \"index\":  \"706_PVPBattle_Summary_offline_*\"}",
    "prefer_storage": "es"
}
sql use ES DSL, reference: http://elasticsearch-dsl.readthedocs.io/en/latest/.
```

### Return Result Example

```python
{
  "code": "00",
  "data": {
    "totalRecords": 168,
    "select_fields_order": [
      "ts",
      "count"
    ],
    "list": [
      {
        "count": "1",
        "ts": "1474321680000"
      }
    ],
    "timetaken": 6.015
  },
  "result": true
}
```

### Return Result Parameters Description

#### data

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| totalRecords     | int       | total records |
| select_fields_order      | array     | queryed field |
| list      | array     | queryed result |
| timetaken      | double     | queryed time(second) |
