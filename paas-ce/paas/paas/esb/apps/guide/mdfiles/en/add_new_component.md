# Component coding / [Appendix](#appendix)

Component coding is to write component code, add component channel configuration to provide API service.
Following interface is taken for an example to describe in detail how to develop a new component.

`Note: It applies to the components that require custom processing logic`

- System name: Host configuration platform (HCP)
- Interface name: get_host_list
- Interface url: http://hcp.domain.com/hcp/get_host_list/

## Add System

[Add a new system](/esb/manager/system/add/){:target="_blank"}, fill in the following system information:

- System name: HCP
- System label: Host configuration platform

## Create a System and Component File
Create directories and files (Template [Download](/static/esb/guide/en/hcp.tar.gz)) under components/generic/apis of the project according to the structure below: 

```
# If apis does not exist, first create the folder apis and create the file __init__.py under it
components/generic/apis/
|-- __init__.py
|-- hcp
|   |-- __init__.py
|   |-- toolkit
|   |   |-- __init__.py
|   |   |-- configs.py
|   |   |-- tools.py
|   |-- get_host_list.py

```
- hcp is a system package and the package name is the system name in lowercase
- hcp/toolkit is a system toolkit used to store system configuration and common methods
- hcp/toolkit/configs.py is a system configuration module used to configure system name, system domain name, etc. 
- hcp/toolkit/tools.py is the system common methods module
- hcp/get_host_list.py is the "get host list" component module


## Add System Information to Component Configuration 
Add system configuration to "components/generic/apis/hcp/toolkit/configs.py", and a sample is shown below: 

```python
# -*- coding: utf-8 -*-
from esb.utils import SmartHost


# The system name in lowercase shall be the same as the system package name
SYSTEM_NAME = 'HCP'

host = SmartHost(
    # The domain name of system production environment shall be filled in 
    host_prod='hcp.domain.com',
)
```

## Development Component Module
Add component code to "components/generic/apis/hcp/get_host_list.py", and a sample is shown below: 
```python
# -*- coding: utf-8 -*-
import json

from django import forms

from common.forms import BaseComponentForm, TypeCheckField
from components.component import Component
from .toolkit import configs


class GetHostList(Component):
    """
    apiLabel get host list
    apiMethod GET

    ### Functional Description

    Get host list

    ### Request Parameters

    {{ common_args_desc }}

    #### Interface Parameters

    | Field  |  Type | Required   |  Description     |
    |-----------|------------|--------|------------|
    | app_id  |  int    | Yes  | Business ID  |
    | ip_list |  array  | No  | Host IP address, including ip and bk_cloud_id, in which, bk_cloud_id represents cloud area ID  |

    ### Request Parameters Example

    ```python
    {
        "bk_app_code": "esb_test",
        "bk_app_secret": "xxx",
        "bk_token": "xxx-xxx-xxx-xxx-xxx",
        "bk_biz_id": 1,
        "ip_list": [
            {
                "ip": "10.0.0.1",
                "bk_cloud_id": 0
            },
            {
                "ip": "10.0.0.2"
                "bk_cloud_id": 0
            }
        ]
    }
    ```
    ### Return Result Example
    ```python
    {
        "result": true,
        "code": 0,
        "message": "",
        "data": [
            {
                "inner_ip": "10.0.0.1",
                "bk_cloud_id": 0,
                "host_name": "db-1",
                "maintainer": "admin"
            },
            {
                "inner_ip": "10.0.0.2",
                "bk_cloud_id": 2,
                "host_name": "db-2",
                "maintainer": "admin"
            }
        ]
    }
    ```
    """

    # Name of the system to which the component belongs
    sys_name = configs.SYSTEM_NAME

    # Form Processing Parameters Validation
    class Form(BaseComponentForm):
        bk_biz_id = forms.CharField(label="Business ID", required=True)
        ip_list = TypeCheckField(label=u'Host IP address', promise_type=list, required=False)

        # The data returned in clean method is available through the component's form_data property
        def clean(self):
            return self.get_cleaned_data_when_exist(keys=['bk_biz_id', 'ip_list'])

    # Component Processing Access
    def handle(self):
        # Get the data processed in Form clean
        data = self.form_data

        # Set Current Operator
        data["operator"] = self.current_user.username

        # Request System Interface
        response = self.outgoing.http_client.post(
            host=configs.host,
            path="/hcp/get_host_list/",
            data=json.dumps(data),
        )

        #  Analyze the Results
        code = response["code"]
        if code == 0:
            result = {
                "result": True,
                "data": response["data"],
            }
        else:
            result = {
                "result": False,
                "message": result["message"]
            }

        # Set the component return result, and payload is the actual return result of component 
        self.response.payload = result
```

