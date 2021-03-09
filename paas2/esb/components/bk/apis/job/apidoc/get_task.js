/**
@api {get} /api/c/compapi/job/get_task/ get_task
@apiName get_task
@apiGroup API-JOB
@apiVersion 1.0.0
@apiDescription 查询作业模板
@apiParam {string} app_code 应用ID
@apiParam {string} app_secret 应用TOKEN，可以通过 蓝鲸智云开发者中心 -> 点击应用ID -> 基本信息 获取
@apiParam {string} [bk_token] 当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取
@apiParam {string} [username] 当前用户用户名，白名单中app可使用

@apiParam {int}    app_id 业务ID
@apiParam {string} [name] 作业名称
@apiParam {string} [creater] 创建人QQ号
@apiParam {string} [last_modify_user] 最后修改人QQ号
@apiParam {string} [create_time_start] 创建起始时间，YYYY-MM-DD格式
@apiParam {string} [create_time_end] 创建结束时间 YYYY-MM-DD格式
@apiParam {string} [last_modify_time_start] 最后修改起始时间 YYYY-MM-DD格式
@apiParam {string} [last_modify_time_end] 最后修改结束时间YYYY-MM-DD格式
@apiParamExample {json} Request-Example:
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "app_id": 46,
        "name": "hotest",
        "creater": "12345",
        "last_modify_user": "12345",
        "create_time_start": "2016-02-22 23:12:34",
        "create_time_end": "2016-02-22 23:12:34",
        "last_modify_time_start": "2016-02-22 23:12:34",
        "last_modify_time_end": "2016-02-22 23:12:34"
    }
@apiSuccessExample {json} Success-Response
    HTTP/1.1 200 OK
    {
        "result": true,
        "code": "00",
        "message": "",
        "data": [
            {
                "account": "",
                "name": "hotest",
                "creater": "12345",
                "stepNum": 1,
                "serverSetId": 0,
                "nmStepBeanList": [],
                "lastModifyTime": "2016-02-22 23:12:34",
                "appId": 46,
                "id": 190,
                "ipList": "",
                "createTime": "2016-02-22 23:12:34",
                "lastModifyUser": "12345"
            },
        ],
    }
*/
