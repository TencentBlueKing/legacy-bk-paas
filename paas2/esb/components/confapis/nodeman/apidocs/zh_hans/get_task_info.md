### 请求地址

/api/c/compapi/v2/nodeman/get_task_info/


### 请求方法

GET


### 功能描述

查询任务状态

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
| job_id   | int    | 是     | 任务id, 可以从创建任务接口返回值中获取 |


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
                "status": "FAILED",
                "err_code": "START_JOB_FAILED",
                "step": "任务执行失败(安装)",
                "err_code_desc": "启动任务失败",
                "host": {
                    "id": 43,
                    "bk_biz_id": "2",
                    "bk_cloud_id": "218",
                    "inner_ip": "xxx.xxx.xxx.xxx",
                    "outer_ip": "xx.xx.xx.xx",
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
            "running_count": 0,
            "failed_count": 1,
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