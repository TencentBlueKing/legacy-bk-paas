# -*- coding: utf-8 -*-
from __future__ import absolute_import  # Python 2 only

from jinja2 import Environment
from django.utils.translation import ugettext as _


def environment(**options):
    env = Environment(**options)
    env.globals.update(
        {
            "_": _,
        }
    )
    return env
