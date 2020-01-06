### 功能描述

导入公共流程

### 请求参数

{{ common_args_desc }}

#### 接口参数

|   字段   |    参数类型  |  必须  |     参数说明     |
| ------------ | ------------ | ------ | ---------------- |
|   template_data    |   string     |   是   |  公共流程数据，即从标准运维 - 公共流程 - 导出功能下载的文件的内容 |
|   override        | bool     | 否         | 是否覆盖 ID 相同的流程           |           |

### 请求参数示例

```
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "template_data": "xxx",
    "override": true,
}
```

### 返回结果示例

```
{
    "message": "Successfully imported 2 common flows",
    "data": {
        "count": 2
    },
    "result": true
}
```

### 返回结果参数说明

|      名称     |     类型   |               说明             |
| ------------  | ---------- | ------------------------------ |
|  result       | bool       | true/false 成功与否            |
|  message      | string     | result=false 时错误信息        |
|  data         | dict        | 返回数据                    |

#### data

|   名称   |  类型  |           说明             |
| ------------ | ---------- | ------------------------------ |
|  count      |    int    |      导入的流程数    |
