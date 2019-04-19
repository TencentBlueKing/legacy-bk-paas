### Functional description

callback specific node

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field          |  Type       | Required   |  Description             |
| ------------ | ------------ | ------ | ---------------- |
|   bk_biz_id    |   string     |   YES   |  the business ID |
|   task_id     |   string   |   YES   |  the task ID     |
|   node_id        | string     | YES         | node id                        |
|   callback_data        | dict     | NO         | callback data          |           |

### Request Parameters Example

```
import requests
kwargs = {
    "app_code": "app_code",
    "app_secret": "app_secret",
    "access_token": "access_token",
    "bk_biz_id": "2",
    "task_id": "10",
    "node_id": "node0df0431f8f553925af01a94854bd",
    "callback_data": {"data": "data"},
}
response = requests.get("http://{stageVariables.domain}/apigw/node_callback/10/2/", kwargs)
result = response.json()
```

### Return Result Example

```
{
    "message": "success",
    "result": true
}
```

### Return Result Description

| Field      | Type      | Description      |
| ------------  | ---------- | ------------------------------ |
|  result   |    bool    |      true or false, indicate success or failure   |
|  message  |    string  |      error message returned when result is false  |
