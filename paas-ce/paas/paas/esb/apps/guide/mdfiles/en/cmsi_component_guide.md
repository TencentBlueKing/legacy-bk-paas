# CMSI Message Component

Currently, API Gateway provides various notification channels, including:

- Public voice notification: /cmsi/send_voice_msg/
- Send Email: /cmsi/send_mail/
- Send WeChat: /cmsi/send_weixin/
- Send SMS: /cmsi/send_sms/

API Gateway defines the [Interface Protocols](/esb/api_docs/system/CMSI/){:target="_blank"} for these message notification components and gives component examples (see components/generic/templates/cmsi/ in the project). However, the component content is not fully implemented and the user can override the component of this part based on the interface protocol. To reduce the difficulty of implementing a message notification component, the API Gateway provides solutions to update the component configuration online without writing a component code.

**Note: **To change the sample of the component, you need to copy the sample code to components/generic/apis/cmsi/. The contents of components/generic/templates/cmsi will be overwritten for each release.

## Solution One

The user provides an interface that is compatible with the Message Notification Component [Interface Protocols](/esb/api_docs/system/CMSI/){:target="_blank"} and then configures to component with the following steps. API Gateway will forward the request to this interface .

1. Find the corresponding component channel in [**Channel Management**](/esb/manager/channel/list/){:target="_blank"}, and open the edit page
2. In **Component Configuration**, configure the interface url under the variable dest_url

**Note：**
```
1. send_voice_msg component, if the receiver__username parameter is valid, 
the parameter user_list_information will be generated according to the platform user data
2. send_mail component, if the receiver__username and cc__username parameters are valid, 
parameters receiver and cc will be generated respectively according the platform user data
3. send_sms component, if the receiver__username parameter is valid, 
the parameter receiver will be generated according to the platform user data
4. send_mail component configuration, in which, variable mail_sender represents default email sender 
```

## Solution Two

### Send Email

User provides the SMTP mail service address and account, and then, configures them to send mail components through following steps. Sending mail via SMTP is supported.

1. Find the /cmsi/send_mail/ component channel in [**Channel Management**](/esb/manager/channel/list/){:target="_blank"}, and open the edit page
2. In **Component Configuration**, configure the SMTP protocol information under the variables smtp_host, smtp_port, smtp_user and smtp_pwd 


### Send SMS

User provides QCloud app account, and then, configures it to the send SMS component through the following steps. Sending SMS via QCloud is supported.

1. Find the /cmsi/send_sms/ component channel in [**Channel Management**](/esb/manager/channel/list/){:target="_blank"}, and open the edit page
2. In **Component Configuration**, configure the QCloud app account under the variables qcloud_app_id and qcloud_app_key. **QCloud app account is highly sensitive information, so pay attention to confidentiality**

**Note:** Before sending SMS, you need to log on QCloud, and create a signature under the application, and create a text template.

### Send WeChat 

Supports sending enterprise WeChat message and WeChat Official Account message. User provides the enterprise WeChat account or WeChat official account, and then, configure it to the WeChat Message component through the following steps.

1. Find the /cmsi/send_weixin/ component channel in [**Channel Management**](/esb/manager/channel/list/){:target="_blank"}, and open the edit page
2. In **Component Configuration**, by selecting wx_type, specify the type of message to be sent: enterprise WeChat, WeChat official account, and then, configure it to the corresponding variable. 

**Note:** When sending a WeChat offical account message, the application shall create a message template in WeChat. The template shall contain 4 variables: first (corresponding component parameter heading), keyword1 (corresponding component parameter message), keyword2 (corresponding component parameter date) and remark (corresponding component parameter remark)
