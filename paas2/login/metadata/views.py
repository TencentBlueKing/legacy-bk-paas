# -*- coding: utf-8 -*-

from django.shortcuts import render
from django.views.decorators.clickjacking import xframe_options_exempt

from bkauth.decorators import login_exempt


@xframe_options_exempt
@login_exempt
def website_metadata(request):
    return render(request, "metadata/website.json")
