### Not found, component class not found
1. access api /api/healthz/check_custom_codename/?codename=generic.xxx.xxx, and check
2. check if esb.log has an exception log

### How to confirm whether the server exists ESB process
    ps -ef | grep esb

### How to find the project file, log file 
    - find esb uwsgi config file uwsgi.ini: ps -ef | grep esb
    - project base dir: "chdir" in uwsgi.ini
    - log base dir: "PAAS_LOGGING_DIR" in uwsgi.ini

### How to access the single server esb service
    - curl 'http://ip:8002/c/compapi/xx/xx/?bk_app_code=xxx&bk_app_secret=xxx&bk_username=xxx'

### How to restart esb
    - ps -ef | grep supervisor-open_paas.conf
    - workon open_paas
    - supervisorctl -c xxx/supervisor-open_paas.conf restart esb
