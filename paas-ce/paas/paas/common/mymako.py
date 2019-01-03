# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from __future__ import unicode_literals

from django.conf import settings
from django.http import HttpResponse
from django.template.context import Context
from mako.lookup import TemplateLookup

from common.log import logger


mylookup = TemplateLookup(
    directories=settings.MAKO_TEMPLATE_DIR,
    module_directory=settings.MAKO_TEMPLATE_MODULE_DIR,
    output_encoding='utf-8',
    input_encoding='utf-8',
    encoding_errors='replace',
    collection_size=500,
)


def render_mako(template_name, dictionary={}, context_instance=None):
    """
    Render the mako template and return the HttpResponse

    @param template_name: 模板名字
    @param dictionary: context字典
    @param context_instance: 初始化context, 如果要使用 TEMPLATE_CONTEXT_PROCESSORS，则要使用 RequestContext(request)
    @note: 因为返回是HttpResponse，所以这个方法也适合给ajax用(dataType不是json的ajax)
    @Example:
                 render_mako('mako_temp.html',{'form':form})
            or
                 render_mako('mako_temp.html',{'form':form},RequestContext(request))
            or
                 render_mako('mako_temp.html',{},RequestContext(request，{'form':form}))
    """
    mako_temp = mylookup.get_template(template_name)
    if context_instance:
        context_instance.update(dictionary)
    else:
        context_instance = Context(dictionary)

    data = {}
    # construct date dictory
    for d in context_instance:
        data.update(d)

    return HttpResponse(mako_temp.render_unicode(**data))


def render_mako_context(request, template_name, dictionary={}):
    """
    Render the mako template with the RequestContext and return the HttpResponse
    """
    context_instance = get_context_processors_content(request)
    return render_mako(template_name, dictionary=dictionary, context_instance=context_instance)


def render_mako_tostring(template_name, dictionary={}, context_instance=None):
    """
    Render mako tostring without RequestContext.

    @note: 因为返回是string，所以这个方法适合include的子页面用
    """
    mako_temp = mylookup.get_template(template_name)
    if context_instance:
        # RequestContext(request)
        context_instance.update(dictionary)
    else:
        # 默认为Context
        context_instance = Context(dictionary)

    data = {}
    # construct date dictory
    for d in context_instance:
        data.update(d)

    # return string
    return mako_temp.render_unicode(**data)


def render_mako_tostring_context(request, template_name, dictionary={}):
    """
    Render mako tostring with RequestContext
    """
    context_instance = get_context_processors_content(request)
    return render_mako_tostring(template_name, dictionary=dictionary, context_instance=context_instance)


# def render_json(dictionary={}):
#     """
#     Return the json string for response

#     @summary: dictionary也可以是string, list数据
#     @note:  返回结果是个dict, 请注意默认数据格式:
#                                     {'result': '',
#                                      'message':''
#                                     }
#     """
#     import json
#     if type(dictionary) is not dict:
#         dictionary = {'result': True, 'message': dictionary}
#     return HttpResponse(json.dumps(dictionary))


def get_context_processors_content(request):
    """
    Return the context_processors dict context
    """
    context = Context()
    try:
        from django.utils.module_loading import import_string
        from django.template.context import _builtin_context_processors
        context_processors = _builtin_context_processors
        context_processors += tuple(settings.TEMPLATE_CONTEXT_PROCESSORS)

        cp_func_list = tuple(import_string(path) for path in context_processors)
        for processors in cp_func_list:
            context.update(processors(request))
    except Exception as e:
        logger.exception('Mako: get_context_processors_content:%s', e)
        context = Context()
    return context
