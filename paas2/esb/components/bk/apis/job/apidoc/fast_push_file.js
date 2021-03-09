/**
@api {post} /api/c/compapi/job/fast_push_file/ fast_push_file
@apiName fast_push_file
@apiGroup API-JOB
@apiVersion 1.0.0
@apiDescription 快速分发文件
@apiParam {string} app_code 应用ID
@apiParam {string} app_secret 应用TOKEN，可以通过 蓝鲸智云开发者中心 -> 点击应用ID -> 基本信息 获取
@apiParam {string} [bk_token] 当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取
@apiParam {string} [username] 当前用户用户名，白名单中app可使用

@apiParam {int} app_id 业务ID
@apiParam {array} file_source 源文件信息，包含内容见下面参数描述
@apiParam {string} file_target_path 目标路径
@apiParam {array} ip_list 目标机器，包含内容见下面参数描述
@apiParam {int} [target_app_id] 目标机器所属业务，全业务需要
@apiParam {string} account 目标机器账户名

@apiParam (file_source) {int} [source_app_id] 为源机器所属业务，全业务需要
@apiParam (file_source) {string} file 源文件路径
@apiParam (file_source) {array} ip_list IP信息，其中包含ip（源文件服务器IP）和source（IP的子网ID）
@apiParam (file_source) {string} account 源文件服务器账户名

@apiParam (ip_list) {string} ip IP地址
@apiParam (ip_list) {int} source 子网ID
@apiParamExample {json} Request-Example:
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "app_id": "46",
        "file_source": [
            {
                "account": "root",
                "ip_list": [
                    {
                        "ip": "10.0.0.1",
                        "source": 1
                    }
                ],
                "file": "/tmp/tmp.txt"
            }
        ],
        "account": "root",
        "file_target_path": "/tmp",
        "ip_list": [
            {
                "ip": "10.0.0.2",
                "source": 1
            }
        ],
    }
@apiSuccessExample {json} Success-Response
    HTTP/1.1 200 OK
    {
        "result": true,
        "code": "00",
        "message": "",
        "data": {
            "taskInstanceName": "API分发文件1456316951760",
            "taskInstanceId": 10000
        }
    }
*/
