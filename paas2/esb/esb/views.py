# -*- coding: utf-8 -*-
from common.django_utils import JsonResponse


def handler_404_view(request):
    resp = JsonResponse(
        {
            "result": False,
            "data": None,
            "message": "The content does not exist",
        },
        status=404,
    )
    return resp


def handler_500_view(request):
    resp = JsonResponse(
        {
            "result": False,
            "data": None,
            "message": "Request is abnormal, please contact the component developer",
        },
        status=500,
    )
    return resp
