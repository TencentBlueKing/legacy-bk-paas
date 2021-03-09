# -*- coding: utf-8 -*-

from django.db import models

from common.constants import ApprovalResultEnum


class ESBAuthApplyRecordManager(models.Manager):
    def is_api_already_applied(self, app_code, sys_name, api_id):

        return self.filter(
            app_code=app_code,
            sys_name=sys_name,
            api_id=api_id,
            approval_result__in=[ApprovalResultEnum.APPLYING, ApprovalResultEnum.PASS],
        ).exists()
