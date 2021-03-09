# -*- coding: utf-8 -*-

import mock

from account.models import BkUser
from django.test import TestCase, Client


def mock_is_bk_token_valid(request):
    return True, request.user


class HomeRedirectTestCase(TestCase):
    def setUp(self):
        self.client = Client()

        self.username = "test"
        self.email = "test@test.com"
        self.password = "12345"
        self.test_user = BkUser.objects.create(username=self.username, email=self.email, password=self.password)

    @mock.patch("account.accounts.Account.is_bk_token_valid", side_effect=mock_is_bk_token_valid)
    def test_home_redirect(self, mocked_func):
        assert not mocked_func.called
        login = self.client.login(username=self.username, password=self.password)

        assert login

        self.assertIn("_auth_user_id", self.client.session)

        resp = self.client.get("/", follow=False)
        self.assertEqual(301, resp.status_code)

        # self.assertRedirects(resp, '/console/', status_code=301, fetch_redirect_response=False)
        # /console/独立跑是访问不到的
        self.assertRedirects(resp, "/console/", status_code=301, target_status_code=404)

        assert mocked_func.called
