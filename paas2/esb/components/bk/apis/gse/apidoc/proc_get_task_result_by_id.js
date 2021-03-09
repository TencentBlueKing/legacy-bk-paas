/**
@api {get} /api/c/compapi/gse/proc_get_task_result_by_id/ proc_get_task_result_by_id
@apiName proc_get_task_result_by_id
@apiGroup API-GSE
@apiVersion 1.0.0
@apiDescription 进程管理：获取任务结果
@apiParam {string} app_code 应用ID
@apiParam {string} app_secret 应用TOKEN，可以通过 蓝鲸智云开发者中心 -> 点击应用ID -> 基本信息 获取
@apiParam {string} [bk_token] 当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取
@apiParam {string} [username] 当前用户用户名，白名单中app可使用

@apiParam {string} task_id 执行命令后产生的任务ID，可在proc_run_command接口中找到

@apiParamExample {json} Request-Example:
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "task_id": "GSEPROC:20160301111111:1"
    }

@apiSuccessExample {json} Success-Response
    HTTP/1.1 200 OK
    {
        "result": true,
        "code": "00",
        "message": "success",
        "data": {
            "failed": [],
            "execInfo": [
                "*.*.*.* matching..."
            ],
            "error_code": 0,
            "error_msg": "success",
            "success": [
                {
                    "proc_id": "test.test.1.1",
                    "seq_id": "",
                    "ipaddr": "10.0.0.1",
                    "app_id": "1",
                    "content": "xxx",
                    "host_name": "yyy",
                    "env_id": "1",
                    "error_code": 0,
                    "error_msg": "success",
                    "end_time": 1302248902
                }
            ]
        }
    }

@apiSuccess (data) {int} error_code 任务状态码，0表示成功，804表示执行中，其他表示失败
*/
