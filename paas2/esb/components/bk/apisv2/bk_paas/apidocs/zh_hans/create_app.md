### 功能描述

创建轻应用

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| bk_light_app_name |  string  | 是     | 轻应用名称 |
| app_url           |  string  | 是     | 应用链接 |
| developer         |  string  | 是     | 应用开发者用户名，多个以分号&#39;;&#39;分隔 |
| app_tag           |  string  | 否     | 应用分类，可选分类： &#34;OpsTools&#34;（运维工具），&#34;MonitorAlarm&#34;（监控告警），&#34;ConfManage&#34;（配置管理），&#34;DevTools&#34;（开发工具），&#34;EnterpriseIT&#34;（企业IT），&#34;OfficeApp&#34;（办公应用），&#34;Other&#34;（其它）。如果传入空参数或不是上诉分类，则使用 &#34;Other&#34; |
| introduction      |  string  | 否     | 应用的简介 |
| width             |  int     | 否     | 应用在桌面打开窗口宽度 |
| height            |  int     | 否     | 应用在桌面打开窗口高度 |

### 请求参数示例

```python
{
    "bk_app_code": "gcloud",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
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
    "data": {
        "bk_light_app_code": "gcloud_fdfh2kl0k"
    }
}
```
