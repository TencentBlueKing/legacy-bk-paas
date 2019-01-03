/**
@api {post} /api/c/compapi/cmsi/send_voice_msg/ send_voice_msg
@apiName send_voice_msg
@apiGroup API-CMSI
@apiVersion 1.0.0
@apiDescription 公共语音通知
@apiParam {string} app_code 应用ID
@apiParam {string} app_secret 应用TOKEN，可以通过 蓝鲸智云开发者中心 -> 点击应用ID -> 基本信息 获取
@apiParam {string} [bk_token] 当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取
@apiParam {string} [username] 当前用户用户名，白名单中app可使用

@apiParam {string} auto_read_message 自动语音读字信息
@apiParam {array} [user_list_information] 待通知的用户列表，自动语音通知列表，若user_list_information、receiver__username同时存在，以user_list_information为准
@apiParam {string} [receiver__username] 待通知的用户列表，包含用户名，用户需在蓝鲸平台注册，多个以逗号分隔，若user_list_information、receiver__username同时存在，以user_list_information为准

@apiParam (user_list_information) {string} username 被通知人
@apiParam (user_list_information) {string} [mobile_phone] 被通知人手机号

@apiParamExample {json} Request-Example:
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "auto_read_message": "This is a test",
        "user_list_information": [{
            "username": "admin",
            "mobile_phone": "1234567890",
        }]
    }
@apiSuccessExample {json} Success-Response
    HTTP/1.1 200 OK
    {
        "result": true,
        "code": "00",
        "message": "",
        "data": {
            "instance_id": "2662152044"
        }
    }
 */
