# 蓝鲸智云PaaS平台（社区版）
<img src="docs/resource/img/logo.png" width="250" hegiht="10" align=center />

[![license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://github.com/Tencent/bk-PaaS/blob/master/LICENSE) [![Release Version](https://img.shields.io/badge/release-3.0.0-blue.svg)](https://github.com/Tencent/bk-PaaS/releases) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-blue.svg)](https://github.com/Tencent/bk-PaaS/pulls)

[(English Documents Available)](README_EN.md)

蓝鲸智云PaaS平台是一个开放式的开发平台，让开发者可以方便快捷地创建、开发、部署和管理SaaS应用。

本次开源的是蓝鲸智云PaaS平台社区版(BlueKing PaaS Community Edition)，它提供了应用引擎、前后台开发框架、API网关、调度引擎、统一登录、公共组件等模块，帮助用户快速、低成本、免运维地构建支撑工具和运营系统（统称为SaaS应用），它为一个SaaS应用从创建到部署，再到后续的维护管理提供了完善的自动化和自助化服务，从而使开发者可以集中精力关注SaaS应用的逻辑开发。

蓝鲸智云PaaS平台社区版源码包含:

- PaaS（paas-ce/paas）: 包含4大服务（python [[Django](https://www.djangoproject.com/)]）
    - login: 蓝鲸统一登录服务
    - paas: 蓝鲸开发者中心&web工作台
    - esb: 蓝鲸API网关
    - appengine: 蓝鲸应用引擎
- PaaSAgent（paas-ce/paasagent）: 蓝鲸应用引擎Agent（golang [[labstack/echo](https://github.com/labstack/echo)]）

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

## Install

- [安装部署PaaS](docs/install/ce_paas_install.md)
- [安装部署PaaSAgent](docs/install/ce_paas_agent_install.md)
- [替换已安装的蓝鲸社区版指引](docs/install/replace_ce_with_opensource.md)


## Release

- [PaaS 版本日志](paas-ce/paas/release.md)
- [PaaSAgent 版本日志](paas-ce/paasagent/release.md)

## 蓝鲸开源SaaS应用列表

- [故障自愈](https://github.com/Tencent/bk-fta-solutions)
- [标准运维](https://github.com/Tencent/bk-sops)
- [CICDkit](https://github.com/Tencent/bk-cicdkit)

## Support

- [白皮书](http://docs.bk.tencent.com/product_white_paper/paas/)
- [蓝鲸论坛](https://bk.tencent.com/s-mart/community)
- [蓝鲸 DevOps 在线视频教程](https://cloud.tencent.com/developer/edu/major-100008)
- 联系我们，技术交流QQ群：


<img src="docs/resource/img/bk_qq_group.png" width="250" hegiht="250" align=center />

## Contributing

关于分支/issue及PR, 请查看 [CONTRIBUTING](docs/CONTRIBUTING.md)

[腾讯开源激励计划](https://opensource.tencent.com/contribution) 鼓励开发者的参与和贡献，期待你的加入。

## FAQ

请查看 [FAQ](https://github.com/Tencent/bk-PaaS/wiki/FAQ)

## License

基于 MIT 协议， 详细请参考[LICENSE](LICENSE)
