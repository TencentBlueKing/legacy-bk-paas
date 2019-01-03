/**
@api {post} /api/c/compapi/cmsi/send_weixin/ send_weixin
@apiName send_weixin
@apiGroup API-CMSI
@apiVersion 1.0.0
@apiDescription 发送微信消息
@apiParam {string} app_code 应用ID
@apiParam {string} app_secret 应用TOKEN，可以通过 蓝鲸智云开发者中心 -> 点击应用ID -> 基本信息 获取
@apiParam {string} [bk_token] 当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取
@apiParam {string} [username] 当前用户用户名，白名单中app可使用

@apiParam {string} [receiver] 微信接收者，包含绑定在指定公众号上的微信用户的 openid 或 企业号上的微信用户的用户ID，多个以逗号分隔 |
@apiParam {string} [receiver__username] 微信接收者，包含用户名，用户需在蓝鲸平台注册，多个以逗号分隔，若receiver、receiver__username同时存在，以receiver为准
@apiParam {dict} data 消息内容

@apiParam (data) {string} heading 通知头部文字
@apiParam (data) {string} message 通知文字
@apiParam (data) {string} [date] 通知发送时间，默认为当前时间 "YYYY-mm-dd HH:MM"
@apiParam (data) {string} [remark] 通知尾部文字
@apiParam (data) {bool} [is_message_base64] 通知文字message是否base64编码，默认False，不编码，若编码请使用base64.b64encode方法

@apiParamExample {json} Request-Example:
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "receiver": "xxx",
        "data": {
            "heading": "蓝鲸平台通知",
            "message": "This 是 a test.",
            "date": "2017-02-22 15:36",
            "remark": "zhen 是一个测试！"
        }
    }
@apiSuccessExample {json} Success-Response
    HTTP/1.1 200 OK
    {
        "result": true,
        "code": "00",
        "message": "微信消息发送成功。",
    }
*/
