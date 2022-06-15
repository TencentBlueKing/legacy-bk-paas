

### Function description

Chart data query
Query the specified storage engine based on the given sql expression

### Request parameters

{{ common_args_desc }}

#### Interface parameters

| Field | Type | Required | Description |
| -------------- | ------ | ---- | ----------- |
| sql | string | yes | SQL query statement |
| prefer_storage | string | no | query engine (default influxdb) |
| bk_username | string | No | App_code of the whitelist is required |

#### Request example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "bk_username":"admin",
    "sql":"select max(in_use) as _in_use from 3_system_disk where time >= \"1m\" group by ip, bk_cloud_id, bk_supplier_id, device_name, minute1 order by time desc limit 1"
}
```

> the resulting table in sql is named biz_id + db_name + table_name
>
> - Biz_id: business id
> - Db_name: database name
> - Table_name: data table name
>
> Example: 2_system_cpu_detail: cpu_detail table of system library under business 2, The sql statement to query the usage of single-core cpu within an hour:
>
> Select Mean(usage) as usage from 2_system_detail where time > '1h' group by ip,device_name,minute1 limit 10

> The result table 3_system_disk in the above request example indicates: the disk table in the system library under business 3

>Note: The above libraries and tables do not correspond to the actual physical libraries and tables in the time series storage. Instead, it refers to the library table of the &#39;Source Data Management Module&#39;

### Return result

| Field | Type | Description |
| ---------- | ------ | ------------------ |
| result | bool | Whether the request was successful |
| code | int | Returned status code |
| message | string | Description |
| data | list | Successfully updated policy id table |
| request_id | string | request id |

#### Data field description

| Field | Type | Description |
| ------------ | ------ | -------- |
| list | list | Query results |
| totalRecords | int | total records |
| timetaken | float | query time |
| device | string | query engine |

#### data.list

The content here is the relevant content of sql search

#### Example results

```json
{
    "message":"OK",
    "code":200,
    "data":{
        "list":[
            {
                "ip":"x.x.x.x",
                "time":1543487700000,
                "bk_supplier_id":"0",
                "device_name":"C:",
                "_in_use":27.0269684761,
                "bk_cloud_id":"0",
                "minute1":1543487700000
            },
            {
                "ip":"x.x.x.x",
                "time":1543487700000,
                "bk_supplier_id":"0",
                "device_name":"\/",
                "_in_use":8.3368418991,
                "bk_cloud_id":"0",
                "minute1":1543487700000
            }
        ],
        "timetaken":0.0059459209,
        "totalRecords": 2,
        "device":"influxdb"
    },
    "result":true,
    "request_id":"408233306947415bb1772a86b9536867"
}
```
