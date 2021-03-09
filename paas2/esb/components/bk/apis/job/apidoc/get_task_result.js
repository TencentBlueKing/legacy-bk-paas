/**
@api {get} /api/c/compapi/job/get_task_result/ get_task_result
@apiName get_task_result
@apiGroup API-JOB
@apiVersion 1.0.0
@apiDescription 根据作业实例 ID 查询作业执行状态
@apiParam {string} app_code 应用ID
@apiParam {string} app_secret 应用TOKEN，可以通过 蓝鲸智云开发者中心 -> 点击应用ID -> 基本信息 获取
@apiParam {string} [bk_token] 当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取
@apiParam {string} [username] 当前用户用户名，白名单中app可使用

@apiParam {int} task_instance_id 作业实例ID
@apiParamExample {json} Request-Example:
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "task_instance_id": "65"
    }
@apiSuccessExample {json} Success-Response
    HTTP/1.1 200 OK
    {
        "result": true,
        "code": "00",
        "message": "",
        "data": {
            "isFinished": true,
            "taskInstance": {
                "status": 3,
                "totalTime": 0,
                "endTime": "2015-09-09 15:05:32",
                "startTime": "2015-09-09 15:05:32",
                "operationList": [],
                "startWay": 1,
                "taskId": -1,
                "appId": 1,
                "operator": "2797261603",
                "taskInstanceId": 65,
                "currentStepId": 75,
                "createTime": "2015-09-09 15:05:31",
                "name": "执行脚本-20158915516182"
            },
            "blocks": [
                {
                    "type": 1,
                    "stepInstances": [
                        {
                            "totalTime": 0,
                            "failIPNum": 0,
                            "text": null,
                            "successIPNum": 2,
                            "isPause": 0,
                            "operator": "2797261603",
                            "stepInstanceId": 75,
                            "taskInstanceId": 65,
                            "type": 1,
                            "badIPNum": 0,
                            "status": 3,
                            "stepId": -1,
                            "blockName": "执行脚本-20158915516182",
                            "operationList": [],
                            "startTime": "2015-09-09 15:05:32",
                            "appId": 1,
                            "totalIPNum": 2,
                            "ord": 1,
                            "createTime": "2015-09-09 15:05:31",
                            "name": "执行脚本-20158915516182",
                            "blockOrd": 1,
                            "retryCount": 0,
                            "endTime": "2015-09-09 15:05:32",
                            "runIPNum": 2
                        }
                    ],
                    "blockOrd": 1,
                    "blockName": "执行脚本-20158915516182"
                }
            ]
        },
    }
@apiSuccess {Boolean} result 包含True和False，其中True表示成功，False表示失败
@apiSuccess {String} code 返回错误码，其中"00"表示成功，其它表示失败
@apiSuccess {String} message 返回错误消息
@apiSuccess {Object} data 返回数据，成功返回请求数据
@apiSuccess (data) {Number} status  任务状态码，
    1.未执行; 2.正在执行; 3.执行成功; 4.执行失败; 5.跳过;
    6.忽略错误; 7.等待用户; 8.手动结束; 9.状态异常;
    10.步骤强制终止中; 11.步骤强制终止成功; 12.步骤强制终止失败
*/
