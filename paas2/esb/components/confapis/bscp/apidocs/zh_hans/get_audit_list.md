### 功能描述(目前仅供 bscp-sass 使用，后面会进行调整) 

查询审计历史记录

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段        |  类型     | 必选   |  描述    |
|-------------|-----------|--------|----------|
| resource_type    |  int     | 目标资源类型,"App": 应用模块资源 "Template": 模板资源 "TemplateBind": 模板绑定 "TemplateVersion": 模板版本 "Config": 配置资源 "Commit": 提交资源 "Content": 配置内容 "Release": 版本资源 "Strategy"： 策略资源 "MultiCommit"：组模式提交资源 "MultiRelease"：组模式配置版本 "ProcAttr"：进程环境应用归属信息 "VarGroup"：变量分组 "Var"：变量   |
| action      |  int     | 目标资源操作类型,"Create": 创建 "Update"：更新  "Delete：删除 "Cancel"：取消 "Confirm"：确认提交 "Publish"：发布版本 "Rollback"：回滚版本 "Reload"：Reload配置版本   |
| biz_id         |  string   | 业务ID  |
| app_id         |  string   | 应用ID  |
| resource_id      |  string   | 资源对象ID   |
| operator        |  string   | 操作者 |
| start_time | string | "2006-01-02 15:04:05" (start_time 和 end_time 同时需要)|
| end_time | string | "2006-01-02 15:04:05" (start_time 和 end_time 同时需要)|
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
  "resource_type": "App",
  "action": "Create",
  "start_time":"2021-09-13 21:37:10",
  "end_time":"2021-09-13 21:38:10",
  "page": {
    "start": 0,
    "limit": 50
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
        "total_count": 0,
        "info": [
            {
                "id": "0",
                "biz_id": "1314",
                "app_id": "",
                "resource_type": "App",
                "action": "Create",
                "resource_id": "A-6856ec48-168d-4221-a7cb-7d427a9ee59a",
                "operator": "e2e",
                "at_time": "2021-09-13 21:37:11",
                "detail": {
                    "cur_data": {
                        "creator": "e2e",
                        "deploy_type": 1,
                        "last_modify_by": "e2e",
                        "memo": "e2e-testing",
                        "name": "e2e-app-2021-09-13-21-195249402"
                    },
                    "pre_data": null,
                    "update_fields": null
                }
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
| id             |  string   | 审计ID  |
| resource_type    |  int     | 目标资源类型,"App": 应用模块资源 "Template": 模板资源 "TemplateBind": 模板绑定 "TemplateVersion": 模板版本 "Config": 配置资源 "Commit": 提交资源 "Content": 配置内容 "Release": 版本资源 "Strategy"： 策略资源 "MultiCommit"：组模式提交资源 "MultiRelease"：组模式配置版本 "ProcAttr"：进程环境应用归属信息 "VarGroup"：变量分组 "Var"：变量   |
| action      |  int     | 目标资源操作类型,"Create": 创建 "Update"：更新  "Delete：删除 "Cancel"：取消 "Confirm"：确认提交 "Publish"：发布版本 "Rollback"：回滚版本 "Reload"：Reload配置版本   |
| biz_id         |  string   | 业务ID  |
| app_id         |  string   | 应用ID  |
| resource_id      |  string   | 资源对象ID   |
| operator        |  string   | 操作者 |
| detail        |  json   | 审计详情 |
| at_time     |  string   | 操作时间 |
