# -*- coding: utf-8 -*-
import pytest

from common.base_validators import ValidationError


class TestValidationError(object):
    def test_message(self):
        with pytest.raises(ValidationError) as err:
            raise ValidationError("test error")

        assert err.value.message == "test error"
