### Functional description

import common flow template

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field          |  Type       | Required   |  Description             |
| ------------ | ------------ | ------ | ---------------- |
|   template_data    |   string     |   YES   |  flow data, the content of file which download from bk-sops - common templates - export |
|   override        | bool     | NO         | whether to override flows which has same ID           |           |

### Request Parameters Example

```
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "template_data": "xxx",
    "override": true,
}
```

### Return Result Example

```
{
    "message": "Successfully imported 2 common flows",
    "data": {
        "count": 2
    },
    "result": true
}
```

### Return Result Description

| Field      | Type      | Description      |
| ------------  | ---------- | ------------------------------ |
|  result   |    bool    |      true or false, indicate success or failure   |
|  message  |    string  |      error message returned when result is false  |
|  data         | dict        |    return data                |

#### data

| Field      | Type      | Description      |
| ------------ | ---------- | ------------------------------ |
|  count      |    int    |       the number of flows had been imported    |
