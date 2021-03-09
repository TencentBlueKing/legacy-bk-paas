#!/usr/bin/env python
# encoding: utf-8

from django.db import models
from django.db.models import Q

from common.log import logger
from common.constants import ModeEnum
from common.utils.file import file_size_bytes_to_m


class SaaSAppManager(models.Manager):
    def is_already_exist(self, app_code):
        return self.filter(code=app_code).exists()

    def query_app_list(self, keyword, hide_outline, page, page_size):
        start = (page - 1) * page_size
        end = page * page_size
        # base
        app_all_list = self.all().order_by("-created_time")
        # 获取应用
        if keyword:
            app_all_list = app_all_list.filter(Q(name__icontains=keyword) | Q(code__icontains=keyword))
        # 过滤已经下架的应用
        if hide_outline == 0:
            app_all_list = app_all_list.exclude(app__state=0)

        total = app_all_list.count()
        app_list = app_all_list[start:end]

        return total, app_list

    def update_online_version(self, app, mode):
        saas_app = self.get(app=app)

        if mode == ModeEnum.TEST:
            saas_app.test_version = saas_app.current_test_version
        elif mode == ModeEnum.PROD:
            saas_app.online_version = saas_app.current_version
        saas_app.save()

    def update_current_version(self, app, mode, saas_app_version):
        saas_app = self.get(app=app)
        if mode == ModeEnum.PROD:
            saas_app.current_version = saas_app_version
        else:
            saas_app.current_test_version = saas_app_version
        saas_app.save()

    def get_queryset(self):
        # PaaS3.0 上创建的应用和已经迁移到 PaaS3.0 的应用不在 PaaS2.0 上展示
        return super(SaaSAppManager, self).get_queryset().filter(
            Q(app=None) | Q(app__from_paasv3=False, app__migrated_to_paasv3=False))


class SaaSVersionManager(models.Manager):
    def get_version_list(self, saas_app, limit=10):
        if not saas_app:
            return []

        saas_versions = self.filter(saas_app=saas_app).all()
        # sorted by version
        try:
            saas_versions = sorted(saas_versions, key=lambda s: list(map(int, s.version.split("."))), reverse=True)
        except Exception:
            logger.exception("there got one wrong version in the saas list")
            saas_versions = sorted(saas_versions, key=lambda s: s.version, reverse=True)

        # then limit
        saas_versions = saas_versions[:limit]

        records = []
        for sv in saas_versions:
            size = file_size_bytes_to_m(sv.upload_file.size)
            records.append(
                {
                    "id": sv.id,
                    "version": sv.version,
                    "file_name": sv.upload_file.name,
                    "file_size": size,
                    "file_uploaded_at": sv.upload_file.uploaded_at_display,
                }
            )

        try:
            s_records = sorted(records, key=lambda r: r["file_uploaded_at"], reverse=True)
            records = s_records
        except Exception:
            logger.exception("sort by file_uploaded_at fail")

        return records


class SaaSUploadFileManager(models.Manager):
    def save_upload_file(self, name, size, md5, file):
        from saas.models import SaaSUploadFile

        saas_upload_file = SaaSUploadFile()
        saas_upload_file.name = name
        saas_upload_file.size = size
        saas_upload_file.md5 = md5
        saas_upload_file.file = file
        saas_upload_file.save()

        return saas_upload_file
