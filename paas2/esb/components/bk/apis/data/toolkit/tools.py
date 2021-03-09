# -*- coding: utf-8 -*-
import urlparse

from esb.bkcore.models import ESBBuffetComponent


def make_esb_conf_with_buffet_data():
    system_id = 5
    url_prefix = "/data"
    buffets = ESBBuffetComponent.objects.filter(system_id=system_id).order_by("registed_path")
    esb_conf = []
    for component in buffets:
        parsed_url = urlparse.urlparse(component.dest_url)
        esb_conf.append(
            u"""
                    ('%s%s', {
                        'comp_codename': 'generic.data.data_component',
                        'method': '%s',
                        'comp_conf': {
                            'dest_path': '%s',
                            'dest_http_method': '%s',
                            'name': '%s',
                            'label': u'%s',
                        }
                    }),"""
            % (
                url_prefix,
                component.registed_path,
                component.registed_http_method,
                parsed_url.path,
                component.dest_http_method,
                component.registed_path.strip("/").replace("/", "_").replace("{", "").replace("}", ""),
                component.name,
            )
        )
    print "".join(esb_conf)

    print "count: %s" % len(esb_conf)
