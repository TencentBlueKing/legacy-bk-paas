/**
@api {post} /api/c/compapi/cmsi/send_qy_weixin/ send_qy_weixin
@apiName send_qy_weixin
@apiGroup API-CMSI
@apiVersion 1.0.0
@apiDescription 发送企业微信
@apiParam {string} app_code 应用ID
@apiParam {string} app_secret 应用TOKEN，可以通过 蓝鲸智云开发者中心 -> 点击应用ID -> 基本信息 获取
@apiParam {string} [bk_token] 当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取
@apiParam {string} [username] 当前用户用户名，白名单中app可使用

@apiParam {string} receiver 微信接收者，包含企业微信用户ID，多个以逗号分隔
@apiParam {string} content 消息内容，长度最长为2048字符
@apiParam {bool} [is_content_base64] 消息内容是否base64编码，默认False，不编码，请使用base64.b64encode方法编码

@apiParamExample {json} Request-Example:
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "receiver": "xxx",
        "content": "This is a Test",
    }
@apiSuccessExample {json} Success-Response
    HTTP/1.1 200 OK
    {
        "result": true,
        "code": "00",
        "message": "微信发送成功。",
    }
 * /
