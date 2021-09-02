### 功能描述

安装类任务

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段     | 类型       | 必选 |描述                  |
|----------|------------|----------|-----------------------------|
| job_type | string | 是 | 任务类型 |
| hosts | list | 是 | 主机信息 |
| retention | Number | 是 | 密码保留天数 |
| replace_host_id | Number | 否 | 要替换的ProxyID，替换proxy时使用 |

#### job_type

| 字段     |描述            |
|----------|----------------|
| INSTALL_AGENT | 安装agent |
| REINSTALL_AGENT |重装agent |
| INSTALL_PROXY | 安装proxy |
| REINSTALL_PROXY | 重装proxy |

#### hosts

| 字段     | 类型       | 必选 |描述                  |
|----------|------------|----------|-----------------------------|
| bk_cloud_id | Number | 否 | 云区域ID |
| ap_id | Number | 是 | 接入点ID |
| bk_host_id | Number | 是 | 主机ID, 创建时可选, 更改时必选 |
| os_type | String | 否 | 操作系统类型 Windows,Linux,AIX |
| bk_biz_id | Number | 否 | 业务ID |
| inner_ip | String | 否 | 内网IP |
| outer_ip | String | 是 | 外网IP |
| login_ip | String | 是 | 登录IP |
| data_ip | String | 是 | 数据IP |
| account | String | 否 | 账户名 |
| port | Number | 否 | 端口 |
| auth_type | String | 否 | 认证类型 |
| password | String | 是 | 密码 |
| key | String | 是 | 密钥 |

### 请求参数示例
```
{
    "job_type": "INSTALL_AGENT",
    "hosts": [
        {
            "bk_cloud_id": 1,
            "ap_id": 1,
            "bk_biz_id": 2,
            "os_type": "Linux",
            "inner_ip": "127.0.0.1",
            "outer_ip": "127.0.0.2",
            "login_ip": "127.0.0.3",
            "data_ip": "127.0.0.4",
            "account": "root",
            "port": 22,
            "auth_type": "PASSWORD",
            "password": "password",
            "key": "key"
        }
    ],
    "retention": 1,
    "replace_host_id": 1
}
```

### 返回结果示例
```
{
	"result": true,
	"code": 0,
    "message": "success",
    "data": {
		"job_id": 35,
		"ip_filter": []
	}
}
```