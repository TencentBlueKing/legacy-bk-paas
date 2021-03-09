### 功能描述

编辑轻应用

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| bk_light_app_code |  string  | 是     | 轻应用的 ID |
| bk_light_app_name |  string  | 否     | 轻应用名称 |
| app_url           |  string  | 否     | 应用链接 |
| developer         |  string  | 否     | 应用开发者用户名，多个以分号&#39;;&#39;分隔 |
| app_tag           |  string  | 否     | 应用分类 |
| introduction      |  string  | 否     | 应用的简介 |
| width             |  int     | 否     | 应用在桌面打开窗口宽度 |
| height            |  int     | 否     | 应用在桌面打开窗口高度 |

### 请求参数示例

```python
{
    "bk_app_code": "gcloud",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_light_app_code": "gcloud_fdfh2kl0k",
    "bk_light_app_name": "轻应用测试",
    "app_url": "http://test.bking.com/o/gcloud/xxx/",
    "developer": "test1;test2",
    "introduction": "introduction",
    "width": 1024,
    "height": 768
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
