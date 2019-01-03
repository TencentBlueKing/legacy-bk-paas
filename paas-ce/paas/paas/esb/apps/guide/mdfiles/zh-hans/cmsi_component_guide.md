# CMSI消息组件

当前，API网关提供的消息通知通道有：

- 公共语音通知: /cmsi/send_voice_msg/
- 发送邮件: /cmsi/send_mail/
- 发送微信: /cmsi/send_weixin/
- 发送短信: /cmsi/send_sms/

API网关定义了这些消息通知组件的[接口协议](/esb/api_docs/system/CMSI/){:target="_blank"}，给出了组件样例（参考项目下的 components/generic/templates/cmsi/），但是，并没有完全实现组件内容，用户可根据接口协议，重写此部分组件。API网关为降低实现消息通知组件的难度，提供了在线更新组件配置，不需编写组件代码的方案。

**注意：**若要更改组件样例，需将样例代码copy到components/generic/apis/cmsi/下修改，components/generic/templates/cmsi中内容，每次发布都会被覆盖。

## 方案一

用户提供兼容消息通知组件[接口协议](/esb/api_docs/system/CMSI/){:target="_blank"}的接口，然后，通过以下步骤配置到组件，API网关会将请求转发到此接口。

1. 在[**通道管理**](/esb/manager/channel/list/){:target="_blank"}中找到对应的组件通道，打开编辑页面
2. 在**组件配置**下，将接口地址配置到变量 dest_url 下 

**注意：**
```
1. send_voice_msg 组件，若 receiver__username 参数有效，将会根据平台用户数据，生成参数 user_list_information
2. send_mail 组件，若 receiver__username，cc__username 参数有效，将会根据平台用户数据，分别生成参数 receiver, cc
3. send_sms 组件，若 receiver__username 参数有效，将会根据平台用户数据，生成参数 receiver
4. send_mail 组件配置中，变量 mail_sender 表示默认的邮件发送者

```
## 方案二

### 发送邮件

用户提供 SMTP 邮件服务地址和帐号，然后，通过以下步骤配置到发送邮件组件，支持通过 SMTP 发送邮件。

1. 在[**通道管理**中](/esb/manager/channel/list/){:target="_blank"}查找 /cmsi/send_mail/ 组件通道，打开编辑页面
2. 在**组件配置**下，将 SMTP 协议信息配置到变量 smtp_host, smtp_port, smtp_user, smtp_pwd 下


### 发送短信

用户提供腾讯云应用帐号，然后，通过以下步骤配置到发送短信组件，支持通过腾讯云发送短信

1. 在[**通道管理**中](/esb/manager/channel/list/){:target="_blank"}查找 /cmsi/send_sms/ 组件通道，打开编辑页面
2. 在**组件配置**下，将腾讯云业务帐号配置到变量 qcloud_app_id, qcloud_app_key 下，**腾讯云帐号为高度敏感信息，注意保密**

**注意：**发送短信前，需要到腾讯云上，在应用下创建签名，及创建正文模版

### 发送微信消息

支持发送企业微信消息和微信公众号消息。用户提供企业微信帐号或微信公众号帐号，然后，通过以下步骤配置到发送微信消息组件。

1. 在[**通道管理**中](/esb/manager/channel/list/){:target="_blank"}查找 /cmsi/send_weixin/ 组件通道，打开编辑页面
2. 在**组件配置**下，通过选择 wx_type，指定要发送的消息类型：企业微信、微信公众号，然后，将对应微信帐号的信息配置到相应变量，**微信帐号为高度敏感信息，注意保密**

**注意：**发送微信公众号消息时，应用需在微信创建消息模版，模版包含4个变量：first(对应组件参数 heading), keyword1(对应组件参数 message), keyword2(对应组件参数 date), remark(对应组件参数 remark)，更多[微信消息组件](/esb/guide/page/weixin_component_guide){:target="_blank"}介绍
