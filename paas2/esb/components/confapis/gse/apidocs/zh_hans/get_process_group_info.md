### 功能描述

获取进程进程组信息

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| meta | dict | 是 | 进程管理元数据，详见meta定义 |
| hosts | array | 是 | 主机对象数组，详见hosts定义 |

#### meta

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| namespace | string | 是 | 命名空间，用于进程分组管理 |
| name | string | 否 | 进程名，用户自定义，与namespace共同用于进程标识 |
| labels | dict | 否 | 进程标签，方便用户按标签管理进程，key和value为用户自定义，value为string类型。默认为空 |

#### hosts

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| ip | string | 是 | IP地址 |
| bk_cloud_id | int | 是 |  云区域id |
| bk_supplier_id | int | 是 | 开发商id |

### 请求参数示例

``` json
{
  "meta": {
	"namespace": "gse",
    "name": "",
    "labels": {
    }
  },
  "hosts": [
    {
      "ip": "10.0.0.1",
      "bk_cloud_id": 1,
      "bk_supplier_id": 2
    }
  ]
}
```

### 返回结果示例

```json
{
    "result": true,
    "code": 0,
    "message":"success",
    "data":{
      "process_group_infos": [
        {
          "meta": {
	        "namespace": "gse",
            "name": "",
            "labels": {
            }
          },
          "host": {
            "ip": "10.0.0.1",
            "bk_cloud_id": 1,
            "bk_supplier_id": 2
          }
          "id":"gse",
          "resource":{
            "cpu_pool_limit": 20,
            "mem_pool_limit": 20,
            "cpu_pool_weight": 0,
            "mem_pool_weight": 0
          }
        }
      ]
    }
}
```

### 返回结果参数说明

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
|result| bool | 返回结果，true为成功，false为失败 |
|code|int|返回码，0表示成功，其他值表示失败|
|message|string|返回信息|
|data|dict| 详细结果，详见data定义 |

#### data

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
|process_group_infos| array | 进程组信息对象数组，详见data.process_group_infos定义 |

#### data.process_group_infos

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| meta | dict | 进程管理元数据，详见data.process_group_infos.meta定义 |
| host | dict | 主机，详见data.process_group_infos.host定义 |
| id | string | 进程组id |
| resource | dict |  进程组资源信息，详见data.process_group_infos.resource定义 |

#### data.process_group_infos.meta

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| namespace | string | 命名空间，用于进程分组管理 | 
| name | string | 进程名，用户自定义，与namespace共同用于进程标识 |
| labels | dict | 进程标签，方便用户按标签管理进程 |

#### data.process_group_infos.host

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| ip | string | IP地址 |
| bk_cloud_id | int |  云区域id |
| bk_supplier_id | int | 开发商id |

#### data.process_group_infos.resource

| 字段      |  类型      |  描述      |
|-----------|------------|------------|
| cpu_pool_limit | double | 进程组cpu使用率上限百分比（总占比，非单核占比）,例如：30表示cpu总使用率上限为30% |
| mem_pool_limit | double | 进程组mem使用率上限百分比（总占比，非单核占比）,例如：30表示mem总使用率上限为30% |
| cpu_pool_weight | int | cpu资源权值，0或1。<br>当为0时，进程资源得分等于进程资源使用率，则进程使用率越高越容易被kill；<br>当为1时，进程资源得分既参考了进程资源使用率，也参考了资源倾斜（进程的资源使用率阈值越高，代表向其倾斜的资源越多，资源占用得分越低，也越不容易被kill） |
| mem_pool_weight | int | mem资源权值，0或1。<br>当为0时，进程资源得分等于进程资源使用率，则进程使用率越高越容易被kill；<br>当为1时，进程资源得分既参考了进程资源使用率，也参考了资源倾斜（进程的资源使用率阈值越高，代表向其倾斜的资源越多，资源占用得分越低，也越不容易被kill） |