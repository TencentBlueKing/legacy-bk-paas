# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations


def load_data(apps, schema_editor):
    """
    初始化壁纸
    """
    Wallpaper = apps.get_model("desktop", "Wallpaper")
    wid_list = [i+1 for i in xrange(30)]
    wallpaper_list = [Wallpaper(name=u"壁纸%s" % i, number=i, width=1920, height=1080) for i in wid_list]
    if wallpaper_list:
        Wallpaper.objects.bulk_create(wallpaper_list)
    # 设置默认壁纸
    Wallpaper.objects.filter(number=1).update(is_default=True)


class Migration(migrations.Migration):

    dependencies = [
        ('desktop', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(load_data)
    ]
