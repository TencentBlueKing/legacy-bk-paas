# 蓝鲸智云PaaS平台社区版安装部署文档

## 系统要求

- 数据库: mysql
- Python版本: python2.7 (务必使用python2.7, 推荐2.7.15)

## 安装部署

#### 1. create database

```
# 创建数据库open_paas

CREATE DATABASE IF NOT EXISTS open_paas DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
```

#### 2. 部署web项目(paas为例)

- [virtualenv](https://virtualenv.pypa.io/en/latest/userguide/#usage)

注意:　login/appengine/esb部署方式相同, 使用不同的virtualenv以及启动端口

服务依赖关系: (根据依赖顺序启动服务)

- login 
- paas: 依赖login/appengine
- appengine: 依赖paasagent
- esb: 依赖login


开发者中心paas部署为例: 

```
# 虚拟环境, 自动进入paas virtualenv
$ virtualenv paas

$ which python
$ cd paas-ce/paas/paas/

# 安装依赖
$ pip install -r requirements.txt

# 修改配置文件, 配置数据库,域名等
$ vim conf/settings_development.py

# 执行migration, 其中 login / paas 两个项目需要做 migration
python manage.py migrate

# 拉起服务
$ python manage.py runserver 8001
```


配置文件注意事项:

1. 本地开发, 必须部署login服务, paas等配置文件中`LOGIN_HOST`配置为login服务的地址
2. 数据库配置: `HOST/PORT/USER/PASSWORD`
3. 涉及域名: 默认为`bking.com`, 如果自定义域名, 需修改4个配置文件中所有相关位置; `PAAS_DOMAIN`及`BK_COOKIE_DOMAIN`
4. `SECRET_KEY` / `ESB_TOKEN`, 修改, 且4个文件这两个变量值保持一致
5. `USERNAME` / `PASSWORD` 修改login/settings_production.py中初始化用户名密码, 超级管理员用户名密码, 建议强密码

部署到生产环境:

- 部署生产环境时, 使用`settings_production.py`以及设置环境变量`BK_ENV="production"`
- 生产的配置文件可以参考 `paas-ce/paas/examples/settings`
- 做nginx反向代理可以参考 `paas-ce/paas/examples/nginx_paas.conf`
- 使用supervisord托管可以参考 `paas-ce/paas/examples/supervisord.conf`
- `PAAS_INNER_DOMAIN`及`HTTP_SCHEMA`是给全站https配置的, 当开启了https, 则配置这两个变量, 前者是paas的内网地址, 此时`PAAS_DOMAIN`为外网https地址

esb配置文件注意事项

- 修改配置文件时，应将配置模板 esb/configs/default_template.py 复制到 esb/configs/default.py，然后更新 esb/cofigs/default.py 中的数据库、域名等信息


#### 3. 访问

假设配置`PAAS_DOMAIN`为`www.bking.com`

修改本地hosts

```
127.0.0.1 www.bking.com
```

`http://www.bking.com:8001` 可以访问到开发者中心
