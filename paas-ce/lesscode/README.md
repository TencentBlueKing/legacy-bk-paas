# 蓝鲸智云可视化开发平台（LessCode）
## 重要通知
**蓝鲸智云可视化开发平台（LessCode）开源仓库已迁移至[新地址](https://github.com/TencentBlueKing/bk-lesscode/tree/master)，该地址源码将不再更新，欢迎继续向我们贡献源码，共建平台能力，感谢**

## 简介
蓝鲸智云可视化开发平台提供了前端页面在线可视化拖拽组装、配置编辑、源码生成、二次开发等能力。旨在帮助用户通过尽量少的手写代码的方式快速设计和开发SaaS。本次平台开源部分支持基于Vuejs的UI组件拖拽及源码生成，未来我们将持续更新扩充平台能力。

## 功能特性
- 可视化拖拽布局：集成蓝鲸MagicBox Vue通用组件，支持在线画布拖拽组件进行页面布局编辑、在线预览、查看及下载源码
- 在线函数库管理：支持在线灵活编写管理事件函数及远程接口返回数据清洗函数
- 在线组件配置：支持组件样式、属性、事件在线配置
- 布局模板：提供多种导航布局模板
- 支持自定义组件开发：提供自定义组件开发规范及示例，开放自定义组件开发能力，满足业务场景组件集成需求
- 二次开发能力：生成的Vue源码文件支持无缝集成到蓝鲸前端开发框架([BKUI-CLI](https://bk.tencent.com/docs/document/6.0/130/5940))进行二次开发

## 代码目录

可视化开发平台源代码目录结构如下：

```bash
├── README.md
├── docs/                   # 文档目录
│   ......
├── lib/                    # 源码目录
│   ├── client/             # 前端源码目录
│   │   ├── build/          # 前端构建脚本目录
│   │       ......
│   │   ├── index-dev.html  # 本地开发使用的 html
│   │   ├── index.html      # 生产环境使用的 html
│   │   ├── preview.html    # 预览模块使用的 html
│   │   ├── require-monaco.html # 辅助引入 monaco 编辑器的 html
│   │   ├── src/            # 前端源码目录
│   │   │   ├── App.vue     # App 组件
│   │   │   ├── main.js     # 主入口
│   │   │   ├── api/        # 前端 ajax 目录
│   │   │       ......
│   │   │   ├── common/     # 常用前端模块目录
│   │   │       ......
│   │   │   ├── components/ # 前端组件目录
│   │   │       ......
│   │   │   ├── css/        # 前端 css 目录
│   │   │       ......
│   │   │   ├── element-materials/  # 基础组件的配置以及修改配置和页面渲染的逻辑
│   │   │   │       ......
│   │   │   ├── images/     # 前端使用的图片存放目录
│   │   │       .....
│   │   │   ├── preview/    # 前端预览模块 目录
│   │   │       ......
│   │   │   ├── router/     # 前端 router 目录
│   │   │       ......
│   │   │   ├── store/      # 前端 store 目录
│   │   │       ......
│   │   │   ├── views/      # 前端页面目录
│   │   │       ......
│   │   └── static/         # 前端静态资源目录
│   │       ......
│   └── server/             # 后端源码目录
│       ├── app.browser.js  # 服务器启动文件
│       ├── logger.js       # 后端日志组件
│       ├── util.js         # 后端工具方法
│       ├── conf/           # 后端配置文件目录
│       │   ......
│       ├── controller/     # 后端 controller 目录
│       │   ......
│       ├── middleware/     # 后端中间件目录
│       │   ......
│       ├── model/          # 后端实体目录
│       │   ......
│       ├── project-template/  # 后端生成项目源码模板
│       │   ......
│       ├── router/         # 后端路由目录
│       │   ......
│       ├── service/        # 后端服务目录
│       │   ......
│       ├── utils/          # 后端utils 目录
│       │   ......
├── nodemon.json            # nodemon 配置文件
├── package.json            # 项目描述文件
├── forever.json            # forever 配置文件
```

## 技术栈

可视化开发平台采用的主要技术如下：

1. 前端：主要是 Vue 全家桶，包括 vue, vue-router, vuex，使用 vuedraggable 来实现拖拽，前端工程化采用的是常用的 webpack 方案。
2. 后端：使用 koa@2 为服务器，mysql 为数据库。本地开发时使用 nodemon 作为进程管理，生产环境使用 forever 作为进程守护。

## 依赖说明

#### 环境依赖
项目主要的依赖是目前常用的比较新的模块，webpack@4，babel@7，vue@2，koa@2 等。**运行的 nodejs 要求为 >= 8.9.0**。

> 安装 Node.js 参见[官方文档](https://nodejs.org/)。安装完成后，注意设置 node 到 PATH 中

#### 服务依赖
- 蓝鲸社区版登录（必须）：可视化平台的登录服务对接的是蓝鲸社区版登录，请事先搭建蓝鲸社区版环境
- 蓝鲸制品库服务（非必须）： 若需要使用到平台的自定义组件功能开发模块，请事先搭建 [蓝鲸制品库服务](https://github.com/Tencent/bk-ci/tree/master/src/backend/storage/core)， **搭建时并开启npm-registry**

## 分支说明
可视化开发平台使用 lesscode-develop, lesscode-master 两个分支进行迭代。其中 lesscode-master 为稳定版分支，每次 release 都会基于这个分支；lesscode-develop 为日常开发的分支，给可视化开发平台贡献代码统一向主库 [bk-PaaS](https://github.com/Tencent/bk-PaaS) 的  [lesscode-develop](https://github.com/Tencent/bk-PaaS/tree/lesscode-develop) 分支提 pr。

## 安装部署
- [本地开发部署](./docs/install/dev_install.md)
- [生产环境部署](./docs/install/prod_install.md)
- [数据库说明](./docs/install/database.md)
- [配置文件说明](./docs/install/conf.md)

## 开发文档
- [自定义组件开发和管理文档](./lib/client/src/views/help/docs/custom.md)
