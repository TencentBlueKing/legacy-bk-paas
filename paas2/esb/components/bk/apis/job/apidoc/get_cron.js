/**
@api {get} /api/c/compapi/job/get_cron/ get_cron
@apiName get_cron
@apiGroup API-JOB
@apiVersion 1.0.0
@apiDescription 查询业务下定时作业信息
@apiParam {string} app_code 应用ID
@apiParam {string} app_secret 应用TOKEN，可以通过 蓝鲸智云开发者中心 -> 点击应用ID -> 基本信息 获取
@apiParam {string} [bk_token] 当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取
@apiParam {string} [username] 当前用户用户名，白名单中app可使用

@apiParam {int}    app_id 业务ID
@apiParam {int}    [crontab_task_id]   定时任务ID，如果存在，则忽略其他筛选条件，只查询这个指定的作业信息
@apiParam {string} [name] 定时作业的名称
@apiParam {string} [status] 作业的状态：1.已启动、2.已暂停、3.已完成
@apiParam {string} [creater] 作业创建人
@apiParam {string} [last_modify_user] 最后修改人
@apiParam {string} [create_time_start] 创建起始时间，YYYY-MM-DD格式
@apiParam {string} [create_time_end] 创建结束时间，YYYY-MM-DD格式
@apiParam {string} [last_modify_time_start] 最后修改起始时间，YYYY-MM-DD格式
@apiParam {string} [last_modify_time_end] 最后修改结束时间，YYYY-MM-DD格式

@apiParamExample {json} Request-Example:
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "app_id": 46,
        "crontab_task_id": 123456,
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
                "lastModifyUser": "admin",
                "des": "",
                "createTime": "2017-03-01 19:45:51",
                "creater": "admin",
                "lastModifyTime": "2017-03-01 20:01:08",
                "cronExpression": "2 0/5 * * * ?",
                "taskId": 5,
                "appId": 3,
                "taskName": "de",
                "type": 0,
                "id": 2,
                "name": "hello test2 a"
            }
        ]
    }
*/
