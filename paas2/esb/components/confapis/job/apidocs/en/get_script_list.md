### Functional description

Get Script List

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field       |  Type      | Required   |  Description      |
|----------------------|------------|--------|------------|
| bk_biz_id              |  int       | No     | Business ID, not necessary when getting public script |
| is_public              |  bool      | No     | is_public_script.true:public script;false:application script.default:false |
| return_script_content  |  bool      | No     | true:return script content;false:do not return script content.default:false |
| start                  |  int       | No     | The default 0, said from the first record to return |
| length                 |  int       | No     | Paging query-page size.default:20.if the value equals 0,will return all script list |
| script_type            |  string    | No     | Script type.0:all type,1:shell,2:bat,3:perl,4:python,5:powershell,6:sql |
| script_name            |  string    | No     | script name |

### Request Parameters Example

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_biz_id": 1,
    "start": 0,
    "length": 10,
    "is_public": false,
    "return_script_content": false
}
```

### Return Result Example

```python
{
    "result": true,
    "code": 0,
    "message": "success",
    "data": {
        "data": [
            {
                "id": 6862,
                "name": "a.sh",
                "version": "admin.20180627172306",
                "tag": "v1.0",
                "type": 1,
                "creator": "admin",
                "public": false,
                "bk_biz_id": 2,
                "create_time": "2018-06-27 17:23:06",
                "last_modify_user": "admin",
                "last_modify_time": "2018-06-27 17:23:06"
            },
            {
                "id": 36,
                "name": "build_version",
                "version": "admin.20180723154537",
                "tag": "v1.0",
                "type": 1,
                "creator": "admin",
                "public": false,
                "bk_biz_id": 2,
                "create_time": "2018-07-23 15:45:37",
                "last_modify_user": "admin",
                "last_modify_time": "2018-07-23 17:24:17"
            }
        ],
        "start": 0,
        "page_size": 10,
        "total_record_size": 2
    }
}
```

### Return Result Parameters Description

#### data

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| id              | int       | Script ID |
| name            | string    | script name |
| version         | string    | script version |
| tag             | string    | script version remarks |
| type            | int       | script type |
| creator         | string    | creator |
| public          | bool      | is public script |
| bk_biz_id       | int       | Business ID |
| create_time     | string    | script create time |
| last_modify_user| string    | script last modify user |
| last_modify_time| string    | script last modify time |
| content         | string    | script content |
