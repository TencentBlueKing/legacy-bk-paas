# 自助接入

自助接入，开发者不需要编写代码，在[自助接入](/esb/manager/buffet_comp/list/){:target="_blank"}进行配置，
即可将自己的接口接入API网关。以如下接口为例，详细介绍如何完成自助接入。

`注：适用于将HTTP协议、无需特殊处理的接口，直接对接的场景`

- 系统名称：主机配置平台 HCP
- 接口名称：查询主机列表 get_host_list
- 接口地址：http://hcp.domain.com/hcp/get_host_list/

## 添加系统

[添加一个新的系统](/esb/manager/system/add/){:target="_blank"}，系统信息中填入以下内容：

- 系统名称：HCP
- 系统标签：主机配置平台

## 添加API配置

打开[自助接入](/esb/manager/buffet_comp/apply/){:target="_blank"}页面，填写接口配置信息，配置信息包含三部分内容：**注册配置**、**请求发出前**、**请求目的地**。

#### 注册配置

注册配置用于指定用户访问API的信息。注册配置中填入以下内容：

- API名称：查询主机列表
- 所属系统：选择 HCP 系统
- 注册到的请求类型：GET
- 注册到的API路径：/hcp/get_host_list/

通过"注册到的路径"，加上统一前缀，即是API的接口地址：
```
http://xxx.domain.com/api/c/self-service-api/hcp/get_host_list/
```

#### 请求发出前
请求发出前用于配置访问系统接口时的请求头信息。

#### 请求目的地
请求目的地用于配置请求系统接口的信息，如系统接口的地址，请求方式，参数设置等。请求目的地配置中填入以下内容：

- 目标接口地址：http://hcp.domain.com/hcp/get_host_list/
- 目标接口请求类型：POST
- 编码POST参数方式：json `目标接口请求方式为 POST 时，才需要指定`

## API访问信息
通过上面的配置，即可接入API，访问API同样会进行应用和用户的认证。API的访问地址为：
```
http://xxx.domain.com/api/c/self-service-api/hcp/get_host_list/
```
