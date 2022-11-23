![](docs/resource/img/bk_paas_zh.png)
---

[![license](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat)](https://github.com/Tencent/bk-PaaS/blob/master/LICENSE) [![Release Version](https://img.shields.io/badge/release-3.2.2-brightgreen.svg)](https://github.com/Tencent/bk-PaaS/releases) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/Tencent/bk-PaaS/pulls) [![](https://travis-ci.com/Tencent/bk-PaaS.svg?token=ypkHQqxUR3Y3ctuD7qFS&branch=master)](https://travis-ci.com/Tencent/bk-PaaS)


[(English Documents Available)](readme_en.md)

>**所属蓝鲸智云主版本 V6，当前该项目停止更新，仅维护功能**

蓝鲸智云PaaS平台是一个开放式的开发平台，让开发者可以方便快捷地创建、开发、部署和管理SaaS应用。

本次开源的是蓝鲸智云PaaS平台社区版(BlueKing PaaS Community Edition)，它提供了应用引擎、前后台开发框架、API网关、调度引擎、统一登录、公共组件等模块，帮助用户快速、低成本、免运维地构建支撑工具和运营系统（统称为SaaS应用），它为一个SaaS应用从创建到部署，再到后续的维护管理提供了完善的自动化和自助化服务，从而使开发者可以集中精力关注SaaS应用的逻辑开发。

蓝鲸智云PaaS平台社区版源码包含:

- PaaS（paas-ce/paas）: 包含4大服务（python [[Django](https://www.djangoproject.com/)]）
    - login: 蓝鲸统一登录服务
    - paas: 蓝鲸开发者中心&web工作台
    - esb: 蓝鲸API网关
    - appengine: 蓝鲸应用引擎
- PaaSAgent（paas-ce/paasagent）: 蓝鲸应用引擎Agent（golang [[labstack/echo](https://github.com/labstack/echo)]）
- LessCode: 蓝鲸可视化开发平台，提供了前端页面在线可视化拖拽组装、配置编辑、源码生成、二次开发等能力，[详细介绍](https://github.com/TencentBlueKing/bk-lesscode/blob/develop/readme.md)

>**蓝鲸智云PaaS平台产品的发展路线图**

|类别 |当前状态 |开源状态 |开源地址 |所属蓝鲸智云主版本 |发布时间 |
|:--|
|PaaS3.0 |主线版本，更新维护中 |已开源 |https://github.com/tencentblueking/blueking-paas |V7 |2022年 |
|PaaS2.0 |停止更新，仅维护功能 |已开源 |https://github.com/tencent/bk-paas |V6 |2019年 |
|PaaS1.0 |停止维护 |未开源 |无 |无 |2012年 |


|模块列表 |PaaS2.0（停止更新，仅限维护） |PaaS3.0（活跃开源项目） |
|:--|
|esb: 蓝鲸API网关 |集成在主仓库（paas-ce/paas/esb) |独立成一个产品，APIGateway |
|login: 蓝鲸统一登录服务 |集成在主仓库（paas-ce/paas/login) |独立成一个产品，统一登录用户管理 https://github.com/TencentBlueKing/bk-user |
|paas: 蓝鲸开发者中心 |集成在主仓库（paas-ce/paas) |独立成一个产品，PaaS-开发者中心 https://github.com/TencentBlueKing/blueking-paas |
|paas: web工作台 |集成在主仓库（paas-ce/paas) |独立成一个产品，将“工作台”优化为“桌面” https://github.com/TencentBlueKing/blueking-console |
|LessCode: 蓝鲸可视化开发平台 |集成在主仓库（paas-ce/paas/lesscode) |独立成一个产品，可视化开发平台 https://github.com/TencentBlueKing/bk-lesscode |


>**V6.0及以前研发的SaaS，如何迁移到V7.0呢？**

PaaS平台的“开发者中心”提供“一键迁移”功能，仅支持将蓝鲸官方“Python开发框架”研发的SaaS，其他类型的SaaS迁移方案正在测试中（敬请期待，后续将更新至官网）。 

>**PaaS平台各版本的功能差异有哪些？**

|功能 |PaaS2.0 |PaaS3.0 |
|:--|
|平台、应用集群最小规模 |平台（1台服务器）/应用（1台服务器）<br>可混用<br>无高可用 |平台（1台服务器）/应用（1台服务器）<br>可混用 |
|底层技术 |原生docker |kubernetes |
|应用集群扩展性 |手动 |自动调用集群节点扩展 |
|应用扩展性 |手动，繁琐 |调整副本数自动扩展 |
|应用类型 |主要 web 类应用 |支持不同编程语言、复杂应用架构 |
|支持编程语言 |Python（PHP、Java 不成熟） |Python、Go、Node.JS |
|支持镜像部署 | |有 （可以支持任意编程语言） |
|支持应用源码仓库 |svn，Git |svn、Git（支持 Oauth 授权） |
|支持自定义进程启动命令 | |有 |
|支持应用多模块管理及部署 | |有 |
|在线查看进程实时日志 | |有 |
|在线停止进程 | |有 |
|支持进程间通信设置 | |有 |
|在线调整进程实例数 | |有 |
|部署限制（仅管理员可部署） | |有 |
|实时查看应用 CPU/内存 资源信息 | |有(二期，基于 BCS) |
|支持Webconsole | |有 |
|支持访问方式 |仅子路径，特殊方式配置独立域名 |子路径 + 独立子域名 |
|支持独立域名 | |有 |
|MySQL 增强服务 |有, 只对 S-Mart 应用提供 |有 |
|Redis 增强服务 | |有 |
|RabbitMQ 增强服务 | |有 |
|bkrepo 增强服务 | |有 |


## Overview

- [架构设计](docs/overview/architecture.md)
- [代码目录](docs/overview/project_codes.md)
- [部署拓扑](docs/overview/project_deploy.md)


## Features

- 开发者中心：提供自助化、自动化服务，支持快速、低成本、免运维地构建SaaS应用
- 统一用户登录体系：支持用户及角色管理，支持对接企业内部登录体系（[对接说明](http://docs.bk.tencent.com/develop_center/enterprise_login/)）
- 开发框架：提供统一的SaaS应用开发框架, 提升开发效率
- API网关：支持两种接入模式（在线自助接入和组件编码接入）的企业级服务总线，方便开发者对接企业内已有系统的API服务
- 多环境部署：支持多环境部署SaaS应用, 方便开发者进行测试验证及生产环境发布
- 可插拔式应用：支持蓝鲸S-mart应用上传部署, 方便蓝鲸S-mart应用部署移植 [更多应用](http://bk.tencent.com/s-mart)
- 可视化开发平台：支持前端页面在线可视化拖拽组装、配置编辑、源码生成、二次开发等能力（[详细介绍](https://github.com/TencentBlueKing/bk-lesscode/blob/develop/readme.md)）

## Experience

- [极速体验容器化部署蓝鲸智云PaaS平台](docs/wiki/container-support.md)

## Getting started

- [安装部署PaaS](docs/install/ce_paas_install.md)
- [安装部署PaaSAgent](docs/install/ce_paas_agent_install.md)
- [替换已安装的蓝鲸社区版指引](https://bk.tencent.com/docs/document/6.0/148/15382)


## Roadmap

- [PaaS 版本日志](paas-ce/paas/release.md)
- [PaaSAgent 版本日志](paas-ce/paasagent/release.md)

## Support

- [wiki](https://github.com/Tencent/bk-PaaS/wiki)
- [FAQ](https://github.com/Tencent/bk-PaaS/wiki/FAQ)
- [白皮书](http://docs.bk.tencent.com/product_white_paper/paas/)
- [蓝鲸论坛](https://bk.tencent.com/s-mart/community)
- [蓝鲸 DevOps 在线视频教程](https://bk.tencent.com/s-mart/video/)
- 联系我们，技术交流QQ群：


<img src="docs/resource/img/bk_qq_group.png" width="250" hegiht="250" align=center />

## BlueKing Community

- [BK-CI](https://github.com/Tencent/bk-ci)：蓝鲸持续集成平台是一个开源的持续集成和持续交付系统，可以轻松将你的研发流程呈现到你面前。
- [BK-BCS](https://github.com/Tencent/bk-bcs)：蓝鲸容器管理平台是以容器技术为基础，为微服务业务提供编排管理的基础服务平台。
- [BK-PaaS](https://github.com/Tencent/bk-PaaS)：蓝鲸PaaS平台是一个开放式的开发平台，让开发者可以方便快捷地创建、开发、部署和管理SaaS应用。
- [BK-SOPS](https://github.com/Tencent/bk-sops)：标准运维（SOPS）是通过可视化的图形界面进行任务流程编排和执行的系统，是蓝鲸体系中一款轻量级的调度编排类SaaS产品。
- [BK-CMDB](https://github.com/Tencent/bk-cmdb)：蓝鲸配置平台是一个面向资产及应用的企业级配置管理平台。
- [TencentBlueKing/iam-python-sdk](https://github.com/TencentBlueKing/iam-python-sdk) / [TencentBlueKing/iam-go-sdk](https://github.com/TencentBlueKing/iam-go-sdk)：蓝鲸权限中心SDK


## Contributing

如果你有好的意见或建议，欢迎给我们提 Issues 或 Pull Requests，为蓝鲸开源社区贡献力量。关于分支/issue及PR, 请查看 [CONTRIBUTING](docs/CONTRIBUTING.md)

[腾讯开源激励计划](https://opensource.tencent.com/contribution) 鼓励开发者的参与和贡献，期待你的加入。

## License

基于 MIT 协议， 详细请参考[LICENSE](LICENSE.txt)

我们承诺未来不会更改适用于交付给任何人的当前项目版本的开源许可证（MIT 协议）。