Note:


- The component class name is a component module name with the underscores (_) removed and the name turned to a hump form. For example, get_host_list component class name should be GetHostList
- The component begins with component document. Through the following instructions, the document, [Component Documents](/esb/api_docs/system/){:target="_blank"}, used by the component can be updated 


```shell
workon esb
python manage.py sync_api_docs
```

## Register Component Channel
After component module is developed, [Register component channel](/esb/manager/channel/add/){:target="_blank"}, and the channel information that shall be filled in is as follows: 

- Channel name: get_host_list
- Channel path: /hcp/get_host_list/
- Component system: Choose HCP system
- Corresponding component code: generic.hcp.get_host_list


## Restart Service
After the component is added, restart the service by following steps: 
```shell
# INSTALL_PATH represents project installation base path

# Restart Instructions
workon open_paas
supervisorctl -c $INSTALL_PATH/etc/supervisor-open_paas.conf restart esb
```

Access url of the new component is:
```python
http://xxx.domain.com/api/c/compapi/hcp/get_host_list/
```

# <span id="appendix">Appendix</span>

When developing a new component, you can get useful data in the component module based on the component's base class Component or common module to facilitate development.

## Available Data in Component Base Class 

- request: Request data, refer to descriptions below for common properties 
- form_data: Data in the component module after Form clean is customized 
- current_user: Current user, get the username of current user according to its property username
- outgoing.http_client: Request interface Client, can be used to request other interface, refer to descriptions below for specific parameters

### Common Properties of request in Component 

- request_id: Unique ID of one request, it is a uuid character string
- app_code: APP ID of current request
- kwargs: Current request parameters, QueryString data in GET request or Request Body data in POST request has been converted to dict


### Supported Method of outgoing.http_client in Component

```python
# response_type: json, whether the interface data is required to be converted to JSON dict, others are not converted 
# max_retries: 0, number of times of retry when interface request is abnormal
# request_encoding: Request interface parameters are transcoded to this type
# response_encoding: Interface response data is transcoded to this type
outgoing.http_client.request(
    method, host, path, params=None, data=None, headers={},
    response_type="json", max_retries=0, response_encoding=None,
    request_encoding=None, verify=False, cert=None,
    timeout=None
)

outgoing.http_client.get # represents request ("GET", *args, **kwargs)
outgoing.http_client.post # represents request ("POST", *args, **kwargs)
```

## Custom Field in common.forms Module

- ListField: List Field, it can convert a character string separated by comma, semicolon, line feed and space to a list. For example, "123;456;789" can be converted to ["123", "456", "789"]
- TypeCheckField: Type Check Field, check data type by setting promise_type parameter, if the parameter type does not match, throw an exception
- DefaultBooleanField: Default Boolean Field, Boolean data can set default value by default parameter 


## Method of Invoking Other Components in a Component

- invoke_other method, current_user will be transferred to invoked component
```python
result = self.invoke_other("generic.auth.get_user", kwargs={"username": "xxx"})
```

- Direct Invoking Method
```python
from esb.components.generic.apis.auth.get_user import GetUser
result = GetUser().invoke(kwargs={"username": "xxx"})
```
