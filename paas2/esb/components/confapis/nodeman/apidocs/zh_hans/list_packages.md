### 功能描述

查询进程包列表

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段     | 类型       | 必选 |描述                  |
|----------|------------|----------|-----------------------------|
| name | list | 是 | 插件名称 |
| os | list | 是 | 系统类型 LINUX\WINDOWS\AIX|

### 请求参数示例
```
{
    "name": "basereport",
    "os": "LINUX"
}
```

### 返回结果示例
```
{
    "message": "",
    "code": 0,
    "data": [
        {
            "cpu_arch": "x86_64",
            "pkg_mtime": "2020-12-20 12:13:02.593875+00:00",
            "module": "gse_plugin",
            "project": "basereport",
            "pkg_size": 5142399,
            "version": "10.8.40",
            "pkg_name": "basereport-10.8.40.tgz",
            "location": "http://127.0.0.1/download/linux/x86_64",
            "pkg_ctime": "2020-12-20 12:13:02.593875+00:00",
            "pkg_path": "/data/bkee/public/bknodeman/download/linux/x86_64",
            "os": "linux",
            "id": 27,
            "md5": "c56c9eedaa81c36a5c5177eb14d9449e"
        }
    ],
    "result": true,
    "request_id": "185ab35db70441e39488156c0c17f938"
}
```
