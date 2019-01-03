### Functional description

create object attribute

### Request Parameters

{{ common_args_desc }}

#### Request Parameters Example

| Field                  |  Type      | Required	   |  Description                                                    |
|-----------------------|------------|--------|----------------------------------------------------------|
| creator               | string     | No     | The creator of data                                             |
| description           | string     | No     | Description information of data                                           |
| editable              | bool       | No     | Editable data                                       |
| isonly                | bool       | No     | Uniqueness data                                             |
| ispre                 | bool       | No     | true:preset field,false:non preset field                           |
| isreadonly            | bool       | No     | true:read-only，false:non read-only                                   |
| isrequired            | bool       | No     | true:required,false:optional                                    |
| option                | string     | No     |User's custom content，the content and format of memory is determined by caller,example ({"min":"1","max":"2"})|
| unit                  | string     | No     | Unit                                                     |
| placeholder           | string     | No     | Placeholder                                                   |
| bk_property_group     | string     | No     | Object property group name                                            |
| bk_obj_id             | string     | Yes     | Object ID                                                   |
| bk_supplier_account   | string     | Yes     | Supplier account                                               |
| bk_property_id        | string     | Yes     | Object Property ID                                             |
| bk_property_name      | string     | Yes     | Object property name                                      |
| bk_property_type      | string     | Yes     | The storage data type of defined property field,rang list(singlechar,longchar,int,enum,date,time,objuser,singleasst,multiasst,timezone,bool)|
| bk_asst_obj_id        | string     | No     | If there are other models associated with the object, then must be set this field, otherwise, it doesn't to be set                                                                        |

#### bk_property_type

| IDentifier       | name     |
|------------|----------|
| singlechar | Single character   |
| longchar   | Long character   |
| int        | Integer     |
| enum       | Enumeration |
| date       | Date      |
| time       | time      |
| objuser    | Object user      |
| singleasst | Single association   |
| multiasst  | Multiple association   |
| timezone   | Timezone     |
| bool       | Bool    |

### Request Parameters Example

```python
{
	"creator": "user",
	"description": "test",
	"editable": "true",
	"isonly": "false",
	"ispre": "false",
	"isreadonly": "false",
	"isrequired": "false",
	"option": {"min":"1","max":"2"},
	"unit": "1",
	"placeholder": "test",
	"bk_property_group": "default",
	"bk_obj_id": "cc_test_inst",
	"bk_supplier_account": "0",
	"bk_property_id": "cc_test",
	"bk_property_name": "cc_test",
	"bk_property_type": "singlechar",
	"bk_asst_obj_id": "test"
}
```


### Return Result Example

```python

{
    "result": true,
    "code": 0,
    "message": "",
	"data": {
		"id": 11142
	}
}
```

### Return Result Parameters Description

#### data

| Field      | Type      | Description               |
|-----------|-----------|--------------------|
| id        | int       | ID of the new data record |
