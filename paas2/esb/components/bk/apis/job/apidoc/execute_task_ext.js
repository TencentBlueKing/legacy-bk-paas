/**
@api {post} /api/c/compapi/job/execute_task_ext/ execute_task_ext
@apiName execute_task_ext
@apiGroup API-JOB
@apiVersion 1.0.0
@apiDescription 启动作业Ext(带全局变量启动)

如果全局变量的类型为IP，参数值必须包含groupIds或ipList。没有设置的参数将使用作业模版中的默认值
@apiParam {string} app_code 应用ID
@apiParam {string} app_secret 应用TOKEN，可以通过 蓝鲸智云开发者中心 -> 点击应用ID -> 基本信息 获取
@apiParam {string} [bk_token] 当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取
@apiParam {string} [username] 当前用户用户名，白名单中app可使用

@apiParam {int} app_id 业务ID
@apiParam {int} task_id 作业ID
@apiParam {array} global_var 全局变量信息，作业包含的全局变量和类型可以通过接口“查询作业模板详情”(get_task_detail)获取

@apiParamExample {json} Request-Example:
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "app_id": "46",
        "task_id": "195",
        "global_var": [{
            "id": 436,
            "ipList": "1:10.0.0.1",
        },
        {
            "id": 437,
            "value": "newValue",
        }]
    }
@apiSuccessExample {json} Success-Response
    HTTP/1.1 200 OK
    {
        "result": true,
        "code": "00",
        "message": "",
        "data": {
            "taskInstanceName": "测试",
            "taskInstanceId": 10000
        }
    }
*/
