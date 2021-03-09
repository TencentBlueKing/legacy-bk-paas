# -*- coding: utf-8 -*-
from django.views.generic import View

from common.decorators import has_apigateway_manage_permission_for_classfunc
from esb.bkcore.models import ESBBuffetMapping
from esb.common.django_utils import JsonResponse, get_error_prompt
from .forms import ESBBuffetMappingForm, EditESBBuffetMappingForm


class APIBuffetMappingView(View):
    """Check All Mappings"""

    @has_apigateway_manage_permission_for_classfunc
    def get(self, request, item_id):
        obj = ESBBuffetMapping.objects.get(pk=item_id)
        return JsonResponse({"error_message": None, "data": obj.get_info()})

    @has_apigateway_manage_permission_for_classfunc
    def post(self, request):
        form = ESBBuffetMappingForm(request.POST)
        if form.is_valid():
            obj = ESBBuffetMapping(**form.cleaned_data)
            obj.save()
            return JsonResponse({"error_message": None, "data": obj.get_info()})

        return JsonResponse(
            {
                "error_message": get_error_prompt(form),
                "data": None,
            }
        )

    @has_apigateway_manage_permission_for_classfunc
    def put(self, request, item_id):
        from django.http import QueryDict

        put = QueryDict(request.body)
        form = EditESBBuffetMappingForm(put)

        if form.is_valid():
            obj = ESBBuffetMapping.objects.get(pk=form.cleaned_data["id"])
            obj.__dict__.update(form.cleaned_data)
            obj.save()
            return JsonResponse({"error_message": None, "data": obj.get_info()})

        return JsonResponse(
            {
                "error_message": get_error_prompt(form),
                "data": None,
            }
        )

    @has_apigateway_manage_permission_for_classfunc
    def delete(self, request, item_id):
        obj = ESBBuffetMapping.objects.get(pk=item_id)
        obj.delete()
        return JsonResponse({"error_message": None, "data": None})
