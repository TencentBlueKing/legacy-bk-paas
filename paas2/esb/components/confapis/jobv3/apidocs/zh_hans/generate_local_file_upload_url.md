### 功能描述

生成本地文件上传URL。

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段                        |  类型      | 必选   |  描述       |
|----------------------------|------------|--------|------------|
| bk_biz_id                  |  long      | 是     | 业务 ID     |
| file_name_list             |  string[]  | 是     | 要上传的文件名列表 |


### 请求参数示例

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_biz_id": 1,
    "file_name_list": [
        "file1.txt",
        "file2.txt"
    ]
}
```

### 返回结果示例

```json
{
    "result": true,
    "code": 0,
    "message": "success",
    "data": {
        "url_map": {
            "file1.txt": {
                "upload_url": "http://bkrepo.com/generic/temporary/upload/bkjob/localupload/1/008f821f-259b-4f62-bd84-1e89d6f05f0d/admin/file1.txt?token=30adf862fdce4b02b909e6a1a1c762c6",
                "path": "1/008f821f-259b-4f62-bd84-1e89d6f05f0d/admin/file1.txt"
            },
            "file2.txt": {
                "upload_url": "http://bkrepo.com/generic/temporary/upload/bkjob/localupload/1/008f821f-259b-4f62-bd84-1e89d6f05f0d/admin/file2.txt?token=30adf862fdce4b02b909e6a1a1c762c6",
                "path": "1/008f821f-259b-4f62-bd84-1e89d6f05f0d/admin/file2.txt"
            }
        }
    }
}
```

### 返回结果参数说明

#### response
| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| result       | bool   | 请求成功与否。true:请求成功；false请求失败 |
| code         | int    | 错误编码。 0表示success，>0表示失败错误 |
| message      | string | 请求失败返回的错误信息|
| data         | object | 请求返回的数据|
| permission   | object | 权限信息|
| request_id   | string | 请求链id|

#### data

| 字段      | 类型      |字段是否一定存在  | 描述      |
|-----------|----------|---------------|---------|
| url_map   | map      |  是           | key:传入的文件名，value:upload_url为带凭据的文件上传地址，path为分发该文件时要传给文件分发接口的路径 |
