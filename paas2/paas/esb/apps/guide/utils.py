# -*- coding: utf-8 -*-
"""
Utils for mkdoc
"""
import os

from esb.common.django_utils import get_cur_language


def mdfile_by_name(name):
    app_dir = os.path.dirname(os.path.abspath(__file__))
    cur_languate = get_cur_language()
    return os.path.join(app_dir, "mdfiles", cur_languate, "%s.md" % name)
