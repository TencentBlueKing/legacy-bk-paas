### Functional description

register process package information

### Request Parameters

{{ common_args_desc }}


#### Interface Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| pkg_name | string | Yes | 包名 |
| version | string | Yes | 版本号 |
| module | string | Yes | 所属服务 |
| project | string | Yes | 进程名 |
| pkg_size | string | Yes | 包容量 |
| pkg_path | string | Yes | 包路径 |
| pkg_mtime | string | Yes | 更新时间 |
| pkg_ctime | string | Yes | 创建时间 |
| location | string | Yes| 下载地址 |

### Request Parameters Example

``` json
{
    "pkg_name": "xxxx-10.0.1.tgz",
    "version": "10.0.1",
    "module": "gse_plugin",
    "project": "xxxx",
    "pkg_size": "1268918",
    "pkg_path": '/data/xxx/xxx/download',
    "md5": '7e3295e53f850de07cf496a5397a38e1',
    "pkg_mtime" '2018-08-22 12:12:10',
    "pkg_ctime" '2018-08-22 12:12:10',
    "location" 'http://10.0.0.1/download' 
}
```

### Return Result Example

```json
{
    "result": true,
    "code": 0,
    "message":"success",
    "data": []
}
```

### Return Result Parameters Description

| Field      | Type      | Description      |
|-----------|-----------|-----------|
|result| bool | return result, true for success, false for failed |
|code|int| return code. 0 indicates success, other values indicate failure  |
|message|string| error message |
|data| array|  result |