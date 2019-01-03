# 微信消息组件
> <font style="font-size:14px;">蓝鲸微信消息可通过微信公众号，微信企业号或者企业微信三种方式进行通知,
> 在配置前请先阅读三种方式的差异性，再选择其中一种方式进行配置</font>

| <div style="width:80px">通知方式</div> | 用户绑定 | open_paas模块所在服务器配置 | <div style="width:120px">微信公众平台配置</div> |
| --- | --- | --- | --- |
| 微信公众号 | 用户客户端需要有外网或者至少能访问微信相关链接 | (1)必须要有外网或者能访问微信提供的API<br>(2)需要反向代理，能够让代理转发到http://\{paas_domain\}/console/user_center/weixin/mp/callback/| (1)服务器配置<br>(2)消息模板配置 |
| 微信企业号 | 用户客户端需要有外网或者至少能访问微信相关链接 | 必须要有外网或者能访问微信提供的API | 可信任域名配置 |
| 企业微信 | 用户客户端需要有外网或者至少能访问微信相关链接 | 必须要有外网或者能访问微信提供的API | 授权回调域配置 |

### 前提准备
* open_paas模块所在服务器必须能访问微信提供的API，微信相关域名如下

```bash
# 微信提供的API 协议均为https
# 微信公众号
api.weixin.qq.com
# 微信企业号/ 企业微信
qyapi.weixin.qq.com
```

* 确保用户客户端浏览器能够访问微信相关链接，微信相关域名如下

```bash
# 微信提供的API 协议均为https
# 微信公众号
mp.weixin.qq.com
# 微信企业号
qy.weixin.qq.com
open.weixin.qq.com
res.wx.qq.com
rescdn.qqmail.com
long.open.weixin.qq.com
wx.qlogo.cn
# 企业微信
open.work.weixin.qq.com
rescdn.qqmail.com
js.aq.qq.com
```

### 入口说明
* 微信公众号： https://mp.weixin.qq.com/
* 微信企业号/企业微信：https://work.weixin.qq.com/
* 蓝鲸微信组件配置入口：http://{paas_domain}/esb/manager/index/, 通道管理 → 找到通道名称为“发送微信消息”的组件 → 组件配置
* 蓝鲸用户微信绑定入口： http://{paas_domain}, 个人中心 → 微信绑定

### 一. 微信公众号
#### 微信公众号 → 消息模板配置
> <font style="font-size:14px;">请进入微信公众平台“公众号后台 → 模板消息 → 模板库”</font>

* 搜索“蓝鲸消息提醒”，只有所在行业是IT科技 互联网才能搜索到，其他行业可以请自行添加模板，点击帮助我们完善模板，进入模板库添加（提交后需要一定时间的审核）
![](/static/esb/guide/weixin_component_guide/15081375626539.jpg)

![](/static/esb/guide/weixin_component_guide/15081379473152.jpg)

* 蓝鲸默认模板内容和蓝鲸组件参数与模版参数映射关系如下图所示，如需调整，可修改 open_paas/esb/components/generic/apis/cmsi/send_weixin.py 中的 get_mp_msg_data 方法

  ![](/static/esb/guide/weixin_component_guide/15081384579344.jpg)

   | 组件参数 | 微信消息模板参数 |
   | --- | --- |
   | heading | first |
   | message | Keyworkd1 |
   | date | keyworkd2 |
   | remark | Remark |

* 若已经添加模块库或者已经搜索到“蓝鲸消息通知”的模板库，点击详情进入该模板并添加该模板，添加后在“功能 → 模板消息 → 我的模板”中将看到添加的消息模板，其中的模版ID是我们后续配置组件需要的

#### 微信公众号 → 服务器配置
> <font style="font-size:14px;">请先在微信公众平台上查看公众号后台 → 开发 → 基本配置，是否已经配置了服务器配置（服务器地址，令牌，消息加解密密钥，消息加解密方式）![](/static/esb/guide/weixin_component_guide/15081252708641.jpg)</font>

##### 1. 微信公众平台上已配置了服务器配置
联系配置了服务器配置的人员，请其协助将在服务器地址响应的服务中添加调用http://{paas_domain}/console/user_center/weixin/mp/callback/（透传微信事件推送）

##### 2. 微信公众平台上未配置服务器配置
填写服务器配置（填写完，<font style="color:red">先不要点击提交</font>）

* url 填写外网能够访问到的URL（暂时称为weixin_server_url）
同时需要配置反向代理，将weixin_server_url 转发到企业蓝鲸平台http://{paas_domain}/console/user_center/weixin/mp/callback/
* Token 英文或数字，长度为3-32字符，请自行定义随机填写
* EncodingAESKey 点击随机生成即可
* 消息加解密方式，选择明文模式即可（任何一种模式都不影响）

