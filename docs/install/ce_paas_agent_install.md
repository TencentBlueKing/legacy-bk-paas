# 蓝鲸智云PaaS平台社区版PaaSAgent安装部署文档

## 系统要求

- Python版本: python2.7
- Go
- Nginx
- Linux环境

## 安装部署
PaaSAgent需要部署在满足系统要求的app服务器上。建议最少准备两台服务器，分别用于测试和正式环境

#### 1. 基础环境初始化

python 2.7环境初始化

```
# 确认基础python环境是python2.7
$ python --version
Python 2.7.15

# 安装 virtualenv 及 预装包
$ pip install virtualenv virtualenvwrapper
$ pip install -r paas-ce/paasagent/etc/build/packages/requirements.txt

# 查看python路径
$ which python
```

构建目录及新建用户

```
# 构建app的部署路径，用户可自定义，例如/data/paas/paas_agent
$ export AGENT_ROOT=/data/paas/paas_agent
$ mkdir -p $AGENT_ROOT

# 创建app进程的执行账户apps
$ adduser apps
```

#### 2. 编译并安装PaaSAgent

```
# 确定已经安装好了golang并设置好了GOPATH
$ go version
$ echo $GOPATH

# 编译并安装PaaSAgent
$ mkdir -p $GOPATH/src
$ cd paas-ce
$ ln -s $PWD/paasagent $GOPATH/src/paasagent
$ cd $GOPATH/src/paasagent
$ make
$ mkdir -p $AGENT_ROOT/paas_agent  /data/paas/logs/paas_agent
$ cp -r bin etc $AGENT_ROOT/paas_agent/

# 更新配置文件
$ cd $AGENT_ROOT/paas_agent/etc
$ sed -i "s#TPL_AGENT_ROOT#${AGENT_ROOT}#g" paas_agent_config.yaml nginx/paasagent.conf

# build 和 buildsaas 中的 VIRTUALENVWRAPPER_PYTHON 变量需要设置正确的 python 路径，默认/usr/bin/python
$ chmod +x build/virtualenv/build  build/virtualenv/saas/buildsaas
```

注意: `build` 和 `buildsaas` 中的 `VIRTUALENVWRAPPER_PYTHON` 变量需要设置正确的 python 路径，默认`/usr/bin/python`, 如果上一步`which python`的返回结果不是`/usr/bin/python`, 需要修改为对应正确的路径

#### 3. 蓝鲸智云开发者中心注册服务器

开发者中心部署成功后, 访问`PAAS_DOMAIN`配置的域名，在**蓝鲸智云开发者中心->服务器信息**页面中，点击`添加服务器信息`按钮, 添加一台测试和正式app服务器。后台会自动生成服务器对应的`服务器ID(sid)`和`Token(stoken)`字段

注意: 开发者中心所在的服务器需要保证网络与app服务器互通

#### 4. 配置etc/paas_agent_config.yaml文件

```
auth:
  sid: bdb209f0-747a-4011-9c8b-9e10b2aceace  # 当前主机的服务器ID
  token: 41ea9d39-8c01-46e4-b7cd-62651fb5b018 # 当前主机的Token
settings:
  CONTROLLER_SERVER_URL: 'http://' # 保证本机网络可访问PAAS_DOMAIN域名
  BASE_PATH: '/data/paas'
  BASE_APP_PATH: '/data/paas/paas_agent'
  USE_PYPI: 'true'
  AGENT_LOG_PATH: '/data/paas/logs/paas_agent/agent.log'
  TEMPLATE_PATH: 'etc/templates'
  BUILD_PATH: 'etc/build'
  EXECUTE_TIME_LIMIT: 300 # 部署任务的超时时间, 单位s
  PYTHON_PIP: 'http://pypi.douban.com/simple/' # 需要填写完整url路径
port: 4245 # 需要和开发者中心注册的Agent端口一致
ip: ''
```

#### 5. 启动PaaSAgent服务

```
# 直接启动PaaSAgent服务，或用supervisor等方式托管进程
$ $AGENT_ROOT/paas_agent/bin/paas_agent &
```
PaaSAgent启动后，日志记录在了`paas_agent_config.yaml`配置的`AGENT_LOG_PATH`文件中，如`/data/paas/logs/paas_agent/agent.log`，用户可通过日志内容查看服务状态

#### 6. 蓝鲸智云开发者中心激活服务器
PaaSAgent服务启动成功后，在**蓝鲸智云开发者中心->服务器信息**页面中，找到服务器**操作**栏中的激活按钮，激活服务器

#### 7. 部署nginx反向代理

将`etc/nginx/paasagent.conf`文件`include`到`nginx.conf`中，并`reload nginx`

注意：nginx建议以root用户启动，避免因文件权限导致访问异常，同时需要保证listen的端口和开发者中心注册的app服务端口一致

