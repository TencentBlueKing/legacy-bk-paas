# The BlueKing PaaS (Community Edition)

<img src="docs/resource/img/logo.png" width="250" hegiht="10" align=center />

[![license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://github.com/Tencent/bk-PaaS/blob/master/LICENSE) [![Release Version](https://img.shields.io/badge/release-3.0.0-blue.svg)](https://github.com/Tencent/bk-PaaS/releases) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-blue.svg)](https://github.com/Tencent/bk-PaaS/pulls)

The BlueKing PaaS is an open development platform that allows developers to create, develop, deploy and manage SaaS applications quickly and easily.

This open source project is the BlueKing PaaS Community Edition，It provides framework, API Gateway, scheduling engine, common components, etc. Helping developers to build SaaS Application(support tools and operating systems) quickly, cost-effectively and effortlessly . It provides a complete automation and self-service for a SaaS application from creation, deployment, maintenance and management. allowing developers to focus on the logical development of SaaS applications.

The BlueKing PaaS Community Edition contains:

- PaaS（paas-ce/paas）: include 4 web projects（python [[Django](https://www.djangoproject.com/)]）
    - login: Unified Login Service
    - paas: Developer Center & Workbench
    - esb: API Gateway
    - appengine: Application Engine
- PaaSAgent（paas-ce/paasagent）: Application Engine Agent（golang [[labstack/echo](https://github.com/labstack/echo)]）

## Overview

- [Architecture(In Chinese)](docs/overview/architecture.md)
- [Code directory(In Chinese)](docs/overview/project_codes.md)
- [Deployment topology(In Chinese)](docs/overview/project_deploy.md)

## Features

- Developer Center: Provide self-service, automated services to support fast, low-cost, 
free-operation of SaaS applications
- Unified Login Service: user and role management, support docking enterprise internal login system（[document](http://docs.bk.tencent.com/develop_center/enterprise_login/)）
- Framework: a SaaS application framework to make the development more efficient
- API Gateway: support docking the system API via online self-service access or component code access
- Multi-environment support: allowing developers to test and release SaaS application in different environment
- BlueKing S-mart application support: deploy S-mart application via file upload [more S-mart Application](http://bk.tencent.com/s-mart)

## Install

- [Install PaaS(In Chinese)](docs/install/ce_paas_install.md)
- [Install PaaSAgent(In Chinese)](docs/install/ce_paas_agent_install.md)
- [Replace the installed ce version(In Chinese)](docs/install/replace_ce_with_opensource.md)

## Release

- [PaaS release log(In Chinese)](paas-ce/paas/release.md)
- [PaaSAgent release log(In Chinese)](paas-ce/paasagent/release.md)

## SaaS List

- [Fault Auto-recovery](https://github.com/Tencent/bk-fta-solutions)
- [Standard OPS](https://github.com/Tencent/bk-sops)

## Support

- [white paper(In Chinese)](http://docs.bk.tencent.com/product_white_paper/paas/)
- [bk forum](https://bk.tencent.com/s-mart/community)
- [bk DevOps online video tutorial(In Chinese)](https://cloud.tencent.com/developer/edu/major-100008)
- Contact us, technical exchange QQ group:


<img src="docs/resource/img/bk_qq_group.png" width="250" hegiht="250" align=center />

## Contributing

For bk-PaaS branch management, issues, and pr specifications, read the [CONTRIBUTING(In Chinese)](docs/CONTRIBUTING.md)

If you are interested in contributing, check out the [CONTRIBUTING.md], also join our [Tencent OpenSource Plan](https://opensource.tencent.com/contribution).


## FAQ

[FAQ](https://github.com/Tencent/bk-PaaS/wiki/FAQ)

## License

bk-PaaS is based on the MIT protocol. Please refer to [LICENSE](LICENSE.txt)
