### 请求地址

/v2/gsekit/api/config_template/config_template_list/

### 请求方式

GET

### 功能描述

获取配置模板列表

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      | 类型 | 必选 | 描述                          |
| --------- | ---- | ---- | ----------------------------- |
| bk_biz_id | int  | 是   | 业务ID                        |
| page  | int  | 否   | 页数，默认为1                |
| pagesize      | int  | 否   | 每页数量，最大为1000，默认为10 |

### 请求参数示例

``` json
{
    "bk_app_code": "xxxx",
    "bk_app_secret": "xxx",
    "bk_username": "admin",
    "bk_biz_id": 2,
    "page": 1,
    "pagesize": 10
}
```

### 返回结果示例

```json
{
  "result": true,
  "data": {
    "count": 1,
    "list": [
      {
        "config_template_id": 1,
        "created_at": "2020-12-03 09:51:26+0800",
        "created_by": "admin",
        "updated_at": "2020-12-03 09:51:26+0800",
        "updated_by": "admin",
        "bk_biz_id": 3,
        "template_name": "template_name",
        "file_name": "file_name",
        "abs_path": "/tmp",
        "owner": "root",
        "group": "root",
        "filemode": "0775",
        "line_separator": "LF",
        "is_bound": true,
        "permission": {
          "edit_config_template": true,
          "delete_config_template": true
        }
      }
    ]
  },
  "code": 0,
  "message": ""
}
```

### 返回结果参数说明

| 字段    | 类型   | 描述                              |
| ------- | ------ | --------------------------------- |
| result  | bool   | 返回结果，true为成功，false为失败 |
| code    | int    | 返回码，0表示成功，其他值表示失败 |
| message | string | 返回信息                          |
| data    | dict   | 详细结果，详见data定义            |

