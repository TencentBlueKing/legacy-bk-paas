# -*- coding: utf-8 -*-
import pytest

from common.errors import BaseException


class TestBaseException(object):
    def test_message(self):
        with pytest.raises(BaseException) as err:
            raise BaseException("test error")

        assert err.value.message == "test error"
