### 功能描述

查询某实例所有的关联关系（包含其作为关联关系原模型和关联关系目标模型的情况）。(v3.5.36)

### 请求参数

#### 通用参数

| 字段          | 类型   | 必选 | 描述                                                         |
| :------------ | :----- | :--- | :----------------------------------------------------------- |
| bk_app_code   | string | 是   | 应用ID                                                       |
| bk_app_secret | string | 是   | 安全密钥(应用 TOKEN)，可以通过 蓝鲸智云开发者中心 -> 点击应用ID -> 基本信息 获取 |
| bk_token      | string | 否   | 当前用户登录态，bk_token与bk_username必须一个有效，bk_token可以通过Cookie获取 |
| bk_username   | string | 否   | 当前用户用户名，应用免登录态验证白名单中的应用，用此字段指定当前用户 |

#### 接口参数

| 字段       | 类型   | 必选 | 描述                     |
| :--------- | :----- | :--- | :----------------------- |
| bk_inst_id | int    | 是   | 实例id                   |
| bk_obj_id  | string | 是   | 模型id                   |
| fields     | array  | Yes   | 需要返回的字段 |
| start      | int    | 否   | 记录开始位置             |
| limit      | int    | 否   | 分页大小，最大值500。    |

### 请求参数示例

```json
{
	"condition": {
        "bk_inst_id": 8,
        "bk_obj_id": "bk_router"
    },
    "fields": [
    	"id",
    	"bk_inst_id",
    	"bk_obj_id",
    	"bk_asst_inst_id",
    	"bk_asst_obj_id",
    	"bk_obj_asst_id",
    	"bk_asst_id"
    	],
    "page": {
    	"start":1,
    	"limit":2
    }
}
```

### 返回结果示例

```json
{
    "result": true,
    "code": 0,
    "message": "success",
    "permission": null,
    "data": {
        "count": 2,
        "info": [
            {
                "id": 15,
                "bk_inst_id": 10,
                "bk_obj_id": "bk_switch",
                "bk_asst_inst_id": 8,
                "bk_asst_obj_id": "bk_router",
                "bk_obj_asst_id": "bk_switch_default_bk_router"
            },
            {
                "id": 14,
                "bk_inst_id": 9,
                "bk_obj_id": "bk_switch",
                "bk_asst_inst_id": 8,
                "bk_asst_obj_id": "bk_router",
                "bk_obj_asst_id": "bk_switch_default_bk_router"
            }
        ]
    }
}
```

### 返回结果参数说明

#### data

| 名称  | 类型  | 说明 |
|---|---|---|---|
| count| int| 记录条数 |
| info| object array |  查询到的关联关系信息 |

#### data.info 字段说明：
| 名称            | 类型   | 说明                     |
| --------------- | ------ | ------------------------ |
| id              | int64  | 关联id                   |
| bk_inst_id      | int64  | 源模型实例id             |
| bk_obj_id       | string | 关联关系源模型id         |
| bk_asst_inst_id | int64  | 关联关系目标模型id       |
| bk_asst_obj_id  | string | 目标模型实例id           |
| bk_obj_asst_id  | string | 自动生成的模型关联关系id |
| bk_asst_id      | string | 关系名称                 |