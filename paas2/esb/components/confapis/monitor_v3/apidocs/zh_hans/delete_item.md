### 功能描述

删除日历事项

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段名      | 类型 | 必选 | 描述                                                         |
| ----------- | ---- | ---- | ------------------------------------------------------------ |
| id          | Int  | 是   | 日历事项ID                                                   |
| start_time  | Int  | 是   | 事项开始时间（传入时间戳）                                   |
| end_time    | Int  | 是   | 事项结束时间（传入时间戳）                                   |
| repeat      | Dict | 是   | 重复事项配置信息（默认为{},表示不重复）                      |
| delete_type | Int  | 是   | 删除类型（删除整个事项：0；删除当前事项：1；删除当前事项及未来所有事项：2） |

#### 重复事项配置信息（repeat）

| 字段名       | 类型        | 必选 | 说明                                                         |
| ------------ | ----------- | ---- | ------------------------------------------------------------ |
| freq         | String      | 是   | 重复频率（天："day"，周："week"，月："month"，年："year"）   |
| interval     | Int         | 是   | 重复间隔                                                     |
| until        | Int         | 是   | 重复结束时间（传入时间戳）                                   |
| every        | List（int） | 是   | 重复区间，当`label`为`week`时这里是0-6(0为周天)的数字，当`label`为`month`的时候，这里是1-31的数字，当`label`为`year`的时候这里的数字是1-12(注：如果传入的start_time对应的标志不在重复区间内，则会自动将其加入） |
| exclude_date | List(int)   | 是   | 排除事项日期(这里记录排除在重复范围内的日期)                 |

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
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "id": 1,
    "start_time": 1647043200,
    "end_time": 1647052200,
    "repeat": {},
    "delete_type": 0
}
```

### 响应参数

| 字段名  | 类型   | 描述         |
| ------- | ------ | ------------ |
| result  | Bool   | 请求是否成功 |
| code    | Int    | 返回的状态码 |
| message | String | 描述信息     |
| data    | Null   | 空           |

#### 示例数据

```json
{
    "message": "OK",
    "code": 200,
    "data": null,
    "result": true
}
```