### 功能描述

附带内容关联, 创建混合提交

提交同一个App下多个Config的改动, 每个Config可以有多份内容，每份内容附带匹配索引

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段             |  类型     | 必选   |  描述      |
|------------------|-----------|--------|------------|
| biz_id           |  string   | 是     | 业务ID     |
| app_id           |  string   | 是     | 应用ID     |
| memo             |  string   | 否     | 备注 (max_length: 256) |
| metadatas        |  array    | 是     | 提交数据, 多个配置的改动数据 |
| validate_content |  bool     | 否     | 是否验证提交的Content，默认不验证，验证需要额外开销，不验证的情况下调用方需要保证指定Content确认已经提交成功 |

#### metadatas[n]

| 字段        |  类型     | 必选   |  描述      |
|-------------|-----------|--------|------------|
| cfg_id      |  string   | 是     | 配置ID     |
| contents    |  array    | 是     | 单个配置的改动内容, 可以为多份内容，并附带每份内容匹配策略 |

#### metadatas[n].contents[m]

| 字段         |  类型     | 必选   |  描述      |
|--------------|-----------|--------|------------|
| content_id   |  string   | 是     | 内容ID，SHA256值（与上传内容时计算的资源ID一致）(min_length: 64, max_length: 64) |
| content_size |  integer  | 否     | 内容大小 |
| labels_or    |  array    | 否     | 内容索引逻辑或KV列表  |
| labels_and   |  array    | 否     | 内容索引逻辑与KV列表  |

#### metadatas[n].contents[m].labels_or[n]

| 字段   |  类型   | 必选   |  描述      |
|--------|---------|--------|------------|
| labels |  map    | 是     | 任意一KV满足则命中匹配，Key为目标节点标签名称；Value为目标匹配的值，格式为"OP|Value", 例如"version:eq|1.0"表示匹配版本为1.0。OP支持的操作符：eq/ne/gt/lt/ge/le(遵循Bash Shell语义) |

#### metadatas[n].contents[m].labels_and[n]

| 字段   |  类型   | 必选   |  描述      |
|--------|---------|--------|------------|
| labels |  map    | 是     | 全部KV满足才命中匹配， Key为目标节点标签名称；Value为目标匹配的值，格式为"OP|Value", 例如"version:eq|1.0"表示匹配版本为1.0。OP支持的操作符：eq/ne/gt/lt/ge/le(遵循Bash Shell语义) |

`注意`:

    - 整体匹配规则为从labels_or和labels_and进行匹配，任意一列表中的Map集合匹配则策略命中;
    - labels_or/labels_and两个列表都为空意味着无匹配规则描述，在该场景下不会匹配到任何节点实例，即无法对外暴露生效;

```json

	KV labels format: "KEY": "OP|VALUE"

	OP(Bash Shell Operators):
			1.=: empty or eq
			2.!=: ne
			3.>: gt
			4.<: lt
			5.>=: ge
			6.<=: le
```

### 请求参数示例

同时提交App A-0b67a798-e9c1-11e9-8c23-525400f99278下3个配置的改动，

配置：F-626889ba-e9c1-11e9-8c23-525400f99278有3份不同的内容，分别发送给不同主机实例,

    - 1AB7D609B9391C81B459AFC5A91C22E7E1DD92A9A956D7263DF3001F87CAE6D1: 发给cloud_id为0且IP为127.0.0.1且path为"/data-1/"和cloud_id为0且IP为127.0.0.2且path为"/data-1/"的2个实例
    - 2AB7D609B9391C81B459AFC5A91C22E7E1DD92A9A956D7263DF3001F87CAE6D2: 发给cloud_id为0且IP为127.0.0.1且path为"/data-2/"的实例

配置：F-216466t6-e9c1-11e9-8c23-525400f99278有3份不同的内容，分别发送给不同的主机实例,

    - 3AB7D609B9391C81B459AFC5A91C22E7E1DD92A9A956D7263DF3001F87CAE6D3: 发给cloud_id为0且IP为127.0.0.1且path为"/data-1/"的实例
    - 4AB7D609B9391C81B459AFC5A91C22E7E1DD92A9A956D7263DF3001F87CAE6D4: 发给cloud_id为0且IP为127.0.0.3,127.0.0.4,127.0.0.5,127.0.0.6的多个实例

