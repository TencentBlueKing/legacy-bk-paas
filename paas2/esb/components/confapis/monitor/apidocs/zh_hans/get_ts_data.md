

### 功能描述

图表数据查询  
根据给定的sql表达式查询指定的存储引擎  


{{ common_args_desc }}

#### 接口参数

| 字段           | 类型   | 必选 | 描述        |
| -------------- | ------ | ---- | ----------- |
| sql            | string | 是   | SQL查询语句 |
| prefer_storage | string | 否   | 查询引擎(默认influxdb)    |
| bk_username    | string | 否   | 白名单的app_code必填      |

#### 请求示例

```json
{
    "bk_username":"admin",
    "sql":"select max(in_use) as _in_use from 3_system_disk where time >= \"1m\" group by ip, plat_id, company_id, device_name, minute1 order by time desc limit 1"
}
```

>sql中的结果表名为biz_id + db_name + table_name  
>Biz_id：业务id  
>Db_name: 数据库名  
>Table_name: 数据表名  
>例：2_system_cpu_detail：业务2下的system库的cpu_detail表  
>查询一个小时内的单核cpu的使用率的sql语句：  
>Select Mean(usage) as usage from 2_system_detail where time > '1h' group by ip,device_name,minute1 limit 10  

>上面请求实例中结果表3_system_disk表示：业务3下的system库中的disk表  

>注意：上述的库和表并非和时序存储中的实际物理库、表对应。而是指'源数据管理模块'的库表


### 返回结果

#### 字段说明

| 字段                | 类型   | 描述     |
| ------------------- | ------ | -------- |
| list                | list   | 查询结果 |
| totalRecords        | int    | 总记录数 |
| timetaken           | float  | 查询耗时 |
| device              | string | 查询引擎 |

#### 结果示例

```json
{
    "message":"OK",
    "code":"0",
    "data":{
        "list":[
            {
                "ip":"x.x.x.x",
                "time":1543487700000,
                "company_id":"0",
                "device_name":"C:",
                "_in_use":27.0269684761,
                "plat_id":"0",
                "minute1":1543487700000
            },
            {
                "ip":"x.x.x.x",
                "time":1543487700000,
                "company_id":"0",
                "device_name":"\/",
                "_in_use":8.3368418991,
                "plat_id":"0",
                "minute1":1543487700000
            }
        ],
        "timetaken":0.0059459209,
        "totalRecords":2,
        "device":"influxdb"
    },
    "result":true,
    "request_id":"408233306947415bb1772a86b9536867"
}
```


