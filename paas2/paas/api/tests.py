# -*- coding: utf-8 -*-
"""
assert raise
"""

from django.test import TestCase
from django.test.client import RequestFactory

from api.signature import Sign


# Create your tests here.
class SignTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_clean_nonce(self):
        request = self.factory.get("/", data={})
        sign = Sign(request)

        self.assertRaises(ValueError, sign.clean_nonce)
