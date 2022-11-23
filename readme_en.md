![](docs/resource/img/bk_paas_en.png)
---

[![license](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat)](https://github.com/Tencent/bk-PaaS/blob/master/LICENSE) [![Release Version](https://img.shields.io/badge/release-3.0.0-brightgreen.svg)](https://github.com/Tencent/bk-PaaS/releases) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/Tencent/bk-PaaS/pulls)


[简体中文](readme.md) | English

>**BlueKing main version V6, currently the project is not updated, only maintenance functions**

The BlueKing PaaS is an open development platform that allows developers to create, develop, deploy and manage SaaS applications quickly and easily.

This open source project is the BlueKing PaaS Community Edition，It provides framework, API Gateway, scheduling engine, common components, etc. Helping developers to build SaaS Application(support tools and operating systems) quickly, cost-effectively and effortlessly . It provides a complete automation and self-service for a SaaS application from creation, deployment, maintenance and management. allowing developers to focus on the logical development of SaaS applications.

The BlueKing PaaS contains:

- PaaS（paas-ce/paas）: include 4 web projects（python [[Django](https://www.djangoproject.com/)]）
    - login: Unified Login Service
    - paas: Developer Center & Workbench
    - esb: API Gateway
    - appengine: Application Engine
- PaaSAgent（paas-ce/paasagent）: Application Engine Agent（golang [[labstack/echo](https://github.com/labstack/echo)]）
- LessCode: Visual development platform, provides front-end page online visual drag-and-drop assembly, configuration editing, source code generation, secondary development and other capabilities，[document](https://github.com/TencentBlueKing/bk-lesscode/blob/develop/readme.md)

<br>

>**Roadmap for BlueKing PaaS platform products**


|category |current status |open source status |open source address |belonging to BlueKing main version |release time |
|:--|:--|:--|:--|:--|:--|
|PaaS3.0 |Mainline version, Updating and maintaining |Open source |https://github.com/tencentblueking/blueking-paas |V7 |2022 |
|PaaS2.0 |Stopped updating, maintenance features only |Open source |https://github.com/tencent/bk-paas |V6 |2019 |
|PaaS1.0 |Stopped maintenance |Not open source |None |None |2012|

<br>

|Module List |PaaS2.0 (no longer updated, maintenance only) |PaaS3.0 (active open source project)
|:--|:--|:--|
|esb: BlueKing API Gateway |Integrated in the main repository (paas-ce/paas/esb) |Standalone as a product, APIGateway |
|login: BlueKing Unified Login Service |Integrated in the main repository (paas-ce/paas/login) |Standalone product, [Unified Login User Management]( https://github.com/TencentBlueKing/bk-user) |
|paas: BlueKing Developer Center |Integrated in the main repository (paas-ce/paas) |Standalone product, [PaaS-Developer Center](https://github.com/TencentBlueKing/blueking-paas) |
|paas: web workbench |Integrated in the main repository (paas-ce/paas) |Standalone product, optimize "workbench" to [console](https://github.com/ TencentBlueKing/blueking-console) |
|LessCode: Visual development platform |Integrated in the main repository lesscode-master branch) |Standalone product, [visual development platform ](https://github.com/TencentBlueKing/bk-lesscode) |

<br>

>**How to migrate SaaS developed in V6.0 and before to V7.0**

The "Developer Center" of PaaS platform provides "one-click migration" function, which only supports the SaaS developed by the official "Python development framework" of BlueKing, other types of Other types of SaaS migration solutions are being tested (please look forward to it, and it will be updated to the official website). 

<br>

>**What are the functional differences between PaaS platform versions**

|Function |PaaS2.0 |PaaS3.0 |
|:--|:--|:--|
|Minimum size of platform and application cluster|Platform (1 server)/Application (1 server)<br>Can be mixed<br>No high availability|Platform (1 server)/Application (1 server)<br>Yes mix |
|Underlying technology |Native docker |kubernetes |
|Application cluster scalability |Manual |Automatically invoke cluster node expansion |
|Application Scalability |Manual, cumbersome |Adjust the number of replicas to automatically expand |
|Application type |Main web application |Supports different programming languages ​​and complex application architecture |
|Supported programming languages ​​|Python (PHP, Java immature) |Python, Go, Node.JS |
|Support image deployment | |Yes (can support any programming language) |
|Support application source code repository |svn, Git |svn, Git (support Oauth authorization) |
|Support custom process start command | |Yes |
|Support application multi-module management and deployment | |Yes |
|View process real-time log online | |Yes |
|Stop process online | |Yes |
|Support inter-process communication settings | |Yes |
|Online adjustment process instance number | |Yes |
|Deployment restrictions (administrators can deploy only) | |Yes |
|View application CPU/memory resource information in real time | |Yes (Phase II, based on BCS) |
|Support Webconsole | |Yes |
|Support access method |Only sub-path, special way to configure independent domain name |Sub-path + independent sub-domain name|
|Support independent domain name | |Yes |
|MySQL Add-ons |Yes, only available for S-Mart applications |Yes |
|Redis Add-onss | |Yes |
|RabbitMQ Add-onss | |Yes |
|bkrepo Add-onss | |Yes |


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
- Visual development platform：Provide front-end page online visual drag-and-drop assembly, configuration editing, source code generation, secondary development and other capabilities，[document](https://github.com/TencentBlueKing/bk-lesscode/blob/develop/readme.md)


## Experience

- [Quick start via Docker container(In Chinese)](docs/wiki/container-support.md)

## Getting started

- [Install PaaS(In Chinese)](docs/install/ce_paas_install.md)
- [Install PaaSAgent(In Chinese)](docs/install/ce_paas_agent_install.md)
- [Replace the installed ce version(In Chinese)](https://docs.bk.tencent.com/bk_osed/guide.html#osed)

## Roadmap

- [PaaS release log(In Chinese)](paas-ce/paas/release.md)
- [PaaSAgent release log(In Chinese)](paas-ce/paasagent/release.md)


## Support

- [Wiki(In Chinese)](https://github.com/Tencent/bk-PaaS/wiki)
- [FAQ(In Chinese)](https://github.com/Tencent/bk-PaaS/wiki/FAQ)
- [white paper(In Chinese)](http://docs.bk.tencent.com/product_white_paper/paas/)
- [bk forum](https://bk.tencent.com/s-mart/community)
- [bk DevOps online video tutorial(In Chinese)](https://cloud.tencent.com/developer/edu/major-100008)
- Contact us, technical exchange QQ group:


<img src="docs/resource/img/bk_qq_group.png" width="250" hegiht="250" align=center />

## BlueKing Community

- [BK-CI](https://github.com/Tencent/bk-ci)：a continuous integration and continuous delivery system that can easily present your R & D process to you.
- [BK-BCS](https://github.com/Tencent/bk-bcs)：a basic container service platform which provides orchestration and management for micro-service business.
- [BK-BCS-SaaS](https://github.com/Tencent/bk-bcs-saas)：a SaaS provides users with highly scalable, flexible and easy-to-use container products and services.
- [BK-PaaS](https://github.com/Tencent/bk-PaaS)：an development platform that allows developers to create, develop, deploy and manage SaaS applications easily and quickly.
- [BK-SOPS](https://github.com/Tencent/bk-sops)：an lightweight scheduling SaaS  for task flow scheduling and execution through a visual graphical interface. 
- [BK-CMDB](https://github.com/Tencent/bk-cmdb)：an enterprise-level configuration management platform for assets and applications.
- [TencentBlueKing/iam-python-sdk](https://github.com/TencentBlueKing/iam-python-sdk) / [TencentBlueKing/iam-go-sdk](https://github.com/TencentBlueKing/iam-go-sdk): the python and go SDK of blueking IAM

## Contributing

If you have good ideas or suggestions, please let us know by Issues or Pull Requests and contribute to the BlueKing Open Source Community. For bk-PaaS branch management, issues, and pr specifications, read the [CONTRIBUTING(In Chinese)](docs/CONTRIBUTING.md)

If you are interested in contributing, check out the [CONTRIBUTING.md], also join our [Tencent OpenSource Plan](https://opensource.tencent.com/contribution).


## License

bk-PaaS is based on the MIT protocol. Please refer to [LICENSE](LICENSE.txt)

We undertake not to change the open source license (MIT license) applicable to the current version of the project delivered to anyone in the future.
