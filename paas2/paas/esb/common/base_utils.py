# -*- coding: utf-8 -*-
import json
import datetime
import decimal


class CustomJSONEncoder(json.JSONEncoder):
    """JSONEncoder subclass that knows how to encode date/time and decimal types.
    And process the smart place name object
    """

    DATE_FORMAT = "%Y-%m-%d"
    TIME_FORMAT = "%H:%M:%S"

    def default(self, o):
        if isinstance(o, datetime.datetime):
            return o.strftime("%s %s" % (self.DATE_FORMAT, self.TIME_FORMAT))
        elif isinstance(o, datetime.date):
            return o.strftime(self.DATE_FORMAT)
        elif isinstance(o, datetime.time):
            return o.strftime(self.TIME_FORMAT)
        elif isinstance(o, decimal.Decimal):
            return str(o)
        else:
            return super(CustomJSONEncoder, self).default(o)


def jsonize(d):
    return json.dumps(d, cls=CustomJSONEncoder, ensure_ascii=False)


def smart_int(v):
    if str(v).isdigit():
        return int(v)
    else:
        return None
