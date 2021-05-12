i18n_all: i18n_tpl i18n_mo i18n_cp

i18n_tpl:
	pybabel extract -F babel.cfg -c "TRANSLATORS:" . -o babel.po
	pybabel update -i babel.po -d locale/locale_api -D django -l en
	pybabel update -i babel.po -d locale/locale_api -D django -l zh_Hans 

i18n_mo:
	django-admin compilemessages -l locale_api/en
	django-admin compilemessages -l locale_api/zh_Hans

i18n_cp:
	cp locale/locale_api/en/LC_MESSAGES/django.* ../paas/locale/locale_api/en/LC_MESSAGES/

poetry.lock: pyproject.toml
	poetry lock

requirements_dev.txt: poetry.lock
	poetry export -f requirements.txt --without-hashes --dev -o requirements_dev.txt

requirements.txt: poetry.lock requirements_dev.txt
	poetry export -f requirements.txt --without-hashes -o requirements.txt

VERSION: pyproject.toml
	poetry version | awk '{print $$2}' > VERSION

.PHONY: update
update: VERSION requirements.txt

.PHONY: test
test:
	. conf/unittest_env && pytest \
		--ds settings \
		--reuse-db \
		--maxfail 1 \
		tests
