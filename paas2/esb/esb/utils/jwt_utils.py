# -*- coding: utf-8 -*-
import time

import jwt
from Crypto.PublicKey import RSA
from esb.utils.func_ctrl import FunctionControllerClient
from jwt.algorithms import has_crypto
from jwt.contrib.algorithms.pycrypto import RSAAlgorithm


class JWTKey(object):
    def generate(self, length=2048):
        key = RSA.generate(length)
        private_key = key.exportKey()
        public_key = key.publickey().exportKey()
        return private_key, public_key

    def get_private_key(self):
        jwt_key = FunctionControllerClient.get_jwt_key()
        if not jwt_key:
            return ""
        return jwt_key.get("private_key", "")

    def get_public_key(self):
        jwt_key = FunctionControllerClient.get_jwt_key()
        if not jwt_key:
            return ""
        return jwt_key.get("public_key", "")


class JWTClient(object):

    ISSUER = "APIGW"
    ALGORITHM = "RS512"

    def __init__(self, app, user, kid="apigw"):
        self.app = app
        self.user = user
        self.kid = kid

        self.payload = {}
        self.headers = {}

    def prepare_headers(self, now):
        """header头信息"""
        self.headers["kid"] = self.kid
        # Issued At Claim (iat)
        self.headers["iat"] = now

    def prepare_payload(self, now):
        """payload内容"""
        # 传递的信息
        self.payload["app"] = self.app.as_json() if self.app else {}
        self.payload["user"] = self.user.as_json() if self.user else {}

        # 其它信息
        self.payload["iss"] = self.ISSUER
        # Not Before Time Claim (nbf)
        self.payload["nbf"] = now - 300  # 5 * 60
        # 过期时间，默认15分钟
        self.payload["exp"] = now + 900  # 15 * 60

    def encode(self):
        """生成JWT Token"""
        private_key = JWTKey().get_private_key()
        if not private_key:
            return ""

        now = int(time.time())

        self.prepare_headers(now)
        self.prepare_payload(now)

        return jwt.encode(self.payload, private_key, algorithm=self.ALGORITHM, headers=self.headers)


# replace cryptography with pycrypto
if has_crypto:
    jwt.unregister_algorithm(JWTClient.ALGORITHM)

jwt.register_algorithm(JWTClient.ALGORITHM, RSAAlgorithm(RSAAlgorithm.SHA512))
