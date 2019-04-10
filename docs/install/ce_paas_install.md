# 蓝鲸智云PaaS平台社区版安装部署文档

## 系统要求

- 数据库: mysql
- Python版本: python2.7 (务必使用python2.7, 推荐2.7.15)

## 部署说明

- `paas-ce` web侧一共4个项目: paas/appengine/login/esb; 均是基于Django开发的
- 4个项目共用一个数据库
- 项目部署过程一致; 过程中需要注意每个项目的配置文件及拉起的端口号(每个项目需要使用不同的端口号)
- 可以部署在同一台机器上, 使用不同端口号即可

## 部署顺序

#### 1. 预分配端口号

预先分配每个服务的端口号, 假设部署机器IP为`127.0.0.1`

- appengine: 127.0.0.1:8000
- paas: 127.0.0.1:8001
- esb: 127.0.0.1:8002
- login: 127.0.0.1:8003

服务间是相互依赖的, 所以部署配置文件中需要将预先分配的服务地址填写到对应变量中

#### 2. 部署4个web项目

按照文档后一部分[安装部署]文档, 依次部署下面项目

- 部署 login (需执行migration)
- 部署 paas (需执行migration), 配置文件中需要配置engine/login的地址

    ```
    # 控制台地址
    ENGINE_HOST = "http://127.0.0.1:8000"
    # 登陆服务地址
    LOGIN_HOST = "http://127.0.0.1:8003"
    ```

- 部署 appengine
- 部署 esb, 配置文件中需要配置login/paas的地址

    ```
    # paas host
    PAAS_HOST = 'http://127.0.0.1:8001'

    # host for bk login
    HOST_BK_LOGIN = 'http://127.0.0.1:8003'
    ```

#### 3. 访问开发者中心

#### 4. 部署PaaSAgent

参考 [蓝鲸智云PaaS平台社区版PaaSAgent安装部署文档](https://github.com/Tencent/bk-PaaS/blob/master/docs/install/ce_paas_agent_install.md) 部署PaaSAgent

## 安装部署

#### 1. create database

```
# 创建数据库open_paas

CREATE DATABASE IF NOT EXISTS open_paas DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
```

#### 2. 部署web项目(paas为例)

- [virtualenv](https://virtualenv.pypa.io/en/latest/userguide/#usage)

注意:　`paas/login/appengine/esb`部署方式相同, 使用不同的`virtualenv`以及启动端口


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

# 注意, login / paas 务必要执行migrate
# 执行migration, 其中 login / paas 两个项目需要做 migration
python manage.py migrate

# 拉起服务, 可以使用其他的托管服务, 例如supervisor
$ python manage.py runserver 8001
```

配置文件位置:

```
# paas
paas/conf/settings_development.py

# login
login/conf/settings_development.py

# appengine
appengine/controller/settings.py

# esb
# 注意, 默认default.py不存在, 需要复制模板修改 `cp default_template.py default.py`
esb/configs/default.py
```

配置文件注意事项:

1. 数据库配置: `HOST/PORT/USER/PASSWORD`
2. 涉及域名: 默认为`bking.com`, 如果自定义域名, 需修改4个配置文件中所有相关位置; `PAAS_DOMAIN`及`BK_COOKIE_DOMAIN`
3. `SECRET_KEY` / `ESB_TOKEN`, 修改, 且4个文件这两个变量值保持一致
4. `USERNAME` / `PASSWORD` 修改`login/settings_production.py`中初始化用户名密码, 超级管理员用户名密码, 建议强密码

日志位置: 如果是`python manage.py runserver`拉起, 可以在终端看到请求日志

```
# ROOT_DIR is bk-PaaS/paas-ce/paas/

paas/logs
  ├── paas.log
  └── paas_mysql.log
login/logs/
  ├── login.log
  └── login_mysql.log
appengine/logs/
  ├── appengine.log
  └── appengine_mysql.log
esb/logs/
  ├── esb_api.log
  └── esb.log
```

#### 3. 访问

假设配置`PAAS_DOMAIN`为`www.bking.com`, 部署机器IP为`127.0.0.1`

修改本地hosts

```
127.0.0.1 www.bking.com
```

`http://www.bking.com:8001` 可以访问到开发者中心

**注意** 登录用户名密码是`login/settings_production.py`中配置的 `USERNAME` / `PASSWORD`

----

## 部署到生产环境

- 部署生产环境时, 使用`settings_production.py`以及设置环境变量`BK_ENV="production"`
- 生产的配置文件可以参考 `paas-ce/paas/examples/settings`
- 做`nginx`反向代理可以参考 `paas-ce/paas/examples/nginx_paas.conf`
- 使用`supervisord`托管可以参考 `paas-ce/paas/examples/supervisord.conf`
- `PAAS_INNER_DOMAIN`及`HTTP_SCHEMA`是给全站https配置的, 当开启了https, 则配置这两个变量, 前者是paas的内网地址, 此时`PAAS_DOMAIN`为外网https地址
