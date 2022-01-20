### 功能描述

获取模板版本列表

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段        |  类型     | 必选   |  描述    |
|-------------|-----------|--------|----------|
| biz_id      |  string   | 是     | 业务ID   |
| template_id |  string   | 是     | 模板ID   |
| page        |  object   | 是     | 分页设置 |

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
    "template_id": "T-0b67a798-e9c1-11e9-8c23-525400f99278",
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
                "version_id": "TV-0b67a798-e9c1-11e9-8c23-525400f99278",
                "biz_id": "XXX",
                "template_id": "T-0b67a798-e9c1-11e9-8c23-525400f99278",
                "version_tag": "v1",
                "content_id": "4c2d4c4231d1ff93975879226fe92250616082cbaed6a4a888d2adc490ba9b44",
                "content_size": 1024,
                "memo": "template version 1",
                "creator": "melo",
                "last_modify_by": "melo",
                "state": 0,
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
| version_id     |  string   | 版本ID  |
| biz_id         |  string   | 业务ID  |
| template_id    |  string   | 模板ID  |
| version_tag    |  string   | 版本TAG |
| content_id     |  string   | 内容ID(调用方可依据此ID下载内容)  |
| content_size   |  integer  | 内容大小|
| memo           |  string   | 备注 |
| state          |  integer  | 状态 默认0: 正常 |
| creator        |  string   | 创建者 |
| last_modify_by |  string   | 修改者 |
| created_at     |  string   | 创建时间 |
| updated_at     |  string   | 更新时间 |
