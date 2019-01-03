### 功能描述

新加主机锁，如果主机已经加过锁，同样提示加锁成功

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
   "ip_list":["127.0.0.1"],
   "bk_cloud_id":0
}
```

### 返回结果示例

```python

{
    "result": true,
    "bk_error_code": 0,
    "bk_error_msg": "success",
    "data": null
}
```
