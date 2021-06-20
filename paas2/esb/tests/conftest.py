# -*- coding: utf-8 -*-
import uuid

import pytest
from django.test import RequestFactory


@pytest.fixture(scope="class")
def request_factory():
    return RequestFactory()


@pytest.fixture
def fake_request(request_factory):
    return request_factory.get("")


@pytest.fixture
def unique_id():
    return uuid.uuid4().hex
