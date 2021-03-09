/**
@api {get} /api/c/compapi/bk_paas/get_app_info/ get_app_info
@apiName get_app_info
@apiGroup API-BK_PAAS
@apiVersion 1.0.0
@apiDescription 获取应用信息
@apiParam {string} app_code 应用ID
@apiParam {string} app_secret 应用TOKEN，可以通过 蓝鲸智云开发者中心 -> 点击应用ID -> 基本信息 获取
@apiParam {string} [bk_token] 当前用户登录态，可以通过Cookie获取
@apiParam {string} [username] 当前用户用户名，白名单中app可使用
@apiParam {string} [target_app_code] 目标蓝鲸应用ID，多个以英文逗号分隔，为空则表示所有应用
@apiParamExample {json} Request-Example:
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "target_app_code": "bk_test,esb_test"
    }
@apiSuccessExample {json} Success-Response
    HTTP/1.1 200 OK
    {
        "result": true,
        "code": "00",
        "message": "",
        "data": [
            {
                "app_code": "bk_test",
                "app_name": "BKTest"
            },
            {
                "app_code": "esb_test",
                "app_name": "ESBTest"
            }
        ]
    }
 */
