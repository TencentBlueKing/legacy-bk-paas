# 蓝鲸智云PaaS平台社区版之应用引擎

## 简介

appengine目录是蓝鲸智云PaaS平台中, 负责托管 SaaS 应用的后台服务模块（应用引擎）源码目录。

主要作用是:

- 提供SaaS应用生命周期的管理功能，包括提测、上线、下架等，与PaaSAgent交互
- 提供SaaS应用依赖的第三方服务的管理功能，包括服务申请，服务配置等

## 技术栈

- framework: Django 1.8.11
- database: mysql

## 依赖说明

- paasagent: 需要调用paasagent接口, 完成对SaaS应用生命周期的管理功能
- mysql: 平台数据库
