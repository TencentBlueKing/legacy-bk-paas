# Self-service

Self-service, developers do not need to write code, configure in [Self-service](/esb/manager/buffet_comp/list/){:target="_blank"} to connect interface to the API Gateway. 
Take the following interface as an example to describe how to complete self-service access.

`Note: It applies to the scenarios which do not require custom processing logic and support HTTP protocol`

- System name: Host configuration platform (HCP)
- Interface name: get_host_list
- Interface url: http://hcp.domain.com/hcp/get_host_list/

## Add System

[Add a new system](/esb/manager/system/add/){:target="_blank"}, fill in the following system information:

- System name: HCP
- System label: Host configuration platform


## Add API configuration

Open the [Self-service](/esb/manager/buffet_comp/apply/){:target="_blank"} page and fill in interface configuration information which consists of three parts: **Register Configuration**, **Before Sending Out Request**, **Request Destination**.

#### Register Configuration

Register configuration is applied to configure the API access information. Fill in register configuration with the following:

- API name: get_host_list
- System: Choose HCP system 
- Request method: GET
- API path: /hcp/get_host_list/

Add a unified prefix to the "API path" to get the interface url of this API: 
```
http://xxx.domain.com/api/c/self-service-api/hcp/get_host_list/
```

#### Before Sending Out Request
"Before Sending Out Request" is used for the request header information for configuring access to system interfaces.

#### Request Target
Request target is used to configure the information of the request system interface, such as system interface url, request method, parameter setting, etc. Fill in request target configuration with the following:

- Target url: http://hcp.domain.com/hcp/get_host_list/
- Request method: POST
- Parameters encode: json `It needs to be specified only when the request method is POST`

## API Access Information
After the above configuration, you can access the API. Access API also requires application and user authentication. Access url of the API is: 
```
http://xxx.domain.com/api/c/self-service-api/hcp/get_host_list/
```
