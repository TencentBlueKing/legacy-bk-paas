# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
from __future__ import unicode_literals
import datetime

from django.utils import timezone

from common.constants import DATETIME_FORMAT_STRING


def _parse_datetime(date_string, format_string, zone=None, target_zone=None):
    """
    将不带时区的字符串转为目标时区的时间
    :param date_string:时间字符串
    :param format_string:时间字符串格式
    :param zone:时间字符串的时区，默认为本地时区
    :param target_zone: 目标时区，默认为本地时区
    """
    # get a naive datetime
    naive_dt = datetime.datetime.strptime(date_string, format_string)
    # makes a naive datetime.datetime in a given time zone aware.
    aware_dt = timezone.make_aware(naive_dt, zone)
    # converts an aware datetime.datetime to local time.
    target_aware_dt = timezone.localtime(aware_dt, target_zone)
    return target_aware_dt


def parse_local_datetime(date_string, format_string=DATETIME_FORMAT_STRING, zone=None):
    """
    将不带时区的字符串转为本地时区的时间
    :param date_string:时间字符串
    :param format_string:时间字符串格式
    :param zone:时间字符串的时区，默认为本地时区
    """
    return _parse_datetime(date_string, format_string, zone=zone)


def parse_utc_datetime(date_string, format_string=DATETIME_FORMAT_STRING, zone=None):
    """
    将不带时区的字符串转为UTC时区的时间
    :param date_string:时间字符串
    :param format_string:时间字符串格式
    :param zone:时间字符串的时区，默认为本地时区
    """
    return _parse_datetime(date_string, format_string, zone=zone, target_zone=timezone.utc)
