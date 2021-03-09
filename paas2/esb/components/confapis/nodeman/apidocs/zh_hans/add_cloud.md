### 请求地址

/api/c/compapi/v2/nodeman/create_cloud/


### 请求方法

POST


### 功能描述

创建云区域

### 请求参数


#### 通用参数

| 字段 | 类型 | 必选 |  描述 |
|-----------|------------|--------|------------|
| bk_app_code  |  string    | 是 | 应用ID     |
| bk_app_secret|  string    | 是 | 安全密钥(应用 TOKEN)，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取 |
| bk_token     |  string    | 否 | 当前用户登录态，bk_token与bk_username必须一个有效，bk_token可以通过Cookie获取 |
| bk_username  |  string    | 否 | 当前用户用户名，应用免登录态验证白名单中的应用，用此字段指定当前用户 |

#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| bk_biz_id   | int    | 是     | 业务id |
| bk_cloud_name   | string    | 是     | 云区域名称，不能与已存在云区域重名 |



### 返回结果示例

```python
{
    "message": "success",
    "code": "OK",
    "data": {
        "id": 211,
        "creator": "",
        "bk_biz_id": "2",
        "bk_supplier_id": "0",
        "bk_cloud_name": "pal12",
        "bk_cloud_id": "40",
        "is_visible": false,
        "hosts": {
            "UNKNOWN": 0,
            "RUNNING": 0,
            "TERMINATED": 0
        },
        "enable_delete": true
    },
    "result": true
}
```