### 功能描述

通过算法训练得到的模型，以 API 方式提供应用服务

#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| bkdata_authentication_method  |  string   | 是     | 数据平台授权方式，默认 Token |
| bkdata_data_token  |  string   | 是     | 数据平台授权码，请在数据平台页面上进行申请 |
| bk_app_code         |  string    | 是     | 蓝鲸应用app code |
| bk_app_secret  |  string   | 是     | 蓝鲸应用app secret |
| data  |  json   | 是     | 预测输入，结构详见数据开发中模型API应用节点的示例 |
| config  |  json   | 是     | 预测输入，结构详见数据开发中模型API应用节点的示例 |


### 请求参数示例

```json
{
    "bkdata_authentication_method": "token",
    "bkdata_data_token": "your_data_token",
    "bk_app_code": "your_app_code",
    "bk_app_secret": "your_app_secret",
    "data": {
        "inputs": [
            {
                "feature": 1,
                "timestamp": ""
            }
        ]
    },
    "config": {
        "predict_args": {
            "predcit_arg": 1
        }
    }
}
```

### 返回结果示例

```json
{
    "result": true,
    "data": {
        "errors": null,
        "message": "APIServing execute success",
        "code": "",
        "data": {
            "status": "success",
            "data": [
                {
                    "inputs": [ //输入数据
                        {
                            "timestamp": 1648468355477,
                            "total1": 1
                        }
                    ],
                    "output": [ //输出数据
                        {
                            "timestamp": 1648468355477,
                            "total1": 1,
                            "prediction": 1
                        }
                    ]
                }
            ]
        },
        "result": true, 
        "api_serving_time": 2.7412729263305664 //完整预测时间
    },
    "code": "1500200",
    "message": "ok",
    "errors": null
}
```

### 返回结果参数说明

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| data     | json       | 包含输入数据和输出数据 |
| message      | string     | 此次预测的返回信息, 如有异常会包含报错信息 |
