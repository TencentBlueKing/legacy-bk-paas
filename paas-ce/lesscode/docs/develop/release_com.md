# 蓝鲸智云PaaS平台社区版之可视化开发平台

## 自定义组件管理

在[自定义组件开发](./dev_com.md)中，我们详细介绍了自定义组件的目录结构，开发过程以及生成代码后如何使用。这里我们主要介绍一下自定义组件的管理，如何集成到平台主代码库以及发布 npm。

### 集成到平台主代码库

可视化开发平台我们采用常规的 github 开源项目的协作方式进行迭代。自定义组件的开发完成后需要集成到平台主代码仓库中，并重新发布平台方可在平台产品上正常拖拽使用。

在[本地开发环境搭建](../install/dev_install.md)中介绍过要把 [bk-PaaS](https://github.com/Tencent/bk-PaaS) fork 到自己的 github 仓库。之后所有的开发工作都在 fork 的这个仓库进行，包括系统的优化、bug 修复以及自定义组件的开发。

在主代码库中，只做三件事，issue 的提出及讨论、pull request 的 review、pull request 的 merge。

自定义组件开发完成后，需要把组件源码放在平台代码库`/lib/client/src/custom` 目录中，同时在 `/lib/client/src/custom/index.js` 中注册该自定义组件（参考[自定义组件开发](./dev_com.md#自定义组件开发-1)），开发完成后，往主库 [bk-PaaS](https://github.com/Tencent/bk-PaaS) 发 pr，code review 之后如果没问题，就会 merge 到主库。

### 上传到 npm

开发的自定义组件 merge 到主库之后，便可将自定义组件发布到 npm 上，这样就可以在项目中真正使用到这个自定义组件（当然，也可以在开发过程中就发到 npm，然后在自己项目中真正引用自定义组件，也方便发现问题）。

以自定义组件`x-script`为例，发布到 npm后，只需要在自定义组件的根目录，即 package.json 所在的目录执行 `npm publish` 即可，之后在项目中使用 `npm install x-script` 来安装自定义组件，`x-script` 就是该自定义组件的 npm 包名（其他 package.json 的属性可以参考[官方文档](https://docs.npmjs.com/files/package.json)）。

安装完成后，在项目中注册自定义组件 `Vue.component('自定义组件名称', '自定义组件')` ，然后就可直接使用 `<x-script prop1="xxx" prop2="xxx"></x-script>`。

> 如果不太了解 npm 的话，那么安装 nodejs 之后，在自定义组件的根目录中执行 `npm init -f` 就可生成默认的 package.json，生成之后，修改 name 和 version 然后 `npm publish` 发布即可。（这里 name 就是指 npm 的包名）
