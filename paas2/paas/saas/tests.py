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

from builtins import object
import os
import json
from tempfile import NamedTemporaryFile

from django.test import TestCase
from django.core.files import File

# from mock import Mock

from settings import APP_TEST_URL, APP_PROD_URL
from app.models import App
from saas.models import SaaSApp, SaaSAppVersion, SaaSUploadFile
from saas.validators import validate_upload_file, validate_upload_page
from saas.utils import is_paas_version_too_low, update_online_version


###########
#  model  #
###########

# NOTE: 测试model中包含的方法
class SaaSAppModeTestCase(TestCase):
    """"""

    def test_property(self):
        code = "bk_test"
        saas_app = SaaSApp()
        saas_app.code = code
        saas_app.name = code

        # logo none
        self.assertEqual(saas_app.logo_url, "/static/img/app_logo/default.png")

        version = SaaSAppVersion()
        version.version = "1.0.0"

        self.assertEqual(saas_app.version, "")

        saas_app.online_version = version
        saas_app.current_version = None
        self.assertEqual(saas_app.version, version.version)

        saas_app.online_version = None
        saas_app.current_version = version
        self.assertEqual(saas_app.version, version.version)

        self.assertEqual(saas_app.app_test_url, APP_TEST_URL.format(app_code=code))
        self.assertEqual(saas_app.app_prod_url, APP_PROD_URL.format(app_code=code))

        self.assertFalse(saas_app.is_already_online)
        self.assertFalse(saas_app.is_already_test)
        self.assertEqual(saas_app.state, 1)
        # self.assertEqual(saas_app.saas_state_display, u"未部署")

    def test_methods(self):
        code = "bk_test"
        saas_app = SaaSApp()
        saas_app.code = code
        saas_app.name = code

        self.assertEqual(saas_app.is_already_deployed("test"), saas_app.is_already_test)
        self.assertEqual(saas_app.is_already_deployed("prod"), saas_app.is_already_online)

        self.assertEqual(saas_app.get_saas_version("test"), saas_app.test_version)
        self.assertEqual(saas_app.get_saas_version("prod"), saas_app.online_version)


class SaaSAppVersionModelTestCase(TestCase):
    """
    SaaSAppVersion Model测试用例
    """

    def setUp(self):
        app = App()
        app.code = "saasapp_t1"
        app.name = "saasapp_t1"
        app.save()

        upload_file = SaaSUploadFile()
        upload_file.name = "test"
        upload_file.md5 = "md5xxxxxxx"
        upload_file.save()

        saas_app = SaaSApp()
        saas_app.app = app
        saas_app.code = "saasapp_t1"
        saas_app.name = "saasapp_t1"
        saas_app.save()

        version = SaaSAppVersion()
        version.version = "1.0.0"
        version.saas_app = saas_app
        version.upload_file = upload_file
        version.settings = "sdfasfsafsaf"
        version.save()

    def test_get_settings(self):

        version = SaaSAppVersion.objects.get(saas_app__app__code="saasapp_t1")

        settings = version.get_settings()
        self.assertEqual(settings, {})

        data = {"a": 1, "b": 2}
        version.settings = json.dumps(data)
        settings = version.get_settings()
        self.assertDictEqual(settings, data)

    def test_get_settings_for_deploy(self):
        version = SaaSAppVersion.objects.get(saas_app__app__code="saasapp_t1")

        upload_file = version.upload_file

        tmp_file = NamedTemporaryFile()
        md5 = "md5"
        url = "/media/saas_files/%s" % os.path.basename(tmp_file.name)

        upload_file.name = "test"
        upload_file.md5 = md5
        upload_file.file = File(tmp_file)
        upload_file.save()

        settings = version.get_settings_for_deploy()
        self.assertEqual(settings.get("url"), url)
        self.assertEqual(settings.get("md5"), md5)

    def test_get_version_info(self):
        """"""
        version = SaaSAppVersion.objects.get(saas_app__app__code="saasapp_t1")

        version.settings = json.dumps({"a": 1, "b": 2})

        data = {
            "file_md5": u"md5xxxxxxx",
            "file_name": u"test",
            "file_size": None,
            "settings": u'{<br>&nbsp;&nbsp;&nbsp;&nbsp;"a":&nbsp;1,&nbsp;<br>&nbsp;&nbsp;&nbsp;&nbsp;"b":&nbsp;2<br>}',
            "version": u"1.0.0",
        }

        self.assertDictEqual(version.get_version_info(), data)


#############
#  manager  #
#############


###########
#  utils  #
###########


