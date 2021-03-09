/**
@api {get} /api/c/compapi/job/get_task_detail/ get_task_detail
@apiName get_task_detail
@apiGroup API-JOB
@apiVersion 1.0.0
@apiDescription 查询作业模板详情
@apiParam {string} app_code 应用ID
@apiParam {string} app_secret 应用TOKEN，可以通过 蓝鲸智云开发者中心 -> 点击应用ID -> 基本信息 获取
@apiParam {string} [bk_token] 当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取
@apiParam {string} [username] 当前用户用户名，白名单中app可使用

@apiParam {int} app_id 业务ID
@apiParam {int} task_id 作业模板ID
@apiParamExample {json} Request-Example:
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "app_id": 1,
        "task_id": 192
    }
@apiSuccessExample {json} Success-Response
    HTTP/1.1 200 OK
    {
        "result": true,
        "code": "00",
        "message": "",
        "data": {
            "account": "",
            "name": "demo演示",
            "creater": "12345",
            "stepNum": 0,
            "serverSetId": 0,
            "nmStepBeanList": [
                {
                    "ccScriptName": "",
                    "text": "",
                    "serverSetId": 0,
                    "stepId": 524,
                    "ipList": "1:10.0.0.1",
                    "serverSetName": "",
                    "ccScriptId": 0,
                    "fileSpeedLimit": 0,
                    "scriptTimeout": 1000,
                    "scriptParam": "",
                    "scriptContent": "xxx",
                    "lastModifyTime": "",
                    "fileSource": "",
                    "type": 1,
                    "scriptType": 4,
                    "lastModifyUser": "",
                    "blockName": "step1",
                    "paramType": 1,
                    "fileTargetPath": "",
                    "scriptId": 523,
                    "taskId": 195,
                    "appId": 46,
                    "isPause": 0,
                    "ord": 1,
                    "createTime": "2016-02-24 21:50:31",
                    "account": "root",
                    "name": "作业执行步骤1",
                    "companyId": 15,
                    "creater": "12345",
                    "ccScriptParam": "",
                    "blockOrd": 1
                },
            ],
            "lastModifyTime": "2016-02-26 16:15:43",
            "appId": 46,
            "id": 195,
            "ipList": "",
            "createTime": "2016-02-24 21:50:31",
            "lastModifyUser": "12345",
            "globalVarList":[
                {
                    "id": 11,
                    "type": 1,
                    "name": "varA1",
                    "defaultValue": "valueisMe",
                    "appId": 3,
                    "taskId": 13,
                    "description": "字符串全局变量",
                    "stepIds": "1",
                    "ipListStatus": [],
                    "ccGroupInfoList": []
                },
                {
                    "id": 12,
                    "type": 2,
                    "name": "id-201782815057397",
                    "ipList": "1:10.0.0.1,1:10.0.0.2",
                    "serverSetId": "",
                    "ccServerSetId": "",
                    "appId": 3,
                    "taskId": 13,
                    "description": "IP全局变量",
                    "stepIds": "13",
                    "ipListStatus": [
                        {
                            "ip": "10.0.0.1",
                            "source": 1,
                            "alived": 0,
                            "valid": 1,
                            "name": "host",
                            "displayIp": "10.0.0.1"
                        },
                        {
                            "ip": "10.0.0.2",
                            "source": 1,
                            "alived": 0,
                            "valid": 1,
                            "name": "host",
                            "displayIp": "10.0.0.2"
                        }
                    ],
                    "ccGroupInfoList": []
                }
            ]
        },
    }
*/
