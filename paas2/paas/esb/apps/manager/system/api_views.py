# -*- coding: utf-8 -*-
from django.views.generic import View
from django.utils.translation import ugettext as _

from common.decorators import has_apigateway_manage_permission_for_classfunc
from esb.common.django_utils import JsonResponse
from esb.bkcore.models import ComponentSystem, ESBChannel, ESBBuffetComponent
from .forms import ComponentSystemForm


class DeletedSystemView(View):
    """Deleted system view"""

    @has_apigateway_manage_permission_for_classfunc
    def post(self, request):
        system_ids = request.POST.get("system_ids")
        system_ids = system_ids.split(",") if system_ids else []
        objs = ComponentSystem.objects.filter(id__in=system_ids)
        ESBChannel.objects.filter(component_system__in=objs).delete()
        ESBBuffetComponent.objects.filter(system__in=objs).delete()
        affected_rows = objs.count()
        objs.delete()
        return JsonResponse({"affected_rows": affected_rows, "error_message": None})


class AddSystemView(View):
    """添加系统"""

    @has_apigateway_manage_permission_for_classfunc
    def post(self, request):
        form = ComponentSystemForm(request.POST)
        if form.is_valid():
            form.save()
            data = form.cleaned_data
            data["id"] = form.instance.id
            data["display_name"] = form.instance.get_display_name()
            return JsonResponse({"result": True, "data": data})

        error_message = ";".join([",".join([_(err) for err in field_error]) for field_error in form.errors.values()])
        return JsonResponse({"result": False, "error_message": error_message})
