# -*- coding: utf-8 -*-
# 蓝鲸登录方式：bk_login
# 企业内部Username-password登录方式：enterprise_ldap
# 自定义登录方式：custom_login
LOGIN_TYPE = "custom_login"

# 默认bk_login，无需设置其他配置

###########################
# 自定义登录 custom_login   #
###########################
# 配置自定义登录请求和登录回调的响应函数, 如：CUSTOM_LOGIN_VIEW = 'ee_official_login.oauth.google.views.login'
CUSTOM_LOGIN_VIEW = "ee_official_login.mock.views.login"
# 配置自定义验证是否登录的认证函数, 如：CUSTOM_AUTHENTICATION_BACKEND = 'ee_official_login.oauth.google.backends.OauthBackend'
CUSTOM_AUTHENTICATION_BACKEND = "ee_official_login.mock.backends.MockBackend"
