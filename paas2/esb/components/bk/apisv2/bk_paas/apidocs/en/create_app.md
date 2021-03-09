### Functional description

create application

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| bk_light_app_name |  string  | Yes     | light application name |
| app_url           |  string  | Yes     | application url |
| developer         |  string  | Yes     | developer, use `;` to split multiple developers |
| app_tag           |  string  | No     | application category, options: OpsTools / MonitorAlarm / ConfManage / DevTools / EnterpriseIT/ OfficeApp / Other |
| introduction      |  string  | No     | application introduction |
| width             |  int     | No     | width of application in console |
| height            |  int     | No     | 应用在桌面打开窗口高度 |

### Request Parameters Example

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

### Return Result Example

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
