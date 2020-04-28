# 极速体验

为了能让大家最快的体验蓝鲸智云PaaS平台，社区推出了蓝鲸智云PaaS平台的容器部署方式，秒级体验PaaS平台服务。

注意:
- 镜像仅用于快速体验, 不能用于生产; 
- 目前可以体验login(统一登录)/paas(开发者中心)/esb(API网关), 暂时还不能体验paas_agent(应用引擎: 应用部署流程); 目前处理中, 后续会加入

## Docker环境

蓝鲸智云PaaS平台容器化部署同时支持让你在Windows, macOS, Linux环境下进行部署。

如果你已经有docker的环境，可以直接进入部署环节。如果你没有docker环境，也想体验，请参照下面的官方链接进行部署。

* windows

    docker官方社区目前只支持Windows10(64位)版本，并启用了Hyper-V服务。Docker for Windows的安装
    包在[这里](https://download.docker.com/win/stable/19507/Docker%20for%20Windows%20Installer.exe)
    下载并安装。安装细节可以参考[这里](https://docs.docker.com/docker-for-windows/install/#what-to-know-before-you-install)。

* macOS

    安装命令如下。安装完成后，直接启动docker即可。
    ```shell
    brew cask install docker
    ```

 * linux
    由于linux的发行版本比较多，这里就不逐一列出，大家可以参考docker官方的文档进行安装。
    - [CentOS](https://docs.docker.com/install/linux/docker-ce/centos/)
    - [Debian](https://docs.docker.com/install/linux/docker-ce/debian/)
    - [Fedora](https://docs.docker.com/install/linux/docker-ce/fedora/)
    - [Ubuntu](https://docs.docker.com/install/linux/docker-ce/ubuntu/)

## 部署

#### 1. 拉取镜像

当你有了docker的环境后，就可以在**终端**拉取bk-PaaS的体验镜像了。

bk-PaaS用于体验的镜像存储于腾讯云的镜像公共镜像仓库。 仓库地址在[这里](https://console.cloud.tencent.com/tke/registry/qcloud/default/detail/tag?rid=1&reponame=bk.io%252Fpaas-standalone)

目前有一个tag为**latest**的镜像, 方便大家体验最新版本; 未来会提供与release版本一致的镜像，


镜像名称：ccr.ccs.tencentyun.com/bk.io/paas-standalone

镜像tag: latest


拉取命令：

```shell
docker pull ccr.ccs.tencentyun.com/bk.io/paas-standalone:latest
```

#### 2. 启动容器

执行如下命令，bk-PaaS容器服务即可启动。

```shell
docker run -d --name="bk-paas" -p 8000-8003:8000-8003 ccr.ccs.tencentyun.com/bk.io/paas-standalone:latest
```

这里端口映射: `appengine 8000/ paas 8001 / esb 8002 / login 8003`

#### 3. 配置host及访问


配置host

```
127.0.0.1 www.bking.com
```

此时你可以打开浏览器，访问`http://www.bking.com:8001`, 使用默认用户名密码(admin/admin)登录, 即可体验最新版的蓝鲸智云PaaS平台服务。

**恭喜你，你正在体验最新的蓝鲸智云PaaS平台服务。**