class UploadFileValidationTestCase(TestCase):
    """
    测试上传版本时的validate方法
    """

    def setUp(self):
        """
        NOTE: setUp, 进入测试前调用, 这里保存一个对象
        """
        s = SaaSApp()
        s.code = "bk_exist"
        s.name = "bk_exist"
        s.save()

    # NOTE: 纯逻辑代码
    def test_validate_upload_page_success(self):
        app_code = "bk_test"
        saas_app_code = "bk_test"

        is_valid, message = validate_upload_page(app_code, saas_app_code)
        self.assertTrue(is_valid)

    def test_validate_upload_page_0_exists(self):
        app_code = "0"
        saas_app_code = "bk_exist"
        is_valid, message = validate_upload_page(app_code, saas_app_code)
        self.assertFalse(is_valid)

    def test_validate_upload_page_0_not_exists(self):
        app_code = "0"
        saas_app_code = "bk_test"
        is_valid, message = validate_upload_page(app_code, saas_app_code)
        self.assertTrue(is_valid)

    def test_validate_upload_page_not_0_not_equal(self):
        app_code = "bk_test"
        saas_app_code = "bk_test2"
        is_valid, message = validate_upload_page(app_code, saas_app_code)
        self.assertFalse(is_valid)

    def test_validate_upload_page_not_0_equal(self):
        app_code = "bk_test"
        saas_app_code = "bk_test"
        is_valid, message = validate_upload_page(app_code, saas_app_code)
        self.assertTrue(is_valid)

    # NOTE: 需要模拟文件对象/文件名
    def test_validate_upload_file_none(self):
        file = None
        is_valid, message = validate_upload_file(file)
        self.assertFalse(is_valid)

    def test_validate_upload_file_not_none_no_name(self):
        class A(object):
            pass

        f = A()
        f.name = None
        is_valid, message = validate_upload_file(f)
        self.assertFalse(is_valid)

    def test_validate_upload_file_not_none_wrong_name(self):
        class A(object):
            pass

        f = A()
        f.name = "a.zip"
        is_valid, message = validate_upload_file(f)
        self.assertFalse(is_valid)

    def test_validate_upload_file_not_none_right_name(self):
        class A(object):
            pass

        f = A()
        f.name = "a.tar.gz"
        is_valid, message = validate_upload_file(f)
        self.assertTrue(is_valid)


class PaaSVersionTooLowTestCase(TestCase):
    # NOTE: 纯逻辑验证
    def test_is_paas_version_too_low_none(self):
        app_name = "test"
        platform_version = None
        is_valid, message = is_paas_version_too_low(app_name, platform_version)
        self.assertFalse(is_valid)

    def test_is_paas_version_too_low(self):
        app_name = "test"
        platform_version = "100.0.0"
        is_valid, message = is_paas_version_too_low(app_name, platform_version)
        self.assertTrue(is_valid)

    def test_is_paas_version_too_low_right(self):
        app_name = "test"
        platform_version = "1.0.0"
        is_valid, message = is_paas_version_too_low(app_name, platform_version)
        self.assertFalse(is_valid)


class SaaSAppOperationTestCase(TestCase):
    """
    测试SaaSApp相关操作动作
    """

    def setUp(self):
        """
        app - saasapp - saasappversion - uploadfile
        """
        app = App()
        app.code = "saasapp_t1"
        app.name = "saasapp_t1"
        app.save()

        upload_file = SaaSUploadFile()
        upload_file.name = "test"
        upload_file.md5 = "md5xxxxxxx"
        upload_file.save()

        saas_app = SaaSApp()
        saas_app.app = app
        saas_app.code = "saasapp_t1"
        saas_app.name = "saasapp_t1"
        saas_app.save()

        version = SaaSAppVersion()
        version.version = "1.0.0"
        version.saas_app = saas_app
        version.upload_file = upload_file
        version.save()

        saas_app.current_version = version
        saas_app.current_test_version = version
        saas_app.save()

    def test_update_online_version_test(self):
        app_code = "saasapp_t1"
        mode = "test"

        is_success = update_online_version(app_code, mode)
        self.assertTrue(is_success)

        s = SaaSApp.objects.get(code=app_code)
        self.assertEqual(s.test_version, s.current_test_version)

    def test_update_online_version_prod(self):
        app_code = "saasapp_t1"
        mode = "prod"

        is_success = update_online_version(app_code, mode)
        self.assertTrue(is_success)

        s = SaaSApp.objects.get(code=app_code)
        self.assertIsNone(s.test_version)
        self.assertEqual(s.online_version, s.current_version)


###########
#  views  #
###########
