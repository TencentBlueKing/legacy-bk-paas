# Custom Conf Manage

For component coding or self-service apis, users need to synchronize the configuration information to the database.
It is inconvenient to migrate data through the management site. 
Therefore, the API Gateway provides a way to manage configuration through configuration files.


## Configuration file path

Manage custom system and api configuration in configuration files

```
[install_path]/open_paas/esb/components/generic/apis/conf.py
```

## Configuration file content

The configuration file `conf.py` is a regular python module that contains the following variables

- SYSTEM_DOC_CATEGORY: Document category, which specifies the document category that the system belongs to in [Docs](/esb/api_docs/system/){:target="_blank"}
- SYSTEMS: System information, corresponding to [System](/esb/manager/system/list/){:target="_blank"}
- CHANNELS: Component channel information, corresponding to [Channel](/esb/manager/channel/list/){:target="_blank"}
- BUFFET_COMPONENTS: Self-service api information, corresponding to [Self-service](/esb/manager/buffet_comp/list/){:target="_blank"}

#### SYSTEM_DOC_CATEGORY

Document category

```python
SYSTEM_DOC_CATEGORY = [
    {
        # Document category label
        'label': 'Test-Catg',
        # Display priority, range [1, 10000], small number in front
        'priority': 100,
        # System name
        'systems': ['TEST'],
    },
]
```

#### SYSTEMS

System information

```python
SYSTEMS = [
    {
        # System name
        'name': 'TEST',
        # System label
        'label': 'My Test',
        # System manager
        'interface_admin': 'admin',
        # Execution timeout
        'execute_timeout': 30,
        # Query timeout
        'query_timeout': 30,
        # remarks
        'remark': 'My Test',
    },
]

```

#### CHANNELS

Component channel information

```python
CHANNELS = [
    # Channel path
    ('/test/healthz/', {
        # Component code
        'comp_codename': 'generic.test.healthz',
    }),
]
```

#### BUFFET_COMPONENTS

Self-service api information

```python
BUFFET_COMPONENTS = [
    {
        # Register config
        # api name
        'name': 'get template list',
        # System name
        'system_name': 'TEST',
        # Request method
        'registed_http_method': 'GET',
        # API path
        'registed_path': '/test/heartbeat/',
        # API type, 2 is Query API, 1 is Execute API
        'type': 2,  
        # timeout
        'timeout_time': 10,

        # Before request
        # Additional header
        'extra_headers': {
            'Token': '1234567890',
        },

        # Request target
        # Target url
        'dest_url': 'http://domain.test.com/test/heartbeat/',
        # Request method
        'dest_http_method': 'POST',
        # Parameters encode, optional value is json, form
        'favor_post_ctype': 'json', 
    },
]
```

## Synchronize configuration to database

```shell
workon esb
# By default, when some of the configurations are inconsistent with the data in the database,
# the difference information is displayed.
# --force, when the configuration is inconsistent with the data in the database, 
# forcibly update the configuration to the database.
python manage.py sync_system_and_channel_data [--force]
```
