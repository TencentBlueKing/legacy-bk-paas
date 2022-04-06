import base64
import rsa
from django.conf import settings


def rsa_decrypt_password(pwd_str):
    if not pwd_str:
        return pwd_str
    private_key = rsa.PrivateKey.load_pkcs1(settings.RSA_PRIVATE_KEY)
    return rsa.decrypt(base64.b64decode(pwd_str), private_key).decode()


