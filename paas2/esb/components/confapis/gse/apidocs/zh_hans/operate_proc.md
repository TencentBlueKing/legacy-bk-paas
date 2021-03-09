### 功能描述

进程操作

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| meta | dict | 是 | 进程管理元数据，详见meta定义 |
| hosts | array | 是 | 主机对象数组，详见hosts定义 |
| op_type | int | 是 | 进程操作类型：<br>0:启动进程（start）,调用spec.control中的start_cmd启动进程，启动成功会注册托管； <br>1:停止进程（stop）, 调用spec.control中的stop_cmd启动进程，停止成功会取消托管； <br>2:进程状态查询； <br>3:注册托管进程，令gse_agent对该进程进行托管（托管：当托管进程异常退出时，agent会自动拉起托管进程；当托管进程资源超限时，agent会杀死托管进程）； <br>4:取消托管进程，令gse_agent对该进程不再托管； <br>7:重启进程（restart）,调用spec.control中的restart_cmd启动进程； <br>8:重新加载进程（reload）,调用spec.control中的reload_cmd启动进程； <br>9:杀死进程（kill）,调用spec.control中的kill_cmd启动进程，杀死成功会取消托管 |

#### meta

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| namespace | string | 是 | 命名空间，用于进程分组管理 |
| name | string | 是 | 进程名，用户自定义，与namespace共同用于进程标识 |
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
    "name": "proc-test",
    "labels": {
        "proc_name": "proc-test"
    }
  },
  "op_type": 0,
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
        "task_id": "GSETASK:XXXXXXXXXX"
    }
}
```

### 返回结果参数说明

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
|result| bool | 返回结果，true为成功，false为失败 |
|code|int|返回码，0表示成功，其他值表示失败|
|message|string|返回信息 |
|data| dict| 详细结果，详见data定义 |

#### data

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
|task_id|String|进程操作实例ID |