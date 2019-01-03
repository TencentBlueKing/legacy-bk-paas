### 功能描述

查询对象模型属性

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段                |  类型      | 必选   |  描述                       |
|---------------------|------------|--------|-----------------------------|
|bk_obj_id            | string     | 否     | 模型ID                      |
|bk_supplier_account  | string     | 否     | 开发商账号                  |


### 请求参数示例

``` python
{
    "bk_obj_id": "test",
    "bk_supplier_account": "0"
}
```


### 返回结果示例

```python

{
    "result": true,
    "code": 0,
    "message": "",
   "data": [
       {
           "bk_asst_obj_id": "",
           "bk_asst_type": 0,
           "create_time": "2018-03-08T11:30:27.898+08:00",
           "creator": "cc_system",
           "description": "",
           "editable": false,
           "id": 51,
           "isapi": false,
           "isonly": true,
           "ispre": true,
           "isreadonly": false,
           "isrequired": true,
           "last_time": "2018-03-08T11:30:27.898+08:00",
           "bk_obj_id": "process",
           "option": "",
           "placeholder": "",
           "bk_property_group": "default",
           "bk_property_group_name": "基础信息",
           "bk_property_id": "bk_process_name",
           "bk_property_index": 0,
           "bk_property_name": "进程名称",
           "bk_property_type": "singlechar",
           "bk_supplier_account": "0",
           "unit": ""
       }
   ]
}
```

### 返回结果参数说明

#### data

| 字段                | 类型         | 描述                                                       |
|---------------------|--------------|------------------------------------------------------------|
| creator             | string       | 数据的创建者                                               |
| description         | string       | 数据的描述信息                                             |
| editable            | bool         | 表明数据是否可编辑                                         |
| isonly              | bool         | 表明唯一性                                                 |
| ispre               | bool         | true:预置字段,false:非内置字段                             |
| isreadonly          | bool         | true:只读，false:非只读                                    |
| isrequired          | bool         | true:必填，false:可选                                      |
| option              | string       | 用户自定义内容，存储的内容及格式由调用方决定               |
| unit                | string       | 单位                                                       |
| placeholder         | string       | 占位符                                                     |
| bk_property_group   | string       | 字段分栏的名字                                             |
| bk_obj_id           | string       | 模型ID                                                     |
| bk_supplier_account | string       | 开发商账号                                                 |
| bk_property_id      | string       | 模型的属性ID                                               |
| bk_property_name    | string       | 模型属性名，用于展示                                       |
| bk_property_type    | string       | 定义的属性字段用于存储数据的数据类型 （singlechar,longchar,int,enum,date,time,objuser,singleasst,multiasst,timezone,bool)|
| bk_asst_obj_id      | string       | 如果有关联其它的模型，那么就必需设置此字段，否则就不需要设置|

#### bk_property_type

| 标识       | 名字     |
|------------|----------|
| singlechar | 短字符   |
| longchar   | 长字符   |
| int        | 整形     |
| enum       | 枚举类型 |
| date       | 日期     |
| time       | 时间     |
| objuser    | 用户     |
| singleasst | 单关联   |
| multiasst  | 多关联   |
| timezone   | 时区     |
| bool       | 布尔     |
