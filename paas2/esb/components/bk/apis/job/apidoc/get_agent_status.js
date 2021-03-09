/**
@api {post} /api/c/compapi/job/get_agent_status/ get_agent_status
@apiName get_agent_status
@apiGroup API-JOB
@apiVersion 1.0.0
@apiDescription 查询Agent状态
@apiParam {string} app_code 应用ID
@apiParam {string} app_secret 应用TOKEN，可以通过 蓝鲸智云开发者中心 -> 点击应用ID -> 基本信息 获取
@apiParam {string} [bk_token] 当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取
@apiParam {string} [username] 当前用户用户名，白名单中app可使用

@apiParam {int} app_id 业务ID
@apiParam {array} ip_infos IP信息，每项条目包含信息见下面参数描述

@apiParam (ip_infos) {string} ip IP地址
@apiParam (ip_infos) {int} plat_id 子网ID
@apiParamExample {json} Request-Example:
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "app_id": 1,
        "ip_infos": [
            {
                "ip": "10.0.0.1",
                "plat_id": 1,
            }
        ]
    }
@apiSuccessExample {json} Success-Response
    HTTP/1.1 200 OK
    {
        "result": true,
        "code": "00",
        "message": "",
        "data": [
            {
                "status": 1,
                "ip": "10.0.0.1"
            }
        ]
    }
@apiSuccess {Boolean} result 包含True和False，其中True表示成功，False表示失败
@apiSuccess {String} code 返回错误码，其中"00"表示成功，其它表示失败
@apiSuccess {String} message 返回错误消息
@apiSuccess {Object} data 返回数据，成功返回请求数据
@apiSuccess (data) {Number} status  主机Agent状态，1.正常; 0.异常
*/
