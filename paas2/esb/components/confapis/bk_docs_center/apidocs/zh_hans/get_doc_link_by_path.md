### 功能描述

根据md文档名查询文档链接

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| version         |  string    | 是     | 查询版本 |
| md_path         |  string    | 是     | md文档所在结构路径（如：ITSM/产品白皮书/FAQ/FAQ.md）|



### 请求参数示例

```json
{
	"version":"2.6",
	"md_path": "ITSM/产品白皮书/FAQ/FAQ.md"
	
}
```

### 返回结果示例

```json
{
    "result": true,
    "code": 0,
    "message": "success",
    "data": "document/2.6/2/1"
}
```
