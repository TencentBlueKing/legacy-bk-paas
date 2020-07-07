# 蓝鲸智云PaaS平台社区版之可视化开发平台

## 数据库说明

需要用户自己提供 MySQL 服务并做 db 授权。本地开发和生产环境的数据库初始化和变更流程是一样的，都需要自己执行SQL对数据库进行修改。执行 SQL 分两种，初始化时执行的 SQL 和升级时执行的 SQL。SQL 文件存放于 `lesscode/lib/server/model/sql` 文件夹下。

## 数据库配置说明

在本地开发和生产环境中，需要依照 [数据库配置示例](../../lib/server/conf/data-base.js.example) 在 `lesscode/lib/server/conf` 中新建 `data-base.js` 文件（复制 `data-base.js.example`，并删除 `.example`即可）。然后依照 `data-base.js.example` 的注释填写数据库的配置信息。

## 数据库初始化说明

在 `lesscode/lib/server/model/sql` 文件夹下，每次发版都会新建一个文件夹，以发布日期命名，里面的 `initial.sql` 为安装该版本需要的所有 SQL，包含了建表语句和初始化数据。初次安装的时候，需要手动执行该SQL，即完成了数据库初始化。注意：如果不是数据库初始化，执行该 SQL 会导致数据丢失。如果是升级，请按照数据库表结构变更来操作。

## 数据库表结构变更说明

在 `lesscode/lib/server/model/sql` 文件夹下，每次发布还会生成 `update.sql`，`update.sql` 是从上一个版本升级到这个版本的 SQL 语句，包含了修改表结构语句和初始化数据。如果这次升级数据库，跨越了3个版本，那么这3个版本的 `update.sql` 需要按照版本顺序都执行一次，即完成了数据库表结构变更。
