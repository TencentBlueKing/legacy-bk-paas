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

"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
"""  # noqa

from __future__ import unicode_literals

from django.views.generic import View
from django.utils import timezone

from common.responses import OKJsonResponse
from common.views.mako import MakoTemplateView
from common.mixins.base import DeveloperExemptMixin
from common.bk_iam import Permission
from common.log import logger
from home.constants import INDEX_FIRST_SHOW_APPS_COUNT
from home.models import UsefulLinks, UserSettings
from home.utils import get_user_apps
from user_center.wx_utils import get_user_wx_info


def _get_greeting_message():
    t = timezone.localtime(timezone.now())
    now_s = t.strftime("%H:%M")
    # use string compare to return greeting

    if now_s >= "23:00" or now_s < "01:00":
        return "现在是晚上 {now}，夜深了... 为了自己的身体健康，请早点休息，保持足够睡眠！".format(now=now_s)
    elif "01:00" <= now_s < "04:00":
        return "现在是凌晨 {now}！切忌劳累过度，影响身体还容易误操作，赶紧休息吧...".format(now=now_s)
    elif "04:00" <= now_s < "05:00":
        return "感谢你来见证凌晨4点的蓝鲸工作台，Mamba Forever！曼巴精神！共勉！"
    elif "05:00" <= now_s < "07:00":
        return "一年之计在于春、一日之计在于晨！早起的鸟儿有虫吃~ 伙计，加油！"
    elif "07:00" <= now_s < "11:40":
        return "上午好！专注工作之时别忘了多饮水，促进身体新陈代谢，有益身体健康噢~"
    elif "11:40" <= now_s < "12:30":
        return "午饭时间到了，肠胃很重要！记得按时就餐喔~"
    elif "12:30" <= now_s < "14:00":
        return "午饭过后，闲庭几步、小憩片刻，下午办公精神更佳！"
    elif "14:00" <= now_s < "18:00":
        return "下午好！预防「久坐成疾」，记得多起来走动走动，松松肩颈，放松片刻。"
    elif "18:00" <= now_s < "19:30":
        return "晚上好！夜间人体内消化能力偏弱，饮食切忌太饱，健康绿色膳食为宜。"
    elif "19:30" <= now_s < "23:00":
        return "晚上好！少加班，多锻炼噢~ 只要每天做好规划，不怕事情做不好！"

    return "新的一天, 从高效的工作开始！"


def _make_greeting():
    t = timezone.localtime(timezone.now())
    month, day = t.month, t.day

    return {"month": month, "day": day, "message": _get_greeting_message()}


class IndexView(DeveloperExemptMixin, MakoTemplateView):
    """站点首页"""

    template_name = "home/index.html"

    def get_context_data(self, **kwargs):
        context = super(IndexView, self).get_context_data(**kwargs)
        request = self.request

        username = request.user.username

        user_app_list = get_user_apps(username)
        user_app_count = len(user_app_list)

        # 获取常用链接
        links = UsefulLinks.objects.get_common_links()
        # 首次显示应用的个数
        # 微信相关
        wx_type, wx_userid = get_user_wx_info(request)

        has_develope_center_view_permission = False
        try:
            has_develope_center_view_permission = Permission().allowed_access_developer_center(username)
        except Exception:
            logger.exception("check has_develope_center_view_permission fail username=%s", username)

        greeting = _make_greeting()

        context.update(
            {
                "wx_type": wx_type,
                "wx_userid": wx_userid,
                "links": links,
                "user_app_count": user_app_count,
                "first_show_count": INDEX_FIRST_SHOW_APPS_COUNT,
                "user_app_list": user_app_list,
                "has_develope_center_view_permission": has_develope_center_view_permission,
                "greeting": greeting,
            }
        )
        return context


class UpdateUserAppView(DeveloperExemptMixin, View):
    """更新用户的应用列表位置"""

    http_method_names = ["post"]

    def post(self, request):
        username = request.user.username
        apps = request.POST.get("apps")
        if apps:
            UserSettings.objects.filter(username=username).update(apps=apps)
        return OKJsonResponse("排序成功")
