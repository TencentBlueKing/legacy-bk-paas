from .default import *  # noqa: F403,F401

DEBUG = True

# Database
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": "esb_unittest",
    }
}

LOG_LEVEL = "INFO"
