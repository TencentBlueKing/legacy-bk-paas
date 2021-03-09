# -*- coding: utf-8 -*-

SERVER_CATEGORY_CHOICES = [
    ("tapp", "App测试环境"),
    ("app", "App正式环境"),
]

# 正式环境 机器数
ASSIGN_PROD_NUM = 2

ENVIRONMENT_CHOICES = [("test", "测试环境"), ("prod", "正式环境")]

THIRD_SERVER_CATEGORY_MQ = "rabbitmq"
THIRD_SERVER_CATEGORY_CHOICES = [
    (THIRD_SERVER_CATEGORY_MQ, u"RabbitMQ服务"),
]
