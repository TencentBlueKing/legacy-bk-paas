#! /bin/sh
mkdir -p /cache/.bk/env/bin

ln -s /usr/bin/pip /cache/.bk/env/bin/pip
ln -s /usr/bin/python /cache/.bk/env/bin/python

/cache/.bk/env/bin/pip install uWSGI==2.0.13.1

/cache/.bk/env/bin/pip install supervisor==3.3.3
ln -s /usr/bin/supervisorctl /cache/.bk/env/bin/supervisorctl
ln -s /usr/bin/supervisord /cache/.bk/env/bin/supervisord
