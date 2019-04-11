
# 使用CentOS 7.x快速部署蓝鲸开源PAAS平台。

本文使用CentOS快速蓝鲸PAAS平台，使用系统默认自带的Python和Mariadb，最后统一使用screen进行启动。

- 注意：仅用于快速部署和学习，不适用于生产环境，生产建议使用Supervisor和Nginx启动，并设置MySQL高可用和备份等。

## 环境准备

### 1.系统初始化
```
[root@paas-node-1 ~]# cat /etc/redhat-release 
CentOS Linux release 7.6.1810 (Core) 
```
关闭SELinux、Iptables、可参考文档：http://k8s.unixhot.com/example-manual.html

### 2.安装依赖软件包
```
[root@paas-node-1 ~]# yum install -y git mariadb mariadb-server nginx supervisor \
 python-pip pycrypto gcc glibc python-devel
```

### 3.启动数据库并初始化
```
[root@paas-node-1 ~]# systemctl start mariadb
[root@paas-node-1 ~]# mysql_secure_installation 
[root@paas-node-1 ~]# mysql -u root -p
MariaDB [(none)]> CREATE DATABASE IF NOT EXISTS open_paas DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
MariaDB [(none)]> grant all on open_paas.* to paas@localhost identified by 'open_paas';
```

### 4.克隆代码
```
[root@paas-node-1 ~]# cd /opt
[root@paas-node-1 opt]# git clone https://github.com/Tencent/bk-PaaS.git
[root@paas-node-1 opt]# pip install virtualenv
```

## 部署paas服务

### 1.初始化Python虚拟环境
```
# 创建Python虚拟环境
[root@paas-node-1 opt]# virtualenv runtime-paas
# 使用Python虚拟环境
[root@paas-node-1 opt]# source /opt/runtime-paas/bin/activate
(runtime-paas) [root@paas-node-1 opt]# cd /opt/bk-PaaS/paas-ce/paas/paas/
# 安装依赖软件包
(runtime-paas) [root@paas-node-1 paas]# pip install -r requirements.txt 
```
### 2.配置paas

- 修改数据库配置，可以根据需求修改域名和端口，这里保持默认。
```
(runtime-paas) [root@paas-node-1 paas]# vim conf/settings_development.py 
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'open_paas',
        'USER': 'paas',
        'PASSWORD': 'open_paas',
        'HOST': '127.0.0.1',
        'PORT': '3306',
    }
}
```

- 进行数据库初始化（如果遇到权限问题请检查数据库授权）
```
(runtime-paas) [root@paas-node-1 paas]# python manage.py migrate
```
退出python虚拟环境
```
(runtime-paas) [root@paas-node-1 paas]# deactivate
```


## 部署login服务

### 1.初始化Python虚拟环境
```
# 创建Python虚拟环境
[root@paas-node-1 ~]# cd /opt/
[root@paas-node-1 opt]# virtualenv runtime-login
# 使用Python虚拟环境
[root@paas-node-1 opt]# source /opt/runtime-login/bin/activate
(runtime-login) [root@paas-node-1 opt]# cd /opt/bk-PaaS/paas-ce/paas/login/
# 安装依赖软件包
(runtime-login) [root@paas-node-1 paas]# pip install -r requirements.txt 
```

### 2.配置login

- 修改数据库配置，可以根据需求修改域名和端口，这里保持默认。
```
(runtime-login) [root@paas-node-1 login]# vim conf/settings_development.py 
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'open_paas',
        'USER': 'paas',
        'PASSWORD': 'open_paas',
        'HOST': '127.0.0.1',
        'PORT': '3306',
    }
}
```

- 进行数据库初始化（如果遇到权限问题请检查数据库授权）
```
(runtime-login) [root@paas-node-1 login]# python manage.py migrate
```
退出python虚拟环境
```
(runtime-login) [root@paas-node-1 login]# deactivate
```

## 部署appengine服务

### 1.初始化Python虚拟环境
```
# 创建Python虚拟环境
[root@paas-node-1 ~]# cd /opt/
[root@paas-node-1 opt]# virtualenv runtime-appengine
# 使用Python虚拟环境
[root@paas-node-1 opt]# source /opt/runtime-appengine/bin/activate
(runtime-appengine) [root@paas-node-1 opt]# cd /opt/bk-PaaS/paas-ce/paas/appengine/
# 安装依赖软件包
(runtime-appengine) [root@paas-node-1 paas]# pip install -r requirements.txt 
```

