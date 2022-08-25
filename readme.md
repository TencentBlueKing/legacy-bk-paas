![](docs/resource/img/bk_paas_zh.png)
---

[![license](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat)](https://github.com/Tencent/bk-PaaS/blob/master/LICENSE) [![Release Version](https://img.shields.io/badge/release-3.2.2-brightgreen.svg)](https://github.com/Tencent/bk-PaaS/releases) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/Tencent/bk-PaaS/pulls) [![](https://travis-ci.com/Tencent/bk-PaaS.svg?token=ypkHQqxUR3Y3ctuD7qFS&branch=master)](https://travis-ci.com/Tencent/bk-PaaS)


[(English Documents Available)](readme_en.md)

> **社区版**

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
- [BK-JOB](https://github.com/Tencent/bk-job)：蓝鲸作业平台(Job)是一套运维脚本管理系统，具备海量任务并发处理能力。

## Contributing

如果你有好的意见或建议，欢迎给我们提 Issues 或 Pull Requests，为蓝鲸开源社区贡献力量。关于分支/issue及PR, 请查看 [CONTRIBUTING](docs/CONTRIBUTING.md)

[腾讯开源激励计划](https://opensource.tencent.com/contribution) 鼓励开发者的参与和贡献，期待你的加入。

## License

基于 MIT 协议， 详细请参考[LICENSE](LICENSE.txt)

我们承诺未来不会更改适用于交付给任何人的当前项目版本的开源许可证（MIT 协议）。
