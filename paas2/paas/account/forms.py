# -*- coding: utf-8 -*-
from django.contrib.auth.forms import UserCreationForm, UserChangeForm

from account.models import BkUser


class BkUserCreationForm(UserCreationForm):
    """
    A form that creates a user, with no privileges, from the given email andpassword
    """

    def __init__(self, *args, **kargs):
        super(BkUserCreationForm, self).__init__(*args, **kargs)

    class Meta:
        model = BkUser
        fields = ("username",)


class BkUserChangeForm(UserChangeForm):
    """
    A form for updating users

    Includes all the fields onthe user,
    but replaces the password field with admin'spassword hash display field.
    """

    def __init__(self, *args, **kargs):
        super(BkUserChangeForm, self).__init__(*args, **kargs)

    class Meta:
        model = BkUser
        fields = ("username", "password")