填写完服务器配置后，请<font style="color:red">不要点击提交</font>，其实提交也没用，一定会出现“Token验证失败”，因为点击提交，微信会验证weixin_server_url能够正常响应验证，由于还未配置蓝鲸微信消息通知组件，所以一定是失败的，故需要先进行下一步“配置完蓝鲸微信消息通知组件”,再返回来点击提交（<font style="color:red">记得下一步完成后回来点击提交!!!</font>）


#### 蓝鲸平台 → API网关
> <font style="font-size:14px;">蓝鲸微信组件配置入口：http:/{paas_domain}/esb/manager/index/, 通道管理 → 找到通道名称为“发送微信消息”的组件 → 组件配置
![](/static/esb/guide/weixin_component_guide/15081404321746.jpg)</font>

* wx_type 选择“微信公众号”
* wx_app_id 【“微信公众号 → 开发 → 基本配置 → 公众号开发信息”】开发者ID(AppID)
* wx_secret 【"微信公众号 → 开发 → 基本配置 → 公众号开发信息"】开发者密码(AppSecret)
  由于没有显示，可以请企业内维护该公众号的管理员提供
* wx_token 【"微信公众号 → 开发 → 基本配置 → 服务器配置"】令牌(Token)
* wx_template_id【“微信公众号 → 功能 → 模板消息”】选择之前第一步中配置的消息模板的模板ID

至此蓝鲸通过公众号发送消息的配置完成，请到最后一步用户绑定后验证配置是否正确

### 二. 微信企业号
#### 微信企业号配置
* 配置用于蓝鲸消息通知的应用

“微信企业号 → 应用中心” 可以选择已经存在的消息型应用或者新建一个类型为消息型的应用，将应用的可见范围设置为全企业人员（或至少设置为可能需要接送微信消息通知的人员）

* 配置登录授权域名

（1）“微信企业号 → 设置 → 权限管理” 新建普通管理组，将用于蓝鲸消息通知的应用添加到该普通管理组的应用权限中

（2）“微信企业号 → 设置 → 功能设置 → 登录授权” 在刚刚创建的普通管理组项设置可信域名为：{paas_domain} （该域名只需要企业内部能访问即可，不需要配置为外网域名）

#### 蓝鲸平台 → API网关
> <font style="font-size:14px;">蓝鲸微信组件配置入口：http:/{paas_domain}/esb/manager/index/, 通道管理 → 找到通道名称为“发送微信消息”的组件 → 组件配置
![](/static/esb/guide/weixin_component_guide/15081428561464.jpg)</font>

* wx_type 选择“微信企业号”
* wx_qy_corpid 【“微信企业号 → 设置 → 权限管理 → 对应的普通管理组“】CorpID
* wx_qy_corpsecret【“微信企业号 → 设置 → 权限管理 → 对应的普通管理组”】Secret
* wx_qy_agentid 【“微信企业号 → 应用中心 → 对应的应用】应用ID

至此蓝鲸通过企业号发送消息的配置完成，请到最后一步用户绑定后验证配置是否正确

### 三. 企业微信
#### 企业微信配置
* 配置用于蓝鲸消息通知的应用

“企业微信 → 企业应用” 可以选择已经存在的自建应用或者新建一个应用，将应用的可见范围设置为全企业人员（或至少设置为可能需要接送微信消息通知的人员）

* 配置Web网页登录授权回调域

“企业微信 → 企业应用 → 选择对应的应用 → 企业微信授权登录 → 设置 → Web网页
 → 设置授权回调域” 设置{paas_domain}为登录授权回到域

#### 蓝鲸平台 → API网关
> <font style="font-size:14px;">蓝鲸微信组件配置入口：http:/{paas_domain}/esb/manager/index/, 通道管理 → 找到通道名称为“发送微信消息”的组件 → 组件配置
![](/static/esb/guide/weixin_component_guide/15081438048577.jpg)</font>

* wx_type 选择"企业微信"
* wx_qy_corpid 【"企业微信 → 我的企业 → 企业信息"】CorpID
* wx_qy_corpsecret【“企业微信 → 企业应用 → 选择对应应用”】Secret
* wx_qy_agentid【“企业微信 → 企业应用 → 选择对应应用”】AgentId

至此蓝鲸通过企业微信发送消息的配置完成，请到最后一步用户绑定后验证配置是否正确

### 用户绑定
> <font style="font-size:14px;">蓝鲸桌面 → 个人中心 → 绑定微信</font>

点击"绑定微信"，扫描绑定即可
需要注意：

（1）若是企业号，需要用户提前关注企业号

（2）若是企业微信，需要用户用企业微信APP进行扫描

### 其它注意项
* **组件会根据开发者ID和开发者密码，获取access_token发送模版消息等，业务若需集中管理 access_token，可优化 components/apis/weixin_mp/get_token.py 中 access_token 获取逻辑**
* 用户绑定二维码未出现原因

（1）用户客户端未能访问外网或无法访问微信相关URL

（2）open_paas所在服务器服务访问外网或至少无法请求微信相关接口



