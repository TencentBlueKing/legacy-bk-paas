# 蓝鲸智云PaaS平台社区版之可可视化开发平台

## 生产环境搭建及部署

<!-- 前面几步与[本地开发部署](./dev_install.md)一致，把代码 clone 到生产环境服务器，然后安装前端依赖。之后执行 `npm run build && npm run online` 即可启动系统。 -->

在[本地开发部署](./dev_install.md)里我们介绍过，需要 fork [bk-PaaS](https://github.com/Tencent/bk-PaaS) 到自己的 github 仓库，之后任何的开发工作都在这个 fork 的仓库进行。

功能开发完成，需要部署到线上环境，这里我们提供单机部署示例，具体分为如下几步：（**下列步骤均在服务器上进行**）

> 假设在服务器上操作的目录是 `/data/`，服务器的 ip 是 `xxx.xxx.xxx.xxx`

```bash
# 1. 把之前 fork 的仓库 clone 到服务器上。（ clone 之后，可视化开发平台的目录结构应该是 `/data/bk-PaaS/paas-ce/lesscode`）
cd /data/
git clone https://github.com/{YOUR NAME}/bk-PaaS.git

# 2. 进入 `/data/bk-PaaS/paas-ce/lesscode` 目录
cd /data/bk-PaaS/paas-ce/lesscode

# 3. 运行 `npm install .` 安装前端依赖
npm install .

# 4. 执行 `npm run online`，系统会进行构建，构建之后会以后台启动的方式启动服务
npm run online
```

执行 `npm run online`，系统会先进行构建，然后后台启动服务，当看到命令行出现如下日志，就说明已经启动成功。

```bash
info:    Forever processing file: lib/server/app.browser.js
```

之后就可以通过 `http://xxx.xxx.xxx.xxx:5000` 的形式来访问服务。

服务启动之后，我们提供下面几条命令对进程进行管理（**均在项目根目录即 `/data/bk-PaaS/paas-ce/lesscode` 下执行**）

```bash
# 查看当前运行的服务进程
npm run list

# 查看当前运行进程的日志存放路径
npm run logs

# 关闭当前运行进程
npm run stop

# 查看 5000 端口是否开启
netstat -nlput | grep 5000
```

## 服务器 80 端口代理配置

前面我们已经可以通过 `http://xxx.xxx.xxx.xxx:5000` 的形式来访问服务。但是这种形式非常不便，我们通常更习惯用域名并且不需要输入端口的形式来访问。这里以 `nginx` 为例简单介绍一下代理配置。

首先我们的系统生产模式是在 5000 端口启动，这个 5000 端口是在 `lib/server/conf/http.js` 文件第三行定义的，可以根据实际情况自行更改。

之后在 nginx 中增加一个代理配置，示例如下：

```bash
#cat /etc/nginx/conf.d/lesscode.conf
upstream LESSCODE {
    server 127.0.0.1:5000 max_fails=1 fail_timeout=30s;
}

server {
    listen 80;
    server_name lesscode.bk.com;

    client_max_body_size 512m;
    access_log /var/log/nginx/lesscode.bk.com.access.log;

    location / {
        proxy_pass http://LESSCODE;
        proxy_pass_header Server;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Scheme $scheme;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $http_host;
        proxy_set_header Host $http_host;
        proxy_redirect off;
        proxy_read_timeout 600;
    }
}
```

可以看到我们配置了域名 `lesscode.bk.com`，并把 5000 端口代理到了 80 端口。

配置完成之后，重启 nginx 就可以通过 `http://lesscode.bk.com` 来访问系统。

> 如果已经设置了域名映射，那么直接访问即可；如果没有设置域名映射，那么需要在本地的 hosts 文件中配置 host 才能通过域名访问。
> host 配置示例 `xxx.xxx.xxx.xxx lesscode.bk.com`
