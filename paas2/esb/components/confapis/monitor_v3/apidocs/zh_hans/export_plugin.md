### 功能描述
导出插件，返回一个url

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段           | 类型   | 必选 | 描述 |
| -------------- | ------ | ---- |--|
| plugin_id  | string | 是   | 插件ID |

- plugin_id为路径参数

#### 请求示例
```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "plugin_id": "script_test"
}
```

### 返回结果

| 字段       | 类型   | 描述         |
| ---------- | ------ | ------------ |
| result     | bool   | 请求是否成功 |
| code       | int    | 返回的状态码 |
| message    | string | 描述信息     |
| data       | dict   | 数据         |
| request_id | string | 请求ID       |

#### data字段说明

| 字段                | 类型     | 描述 |
| ------------------- |--------|--|
| download_url | string | 插件下载的url |

#### 结果示例

```json
{
    "message":"OK",
    "code":200,
    "data":{
    	"download_url": "download_url"
    },
    "result":true,
    "request_id":"408233306947415bb1772a86b9536867"
}
```
