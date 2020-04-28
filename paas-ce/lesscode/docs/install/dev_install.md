# 蓝鲸智云PaaS平台社区版之可视化开发平台

## 分支管理说明

可视化开发平台使用 [lesscode-develop](https://github.com/Tencent/bk-PaaS/tree/lesscode-develop), [lesscode-master](https://github.com/Tencent/bk-PaaS/tree/lesscode-master) 两个分支进行迭代。其中 lesscode-master 为稳定版分支，每次 release 都会基于这个分支；lesscode-develop 为日常开发的分支，给可视化开发平台贡献代码统一向 lesscode-develop 分支提 pr。

## 本地开发环境搭建以及开发流程

> 主库：指 https://github.com/Tencent/bk-PaaS
>
> fork 仓库：指 https://github.com/{YourName}/bk-PaaS
>
> 本地仓库：指从 fork 仓库 clone 到本地的仓库

1. fork 主库 [bk-PaaS](https://github.com/Tencent/bk-PaaS) 到你自己的 github 仓库
2. 把 fork 的仓库 clone 到本地仓库
    ```bash
    git clone https://github.com/{YourName}/bk-PaaS.git
    ```
3. 进入 bk-PaaS/paas-ce/lesscode 目录
    ```bash
    cd bk-PaaS/paas-ce/lesscode
    ```
4. remote 添加主库
    ```bash
    # base 为给主库设置的别名
    git remote add base https://github.com/Tencent/bk-PaaS.git
    ```
5. 本地仓库切换分支（以主库 lesscode-develop 分支为准，lesscode-develop 为日常开发的分支，每次均向 lesscode-develop 分支提 pr）
    ```bash
    git checkout lesscode-develop
    ```
6. 把主库 lesscode-develop 的代码更新到本地仓库（第一次从主库合并最新代码到本地仓库，推荐 rebase，之后我们用 merge）
    ```bash
    # git merge base/lesscode-develop
    git rebase base/lesscode-develop
    ```
    rebase 之后，查看 git 状态（`git status`），如果发现本地仓库对比远程有 behind，那么此时需要执行如下命令
    ```bash
    git pull origin lesscode-develop --allow-unrelated-histories
    ```
    之后便可正常 pull, push

7. 本地仓库切换 lesscode-master 分支，把主库 lesscode-master 的代码更新到本地仓库。（lesscode-master 为稳定版分支，建议本地仓库 lesscode-master 分支保持与主库一致）
    ```bash
    git checkout lesscode-master

    # 和主库的 lesscode-master 分支对比
    git diff base/lesscode-master

    # 正常来说，对比不会有差异，如果有差异，那么就把主库的代码合入本地仓库（第一次从主库合并最新代码到自己的库，推荐 rebase，之后我们用 merge）
    # git merge base/lesscode-master
    git rebase base/lesscode-master
    ```
8. 本地仓库切换到 lesscode-develop 分支，然后开始自己的开发
    ```bash
    git checkout lesscode-develop
    # 安装 node_modules 依赖
    npm install .
    # 本地启动，开始开发
    npm run dev
    ```
9. 开发完成后，本地仓库推往 fork 仓库 lesscode-develop 分支 **（自己 fork 的仓库，https://github.com/{YourName}/bk-PaaS.git）**
    ```bash
    git push origin lesscode-develop
    ```
10. 推往自己 fork 仓库的 lesscode-develop 分支后，可以向 bk-PaaS 主库的 lesscode-develop 提 pr。 **（给可视化开发平台贡献代码，统一向 lesscode-develop 分支提 pr）**
