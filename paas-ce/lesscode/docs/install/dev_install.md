# 蓝鲸智云PaaS平台社区版之可视化开发平台

## 分支管理说明

可视化开发平台使用 [lesscode-develop](https://github.com/Tencent/bk-PaaS/tree/lesscode-develop), [lesscode-master](https://github.com/Tencent/bk-PaaS/tree/lesscode-master) 两个分支进行迭代。其中 lesscode-master 为稳定版分支，每次 release 都会基于这个分支；lesscode-develop 为日常开发的分支。

## 本地开发环境搭建以及开发流程

1. fork [bk-PaaS](https://github.com/Tencent/bk-PaaS) 到你自己的 github 仓库
2. 把 fork 的仓库 clone 到本地
    ```bash
    git clone https://github.com/{YourName}/bk-PaaS.git
    ```
3. 进入 bk-PaaS/paas-ce/lesscode 目录
    ```bash
    cd bk-PaaS/paas-ce/lesscode
    ```
4. 添加主库
    ```bash
    # base 为设置主库的别名
    git remote add base https://github.com/Tencent/bk-PaaS.git
    ```
5. 切换分支（以主库 develop 分支为准，但是主库的默认分支是 master，所以需要切换。之后所有的 pr 都会往主库的 develop 发送）
    ```bash
    git checkout develop
    ```
6. 把主库 develop 的代码更新到本地（第一次从主库合并最新代码到自己的库，推荐 rebase，之后我们用 merge）
    ```bash
    # git merge base/develop
    git rebase base/develop
    ```
    rebase 之后，查看 git 状态（`git status`），如果发现本地对比远程有 behind，那么此时需要执行如下命令
    ```bash
    git pull origin master --allow-unrelated-histories
    ```
    之后便可正常 pull, push

7. 本地创建 lesscode-develop, lesscode-master 分支
    ```bash
    git checkout -b lesscode-develop
    git checkout -b lesscode-master
    ```
8. 创建完成后，可以和主库的这两个分支对比一下
    ```bash
    git diff base/lesscode-develop
    git diff base/lesscode-master
    ```
9. 上一步的对比，正常来说，不会有差异，如果有差异，那么就把主库的代码合入本地（第一次从主库合并最新代码到自己的库，推荐 rebase，之后我们用 merge）
    ```bash
    # git merge base/lesscode-develop
    git rebase base/lesscode-develop
    # git merge base/lesscode-master
    git rebase base/lesscode-master
    ```
10. 本地切换到 lesscode-develop 分支，然后开始自己的开发
    ```bash
    # 安装 node_modules 依赖
    npm install .
    # 本地启动，开始开发
    npm run dev
    ```
12. 开发完成后，本地推往远程 **（自己 fork 的远程，https://github.com/{YourName}/bk-PaaS.git）**
    ```bash
    git push origin lesscode-develop
    ```
