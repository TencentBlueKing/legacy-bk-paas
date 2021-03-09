### 功能描述

克隆主机属性

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段        |  类型   | 必选   |  描述                       |
|-------------|---------|--------|-----------------------------|
| bk_org_ip   | string  | 是     | 源主机ip, 只支持传入单ip    |
| bk_dst_ip   | string  | 是     | 目标主机ip, 多个ip用","分割 |
| bk_biz_id   | int     | 是     | 业务ID                      |
| bk_cloud_id | int     | 否     | 云区域ID                    |

### 请求参数示例

```python
{
    "bk_biz_id":2,
    "bk_org_ip":"127.0.0.1",
    "bk_dst_ip":"127.0.0.2",
    "bk_cloud_id":0
}
```


### 返回结果示例

```python

{
    "result": true,
    "code": 0,
    "message": "",
    "data": null
}
```
