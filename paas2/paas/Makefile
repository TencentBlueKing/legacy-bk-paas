i18n_all: i18n_tpl i18n_js i18n_mo
esb_i18n_all: esb_i18n_mkdir esb_i18n_tpl esb_i18n_js esb_i18n_mo esb_i18n_rmdir

i18n_tpl:
	pybabel extract -k '_l' -F babel.cfg -c "TRANSLATORS:" . -o babel.po
	pybabel update -i babel.po -d locale -D django -l en
	pybabel update -i babel.po -d locale -D django -l zh_Hans
i18n_js:
	django-admin.py  makemessages -d djangojs -l en
	django-admin.py  makemessages -d djangojs -l zh_Hans

i18n_mo:
	django-admin.py  compilemessages

esb_i18n_mkdir:
	mkdir -p esb/locale/en/LC_MESSAGES
	mkdir -p esb/locale/zh_Hans/LC_MESSAGES
	mkdir -p static/esb/locale/en/LC_MESSAGES
	mkdir -p static/esb/locale/zh_Hans/LC_MESSAGES

esb_i18n_tpl:
	cp locale/locale_esb/en/LC_MESSAGES/django.po esb/locale/en/LC_MESSAGES/django.po
	cp locale/locale_esb/zh_Hans/LC_MESSAGES/django.po esb/locale/zh_Hans/LC_MESSAGES/django.po
	cd esb; django-admin makemessages -d django -l en
	cd esb; django-admin makemessages -d django -l zh_Hans
	mv esb/locale/en/LC_MESSAGES/django.po locale/locale_esb/en/LC_MESSAGES/django.po
	mv esb/locale/zh_Hans/LC_MESSAGES/django.po locale/locale_esb/zh_Hans/LC_MESSAGES/django.po

esb_i18n_js:
	mv locale/locale_esb/en/LC_MESSAGES/djangojs.po static/esb/locale/en/LC_MESSAGES/djangojs.po
	mv locale/locale_esb/zh_Hans/LC_MESSAGES/djangojs.po static/esb/locale/zh_Hans/LC_MESSAGES/djangojs.po
	cd static/esb; django-admin makemessages -d djangojs -l en
	cd static/esb; django-admin makemessages -d djangojs -l zh_Hans
	mv static/esb/locale/en/LC_MESSAGES/djangojs.po locale/locale_esb/en/LC_MESSAGES/djangojs.po
	mv static/esb/locale/zh_Hans/LC_MESSAGES/djangojs.po locale/locale_esb/zh_Hans/LC_MESSAGES/djangojs.po

esb_i18n_mo:
	django-admin compilemessages -l locale_esb/en
	django-admin compilemessages -l locale_esb/zh_Hans

esb_i18n_rmdir:
	rm -rf static/esb/locale
	rm -rf esb/locale
