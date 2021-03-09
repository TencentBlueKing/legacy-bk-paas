# -*- coding: utf-8 -*-
import datetime

from django.db import models


class AppUseRecordManager(models.Manager):
    """
    用户使用APP记录操作
    """

    def get_records(self, s_time, e_time, app_code):
        """
        获取经过过滤的app使用记录数据
        """
        all_visit = self.filter()
        if s_time:
            all_visit = all_visit.filter(use_time__gte=s_time)
        if e_time:
            delta_one_day = datetime.timedelta(days=1)
            all_visit = all_visit.filter(use_time__lt=e_time + delta_one_day)
        # 筛选
        if app_code:
            all_visit = all_visit.filter(app__code=app_code)

        return all_visit
