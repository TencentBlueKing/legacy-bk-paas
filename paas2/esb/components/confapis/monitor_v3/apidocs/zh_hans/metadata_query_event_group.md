

### 功能描述

批量查询事件分组信息

### 请求参数

{{ common_args_desc }}

#### 通用参数

| 字段          | 类型   | 必选 | 描述                                                         |
| ------------- | ------ | ---- | ------------------------------------------------------------ |
| bk_app_code   | string | 是   | 应用ID                                                       |
| bk_app_secret | string | 是   | 安全密钥(应用 TOKEN)，可以通过 蓝鲸智云开发者中心 -> 点击应用ID -> 基本信息 获取 |
| bk_token      | string | 否   | 当前用户登录态，bk_token与bk_username必须一个有效，bk_token可以通过Cookie获取 |
| bk_username   | string | 否   | 当前用户用户名，应用免登录态验证白名单中的应用，用此字段指定当前用户 |

#### 接口参数

| 字段           | 类型   | 必选 | 描述        |
| -------------- | ------ | ---- | ----------- |
| label  | string | 否   | 事件分组标签（监控对象） |
| event_group_name | string | 否 | 事件分组名称 |
| bk_biz_id | int | 否 | 业务ID | 


#### 请求示例

```json
{
    "bk_app_code": "xxx",
  	"bk_app_secret": "xxxxx",
  	"bk_token": "xxxx",
	"label": "application",
	"event_group_name": "事件分组名",
	"bk_biz_id": 123
}
```

### 返回结果

| 字段       | 类型   | 描述         |
| ---------- | ------ | ------------ |
| result     | bool   | 请求是否成功 |
| code       | int    | 返回的状态码 |
| message    | string | 描述信息     |
| data       | list   | 数据         |
| request_id | string | 请求ID       |

#### data字段说明

| 字段                | 类型   | 描述     |
| ------------------- | ------ | -------- |
| event_group_id | int | 事件分组ID  |
| bk\_data_id | int | 数据源ID |
| bk\_biz_id | int | 业务ID |
| event\_group_name | string | 事件分组名 |
| label | string | 事件标签 |
| is_enable | bool | 是否启用 |
| creator | string | 创建者 |
| create_time | string | 创建时间 |
| last_modify_user | string | 最后修改者 |
| last_modify_time | string | 最后修改时间 |
| event_info_list | list | 事件列表 |

#### data.event_info_list具体内容说明

| 字段                | 类型   | 描述     |
| ------------------- | ------ | -------- |
| bk\_event_id | int | 事件ID  |
| event_name | string | 事件名 |
| dimension | list | 维度列表 |

#### data.event_info_list.dimension具体内容说明

| 字段                | 类型   | 描述     |
| ------------------- | ------ | -------- |
| dimension_name | string | 维度名 | 
| dimension_ch_name | string | 维度中文名 | 

#### 结果示例

```json
{
    "message":"OK",
    "code":200,
    "data": [{
    	"event_group_id": 1001,
    	"bk_data_id": 123,
    	"bk_biz_id": 123,
    	"event_group_name": "事件分组名",
    	"label": "application",
    	"is_enable": true,
    	"creator": "admin",
    	"create_time": "2019-10-10 10:10:10",
    	"last_modify_user": "admin",
    	"last_modify_time": "2020-10-10 10:10:10",
    	"event_info_list": [{
          "bk_event_id": 1,
          "event_name": "usage for update",
          "dimension_list": [{
            "dimension_name": "field_name"
          }]
        },{
          "bk_event_id": 2,
          "event_name": "usage for create",
          "dimension_list": [{
            "dimension_name": "field_name"
          }]
        }]
    }],
    "result":true,
    "request_id":"408233306947415bb1772a86b9536867"
}
```
