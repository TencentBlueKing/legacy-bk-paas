### 功能描述

查询已生效指定版本的应用实例列表

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段             |  类型     | 必选   |  描述    |
|------------------|-----------|--------|----------|
| biz_id           |  string   | 是     | 业务ID   |
| app_id           |  string   | 是     | 应用ID   |
| cfg_id           |  string   | 是     | 配置ID   |
| release_id       |  string   | 是     | 版本ID   |
| page             |  object   | 是     | 分页设置 |
| timeout_sec      |  integer  | 否     | 生效超时时间（秒），即从配置版本发布时间点开始计算, 判断实例节点生效结果是否超时, 默认: 600, 即10分钟 |

#### page

| 字段         |  类型  | 必选   |  描述      |
|--------------|--------|--------|------------|
| return_total |  bool  | 否     | 是否返回总记录条数, 默认不返回 |
| start        |  int   | 是     | 记录开始位置 |
| limit        |  int   | 是     | 每页限制条数,最大500 |

### 请求参数示例

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "biz_id": "xxx",
    "app_id": "A-0b67a798-e9c1-11e9-8c23-525400f99278",
    "cfg_id": "F-0b67a798-e9c1-11e9-8c23-525400f99278",
    "release_id": "R-0b67a798-e9c1-11e9-8c23-525400f99278",
    "page": {
        "start": 0,
        "limit": 500
    }
}
```

### 返回结果示例

```json
{
    "result": true,
    "code": 0,
    "message": "OK",
    "data": {
        "total_count": 1,
        "info": [
            {
                "biz_id": "XXX",
                "app_id": "A-0b67a798-e9c1-11e9-8c23-525400f99278",
                "cloud_id": "0",
                "ip": "127.0.0.1",
                "path": "/data/configs",
                "labels":"{\"Labels\":{\"version\":\"1.0\"}}",
                "cfg_id": "F-0867a798-e9c1-11e9-8c23-525400f99278",
                "release_id": "R-0967g678-e9c1-11e9-8c23-525400f99278",
                "effect_time": "2019-08-29 17:18:22",
                "effect_code": 1,
                "effect_msg": "SUCCESS",
                "reload_time": "2019-08-29 17:18:25",
                "reload_code": 1,
                "reload_msg": "SUCCESS",
                "created_at": "2019-07-29 11:57:20",
                "updated_at": "2019-07-29 11:57:20"
            }
        ]
    }
}
```

### 返回结果参数

#### data

| 字段        | 类型      | 描述      |
|-------------|-----------|-----------|
| total_count | int       | 当前规则能匹配到的总记录条数 |
| info        | array     | 查询返回的数据 |

#### data.info[n]

| 字段           | 类型      | 描述    |
|----------------|-----------|---------|
| biz_id         |  string   | 业务ID  |
| app_id         |  string   | 应用ID  |
| cloud_id       |  string   | 云区域/网络ID |
| ip             |  string   | 实例IP |
| path           |  string   | 实例配置缓存路径 |
| labels         |  string   | 实例标签集合JSON字符串 |
| cfg_id         |  string   | 配置ID |
| release_id     |  string   | 配置版本ID |
| effect_time    |  string   | 实例生效时间, '2019-08-29 17:18:22' |
| effect_code    |  string   | 实例生效结果 (0:生效中  1:成功  -1:失败  -2:超时  -3:离线) |
| effect_msg     |  string   | 实例生效结果信息 (生效中:PENDING  成功: "SUCCESS"  生效超时: "TIMEOUT"  离线: "OFFLINE") |
| reload_time    |  string   | 实例reload时间, '2019-08-29 17:18:22' |
| reload_code    |  string   | 实例reload结果 (0:未执行  1:reload成功  2:rollback reload成功  -1:失败  -2:超时  -3:离线) |
| reload_msg     |  string   | 实例reload结果信息 (未执行:PENDING  reload成功: "SUCCESS"  rollback reload成功: "ROLLBACK SUCCESS"  执行超时: "TIMEOUT"  离线: "OFFLINE") |
| created_at     |  string   | 创建时间 |
| updated_at     |  string   | 更新时间 |
