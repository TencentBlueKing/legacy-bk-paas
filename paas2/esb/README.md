## 蓝鲸智云PaaS平台-API网关

## 简介

API网关是蓝鲸智云PaaS平台中的API接口服务总线。它将蓝鲸底层原子平台或第三方系统接口，以自助对接的方式或编码的方式封装成一个个原子组件，以统一的云API规范为上层SaaS应用提供API服务。esb目录是API网关的源码目录。

API网关的主要作用是：

- 为SaaS应用开发者提供蓝鲸官方服务云API
- 为管理员提供自助接入API到API网关的服务
- 为管理员提供网关管理入口
- 提供组件开发模板，支持编码形式开发API组件对接API网关

## 技术栈

- framework: Django 1.8.11
- database: mysql
- cache: redis

## 依赖说明

- mysql: 平台数据库
- redis: 缓存服务
- login: 调用统一登录服务接口，判定用户登录态
- paas: 访问PaaS平台数据库，认证蓝鲸SaaS应用

## 支持的组件列表

项目默认支持的蓝鲸官方系统组件列表：

- bk_login: 蓝鲸统一登录
- bk_paas: 蓝鲸PaaS平台
- cc: 蓝鲸配置平台
- fta: 故障自愈
- sops: 标准运维

如要使用这些系统的组件，需要在项目配置文件 configs/default.py 中更新对应系统的服务域名地址

如果需要使用社区版对应的其他系统组件，请参考`开源版替换已安装的社区版的指引`中的`API网关部署替换`进行组件更新

## 使用指南

### 1. 使用当前组件

根据需要，更新配置文件，设置第三方系统服务地址

配置文件位置：`configs/default.py`

```
# 登录系统
HOST_BK_LOGIN="xxx"

# 配置系统
HOST_CC="xxx"

# 开启作业平台 API SSL验证，默认为True, 注意需要同步升级作业平台
JOB_SSL = True
# JOB客户端证书，路径为{{ SSL_ROOT_DIR }}job_api_client.crt
JOB_CLIENT_CERT = "xxx"
# JOB客户端私钥，路径为{{ SSL_ROOT_DIR }}job_api_client.key
JOB_CLIENT_KEY = "xxx"
```

### 2. 开发新组件

以系统 my_app，组件 get_hello_msg 为例，说明新组件开发过程

```
a. 在"components/generic/apis/"下创建系统对应的包: my_app

b. 在my_app下创建包toolkit，在tookit下创建模块configs.py

c. 在configs.py中设置组件系统名，及第三方系统地址
    SYSTEM_NAME="MY_APP"
    host=SmartHost(host_prod="system_domain_address")

d. 在my_app下创建组件模块：get_hello_msg.py，并在组件模块中创建组件类，
    新组件继承组件基类"components.component.Component"，新组件类名为
    组件模块名的驼峰写法，get_hello_msg对应为GetHelloMsg；配置组件类
    属性sys_name=configs.SYSTEM_NAME，并覆盖基类的handle方法，实现
    组件功能

    from components.component import Component
    from .toolkit import configs

    class GetHelloMsg(Component):
        sys_name = configs.SYSTEM_NAME

        def handle(self):
            result = self.outgoing.http_client.get(
                configs.host,
                '/xxx/xxx/',
                params=self.request.kwargs,
            )
            self.response.payload = result

e. 将新组件配置到components/esb_conf.py中的"config.channel_groups.default.preset_channels"中，如
    ('/my_app/get_hello_msg/', {'comp_codename': 'generic.my_app.get_hello_msg'})

f. 重启服务，即可通过以下地址访问新组件
    http://xxx.xxx.xxx/api/c/compapi/my_app/get_hello_msg/

```

### 3. 配置用户登录态验证白名单

访问组件，默认验证用户登录态，如果允许部分APP不验证，可在admin中设置白名单

位置：Bkcore/Function controllers

```
功能code: user_auth::skip_user_auth
是否开启功能: 是
功能测试白名单: APP_CODE，多个以逗号分隔

```

### 4. 蓝鲸 ESB 日志统一错误码
1306001    redis 连接失败    查redis配置是否正确，服务是否正常
1306101    组件代码逻辑错误，无法加载    根据异常信息，检查代码逻辑，排除异常
1306102    组件通道中的组件配置，不是一个有效的JSON字符串    检查组件配置，JSON 字符串需要是一个 dict，或者可以转化为 dict 的列表
1306201    请求第三方系统接口出现异常    检查第三方系统接口服务是否正常
1306202    第三方系统接口返回数据不是一个有效的 JSON 字符串    检查第三方系统接口服务是否正常
1306203    请求第三方系统接口出现SSLError    检查组件配置中 SSL_ROOT_DIR 对应的文件夹是否存在，及其下的证书是否过期
1306204    访问系统 GSE 的接口出现错误    检查 GSE 系统接口服务是否正常
1306205    访问 SMTP 邮箱服务出现错误    检查发送邮件组件 SMTP 配置是否正确，及 SMTP 邮箱服务是否正常
