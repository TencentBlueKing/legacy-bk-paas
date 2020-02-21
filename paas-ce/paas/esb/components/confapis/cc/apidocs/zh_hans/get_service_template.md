### 功能描述

获取服务模板

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段                 |  类型      | 必选	   |  描述                 |
|----------------------|------------|--------|-----------------------|
| bk_supplier_account  | string     |是     | 开发商ID       |


#### metadata 字段说明

| 字段|类型|说明|Description|
|---|---|---|---|
|lable|object|标签，支持"bk_biz_id"|metadata|


### 返回结果示例

```python
{
  "result": true,
  "code": 0,
  "message": "success",
  "data": {
    "metadata": {
      "label": {
        "bk_biz_id": "2"
      }
    },
    "id": 50,
    "name": "t1",
    "service_category_id": 2,
    "creator": "admin",
    "modifier": "admin",
    "create_time": "2019-06-19T15:18:17.223+08:00",
    "last_time": "2019-06-19T15:18:17.223+08:00",
    "bk_supplier_account": "0"
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

| 字段|类型|说明|Description|
|---|---|---|---|
|id|integer|服务模板ID||
|name|array|服务模板名称||
|service_category_id|integer|服务分类ID||
