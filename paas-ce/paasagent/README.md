# 蓝鲸智云PaaS平台社区版之PaaSAgent

## 简介

paasagent目录是蓝鲸智云PaaS平台中应用引擎(appengine)对应的agent模块源码目录

主要作用是:

- agent需要部署在应用服务器上
- 负责接收上层应用引擎(appengine)的请求指令，执行SaaS应用的部署和下架等任务操作(应用运行时环境的构建和进程托管)

## 技术栈

- framework: labstack/echo
- python run time: virtualenv, uwsgi

## 依赖说明

- appengine: 需要调用appengine的接口, 回写SaaS应用的部署日志
