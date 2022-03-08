# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS
Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
You may obtain a copy of the License at http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.
"""

from django.utils.translation import ugettext as _

from common.decorators import app_exists, has_app_develop_or_smart_develop_permission, escape_exempt
from common.mymako import render_mako_context, render_json
from common.log import logger
from common.constants import ModeEnum
from app_env.models import AppEnvVar
from app_env.constants import ENV_MODE_TYPE_CHOICES
from app_env.validators import validate_id, validate_env_var_value, validate_env_var_name


@app_exists
@has_app_develop_or_smart_develop_permission
def home(request, app_code):
    """
    环境变量管理页面
    """
    base_tpl = "/base_app.html"
    if request.GET.get("is_saas") == "1":
        base_tpl = "/base_saas.html"

    result = {"app_code": app_code, "is_allow": True, "base_tpl": base_tpl}

    env_vars = AppEnvVar.objects.filter(app_code=app_code).all()
    result["env_vars"] = env_vars

    #  result['mode_choices'] = ENV_MODE_TYPE_CHOICES
    trans_dict = []
    for k, v in ENV_MODE_TYPE_CHOICES:
        trans_dict.append((k, _(v)))

    result["mode_choices"] = trans_dict

    mode_choices_html = ['<select class="form-control env_mode">']
    for key, value in ENV_MODE_TYPE_CHOICES:
        mode_choices_html.append(u'<option value="{key}" > {value} </option>'.format(key=key, value=value))
    mode_choices_html.append("<select>")
    result["mode_choices_html"] = "".join(mode_choices_html)

    return render_mako_context(request, "app_env/home.html", result)


@app_exists
@has_app_develop_or_smart_develop_permission
@escape_exempt
def add_or_update_env_var(request, app_code):
    name = request.POST.get("name", "")
    value = request.POST.get("value", "")
    intro = request.POST.get("intro", "")
    mode = request.POST.get("mode", "")
    id = request.POST.get("id")

    # validate
    if id:
        is_valid, message = validate_id(id)
        if not is_valid:
            return render_json({"result": False, "msg": message})
        id = int(id)

    is_valid, message = validate_env_var_name(name)
    if not is_valid:
        return render_json({"result": False, "msg": message})

    is_valid, message = validate_env_var_value(value)
    if not is_valid:
        return render_json({"result": False, "msg": message})

    # FORMAT TO: BKAPP_*
    name = "BKAPP_%s" % name

    extra_modes = (
        [mode, ModeEnum.ALL]
        if mode in (ModeEnum.TEST, ModeEnum.PROD)
        else [ModeEnum.ALL, ModeEnum.TEST, ModeEnum.PROD]
    )

    # do add
    if not id:
        if AppEnvVar.objects.filter(app_code=app_code, mode__in=extra_modes, name=name).exists():
            msg = _(u"变量名已经存在, 请勿重复添加!")
            return render_json({"result": False, "msg": msg})

        try:
            env_var = AppEnvVar.objects.create(app_code=app_code, mode=mode, name=name, value=value, intro=intro)

        except Exception:
            # 保存app环境变量异常
            logger.exception(u"Save the app environment variable abnormal")
            msg = _(u"保存app环境变量失败")
            return render_json({"result": False, "msg": msg})
    # do update
    else:
        if AppEnvVar.objects.filter(app_code=app_code, mode__in=extra_modes, name=name).exclude(id=id).exists():
            msg = _(u"同名变量已经存在! 无法对当前变量进行更新")
            return render_json({"result": False, "msg": msg})

        env_var = AppEnvVar.objects.get(id=id)
        env_var.name = name
        env_var.value = value
        env_var.intro = intro
        env_var.mode = mode
        env_var.save()

    return render_json({"result": True, "msg": _(u"保存变量成功"), "id": env_var.id})


@app_exists
@has_app_develop_or_smart_develop_permission
def delete_env_var(request, app_code):
    id = request.POST.get("id")

    is_valid, message = validate_id(id)
    if not is_valid:
        return render_json({"result": False, "msg": message})
    id = int(id)

    try:
        AppEnvVar.objects.filter(id=id).delete()
    except Exception:
        # 删除app环境变量异常
        logger.exception(u"Delete app environment variables abnormal")

        return render_json({"result": False, "msg": _(u"删除app环境变量失败")})

    return render_json({"result": True, "msg": _(u"删除成功")})
