i18n_all: i18n_tpl i18n_js i18n_mo

# make messages of python file and django template file to django.po 
i18n_tpl:
	django-admin.py makemessages -d django -l en -e html,part -e py
	django-admin.py makemessages -d django -l zh_Hans -e html,part -e py

#  make messages of javascript file and django template file to djangojs.po
i18n_js:
	django-admin.py  makemessages -d djangojs -l en
	django-admin.py  makemessages -d djangojs -l zh_Hans

# compile django.po and djangojs.po to django.mo and djangojs.mo
i18n_mo:
	django-admin.py  compilemessages
