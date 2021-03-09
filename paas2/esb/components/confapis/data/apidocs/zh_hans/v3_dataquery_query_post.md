### 功能描述

查询数据接口

### 请求参数

{{ common_args_desc }}


#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| bkdata_authentication_method  |  string   | 是     | 数据平台授权方式，默认 Token |
| bkdata_data_token  |  string   | 是     | 数据平台授权码，请在数据平台页面上进行申请 |
| sql         |  string    | 是     | 查询sql |
| prefer_storage  |  string   | 否     | 查询存储 |
| bkdata_authentication_method  |  string   | 是     | 认证方式，默认 Token |


### 请求参数示例

```python
{
    "bk_app_code": "your_app_code",
    "bk_app_secret": "your_app_secret",
    "bk_token": "xxxxxx",

    "bkdata_authentication_method": "token",
    "bkdata_data_token":"your_data_token",
    "sql":"select dteventtimestamp as ts,count from 477_ja_set_login where thedate=20160920 AND cc_set='4005' AND biz_id='477' limit 1",
    "prefer_storage":""
}
```

如果prefer_storage是ES，sql采用ES DSL的方式, 可参照http://elasticsearch-dsl.readthedocs.io/en/latest/. 
请求参数：
```python
{
    "bk_app_code": "your_app_code",
    "bk_app_secret": "your_app_secret",
    "bk_token": "xxxxxx",

    "bkdata_authentication_method": "token",
    "bkdata_data_token":"your_data_token",
    "sql": "{\"body\": {\"query\": {\"bool\": {\"must\": {\"match\": {\"operator\": {\"query\": \"\\u4e2d\\u56fd\\u8054\\u901a\", \"type\": \"phrase\"}}}}}, \"from\": 0, \"size\": 1},  \"index\":  \"706_PVPBattle_Summary_offline_*\"}",
    "prefer_storage": "es"
}
```

### 返回结果示例

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

### 返回结果参数说明

#### data

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| totalRecords     | int       | 查询记录数 |
| select_fields_order      | array     | 查询字段 |
| list      | array     | 查询结果 |
| timetaken      | double     | 查询耗时(秒) |
