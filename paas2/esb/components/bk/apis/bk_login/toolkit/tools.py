# -*- coding: utf-8 -*-


def convert_user_info(user):
    return {
        "username": user.get("bk_username", ""),
        "qq": user.get("qq", ""),
        "language": user.get("language", ""),
        "wx_userid": user.get("wx_userid", ""),
        "time_zone": user.get("time_zone", ""),
        "phone": user.get("telephone", ""),
        "role": str(user.get("bk_role", 0)),
        "email": user.get("email"),
        "chname": user.get("display_name"),
    }
