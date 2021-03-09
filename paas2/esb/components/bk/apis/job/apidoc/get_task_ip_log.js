/**
@api {get} /api/c/compapi/job/get_task_ip_log/ get_task_ip_log
@apiName get_task_ip_log
@apiGroup API-JOB
@apiVersion 1.0.0
@apiDescription 根据作业实例ID查询作业执行日志
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
        "task_instance_id": "100932"
    }
@apiSuccessExample {json} Success-Response
    HTTP/1.1 200 OK
    {
        "result": true,
        "code": "00",
        "message": "",
        "data": [
            {
                "isFinished": true,
                "stepInstanceName": "读取文件",
                "stepAnalyseResult": [
                    {
                        "count": "1",
                        "resultType": 9,
                        "ipLogContent": [
                            {
                                "status": 9,
                                "totalTime": 0.24799999594688416,
                                "stepInstanceId": 156965,
                                "isJobIp": 1,
                                "ip": "xxx.xxx.xxx.xxx",
                                "errCode": 0,
                                "source": 1,
                                "logContent": "QlpoOTFBWSZTWekFHDQAGcHf+XMyQA...",
                                "startTime": "2016-06-12 14:29:39",
                                "retryCount": 0,
                                "endTime": "2016-06-12 14:29:39",
                                "exitCode": 0
                            }
                        ],
                        "resultTypeText": "执行成功"
                    }
                ],
                "stepInstanceId": 156965,
                "stepInstanceStatus": 3
            }
        ]
    }
@apiSuccess {Boolean} result 包含True和False，其中True表示成功，False表示失败
@apiSuccess {String} code 返回错误码，其中"00"表示成功，其它表示失败
@apiSuccess {String} message 返回错误消息
@apiSuccess {Object} data 返回数据，成功返回请求数据
@apiSuccess (ipLogContent) {Number} status  主机任务状态码，
   1.Agent异常; 3.上次已成功; 5.等待执行; 7.正在执行;
   9.执行成功; 11.任务失败; 12.任务下发失败; 13.任务超时;
   15.任务日志错误; 101.脚本执行失败; 102.脚本执行超时;
   103.脚本执行被终止; 104.脚本返回码非零; 202.文件传输失败;
   203.源文件不存在; 310.Agent异常; 311.用户名不存在;
   320.文件获取失败; 321.文件超出限制; 329.文件传输错误; 399.任务执行出错
*/
