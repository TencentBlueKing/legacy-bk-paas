/**
@api {post} /api/c/compapi/gse/proc_run_command/ proc_run_command
@apiName proc_run_command
@apiGroup API-GSE
@apiVersion 1.0.0
@apiDescription 进程管理：执行命令
@apiParam {string} app_code 应用ID
@apiParam {string} app_secret 应用TOKEN，可以通过 蓝鲸智云开发者中心 -> 点击应用ID -> 基本信息 获取
@apiParam {string} [bk_token] 当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取
@apiParam {string} [username] 当前用户用户名，白名单中app可使用

@apiParam {string} session_id 新建Session后产生的会话ID，可在proc_create_session接口中找到
@apiParam {string} cmd 命令动作，可选值：createcfg（含义：从配置模板生成配置），pushcfg（将createcfg生成的配置下发至服务器），start（启动进程），stop（停止进程），restart（重启进程），reload（重新加载进程），kill（Kill进程），noauto（将进程注册为非托管状态，进程crash后不自动拉起 ），autoproc（将进程注册为托管状态，进程crash后可自动拉起），check（检查进程实例），getremotecfg（获取业务机器的配置文件）
@apiParam {string} proc_id 进程实例ID，可在[配置平台]-[进程管理]-[进程模块绑定]页面找到，例如 "公共组件.nginx.1.1"
@apiParam {string} [ipaddr] 过滤主机IP。比如进程实例ID为*.*.*.*，ipaddr为"10.0.0.1"，则执行10.0.0.1上的所有进程实例

@apiParamExample {json} Request-Example:
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "session_id": "8888888888888888888888-8888-8888-8888-888888888888",
        "cmd": "check",
        "proc_id": "*.*.*.*",
        "ipaddr": "10.0.0.1"
    }

@apiSuccessExample {json} Success-Response
    HTTP/1.1 200 OK
    {
        "result": true,
        "code": "00",
        "message": "",
        "data": {
            "unique_id": "88888888-8888-8888-8888-888888888888",
            "session_id": "8888888888888888888888-8888-8888-8888-888888888888",
            "error_code": 0,
            "error_msg": "",
            "task_id": "GSEPROC:20160101111111:1"
        }
    }

*/
