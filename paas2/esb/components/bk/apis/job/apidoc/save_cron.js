/**
@api {post} /api/c/compapi/job/save_cron/ save_cron
@apiName save_cron
@apiGroup API-JOB
@apiVersion 1.0.0
@apiDescription 新建或保存定时作业
；新建定时作业，作业状态默认为暂停；操作者必须是业务的创建人或运维
@apiParam {string} app_code 应用ID
@apiParam {string} app_secret 应用TOKEN，可以通过 蓝鲸智云开发者中心 -> 点击应用ID -> 基本信息 获取
@apiParam {string} [bk_token] 当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取
@apiParam {string} [username] 当前用户用户名，白名单中app可使用

@apiParam {int}    app_id 业务ID
@apiParam {string} name 定时作业的名称
@apiParam {int} task_id 要定时执行的作业的作业ID
@apiParam {int}    [crontab_task_id]   定时任务ID，更新定时任务时，必须传这个值
@apiParam {string} cron_expression     定时任务crontab的定时规则，各自段含义为：秒 分 时 日 月 周 年（可选），如: 0 0/5 * * * ?  表示每5分钟执行一次

@apiParamExample {json} Request-Example:
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "app_id": 46,
        "name": "hotest",
        "task_id": 123,
        "cron_expression": "0 0/5 * * * ?"
    }
@apiSuccessExample {json} Success-Response
    HTTP/1.1 200 OK
    {
        "result": true,
        "code": "00",
        "message": "",
        "data": {
            "crontabTaskId": 2
        }
    }
*/
