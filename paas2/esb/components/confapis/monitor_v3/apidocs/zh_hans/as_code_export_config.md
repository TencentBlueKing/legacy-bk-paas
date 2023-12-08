### 功能描述

导出YAML配置

#### 接口参数

| 字段      | 类型      | 必选 | 描述                            |
|---------|---------|----|-------------------------------|
| bk_biz_id | integer | 是  | 业务ID                          |
| dashboard_for_external | boolean | 否  | 是否以外部导出模式导出grafana仪表盘，默认false |

#### 示例数据

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "bk_biz_id": 2,
    "dashboard_for_external": true,
}
```

### 响应参数

| 字段    | 类型        | 描述         |
| ------- |-----------| ------------ |
| result  | bool      | 请求是否成功 |
| message | string    | 描述信息     |
| data    | dict/null | 返回数据     |

#### 示例数据

```json
{
    "message": "",
    "data": {
      "rule": {
        "xxx.yaml": "xxxx"
      },
      "notice": {
        "xxx.yaml": "xxxx",
        "yyy/zzz.yaml": "xxxx"
      },
      "grafana": {
        "xxx.yaml": "xxxx"
      },
      "action": {
        "xxx.yaml": "xxxx"
      }
    },
    "result": true
}
```
