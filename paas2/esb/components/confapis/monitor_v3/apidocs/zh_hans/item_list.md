### 功能描述

查询规定日期内的所有日历事项列表

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段名       | 类型      | 必选 | 描述                                             |
| ------------ | --------- | ---- | ------------------------------------------------ |
| calendar_ids | List(int) | 是   | 日历列表                                         |
| start_time   | Int       | 是   | 日历查询范围开始时间                             |
| end_time     | Int       | 是   | 日历查询范围结束时间                             |
| time_zone    | String    | 否   | 时区信息，如果不填，默认使用创建时的时区进行查询 |
| search_key   | String    | 否   | 搜索关键字                                       |

#### 示例数据

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
	"calendar_ids": [1],
    "start_time": 1640966400,
    "end_time": 1672502400
}
```

> 上面是查找id为1的日历在2022年整年的日历事项

### 响应参数

| 字段名  | 类型   | 描述                     |
| ------- | ------ | ------------------------ |
| result  | Bool   | 请求是否成功             |
| code    | Int    | 返回的状态码             |
| message | String | 描述信息                 |
| data    | List   | 时间范围内的所有日历事项 |

#### data字段详解

| 字段名      | 类型   | 描述                                 |
| ----------- | ------ | ------------------------------------ |
| id          | Int    | 事项ID                               |
| name        | String | 事项名称                             |
| start_time  | Int    | 事项开始时间                         |
| end_time    | Int    | 事项结束时间                         |
| update_user | String | 更新者                               |
| update_time | Int    | 更新时间                             |
| create_user | String | 创建者                               |
| create_time | Int    | 创建时间                             |
| calendar_id | Int    | 所属日历ID                           |
| deep_color  | String | 深色底色（由所属日历底色决定）       |
| repeat      | Dict   | 重复事项配置信息                     |
| is_first    | Bool   | 是否是第一个事项                     |
| parent_id   | Int    | 父事项ID                             |
| status      | Bool   | 事项是否有效（和此刻的时间进行对比） |
| Light_color | String | 浅色底色（由所属日历底色决定）       |

#### 重复事项配置信息（repeat）

| 字段名       | 类型        | 说明                                                         |
| ------------ | ----------- | ------------------------------------------------------------ |
| freq         | String      | 重复频率（天："day"，周："week"，月："month"，年："year"）   |
| interval     | Int         | 重复间隔                                                     |
| until        | Int         | 重复结束时间                                                 |
| every        | List（int） | 重复区间，当`label`为`week`时这里是`0-6`(0为周天)的数字，当`label`为`month`的时候，这里是`1-31`的数字，当`label`为`year`的时候这里的数字是`1-12` |
| exclude_date | List(int)   | 排除事项日期(这里记录排除在重复范围内的日期)                 |

- 不重复（默认）=>`repeat={}`

- 每天

    ```python
    {
        "freq": "day",
        "interval": 1,  # 间隔
        "until": 1648569600,  # 结束日期
        "every": [],  # 区间
        "exclude_date": []  # 排除事项日期
    }
    ```

- 每个工作日

    ```python
    {
        "freq": "week",
        "interval": 1,
        "until": null,  # 永不结束
        "every": [1,2,3,4,5],
        "exclude_date": []  # 排除事项日期
    }
    ```

- 每周

    ```python
    {
        "freq": "week",
        "interval": 1,
        "until": null,
        "every": [],
        "exclude_date": []  # 排除事项日期
    }
    ```

- 每月

    ```python
    {
        "freq": "month",
        "interval": 1, 
        "until": null,
        "every": [],
        "exclude_date": []  # 排除事项日期
    }
    ```

- 每年

    ```python
    {
        "freq": "year",
        "interval": 1, 
        "until": null,
        "every": [],
        "exclude_date": []  # 排除事项日期
    }
    ```

- 自定义

    自定义这里，根据用户选择的重复结束日期和重复间隔在对应的位置进行处理

    ```python
    # 每三天并且永不结束
    {
        "freq": "day",
        "interval": 3,  # 间隔
        "until": null,  # 结束日期
        "every": [],  # 区间
        "exclude_date": []  # 排除事项日期
    }
    # 每四周并且10.1日结束
    {
        "freq": "week",
        "interval": 4,  # 间隔
        "until": 1664553600,  # 结束日期
        "every": [],  # 区间
        "exclude_date": []  # 排除事项日期
    }
    # 每周四和六并且两周一次，永不结束
    {
        "freq": "week",
        "interval": 2,  # 间隔
        "until": null,  # 结束日期
        "every": [4,6],  # 区间
        "exclude_date": []  # 排除事项日期
    }
    # 每月1号和15号重复，并且间隔3个月，永不重复
    {
        "freq": "month",
        "interval": 3,  # 间隔
        "until": null,  # 结束日期
        "every": [1, 15],  # 区间
        "exclude_date": []  # 排除事项日期
    }
    ```

#### 排除日期（repeat.exclude_date）

当用户对一个重复的事项进行单个编辑或者删除的时候，对应的日期就会存入`exclude_date`

例如：当有一从`2022-03-10至2022-03-20`的每天重复的事项，如果将15号的事项删除，则可以将3.15存入`exclude_date`，使之变成`[1647273600]`

#### 示例数据

```json
{
    "message": "OK",
    "code": 200,
    "data": [
        {
            "today": 1641312000,
            "list": [
                {
                    "id": 1,
                    "name": "新建事项",
                    "start_time": 1641340800,
                    "end_time": 1641355200,
                    "update_user": "xxx",
                    "update_time": 1648569600,
                    "create_user": "xxx",
                    "create_time": 1648569600,
                    "calendar_id": 1,
                    "deep_color": "#BBFFFF",
                    "repeat": {
                        "freq": "day",
                        "interval": 3,
                        "until": null,
                        "every": [],
                        "exclude_date": [] 
                    },
                    "is_first": true,
                    "parent_id": null,
                    "status": true,
                    "light_color": "#111111"
                }
            ]
        },
        {
            "today": 1673625600,
            "list": [
                {
                    "id": 1,
                    "name": "新建事项",
                    "start_time": 1673654400,
                    "end_time": 1673668800,
                    "update_user": "xxx",
                    "update_time": 1648569600,
                    "create_user": "xxx",
                    "create_time": 1648569600,
                    "calendar_id": 1,
                    "deep_color": "#BBFFFF",
                    "light_color": "#111111",
                    "repeat": {
                        "freq": "day",
                        "interval": 3,
                        "until": null,
                        "every": [],
                        "exclude_date": [] 
                    },
                    "is_first": false,
                    "parent_id": null,
                    "status": false
                }
            ]
        }
    ],
    "result": true
}
```