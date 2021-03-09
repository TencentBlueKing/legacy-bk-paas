# -*- coding: utf-8 -*-


COLLECTIONS_PY_TMPL = '''# -*- coding: utf-8 -*-
"""Collections for component client"""
{{ import_collections }}


# Available components
AVAILABLE_COLLECTIONS = {
{{ available_collections }}
}

'''

API_PY_TMPL = '''# -*- coding: utf-8 -*-
from ..base import ComponentAPI


class Collections{{ system_name_smart }}(object):
    """Collections of {{ system_name }} APIS"""

    def __init__(self, client):
        self.client = client

{{ apis }}
'''


API_COMPONENT_TMPL = """\
        self.{api_name} = ComponentAPI(
            client=self.client, method='{suggest_method}',
            path='{api_path}',
            description=u'{description}'
        )
"""
