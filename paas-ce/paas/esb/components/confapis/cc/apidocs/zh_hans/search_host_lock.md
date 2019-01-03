### 功能描述

查询主机锁

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段                |  类型       | 必选   |  描述                            |
|---------------------|-------------|--------|----------------------------------|
|ip_list| string array| 是|无| 主机内网IP|
| bk_cloud_id| int| 否| 0|云区域ID


### 请求参数示例

```python
{
   "ip_list":["127.0.0.1", "127.0.0.2"],
   "bk_cloud_id":0
}
```

### 返回结果示例

```python

{
    "result": true,
    "bk_error_code": 0,
    "bk_error_msg": "success",
    "data": {
        "127.0.0.1": true,
        "127.0.0.2": false
    }
}
```

### 返回结果参数说明

#### data
| 字段      | 类型      | 描述         |
|-----------|-----------|--------------|
| data | map[string]bool | 请求返回的数据, key 是 IP，value 是否上锁 |the data response,Key is the IP, value is locked status|
