### 请求地址

/api/c/compapi/v2/nodeman/create_task/


### 请求方法

POST


### 功能描述

创建任务

### 请求参数


#### 通用参数

| 字段 | 类型 | 必选 |  描述 |
|-----------|------------|--------|------------|
| bk_app_code  |  string    | 是 | 应用ID     |
| bk_app_secret|  string    | 是 | 安全密钥(应用 TOKEN)，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取 |
| bk_token     |  string    | 否 | 当前用户登录态，bk_token与bk_username必须一个有效，bk_token可以通过Cookie获取 |
| bk_username  |  string    | 否 | 当前用户用户名，应用免登录态验证白名单中的应用，用此字段指定当前用户 |

#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| bk_biz_id   | int    | 是     | 业务id |
| creator   | string    | 是     | 任务创建人 |
| hosts     | array    | 是     | 主机相关信息 |
| bk_cloud_id | int    | 是     | 云区域ID |
| node_type   | string  | 是    | 主机的节点类型，可以是AGENT, PROXY或PAGENT |
| op_type  | string | 是     | 操作类型，可以是INSTALL, REINSTALL, UNINSTALL, REMOVE 或UPGRADE |

#### hosts

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| conn_ips     |  string     | 是     | 主机通信IP，当为多个时用逗号隔开 |
| login_ip     |  string     | 否     | 主机登录IP，适配复杂网络时填写 |
| data_ip     |  string     | 否     | 主机数据IP，适配复杂网络时填写 |
| cascade_ip      |  string     | 否     | 级联IP, 安装PROXY时必填 |
| os_type |  string  | 否     | 操作系统类型，可以是LINUX, WINDOWS,或AIX |
| has_cygwin   |  bool  | 否     | 是否安装了cygwin, windows操作系统时选填 |
| port |  int     | 否     | 端口号 |
| account        |  string  | 否     | 登录帐号 |
| auth_type    |  string     | 否     | 认证方式，可以是PASSWORD或KEY |
| password | string | 否     | 登录密码，auth_type为PASSWORD时需要填写,RSA方式加密 |
| key    |  string   | 否     | 登录密钥， auth_type为KEY时需要填写，RSA方式加密 |



### 请求参数示例

```python
{
"bk_biz_id":2,
"creator":"admin",
"hosts":[{"conn_ips":"xxx.xxx.xxx.xxx", 
          "os_type":"LINUX",
          "has_cygwin":false,
          "port":22,
          "account":"root",
          "auth_type":"PASSWORD",
          "password":"JPRidyg3iXUFN6BiRj8ncgzOgL2nuIl2DcTjTG2oTrClZar/MqZc=",
          "key":""}],
"bk_cloud_id":"xxx",
"node_type":"PAGENT",
"op_type":"INSTALL", 
}
```

### 返回结果示例

```python
{
    "message": "success",
    "code": "OK",
    "data": {
        "id": 187,
        "creator": "admin",
        "bk_biz_id": "2",
        "bk_supplier_account": "",
        "bk_supplier_id": "0",
        "bk_cloud_id": "218",
        "job_type": "INSTALL_PAGENT",
        "hosts": [
            {
                "job_id": "187",
                "status": "QUEUE",
                "err_code": "INIT",
                "step": "任务初始化(安装)",
                "err_code_desc": "初始化",
                "host": {
                    "id": 43,
                    "bk_biz_id": "2",
                    "bk_cloud_id": "218",
                    "conn_ips": "xxx.xxx.xxx.xxx",
                    "node_type": "PAGENT",
                    "os_type": "LINUX",
                    "has_cygwin": false
                }
            }
        ],
        "global_params": null,
        "start_time": "2018-12-05 21:20:20",
        "end_time": null,
        "status_count": {
            "running_count": 1,
            "failed_count": 0,
            "success_count": 0
        },
        "os_count": {
            "WINDOWS": 0,
            "AIX": 0,
            "LINUX": 1
        },
        "host_count": 1,
        "job_type_desc": "安装PAGENT",
        "op_target": {
            "config_file": "",
            "name": ""
        }
    },
    "result": true
}
```