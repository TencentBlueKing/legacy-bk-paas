# -*- coding: utf-8 -*-
from common.constants import FunctionControllerCodeEnum


FUNCTION_CONTROLLERS = [
    {
        "func_code": FunctionControllerCodeEnum.SKIP_USER_AUTH.value,
        "func_name": "Whether to skip user authentication",
        "wlist": (
            "bk_cmdb,bk_fta_solutions,bk_gse,bk_iam,bk_job,bk_monitor,bk_nodeman,"
            "bk_paas,bk_paas_log_alert,bk_usermgr,bk_sops,bk_log_search,bk_bklog"
        ),
    }
]
