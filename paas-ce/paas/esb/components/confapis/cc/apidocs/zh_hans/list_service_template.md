### 功能描述

查询服务模板列表

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段                 |  类型      | 必选	   |  描述                 |
|----------------------|------------|--------|-----------------------|
| bk_supplier_account  | string     |是     | 开发商ID       |
| service_category_id         | int  | 否   | 服务分类ID |


### 请求参数示例

```python
{
  "bk_biz_id": 1,
  "service_category_id": 1,
  "page": {
    "start": 0,
    "limit": 10,
    "sort": "-name"
  }
}
```

### 返回结果示例

```python
{
  "result": true,
  "code": 0,
  "message": "success",
  "permission": null,
  "data": {
    "count": 2,
    "info": [
      {
        "bk_biz_id": 1,
        "id": 51,
        "name": "test3",
        "service_category_id": 1,
        "creator": "admin",
        "modifier": "admin",
        "create_time": "2019-09-18T20:31:34.627+08:00",
        "last_time": "2019-09-18T20:31:34.627+08:00",
        "bk_supplier_account": "0"
      },
      {
	"bk_biz_id": 1,
        "id": 50,
        "name": "test2",
        "service_category_id": 1,
        "creator": "admin",
        "modifier": "admin",
        "create_time": "2019-09-18T20:31:29.607+08:00",
        "last_time": "2019-09-18T20:31:29.607+08:00",
        "bk_supplier_account": "0"
      }
    ]
  }
}
```

### 返回结果参数说明

#### response

| 名称  | 类型  | 描述 |
|---|---|---|
| result | bool | 请求成功与否。true:请求成功；false请求失败 |
| code | int | 错误编码。 0表示success，>0表示失败错误 |
| message | string | 请求失败返回的错误信息 |
| data | object | 请求返回的数据 |

#### data 字段说明

| 字段|类型|说明|描述|
|---|---|---|---|
|count|integer|总数||
|info|array|返回结果||

#### info 字段说明

| 字段|类型|说明|Description|
|---|---|---|---|
|id|integer|服务模板ID||
|name|array|服务模板名称||
|service_category_id|integer|服务分类ID||
