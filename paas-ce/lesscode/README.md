# 蓝鲸智云PaaS平台社区版之可视化开发平台

## 简介
蓝鲸智云可视化开发平台提供了前端页面在线可视化拖拽组装、配置编辑、源码生成、二次开发等能力。旨在帮助用户通过尽量少的手写代码的方式快速设计和开发SaaS。本次平台开源部分支持基于Vuejs的UI组件拖拽及源码生成，未来我们将持续更新扩充平台能力。

## 功能特性
- 可视化拖拽布局：集成蓝鲸MagicBox Vue通用组件，支持在线画布拖拽组件进行页面布局编辑、在线预览、查看及下载源码
- 在线函数库管理：支持在线灵活编写管理事件函数及远程接口返回数据清洗函数
- 在线组件配置：支持组件样式、属性、事件在线配置
- 支持自定义组件开发：提供自定义组件开发规范及示例，开放自定义组件开发能力，满足业务场景组件集成需求
- 二次开发能力：生成的Vue源码文件支持无缝集成到蓝鲸前端开发框架([BKUI-CLI](https://bk.tencent.com/docs/document/5.1/19/583))进行二次开发

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
│   │   │   ├── custom/     # 自定义组件的存放目录
│   │   │   │   ├── index.js    # 自定义组件的入口文件，如增加自定义组件，需要在此文件中注册
│   │   │   │       ......
│   │   │   ├── element-materials/  # 基础组件的配置以及修改配置和页面渲染的逻辑
│   │   │   │       ......
│   │   │   ├── images/     # 前端使用的图片存放目录
│   │   │       .....
│   │   │   ├── mixins/     # 前端使用的 mixins
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
│       ├── router/         # 后端路由目录
│       │   ......
│       ├── service/        # 后端服务目录
│       │   ......
├── nodemon.json            # nodemon 配置文件
├── package.json            # 项目描述文件
```

## 技术栈

可视化开发平台采用的主要技术如下：

1. 前端：主要是 Vue 全家桶，包括 vue, vue-router, vuex，使用 vuedraggable 来实现拖拽，前端工程化采用的是常用的 webpack 方案。
2. 后端：使用 koa@2 为服务器，mysql 为数据库。本地开发时使用 nodemon 作为进程管理，生产环境使用 forever 作为进程守护。

## 依赖说明

项目主要的依赖是目前常用的比较新的模块，webpack@4，babel@7，vue@2，koa@2 等。**运行的 nodejs 要求为 >= 8.9.0**。

> 安装 Node.js 参见[官方文档](https://nodejs.org/)。安装完成后，注意设置 node 到 PATH 中

## 安装部署
- [本地开发部署](./docs/install/dev_install.md)
- [生产环境部署](./docs/install/prod_install.md)

## 开发文档
- [自定义组件开发文档](./docs/develop/dev_com.md)
- [自定义组件管理文档](./docs/develop/release_com.md)
