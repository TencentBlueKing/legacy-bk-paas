### Functional description

Query document link according to MD document name

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| version         |  string    | YES     | version |
| md_path         |  string    | YES     | Structure path of MD document(For example: ITSM / productwhitepaper / FAQ / faq.md)|



### Request Parameters Example

```json
{   
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_username": "xxx",
    "bk_token": "xxx",
    "version":"2.6",
    "md_path": "ITSM/productwhitepaper/FAQ/FAQ.md"
	
}
```

### Return Result Example

```json
{
    "result": true,
    "code": 0,
    "message": "success",
    "data": "document/2.6/2/1"
}
```
