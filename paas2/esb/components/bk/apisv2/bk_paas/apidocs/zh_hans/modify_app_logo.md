### 功能描述

修改轻应用 logo

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| bk_light_app_code |  string  | 是     | 轻应用的 ID |
| logo              |  string  | 是     | png 格式图片文件的 Base64 编码字符串 |

### 请求参数示例

```python
{
    "bk_app_code": "gcloud",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_light_app_code": "gcloud_fdfh2kl0k",
    "logo": "iVBORw0KGgoA......AAABJRU5ErkJggg=="
}
```

### 返回结果示例

```python
{
    "result": true,
    "code": 0,
    "message": "",
    "data": {}
}
```
