/**
@api {post} /api/c/compapi/cmsi/send_mail/ send_mail
@apiName send_mail
@apiGroup API-CMSI
@apiVersion 1.0.0
@apiDescription 发送邮件
@apiParam {string} app_code 应用ID
@apiParam {string} app_secret 应用TOKEN，可以通过 蓝鲸智云开发者中心 -> 点击应用ID -> 基本信息 获取
@apiParam {string} [bk_token] 当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取
@apiParam {string} [username] 当前用户用户名，白名单中app可使用

@apiParam {string} [receiver] 邮件接收者，包含邮件完整地址，多个以逗号分隔，若receiver、receiver__username同时存在，以receiver为准
@apiParam {string} [receiver__username] 邮件接收者，包含用户名，用户需在蓝鲸平台注册，多个以逗号分隔，若receiver、receiver__username同时存在，以receiver为准
@apiParam {string} [sender] 发件人
@apiParam {string} title 邮件主题
@apiParam {string} content 邮件内容
@apiParam {string} [cc] 抄送人，包含邮件完整地址，多个以逗号分隔
@apiParam {string} [cc__username] 抄送人，包含用户名，用户需在蓝鲸平台注册，多个以逗号分隔，若cc、cc__username同时存在，以cc为准
@apiParam {string} [body_format] 邮件格式，包含'Html', 'Text'，默认为'Html'
@apiParam {bool} [is_content_base64] 邮件内容是否base64编码，默认False，不编码，请使用base64.b64encode方法编码

@apiParamExample {json} Request-Example:
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "receiver": "admin@bking.com",
        "sender": "admin@bking.com",
        "title": "This is a Test",
        "content": "<html>Welcome to Blueking</html>",
    }
@apiSuccessExample {json} Success-Response
    HTTP/1.1 200 OK
    {
        "result": true,
        "code": "00",
        "message": "邮件发送成功。",
    }
*/
