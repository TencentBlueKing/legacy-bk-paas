/**
@api {post} /api/c/compapi/cmsi/send_sms/ send_sms
@apiName send_sms
@apiGroup API-CMSI
@apiVersion 1.0.0
@apiDescription 发送短信
@apiParam {string} app_code 应用ID
@apiParam {string} app_secret 应用TOKEN，可以通过 蓝鲸智云开发者中心 -> 点击应用ID -> 基本信息 获取
@apiParam {string} [bk_token] 当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取
@apiParam {string} [username] 当前用户用户名，白名单中app可使用

@apiParam {string} [receiver] 短信接收者，包含接收者电话号码，多个以逗号分隔，若receiver、receiver__username同时存在，以receiver为准
@apiParam {string} [receiver__username] 短信接收者，包含用户名，用户需在蓝鲸平台注册，多个以逗号分隔，若receiver、receiver__username同时存在，以receiver为准
@apiParam {string} content 短信内容
@apiParam {bool} [is_content_base64] 消息内容是否base64编码，默认False，不编码，请使用base64.b64encode方法编码

@apiParamExample {json} Request-Example:
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "receiver": "1234567890",
        "receiver__username": "admin",
        "content": "Welcome to Blueking",
    }
@apiSuccessExample {json} Success-Response
    HTTP/1.1 200 OK
    {
        "result": true,
        "code": "00",
        "message": "短信发送成功。",
    }

 */
