# 自定义配置管理

用户开发组件或自助接入API时，都需要将配置信息，同步到数据库中；
通过管理端管理配置的方式，不方便对数据进行迁移，因此，API网关提供一种通过配置文件管理配置的方式。

## 配置文件地址

在配置文件中，管理自定义的系统及API配置

```
[install_path]/open_paas/esb/components/generic/apis/conf.py
```

## 配置文件内容

配置文件 `conf.py` 是一个普通的 python 模块，其中包含以下变量

- SYSTEM_DOC_CATEGORY: 文档分类，指定系统在[API文档](/esb/api_docs/system/){:target="_blank"}中所属的文档分类
- SYSTEMS: 系统信息，对应管理端的[系统管理](/esb/manager/system/list/){:target="_blank"}
- CHANNELS: 组件通道信息，对应管理端的[通道管理](/esb/manager/channel/list/){:target="_blank"}
- BUFFET_COMPONENTS: 自助接入API信息，对应管理端的[自助接入](/esb/manager/buffet_comp/list/){:target="_blank"}

#### SYSTEM_DOC_CATEGORY

文档分类
```python
SYSTEM_DOC_CATEGORY = [
    {
        # 文档分类标签
        'label': 'Test-Catg',
        # 展示优先级，范围 [1, 10000]，数字小的展示在前面
        'priority': 100,
        # 文档分类下的系统名
        'systems': ['TEST'],
    },
]
```

#### SYSTEMS

系统

```python
SYSTEMS = [
    {
        # 系统名称
        'name': 'TEST',
        # 系统标签
        'label': 'My Test',
        # 系统接口负责人
        'interface_admin': 'admin',
        # 执行类超时时长
        'execute_timeout': 30,
        # 查询类超时时长
        'query_timeout': 30,
        # 备注
        'remark': 'My Test',
    },
]

```

#### CHANNELS

组件通道

```python
CHANNELS = [
    # 通道名称，所属系统，API类型通过组件模块自动获取

    # 通道路径
    ('/test/healthz/', {
        # 对应组件代号
        'comp_codename': 'generic.test.healthz',
    }),
]

```

#### BUFFET_COMPONENTS

自助接入API

```python
BUFFET_COMPONENTS = [
    {
        # 注册配置
        # API名称
        'name': 'get template list',
        # 所属系统名称
        'system_name': 'TEST',
        # 注册到的请求类型
        'registed_http_method': 'GET',
        # 注册到的API路径
        'registed_path': '/test/heartbeat/',
        # API类型，2 是查询API，1 是执行API
        'type': 2,  
        # 超时时长
        'timeout_time': 10,

        # 请求发出前
        # 请求头信息
        'extra_headers': {
            'Token': '1234567890',
        },

        # 请求目的地
        # 目标接口地址
        'dest_url': 'http://domain.test.com/test/heartbeat/',
        # 目标接口请求类型
        'dest_http_method': 'POST',
        # 编码POST参数方式，可选值：json, form
        'favor_post_ctype': 'json', 
    },
]
```

## 同步配置到数据库

```shell
workon esb
# 默认情况，当部分配置与数据库中数据不一致时，显示差别信息；
# --force，配置与数据库中数据不一致时，强制将配置更新到数据库
python manage.py sync_system_and_channel_data [--force]
```
