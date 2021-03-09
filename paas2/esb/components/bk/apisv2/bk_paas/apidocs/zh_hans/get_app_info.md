### 功能描述

获取应用信息，支持批量获取

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| target_app_code |  string    | 否     | target_app_code 表示应用 ID，多个 ID 以英文分号分隔，target_app_code 为空则表示所有应用 |
| fields          |  string    | 否     | fields 需要返回的字段，多个字段以英文分号分割，如果不传或传入 &#34;&#34;，则返回应用的 bk_app_code、bk_app_name 字段。可选的字段有：bk_app_code（应用ID），bk_app_name（应用名），introduction（应用简介），creator（创建者），developer（开发人员） |

### 请求参数示例

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "target_app_code": "bk_test;esb_test",
}
```
### 返回结果示例
```python
{
    "result": true,
    "code": 0,
    "message": "",
    "data": [
        {
            "bk_app_code": "bk_test",
            "bk_app_name": "BKTest"
        },
        {
            "bk_app_code": "esb_test",
            "bk_app_name": "ESBTest"
        }
    ]
}
```
