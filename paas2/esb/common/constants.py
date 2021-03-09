# -*- coding: utf-8 -*-
from enum import Enum

from common.base_utils import FancyDict


COMPONENT_STATUSES = FancyDict(
    (
        ("ARGUMENT_ERROR", 0),
        ("PENDING", 1),
        ("EXECUTING", 2),
        ("SUCCESS", 3),
        ("FAILURE", 4),
        ("EXCEPTION", 5),
        ("UNABLE_TO_CYCLE", 6),
        ("PENDING_TOO_LONG", 7),
    )
)


API_TYPE_OP = "operate"
API_TYPE_Q = "query"

HTTP_METHOD = FancyDict(
    (
        ("GET", "GET"),
        ("POST", "POST"),
    )
)


class CacheTimeLevel(Enum):

    CACHE_TIME_SHORT = 5 * 60
    CACHE_TIME_MEDIUM = 3600
    CACHE_TIME_LONG = 24 * 3600


CACHE_MAXSIZE = 2000


class FunctionControllerCodeEnum(Enum):

    SKIP_USER_AUTH = "user_auth::skip_user_auth"
    JWT_KEY = "jwt::private_public_key"
