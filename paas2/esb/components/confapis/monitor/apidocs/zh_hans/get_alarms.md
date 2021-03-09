### 功能描述

通过筛选条件获取指定告警事件

{{ common_args_desc }}

#### 接口参数

| 字段                    | 类型   | 必选 | 描述                                                         |
| ----------------------- | ------ | ---- | ------------------------------------------------------------ |
| bk_biz_id               | int    | 是   | 业务ID                                                       |
| source_time             | string | 是   | 告警源时间，"YYYY-MM-DD hh:mm:ss"                            |
| id                      | int    | 否   | 告警事件ID                                                   |
| alarm_type              | string | 否   | 监控类型，可选base、cpu、men等，详情见下alarm_type           |
| level                   | int    | 否   | 告警级别，1为致命，2为预警，3为提醒                          |
| alarm_content__contains | string | 否   | 包含的告警内容，从alarm_content字段中匹配                    |
| user_status             | string | 否   | 通知状态，默认为user_status__in="notified,unnotified"        |
| status                  | string | 否   | 告警状态，可选（待定）                                       |
| extend_fields           | string | 否   | 用户自定义显示的额外字段,可选begin_time(告警开始处理时间)，end_time(告警结束处理时间)，finish_time(告警恢复时间)，original_alarm(原始告警)等，多个字段使用半角逗号分隔" |
| ordering                | string | 否   | 排序方式，默认为id(升序)，可选source_time,begin_time,end_time，加上"-"前缀为降序 |
| page                    | int    | 否   | 当前页码数，默认为1                                          |
| page_size               | int    | 否   | 每页最大显示数，默认为5                                      |


注：以上字段除`extend_fields`、`ordering`、`page`、`page_size`外，均支持Django的ORM操作

```
如source_time__gte、source_time__lte、alarm_type__in等。
使用__in操作时，参数用英文逗号隔开，如alarm_type__in=cpu,net
```

#### alarm_type: 监控类型

```
base(基础)、cpu(CPU)、mem(内存)、net(网络)、disk(磁盘)、system_env(系统)、
base_alarm(事件)、gse_custom_event(字符型)、proc_port(进程端口)、
custom(自定义)、keyword(关键字)、process(进程)、selfscript(脚本)、
uptimecheck(服务拨测)、apache、mysql、nginx、redis、tomcat、ad、ceph、
consul、elastic、exchange2010、haproxy、iis、jmx、kafka、memcache、
mongodb、mssql、oracle、rabbitmq、weblogic、zookeeper 等
```

### 请求参数示例
(注意时区,不输入时区信息默认为零时区)获取告警接入时间在2018-10-01
00:00:01+0800和2018-11-08
23:59:59+0800之间，业务ID为2，监控类型为cpu，额外字段为end_time的告警事件，且当前页码为1，单页最大显示数为10，排序方式为按begin_time字段降序：

```
bk_biz_id=2&extend_fields=end_time&source_time__gte=2018-10-01 00:00:01%2b0800&source_time__lte=2018-11-08 23:59:59%2b0800&page=1&page_size=10&ordering=-begin_time&alarm_type=cpu
```
(零时区)获取告警接入时间在2019-01-01 00:00:00和2019-01-08
23:59:59之间，业务ID为2，告警级别为严重，监控类型为内存，告警内容包含“PING”的告警事件：

```
bk_biz_id=2&source_time__gte=2019-01-01 00:00:00&source_time__lte=2019-01-08 23:59:59&level=1&alarm_type=men&alarm_content__contains=PING
```

### 返回结果示例

```
{
    "message": "OK",
    "code": "0",
    "data": {
        "total": 1,
        "result": [
            {
                "comment": "",
                "status": "success",
                "source_time": "2018-11-05 06:01:00+0000",
                "user_status": "notified",
                "alarm_type": "cpu",
                "ip": "x.x.x.x",
                "level": 2,
                "bk_cloud_id": 0,
                "alarm_content": {
                    "source_name": "5分钟平均负载",
                    "title": "x.x.x.x发生5分钟平均负载告警",
                    "cc_biz_name": "蓝鲸",
                    "content": "主机[x.x.x.x]:当前指标值(6.57) >= (0.0)",
                    "is_performance_alarm": true,
                    "dimensions_display": "ip(x.x.x.x)-company_id(0)-集群(公共组件)-模块(influxdb)-biz_id(2)-plat_id(0)"
                },
                "end_time": "2018-11-05 06:02:37+0000",  # 此字段为用户自定义的额外字段
                "bk_biz_id": 2,
                "match_dimension": {
                    "cc_app_module": "33",
                    "bk_biz_id": 2,
                    "ModuleName": "influxdb",
                    "SetName": "公共组件",
                    "ip": "x.x.x.x",
                    "bk_cloud_id": "0",
                    "cc_topo_module": "33",
                    "cc_topo_set": "6",
                    "bk_supplier_id": "0"
                },
                "id": 1499348,
                "bk_supplier_id": 0
            }
        ]
    },
    "result": true
}
```

### 返回结果参数说明

| 字段    | 类型   | 描述                                  |
| ------- | ------ | ------------------------------------- |
| result  | bool   | 返回结果，true为成功，false为失败     |
| code    | int    | 返回码，0表示成功，其他值表示失败     |
| message | string | 错误信息                              |
| data    | dict   | 结果，其中total为数据总数，result如下 |

#### data.result

| 字段            | 类型   | 描述                                |
| --------------- | ------ | ----------------------------------- |
| id              | int    | 告警事件ID                          |
| bk_biz_id       | int    | 业务ID                              |
| bk_cloud_id     | int    | 云平台ID，主机相关字段              |
| bk_supplier_id  | int    | 开发商ID，主机相关字段              |
| ip              | string | IP地址，主机相关字段                |
| comment         | string | 备注                                |
| status          | string | 状态                                |
| user_status     | string | 通知状态(已通知，通知失败)        |
| alarm_type      | string | 告警类型                            |
| level           | int    | 告警等级，1为严重，2为普通，3为轻微 |
| match_dimension | dict   | 告警后台内部匹配的维度              |
| alarm_content   | dict   | 告警内容                            |
| source_time     | string | 告警源时间                          |

##### result.alarm_content

| 字段                 | 类型   | 描述             |
| -------------------- | ------ | ---------------- |
| source_name          | string | 监控名称         |
| title                | string | 告警标题         |
| cc_biz_name          | string | 业务名称         |
| content              | string | 触发条件         |
| is_performance_alarm | bool   | 是否属于主机监控 |
| dimensions_display   | string | 维度信息         |

