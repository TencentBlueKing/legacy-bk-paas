# -*- coding: utf-8 -*-
from enum import Enum


class ChoicesEnum(Enum):
    """Enum with choices"""

    @classmethod
    def get_choices(cls):
        return cls._choices_labels.value

    @classmethod
    def get_choice_label(cls, value):
        if isinstance(value, Enum):
            value = value.value
        return dict(cls.get_choices()).get(value, value)
