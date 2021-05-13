# 蓝鲸智云PaaS平台社区版之可视化开发平台

## 数据库说明

需要用户自己提供 MySQL 服务并做 db 授权。

可视化平台内置数据库自动导入和更新功能（db-migrate），程序每次启动时会自动执行数据库表结构的导入和更新操作，在同一个数据库内，内置的db-migrate框架会先检测每次的db变更是否已执行过，未执行过的db变更才会执行

相应的db初始化合变更文件可在`lesscode/lib/server/model/migrations/sql` 文件夹下查看

因此用户搭建好可用的MySQL服务，创建好相应数据库，按以外数据库配置说明配置好相应数据库信息即可

## 数据库配置说明

数据库相关配置文件共有两个，分别是

#### lesscode/lib/server/conf/data-base.js (用于数据库的连接)

在 `lesscode/lib/server/conf` 中新建 `data-base.js` 文件（复制 `data-base.js.example`，并删除 `.example`即可）。然后依照 [data-base.js.example](../../lib/server/conf/data-base.js.example) 的注释填写本地开发和线上运行时的数据库的配置信息。

#### lesscode/lib/server/conf/db-migrate.json (用于自动执行db导入和变更)

依照 [db-migrate.json](../../lib/server/conf/db-migrate.json) 的注释填写本地开发和线上运行时的数据库的配置信息。

