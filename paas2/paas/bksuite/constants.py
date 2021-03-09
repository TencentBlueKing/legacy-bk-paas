# -*- coding: utf-8 -*-
from django.utils.translation import ugettext as _


# 蓝鲸产品信息表名
PRODUCTION_INFO_TABLE_NAME = "production_info"

# 查询蓝鲸版本的SQL语句
BKSUITE_QUERY_SQL = "SELECT * FROM {table_name} WHERE code='{bksuite_code}'".format(
    table_name=PRODUCTION_INFO_TABLE_NAME, bksuite_code="bksuite"
)

# 查询所有产品信息
ALL_PRODUCTION_QUERY_SQL = "SELECT * FROM {table_name} ORDER BY code".format(table_name=PRODUCTION_INFO_TABLE_NAME)


PRODUCTION_NAME_DICT = {
    u"数据基础模块": _(u"数据基础模块"),
    u"数据平台官网": _(u"数据平台官网"),
    u"数据集成服务": _(u"数据集成服务"),
    u"数据开发服务": _(u"数据开发服务"),
    u"蓝鲸企业版": _(u"蓝鲸企业版"),
    u"配置平台": _(u"配置平台"),
    u"故障自愈": _(u"故障自愈"),
    u"管控平台": _(u"管控平台"),
    u"作业平台": _(u"作业平台"),
    u"全局认证服务": _(u"全局认证服务"),
    u"PaaS平台": _(u"PaaS平台"),
    u"PaaS 平台": _(u"PaaS 平台"),
    u"paas_agent": _(u"paas_agent"),
}
