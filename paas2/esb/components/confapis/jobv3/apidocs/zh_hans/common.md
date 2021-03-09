## 通用字段和约定

#### global_var

| 字段         |  类型      | 必选   |  描述      |
|-------------|------------|--------|------------|
| id          |  long     | 否     | 全局变量 id，唯一标识。如果 id 为空，那么使用 name 作为唯一标识 |
| name        |  string   | 否     | 全局变量名 |
| description |  string   | 否     | 全局变量描述 |
| type        |  int      | 否     | 全局变量类型 |
| required    |  int      | 否     | 模版/执行方案中该变量是否必填 |
| value       |  string   | 否     | 字符、密码、数组类型的全局变量的值 |
| server      |  object   | 否     | 主机类型全局变量的值 |

#### server
| 字段                   |  类型 | 必选   |  描述      |
|-----------------------|-------|--------|------------|
| ip_list               | array | 否     | 静态 IP 列表，定义见ip |
| dynamic_group_list | array | 否     | 动态分组列表，定义见dynamic_group |
| topo_node_list        | array | 否     | 动态 topo 节点列表，定义见topo_node |

#### ip
| 字段         |  类型   | 必选    |  描述   |
|-------------|---------|--------|---------|
| bk_cloud_id |  int    | 是     | 云区域ID |
| ip          |  string | 是     | IP地址 |

#### dynamic_group

| 字段 | 类型   | 必选 | 描述           |
| ---- | ------ | ---- | -------------- |
| id   | string | 是   | CMDB动态分组ID |

#### topo_node

| 字段              |  类型  | 必选   |  描述      |
|------------------|--------|--------|------------|
| id               | long   | 是     | 动态topo节点ID，对应CMDB API 中的 bk_inst_id |
| node_type        | string | 是     | 动态topo节点类型，对应CMDB API 中的 bk_obj_id,比如"module","set"|

#### account
| 字段   |  类型  | 必选   |  描述      |
|-------|--------|--------|------------|
| id    | long   | 否     | 账号 ID |
| name  | string | 否     | 账号名 |
