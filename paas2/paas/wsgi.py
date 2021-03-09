"""
WSGI config for paas project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.8/howto/deployment/wsgi/
"""

# FOR OPENSOURCE: REMOVE BEGIN
from gevent import monkey

# patches stdlib (including socket and ssl modules) to cooperate with other greenlets
monkey.patch_all()
# FOR OPENSOURCE: REMOVE END

import os  # noqa

from django.core.wsgi import get_wsgi_application  # noqa
from dj_static import Cling  # noqa

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "settings")

application = Cling(get_wsgi_application())
