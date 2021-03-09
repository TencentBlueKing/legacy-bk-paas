# -*- coding: utf-8 -*-
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
