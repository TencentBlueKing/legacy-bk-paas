### 功能描述

获取所有transfer集群信息

### 请求参数

{{ common_args_desc }}

#### 接口参数

无请求参数

#### 请求示例

```json
{
    "bk_app_code": "xxx",
  	"bk_app_secret": "xxxxx",
  	"bk_token": "xxxx",
}
```

### 返回结果

| 字段       | 类型   | 描述         |
| ---------- | ------ | ------------ |
| result     | bool   | 请求是否成功 |
| code       | int    | 返回的状态码 |
| message    | string | 描述信息     |
| data       | dict   | 数据         |
| request_id | string | 请求ID       |

#### data字段说明

| 字段       | 类型   | 描述           |
| ---------- | ------ | -------------- |
| cluster_id | string | transfer集群ID |

#### 结果示例

```json
{
    "message": "OK",
    "code": 200,
    "data": [
        {
            "cluster_id": "default"
        },
        {
            "cluster_id": "bkmonitorv3-na"
        }
    ],
    "result": true,
    "request_id": "408233306947415bb1772a86b9536867"
}
```