配置：F-N161106b-e9c1-11e9-8c23-525400f99278只有1份内容，发送给不同的主机实例,

    - 5AB7D609B9391C81B459AFC5A91C22E7E1DD92A9A956D7263DF3001F87CAE6D5: 发给cloud_id为0且IP为127.0.0.1,127.0.0.2,127.0.0.3,127.0.0.4,127.0.0.5,127.0.0.6的多个实例

综上，可以同时提交同App下的多个配置改动，每个配置可以经模板渲染出多份内容，或非模板的单份内容，每份内容可以通过策略控制定向匹配给不同的实例节点

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "biz_id": "xxx",
    "app_id": "A-0b67a798-e9c1-11e9-8c23-525400f99278",
    "memo": "my first commit",
    "metadatas": [
        {
            "cfg_id": "F-626889ba-e9c1-11e9-8c23-525400f99278",
            "contents":[
                {
                    "content_id":"1AB7D609B9391C81B459AFC5A91C22E7E1DD92A9A956D7263DF3001F87CAE6D1",
                    "content_size":1024,
                    "labels_and":[
                        {
                            "labels": {
                                "cloud_id":"eq|0",
                                "ip":"eq|127.0.0.1",
                                "path": "/data-1/"
                            }
                        },
                        {
                            "labels": {
                                "cloud_id":"eq|0",
                                "ip":"eq|127.0.0.2",
                                "path": "/data-1/"
                            }
                        }
                    ]
                },
                {
                    "content_id":"2AB7D609B9391C81B459AFC5A91C22E7E1DD92A9A956D7263DF3001F87CAE6D2",
                    "content_size":1024,
                    "labels_and":[
                        {
                            "labels": {
                                "cloud_id":"eq|0",
                                "ip":"eq|127.0.0.1",
                                "path": "/data-2/"
                            }
                        }
                    ]
                }
            ]
        },
        {
            "cfg_id": "F-216466t6-e9c1-11e9-8c23-525400f99278",
            "contents":[
                {
                    "content_id":"3AB7D609B9391C81B459AFC5A91C22E7E1DD92A9A956D7263DF3001F87CAE6D3",
                    "content_size":1024,
                    "labels_and":[
                        {
                            "labels": {
                                "cloud_id":"eq|0",
                                "ip":"eq|127.0.0.1",
                                "path": "/data-1/"
                            }
                        }
                    ]
                },
                {
                    "content_id":"4AB7D609B9391C81B459AFC5A91C22E7E1DD92A9A956D7263DF3001F87CAE6D4",
                    "content_size":1024,
                    "labels_and":[
                        {
                            "labels": {
                                "cloud_id":"eq|0",
                                "ip":"eq|127.0.0.3,127.0.0.4,127.0.0.5,127.0.0.6"
                            }
                        }
                    ]
                }
            ]
        },
        {
            "cfg_id": "F-N161106b-e9c1-11e9-8c23-525400f99278",
            "contents":[
                {
                    "content_id":"5AB7D609B9391C81B459AFC5A91C22E7E1DD92A9A956D7263DF3001F87CAE6D5",
                    "content_size":1024,
                    "labels_and":[
                        {
                            "labels": {
                                "cloud_id":"eq|0",
                                "ip":"eq|127.0.0.1,127.0.0.2,127.0.0.3,127.0.0.4,127.0.0.5,127.0.0.6"
                            }
                        }
                    ]
                }
            ]
        }
    ]
}
```

### 返回结果示例

```json
{
    "result": true,
    "code": 0,
    "message": "OK",
    "data": {
        "multi_commit_id": "MM-cd34e60a-ec95-11e9-b110-525400f99278"
    }
}
```

### 返回结果参数

#### data

| 字段             | 类型   | 描述     |
|------------------|--------|----------|
| multi_commit_id  | string | 新混合提交ID |
