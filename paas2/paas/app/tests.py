# -*- coding: utf-8 -*-
"""
mock request with params/data
"""

from django.test import TestCase
from django.test.client import RequestFactory

from app.utils import modify_app_db_info
from app.models import SecureInfo


# Create your tests here.
class AppModificationTestCase(TestCase):
    """
    test
    """

    def setUp(self):
        s = SecureInfo()
        s.app_code = "test_modify"
        s.save()

        self.factory = RequestFactory()

    def test_modify_app_db_info(self):
        app_code = "test_modify"
        data = {}
        request = self.factory.post("/", data=data)

        is_success, message = modify_app_db_info(app_code, request)
        self.assertFalse(is_success)

        data = {"db_host": "127.0.0.1", "db_port": "abcd", "db_username": "root", "db_password": "123456"}
        request = self.factory.post("/", data=data)
        is_success, message = modify_app_db_info(app_code, request)
        self.assertFalse(is_success)

        data = {"db_host": "127.0.0.1", "db_port": "3306", "db_username": "root", "db_password": "123456"}
        request = self.factory.post("/", data=data)
        is_success, message = modify_app_db_info(app_code, request)
        self.assertTrue(is_success)

        s = SecureInfo.objects.get(app_code=app_code)
        self.assertEqual(s.db_host, "127.0.0.1")
        self.assertEqual(s.db_port, 3306)
        self.assertEqual(s.db_username, "root")
        self.assertEqual(s.db_password, "123456")


# class AppCreateViewTestCase(TestCase):
# def test_check_app_code(self):
# resp = self.client.get('/app/check_app_code/', data={'app_code': 'testaaa'})

# self.assertEqual(resp.status_code, 200)
# print resp.body
