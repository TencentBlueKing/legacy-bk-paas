### Functional description

Get job instance global variable value

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| bk_biz_id       |  int       | Yes     | Business ID |
| job_instance_id |  string    | Yes     | Job instance ID |

### Request Parameters Example

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_biz_id": 1,
    "job_instance_id": "100"
}
```

### Return Result Example

```python
{
    "result": true,
    "code": 0,
    "message": "",
    "data": {
        "job_instance_id": 100,
        "job_instance_var_values": [
            {
                "step_instance_id": 292778,
                "step_instance_var_values": [
                    {
                        "name": "aa",
                        "value": "AA",
                        "category": 1,
                        "data_type": 1
                    },
                    {
                        "name": "array1",
                        "value": "([0]="abc")",
                        "category": 1,
                        "data_type": 3
                    }
                ]
            },
            {
                "step_instance_id": 292779,
                "step_instance_var_values": [
                    {
                        "name": "aa",
                        "value": "AAAA",
                        "category": 1,
                        "data_type": 1
                    },
                    {
                        "name": "array1",
                        "value": "([0]="abc" [1]="CBA")",
                        "category": 1,
                        "data_type": 3
                    }
                ]
            }
        ]
    }
}
```

### Return Result Parameters Description

#### data

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| job_instance_id  | int       | Job instance ID |
| setp_instance_id | int       | step instance id |
| name             | string    | global variable name |
| value            | string    | global variable value |
| category         | int       | variable category,1:cloud-variable,2:context-variable,3:ip-variable |
| data_type        | int       | variable data type,1:string,2:ip,3:index array,4:associative array |
