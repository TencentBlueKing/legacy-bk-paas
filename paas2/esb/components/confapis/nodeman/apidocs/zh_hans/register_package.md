### 功能描述

注册插件包信息

### 请求参数

{{ common_args_desc }}


#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| pkg_name | string | 是 | 包名 |
| version | string | 是 | 版本号 |
| module | string | 是 | 所属服务 |
| project | string | 是 | 进程名 |
| pkg_size | string | 是 | 包容量 |
| pkg_path | string | 是 | 包路径 |
| pkg_mtime | string | 是 | 更新时间 |
| pkg_ctime | string | 是 | 创建时间 |
| location | string | 是 | 下载地址 |

### 请求参数示例

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

### 返回结果示例

```json
{
    "result": true,
    "code": 0,
    "message":"success",
    "data": []
}
```

### 返回结果参数说明

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
|result| bool | 返回结果，true为成功，false为失败 |
|code|int|返回码，0表示成功，其他值表示失败|
|message|string|错误信息
|data| array| 结果 |