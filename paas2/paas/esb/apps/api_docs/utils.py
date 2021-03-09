# -*- coding: utf-8 -*-
from esb.bkcore.models import ComponentSystem


def get_system_category():
    """获取文档分类"""
    systems = ComponentSystem.objects.all()
    doc_category = {}
    for system in systems:
        if not system.has_display_doc:
            continue
        system_doc_category = system.doc_category
        doc_category.setdefault(
            system_doc_category.id,
            {
                "name": system_doc_category.name_display,
                "label": system_doc_category.name_display,
                "priority": system_doc_category.priority,
                "systems": [],
            },
        )
        doc_category[system_doc_category.id]["systems"].append(
            {
                "name": system.name,
                "label": system.label_display,
                "desc": system.remark_display,
            }
        )
    doc_category = doc_category.values()
    doc_category.sort(key=lambda x: x["priority"])
    for category in doc_category:
        category["systems"].sort(key=lambda x: x["name"])
    return doc_category
