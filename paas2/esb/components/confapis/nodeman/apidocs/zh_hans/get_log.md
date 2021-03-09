### 请求地址

/api/c/compapi/v2/nodeman/get_log/


### 请求方法

GET


### 功能描述

获取日志

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
| host_id   | int    | 是     | 主机id, 可以从get_task_info接口返回值获取 |



### 返回结果示例

```python
{
    "message": "success",
    "code": "OK",
    "data": {
        "job_id": "187",
        "status": "FAILED",
        "err_code": "START_JOB_FAILED",
        "step": "任务执行失败(安装)",
        "err_code_desc": "启动任务失败",
        "logs": "<pre><br/><b>>>step 1 准备安装脚本</b> </pre><pre>[2018-12-05 21:47:46]: create pagent install script parameter[ -m client -b -i 218 -w x.x.x.x -l xx.xx.xx.xx -g xxx.xxx.xxx.xxx:80 -I 0] </pre><pre>[2018-12-05 21:47:46]: job parameter is：[\n{\n  \"account\": \"root\", \n  \"ip_list\": [\n    {\n      \"ip\": \"xx.xx.xx.xx\", \n      \"source\": \"218\"\n    }\n  ], \n  \"script_timeout\": 3000, \n  \"app_id\": \"2\", \n  \"script_param\": \" -m client -b -i 218 -w x.x.x.x -l xx.xx.xx.xx -g xxx.xxx.xxx.xxx:80 -I 0\", \n  \"type\": 1\n}\n] </pre><pre>[2018-12-05 21:47:47]: ESB api: https://xxx.xx.com/api/c/compapi/job/fast_execute_script/ </pre><pre>[2018-12-05 21:47:47]: start job failed: 组件调用异常:IP xx.xx.xx.xx不属于该业务(code=1306000) </pre>"
    },
    "result": true
}
```