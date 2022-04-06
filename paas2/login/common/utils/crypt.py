import base64

import rsa


def rsa_decrypt_password(pwd_str, private_key):
    if not pwd_str:
        return pwd_str

    pkcs1_private_key = rsa.PrivateKey.load_pkcs1(private_key)
    return rsa.decrypt(base64.b64decode(pwd_str), pkcs1_private_key).decode()


