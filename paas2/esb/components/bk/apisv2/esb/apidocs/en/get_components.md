### Functional description

Get the list of components for the specified system

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field          |  Type       | Required   |  Description             |
|---------------|------------|--------|------------------|
|   system_names   |   array     |   YES   |  System name, Available through the component get_systems.|

### Request Parameters Example

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "system_names": ["BK_LOGIN", "XXXX"]
}
```

### Return Result Example

```python
{
    "result": true,
    "code": 0,
    "data": [
        {
            "name": "get_all_users",
            "label": "get all users",
            "version": "v2",
            "method": "GET",
            "path": "/api/c/compapi/v2/bk_login/get_all_users/",
            "type": 2,
            "system_id": 1,
            "system_name": "BK_LOGIN",
            "category": "component"
        },
        {
            "name": "get_api_check_component_exist",
            "label": "check_component_exist",
            "version": "",
            "method": "GET",
            "path": "/api/c/self-service-api/api/check_component_exist/",
            "type": 2,
            "system_id": 6,
            "system_name": "XXXX",
            "category": "buffet_component"
        }
    ],
    "message": ""
}
```

### Return Result Description

| Field      | Type      | Description      |
|-----------|----------|-----------|
|  result   |    bool    |      return result, true for success, false for failure  |
|  code     |    int     |      return code, 0 for success, other values for failure |
|  message  |    string  |      error message |
|  data     |    array   |      result data, details are described below  |

#### data

| Field        | Type      | Description      |
| ------------ | ---------- | ------------------------------ |
|  method      |    string  |    suggest request method   |
|  version     |    string  |    component version   |
|  system_id   |    int     |    System id   |
|  name        |    string  |    component name   |
|  path        |    string  |    component Third-party system path   |
|  type        |    int     |    1 query, 2 operate   |
|  label       |    string  |    component label   |
|  category    |    string  |    component category, component or buffet_component   |
