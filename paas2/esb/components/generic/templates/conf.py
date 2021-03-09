# -*- coding: utf-8 -*-


SYSTEM_DOC_CATEGORY = [
    # {
    #     'label': 'Test-Catg',
    #     'priority': 100,
    #     'systems': ['TEST']    # system_name
    # },
]


SYSTEMS = [
    # {
    #     'name': 'TEST',
    #     'label': 'My Test',
    #     'remark': 'My Test',
    #     'interface_admin': 'admin',
    #     'execute_timeout': 30,
    #     'query_timeout': 30,
    # },
]


CHANNELS = [
    # TEST
    # ('/test/healthz/', {'comp_codename': 'generic.test.healthz'}),
]


# Self-service components
BUFFET_COMPONENTS = [
    # {
    #     # Register config
    #     'name': 'get template list',
    #     'system_name': 'TEST',
    #     'registed_http_method': 'GET',
    #     'registed_path': '/test/heartbeat/',
    #     'type': 2,  # 2 is query, 1 is operate
    #     # Before request
    #     'extra_headers': {
    #         'Token': '1234567890',
    #     },
    #     # Request target
    #     'dest_url': 'http://domain.test.com/test/heartbeat/',
    #     'dest_http_method': 'POST',
    #     'favor_post_ctype': 'json',   # json / form
    #     'timeout_time': 10,
    # },
]
