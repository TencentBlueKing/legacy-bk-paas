/**
@api {get} /api/c/compapi/bk_login/get_batch_user_platform_role/ get_batch_user_platform_role
@apiName get_batch_user_platform_role
@apiGroup API-BK_LOGIN
@apiVersion 1.0.0
@apiDescription 获取多个用户在平台应用的角色
@apiParam {string} app_code 应用ID
@apiParam {string} app_secret 应用TOKEN，可以通过 蓝鲸智云开发者中心 -> 点击应用ID -> 基本信息 获取
@apiParam {string} [bk_token] 当前用户登录态，可以通过Cookie获取
@apiParam {string} [username] 当前用户用户名，白名单中app可使用
@apiParam {string} username_list 待获取信息的用户名列表
@apiParamExample {json} Request-Example:
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "username_list": "admin;test"
    }
@apiSuccessExample {json} Success-Response
    HTTP/1.1 200 OK
    {
        "result": true,
        "code": "00",
        "message": "用户信息获取成功",
        "data": {
            "admin": {
                "bkdata": [1],
                "job": [1],
                "cmdb": [1, 2]
            }
        }
    }

@apiSuccess {Object} data 返回数据，成功返回请求数据
@apiSuccess (data) {list} role  用户角色，0：普通用户，1：超级管理员，2：开发者，3：职能化用户，4：审计员
 */
