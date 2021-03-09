# -*- coding: utf-8 -*-
import json
import random
import time
import hashlib

from . import configs


class QCloudVoiceClient(object):
    def __init__(self, http_client):
        self.http_client = http_client

    def get_random(self):
        return random.randint(10000, 99999)

    def get_cur_time(self):
        return int(time.time())

    def generate_sig(self, qcloud_app_key, mobile, random_int, now):
        fmt = "appkey={}&random={}&time={}&mobile={}"
        return hashlib.sha256(fmt.format(qcloud_app_key, random_int, now, mobile)).hexdigest()

    def post(self, path, data):
        return self.http_client.post(configs.host, path, data=json.dumps(data))
