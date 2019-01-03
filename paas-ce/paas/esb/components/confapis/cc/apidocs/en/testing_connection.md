### Functional description

testing connection(Only test connectivity)

### Request Parameters

{{ common_args_desc }}

#### General Parameters

| Field                |  Type      | Required	     |  Description                                |
|---------------------|------------|----------|--------------------------------------|
| callback_url        | string     | callback | The callback url                     |

### Request Parameters Example

```python
{
    "callback_url":"127.0.0.1:8080/callback",
    "data":{

    }
}
```

### Return Result Example

```python

{
    "result": true,
    "code": 0,
    "message": "",
	"data":  "success"
}
```
