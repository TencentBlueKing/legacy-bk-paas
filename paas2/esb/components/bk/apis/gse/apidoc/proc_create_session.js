/**
@api {post} /api/c/compapi/gse/proc_create_session/ proc_create_session
@apiName proc_create_session
@apiGroup API-GSE
@apiVersion 1.0.0
@apiDescription 进程管理：新建 session
@apiParam {string} app_code 应用ID
@apiParam {string} app_secret 应用TOKEN，可以通过 蓝鲸智云开发者中心 -> 点击应用ID -> 基本信息 获取
@apiParam {string} [bk_token] 当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取
@apiParam {string} [username] 当前用户用户名，白名单中app可使用

@apiParam {int} app_id 配置平台业务ID，在[配置平台]-[开发商视图]的业务管理页面可查询
@apiParam {int} env_id 环境类型，配置平台集群的标准属性；可选值为 1（中文含义：测试环境），2（体验环境），3（正式环境）

@apiParamExample {json} Request-Example:
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "app_id": 1,
        "env_id": 1
    }

@apiSuccessExample {json} Success-Response
    HTTP/1.1 200 OK
    {
        "result": true,
        "code": "00",
        "message": "create session success",
        "data": {
            "error_code": 0,
            "error_msg": "create session success",
            "session_id": "8888888888888888888888-8888-8888-8888-888888888888"
        }
    }
*/