### 2.配置appengine

- 修改数据库配置，可以根据需求修改域名和端口，这里保持默认。
```
[root@paas-node-1 appengine]# vim controller/settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'open_paas',
        'USER': 'paas',
        'PASSWORD': 'open_paas',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```



- 退出python虚拟环境
```
(runtime-appengine) [root@paas-node-1 appengine]# deactivate
```


## 部署esb服务

### 1.初始化Python虚拟环境
```
# 创建Python虚拟环境
[root@paas-node-1 ~]# cd /opt/
[root@paas-node-1 opt]# virtualenv runtime-esb
# 使用Python虚拟环境
[root@paas-node-1 opt]# source /opt/runtime-esb/bin/activate
(runtime-esb) [root@paas-node-1 opt]# cd /opt/bk-PaaS/paas-ce/paas/esb/
# 安装依赖软件包
(runtime-esb) [root@paas-node-1 paas]# pip install -r requirements.txt 
```

### 2.配置esb

- 修改数据库配置，可以根据需求修改域名和端口，这里保持默认。
```
(runtime-esb) [root@paas-node-1 esb]# cd configs/
(runtime-esb) [root@paas-node-1 configs]# cp default_template.py default.py
(runtime-esb) [root@paas-node-1 configs]# vim default.py 
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'open_paas',
        'USER': 'paas',
        'PASSWORD': 'open_paas',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

- 进行数据库初始化（如果遇到权限问题请检查数据库授权）
```
(runtime-esb) [root@paas-node-1 esb]# python manage.py migrate
```
退出python虚拟环境
```
(runtime-esb) [root@paas-node-1 esb]# deactivate
```

## 使用screen启动服务

   对于screen不熟悉的用户可以参考https://www.ibm.com/developerworks/cn/linux/l-cn-screen/index.html

### 启动paas
```
[root@paas-node-1 ~]# screen -t paas
[root@paas-node-1 ~]# source /opt/runtime-paas/bin/activate
(runtime-paas) [root@paas-node-1 ~]# cd /opt/bk-PaaS/paas-ce/paas/paas/
(runtime-paas) [root@paas-node-1 paas]# python manage.py runserver 0.0.0.0:8001
#按Ctrl+A+D退出screen

```
### 启动login
```
[root@paas-node-1 ~]# screen -t login
[root@paas-node-1 ~]# source /opt/runtime-login/bin/activate
(runtime-login) [root@paas-node-1 ~]# cd /opt/bk-PaaS/paas-ce/paas/login/
(runtime-login) [root@paas-node-1 login]# python manage.py runserver 0.0.0.0:8003
#按Ctrl+A+D退出screen
```

### 启动esb
```
[root@paas-node-1 ~]# screen -t esb
[root@paas-node-1 ~]# source /opt/runtime-esb/bin/activate
(runtime-esb) [root@paas-node-1 ~]# cd /opt/bk-PaaS/paas-ce/paas/esb/
(runtime-esb) [root@paas-node-1 esb]# python manage.py runserver 0.0.0.0:8002
#按Ctrl+A+D退出screen
```

### 启动appengine
```
[root@paas-node-1 ~]# screen -t appengine
[root@paas-node-1 ~]# source /opt/runtime-appengine/bin/activate
(runtime-appengine) [root@paas-node-1 ~]# cd /opt/bk-PaaS/paas-ce/paas/appengine/
(runtime-appengine) [root@paas-node-1 appengine]# python manage.py runserver 0.0.0.0:8000
#按Ctrl+A+D退出screen
```

## 使用Nignx配置访问

### 配置Nginx

```
[root@paas-node-1 ~]# cd /opt/bk-PaaS/paas-ce/paas/examples/
[root@paas-node-1 examples]# cp nginx_paas.conf /etc/nginx/conf.d/
[root@paas-node-1 ~]# vim /etc/nginx/conf.d/nginx_paas.conf 
#在location / 下面增加
location /static {
        proxy_pass http://OPEN_PAAS_LOGIN;
        proxy_pass_header Server;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Scheme $scheme;
        proxy_set_header Host $http_host;
        proxy_redirect off;
        proxy_read_timeout 600;
    }
[root@paas-node-1 ~]# nginx -t
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
[root@paas-node-1 ~]# systemctl start nginx
```

### 访问蓝鲸PAAS
 - 设置本地Hosts绑定
 - http://www.bking.com/
 - 默认用户名密码：admin admin
