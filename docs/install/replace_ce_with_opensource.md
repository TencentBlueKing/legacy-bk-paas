# 开源版替换已安装的社区版指引

注意: 当前版本接口及协议同社区版4.0一致. 如果社区版版本高于4.0, 谨慎替换

开源版本代码来源于社区版, 功能一致

即, 如果自行在开源版代码基础上进行二次开发, 可以替换已有社区版的服务

#### 替换维度

服务级替换, 即, 以整体服务为单元进行替换. 可以分别替换`paas`/`login`/`appengine`以及`paasagent`

## web服务替换方式

注意: 对于API网关(esb), 由于社区版包含所有官方组件, 而开源版是社区版的子集, 所以谨慎替换, 如需替换并支持社区版所有组件, 请参考本文档`paas下的API网关(esb)服务替换方式`

以`paas`为例

1. 确认社区版对应`paas`的配置文件内容
2. 在机器上, 根据部署文档, 参考社区版相同服务的配置, 部署`paas`, 并启动(监听端口可能不同, 例如`8010`)
3. 修改社区版`nginx`配置, 将`OPEN_PAAS`执行新服务地址

    ```
    upstream OPEN_PAAS {
     ip_hash;
     server 127.0.0.1:8010 max_fails=1  fail_timeout=30s;
    }
    ```
4. `nginx -s reload`重新加载`nginx`, 测试访问开发者中心
5. 停止老的`paas`服务

## paasagent服务替换方式

以`paasagent`测试环境为例

0. 确认老版本`paasagent`服务的配置
1. 部署开源版本`paasagent`, 配置参考老版本
2. 到开发者中心-服务列表页面进行激活
3. 修改`nginx`配置: `PAAS_AGENT_TEST`修改为新机器的`ip/端口号`
4. `nginx -s reload`重新加载`nginx`
5. 重新部署对应环境的应用, 并验证访问
6. 停止老的`paasagent`服务

注意，如果使用社区版python解释器，需要`pip uninstall supervisor uwsgi`


## PaaS下的API网关(esb)服务替换方式

### 一. API网关部署替换

以 **INSTALL_PATH** 表示 paas 部署目标目录，例如`/data/`，则 $INSTALL_PATH/paas/esb/ 为API网关服务根目录

务必确保python版本是 `2.7.x`, 推荐`2.7.15`

API 网关组件同步步骤：(开源版本 替换 社区版)

##### 1. 组件代码同步

将社区版以下目录的代码，拷贝到开源版本对应目录：

```
components/
lib/gse/
```

##### 2. 配置文件同步及更新


将社区版以下配置文件，拷贝到开源版本对应文件:

```
configs/default.py
```

如果开源版本中，对应的DB配置或第三方服务地址发生变动，修改配置 configs/default.py 中的对应数据

##### 3. DB数据同步

如果社区版，开源版共用DB，由于数据已经初始化，跳过本步骤；

如果开源版本使用新DB，则按照开源版本要求，对DB进行数据初始化

##### 4. 重启服务

按照开源版本要求，重启API网关服务


### 二. 蓝鲸官方SaaS应用组件的维护

以标准运维`bk_sops`为例进行说明

##### 场景一：复制SaaS为新应用，访问SaaS应用组件时，请求转发到新的SaaS应用

假定新标准运维应用为 bk-sops-ce

```
1. 打开 $INSTALL_PATH/paas/esb/components/confapis/sops/sops.yaml，将每个组件配置中 dest_path 替换为新应用 bk-sops-ce 提供的API地址
   比如，将 dest_path 改为 /o/bk-sops-ce/apigw/get_template_list/{bk_biz_id}/
2. 更新配置
   参考：API网关服务常用指令/更新配置
3. 重启服务
   参考: API网关服务常用指令/重启API网关服务
```

##### 场景二：复制SaaS为新应用，并为新应用提供新的组件

假定新标准运维应用为 bk-sops-ce

```
1. 将 $INSTALL_PATH/paas/esb/components/bk/apisv2/sops 复制为 $INSTALL_PATH/paas/esb/components/bk/apisv2/bk_sops_ce，
   并将 bk_sops_ce/toolkit/configs.py 中的 SYSTEM_NAME 改为 BK_SOPS_CE（新应用ID的大写形式）
2. 将 $INSTALL_PATH/paas/esb/components/confapis/sops 复制为 $INSTALL_PATH/paas/esb/components/confapis/bk_sops_ce，
   将 bk_sops_ce/sops.yaml 文件名更新为 bk_sops_ce/bk_sops_ce.yaml，
   将 bk_sops_ce/bk_sops_ce.yaml 每个组件配置中 path 替换为新组件的路径，比如：/v2/bk_sops_ce/get_template_list/，
   将 bk_sops_ce/bk_sops_ce.yaml 每个组件配置中 comp_codename 替换为新组件的组件代号，比如： generic.v2.bk_sops_ce.sops_component，
   将 bk_sops_ce/bk_sops_ce.yaml 每个组件配置中 dest_path 替换为新应用 bk_sops_ce 提供的API地址，比如：/o/bk-sops-ce/apigw/get_template_list/{bk_biz_id}/ 
3. 在API网关管理端->系统管理中，添加一个新的系统，系统名称为：BK_SOPS_CE（同步骤1中的 SYSTEM_NAME）
4. 更新配置
   参考：API网关服务常用指令/更新配置
5. 重启服务
   参考: API网关服务常用指令/重启API网关服务
6. 新组件访问路径
   /api/c/compapi/ + {path}（bk_sops_ce/bk_sops_ce.yaml 中的配置项 path）
``` 

### 三. API网关服务常用指令

1、更新配置

```
# 进入到API网关的 virtualenv 环境
workon esb
# 进入项目根目录
cd $INSTALL_PATH/paas/esb/
# 执行指令，同步数据
python manage.py sync_data_at_deploy 
```

**注意**：更新配置时，只需要在 1 台API网关服务器操作即可

2、重启API网关服务

若使用 supervisor 托管，可采用以下方案重启服务，若使用其它方式托管，请按照对应方式重启服务

```
# 进入到安装 supervisor 工具的 virtualenv 环境，比如 paas
workon paas
# 使用 supervisor 指令重启API网关服务
supervisorctl -c ${path/to/supervisord.conf} restart esb 
```
