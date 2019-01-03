define({ "api": [
  {
    "type": "get",
    "url": "/api/c/compapi/bk_login/get_all_user/",
    "title": "get_all_user",
    "name": "get_all_user",
    "group": "API_BK_LOGIN",
    "version": "1.0.0",
    "description": "<p>获取所有用户信息</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "role",
            "description": "<p>用户角色，0：普通用户，1：管理员，2：开发者</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"用户信息获取成功\",\n    \"data\": [\n        {\n            \"username\": \"admin\",\n            \"qq\": \"12345\",\n            \"phone\": \"12345678911\",\n            \"role\": \"1\",\n            \"email\": \"11@qq.com\",\n            \"chname\": \"管理员\"\n        },\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/bk/apis/bk_login/apidoc/get_all_user.js",
    "groupTitle": "API_BK_LOGIN"
  },
  {
    "type": "get",
    "url": "/api/c/compapi/bk_login/get_batch_user/",
    "title": "get_batch_user",
    "name": "get_batch_user",
    "group": "API_BK_LOGIN",
    "version": "1.0.0",
    "description": "<p>获取多个用户信息</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "username_list",
            "description": "<p>待获取信息的用户名列表</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"username_list\": \"admin;test\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"用户信息获取成功\",\n    \"data\": {\n        \"admin\": {\n            \"username\": \"admin\",\n            \"qq\": \"123123\",\n            \"phone\": \"11111111111\",\n            \"role\": \"1\",\n            \"email\": \"11@qq.com\",\n            \"chname\": \"admin\"\n        }\n    }\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>返回数据，成功返回请求数据</p>"
          }
        ],
        "data": [
          {
            "group": "data",
            "type": "string",
            "optional": false,
            "field": "role",
            "description": "<p>用户角色，0：普通用户，1：管理员，2：开发者</p>"
          }
        ]
      }
    },
    "filename": "esb/components/bk/apis/bk_login/apidoc/get_batch_user.js",
    "groupTitle": "API_BK_LOGIN"
  },
  {
    "type": "get",
    "url": "/api/c/compapi/bk_login/get_batch_user_platform_role/",
    "title": "get_batch_user_platform_role",
    "name": "get_batch_user_platform_role",
    "group": "API_BK_LOGIN",
    "version": "1.0.0",
    "description": "<p>获取多个用户在平台应用的角色</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "username_list",
            "description": "<p>待获取信息的用户名列表</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"username_list\": \"admin;test\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"用户信息获取成功\",\n    \"data\": {\n        \"admin\": {\n            \"bkdata\": [1],\n            \"job\": [1],\n            \"cmdb\": [1, 2]\n        }\n    }\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>返回数据，成功返回请求数据</p>"
          }
        ],
        "data": [
          {
            "group": "data",
            "type": "list",
            "optional": false,
            "field": "role",
            "description": "<p>用户角色，1：管理员，2：操作员</p>"
          }
        ]
      }
    },
    "filename": "esb/components/bk/apis/bk_login/apidoc/get_batch_user_platform_role.js",
    "groupTitle": "API_BK_LOGIN"
  },
  {
    "type": "get",
    "url": "/api/c/compapi/bk_login/get_user/",
    "title": "get_user",
    "name": "get_user",
    "group": "API_BK_LOGIN",
    "version": "1.0.0",
    "description": "<p>获取用户信息</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"用户信息获取成功\",\n    \"data\": {\n        \"username\": \"admin\",\n        \"qq\": \"12345\",\n        \"phone\": \"12345678911\",\n        \"role\": \"1\",\n        \"email\": \"11@qq.com\",\n        \"chname\": \"管理员\"\n    },\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>返回数据，成功返回请求数据</p>"
          }
        ],
        "data": [
          {
            "group": "data",
            "type": "string",
            "optional": false,
            "field": "role",
            "description": "<p>用户角色，0：普通用户，1：管理员，2：开发者</p>"
          }
        ]
      }
    },
    "filename": "esb/components/bk/apis/bk_login/apidoc/get_user.js",
    "groupTitle": "API_BK_LOGIN"
  },
  {
    "type": "get",
    "url": "/api/c/compapi/bk_paas/get_app_info/",
    "title": "get_app_info",
    "name": "get_app_info",
    "group": "API_BK_PAAS",
    "version": "1.0.0",
    "description": "<p>获取应用信息</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "target_app_code",
            "description": "<p>目标蓝鲸应用ID，多个以英文逗号分隔，为空则表示所有应用</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"target_app_code\": \"bk_test,esb_test\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": [\n        {\n            \"app_code\": \"bk_test\",\n            \"app_name\": \"BKTest\"\n        },\n        {\n            \"app_code\": \"esb_test\",\n            \"app_name\": \"ESBTest\"\n        }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/bk/apis/bk_paas/apidoc/get_app_info.js",
    "groupTitle": "API_BK_PAAS"
  },
  {
    "type": "post",
    "url": "/api/c/compapi/cc/add_app/",
    "title": "add_app",
    "name": "add_app",
    "group": "API_CC",
    "version": "1.0.0",
    "description": "<p>新建业务</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_name",
            "description": "<p>业务名</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "maintainers",
            "description": "<p>运维人员, 多个人之间用逗号分隔</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "product_pm",
            "description": "<p>产品人员，多个人之间用逗号分隔</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "developer",
            "description": "<p>开发人员，多个人之间用逗号分隔</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "tester",
            "description": "<p>测试人员，多个人之间用逗号分隔</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "operator",
            "description": "<p>操作者，多个人之间用逗号分隔</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "company_name",
            "description": "<p>公司名,cmdb配置文件中定义的constants.php中的 COMPANY_NAME</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "level",
            "description": "<p>业务拓扑级别，2或者3</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "life_cycle",
            "description": "<p>生成周期，测试中, 已上线, 停运其中的一个值</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"app_name\": \"测试\",\n    \"maintainers\": \"admin\",\n    \"product_pm\": \"admin\",\n    \"company_name\": \"公司名称\",\n    \"level\": 3,\n    \"life_cycle\": \"测试中\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": {\n        \"appId\": 25\n    }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/bk/apis/cc/apidoc/add_app.js",
    "groupTitle": "API_CC"
  },
  {
    "type": "post",
    "url": "/api/c/compapi/cc/add_module/",
    "title": "add_module",
    "name": "add_module",
    "group": "API_CC",
    "version": "1.0.0",
    "description": "<p>新建模块</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "app_id",
            "description": "<p>业务ID</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "set_id",
            "description": "<p>集群ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "module_name",
            "description": "<p>模块名，多个用英文逗号分隔</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "operator",
            "description": "<p>操作人</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bak_operator",
            "description": "<p>备份操作人</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": true,
            "field": "module_type",
            "description": "<p>模块类型，1: 普通, 2: 数据库</p>"
          },
          {
            "group": "Parameter",
            "type": "dict",
            "optional": true,
            "field": "properties",
            "description": "<p>模块属性，自定义属性用customerxx来修改</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"app_id\": 1,\n    \"set_id\": 10,\n    \"module_name\": \"test1,test2\",\n    \"module_type\": 1,\n    \"operator\": \"user1\",\n    \"bak_operator\": \"user2\",\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": {},\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/bk/apis/cc/apidoc/add_module.js",
    "groupTitle": "API_CC"
  },
  {
    "type": "post",
    "url": "/api/c/compapi/cc/add_plat_id/",
    "title": "add_plat_id",
    "name": "add_plat_id",
    "group": "API_CC",
    "version": "1.0.0",
    "description": "<p>新增子网ID</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "plat_name",
            "description": "<p>子网名称</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"plat_name\": \"test_plat\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": 2,\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "result",
            "description": "<p>包含True和False，其中True表示成功，False表示失败</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>返回错误码，其中&quot;00&quot;表示成功，其它表示失败</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>返回数据，成功返回请求数据</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>返回错误消息</p>"
          }
        ]
      }
    },
    "filename": "esb/components/bk/apis/cc/apidoc/add_plat_id.js",
    "groupTitle": "API_CC"
  },
  {
    "type": "post",
    "url": "/api/c/compapi/cc/add_set/",
    "title": "add_set",
    "name": "add_set",
    "group": "API_CC",
    "version": "1.0.0",
    "description": "<p>新建集群</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "app_id",
            "description": "<p>业务ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "set_names",
            "description": "<p>集群名称，多个以半角逗号分隔</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "chn_name",
            "description": "<p>中文名称</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "group_flag",
            "description": "<p>分组标识</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": true,
            "field": "env_type",
            "description": "<p>环境类型，包含1：测试 2：体验 3：正式，默认为3</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": true,
            "field": "service_status",
            "description": "<p>服务状态，包含0：关闭，1：开启，默认为1</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": true,
            "field": "capacity",
            "description": "<p>设计容量</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "des",
            "description": "<p>描述</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"app_id\": 3,\n    \"set_names\": \"test\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": null,\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "result",
            "description": "<p>包含True和False，其中True表示成功，False表示失败</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>返回错误码，其中&quot;00&quot;表示成功，其它表示失败</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>返回数据，成功返回请求数据</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>返回错误消息</p>"
          }
        ]
      }
    },
    "filename": "esb/components/bk/apis/cc/apidoc/add_set.js",
    "groupTitle": "API_CC"
  },
  {
    "type": "post",
    "url": "/api/c/compapi/cc/clone_host_property/",
    "title": "clone_host_property",
    "name": "clone_host_property",
    "group": "API_CC",
    "version": "1.0.0",
    "description": "<p>克隆主机属性</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "app_id",
            "description": "<p>业务ID</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "plat_id",
            "description": "<p>子网ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "org_ip",
            "description": "<p>主机（内网IP）</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "dst_ip",
            "description": "<p>目标主机（内网IP）</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"app_id\": 12,\n    \"plat_id\": 2,\n    \"org_ip\": \"xxx.xxx.xxx.xxx\",\n    \"dst_ip\": \"xxx.xxx.xxx.xxx\",\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"data\": null,\n    \"message\": \"\",\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/bk/apis/cc/apidoc/clone_host_property.js",
    "groupTitle": "API_CC"
  },
  {
    "type": "post",
    "url": "/api/c/compapi/cc/del_app/",
    "title": "del_app",
    "name": "del_app",
    "group": "API_CC",
    "version": "1.0.0",
    "description": "<p>删除业务</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "app_id",
            "description": "<p>业务ID</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"app_id\": 1\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": {}\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/bk/apis/cc/apidoc/del_app.js",
    "groupTitle": "API_CC"
  },
  {
    "type": "post",
    "url": "/api/c/compapi/cc/del_host_in_app/",
    "title": "del_host_in_app",
    "name": "del_host_in_app",
    "group": "API_CC",
    "version": "1.0.0",
    "description": "<p>从业务空闲机集群中删除主机 ，如果主机在当前业务下不存在，也提示不在空闲机集群的错误信息</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "app_id",
            "description": "<p>业务ID</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "host_id",
            "description": "<p>主机ID</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"app_id\": 1,\n    \"host_id\": 12345\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": null,\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/bk/apis/cc/apidoc/del_host_in_app.js",
    "groupTitle": "API_CC"
  },
  {
    "type": "post",
    "url": "/api/c/compapi/cc/del_module/",
    "title": "del_module",
    "name": "del_module",
    "group": "API_CC",
    "version": "1.0.0",
    "description": "<p>删除模块</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "app_id",
            "description": "<p>业务ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "module_ids",
            "description": "<p>模块ID, 多个ID用英文逗号分隔</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"app_id\": 1,\n    \"module_ids\": \"10,11\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": {}\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/bk/apis/cc/apidoc/del_module.js",
    "groupTitle": "API_CC"
  },
  {
    "type": "post",
    "url": "/api/c/compapi/cc/del_plat/",
    "title": "del_plat",
    "name": "del_plat",
    "group": "API_CC",
    "version": "1.0.0",
    "description": "<p>删除子网</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "plat_id",
            "description": "<p>子网ID</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"plat_id\": 1234,\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": null,\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/bk/apis/cc/apidoc/del_plat.js",
    "groupTitle": "API_CC"
  },
  {
    "type": "post",
    "url": "/api/c/compapi/cc/del_set/",
    "title": "del_set",
    "name": "del_set",
    "group": "API_CC",
    "version": "1.0.0",
    "description": "<p>删除集群</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "app_id",
            "description": "<p>业务ID</p>"
          },
          {
            "group": "Parameter",
            "type": "array",
            "optional": false,
            "field": "set_ids",
            "description": "<p>集群ID</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"app_id\": 3,\n    \"set_ids\": [\"1\"]\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": null,\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "result",
            "description": "<p>包含True和False，其中True表示成功，False表示失败</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>返回错误码，其中&quot;00&quot;表示成功，其它表示失败</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>返回数据，成功返回请求数据</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>返回错误消息</p>"
          }
        ]
      }
    },
    "filename": "esb/components/bk/apis/cc/apidoc/del_set.js",
    "groupTitle": "API_CC"
  },
  {
    "type": "post",
    "url": "/api/c/compapi/cc/del_set_host/",
    "title": "del_set_host",
    "name": "del_set_host",
    "group": "API_CC",
    "version": "1.0.0",
    "description": "<p>清空集群下所有主机</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "app_id",
            "description": "<p>业务ID</p>"
          },
          {
            "group": "Parameter",
            "type": "array",
            "optional": false,
            "field": "set_ids",
            "description": "<p>集群ID</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"app_id\": 3,\n    \"set_ids\": [\"1\"]\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": null,\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "result",
            "description": "<p>包含True和False，其中True表示成功，False表示失败</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>返回错误码，其中&quot;00&quot;表示成功，其它表示失败</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>返回数据，成功返回请求数据</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>返回错误消息</p>"
          }
        ]
      }
    },
    "filename": "esb/components/bk/apis/cc/apidoc/del_set_host.js",
    "groupTitle": "API_CC"
  },
  {
    "type": "post",
    "url": "/api/c/compapi/cc/edit_app/",
    "title": "edit_app",
    "name": "edit_app",
    "group": "API_CC",
    "version": "1.0.0",
    "description": "<p>编辑业务</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "app_id",
            "description": "<p>业务ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "app_name",
            "description": "<p>业务名</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "maintainers",
            "description": "<p>运维人员, 多个人之间用逗号分隔</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "product_pm",
            "description": "<p>产品人员，多个人之间用逗号分隔</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "developer",
            "description": "<p>开发人员，多个人之间用逗号分隔</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "tester",
            "description": "<p>测试人员，多个人之间用逗号分隔</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "operator",
            "description": "<p>操作者，多个人之间用逗号分隔</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "life_cycle",
            "description": "<p>生成周期，测试中, 已上线, 停运其中的一个值</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"app_id\": 1,\n    \"app_name\": \"测试\",\n    \"operator\": \"test1,test2\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": {},\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/bk/apis/cc/apidoc/edit_app.js",
    "groupTitle": "API_CC"
  },
  {
    "type": "post",
    "url": "/api/c/compapi/cc/enter_ip/",
    "title": "enter_ip",
    "name": "enter_ip",
    "group": "API_CC",
    "version": "1.0.0",
    "description": "<p>导入主机到业务 ，如果业务不存在，将导入到资源池中，如果主机已经存在，将会删除原有主机与模块的关系如果业务不存在，将导入到资源池中，如果主机已经存在，将会删除原有主机与模块的关系如果业务不存在，将导入到资源池中，如果主机已经存在，将会删除原有主机与模块的关系</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "ips",
            "description": "<p>IP地址，多个用英文逗号分隔</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "hostname",
            "description": "<p>主机名, 多个用英文逗号分隔</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "app_name",
            "description": "<p>业务名</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "set_name",
            "description": "<p>集群名</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "module_name",
            "description": "<p>模块名</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "os_type",
            "description": "<p>操作系统类型，linux或windows</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"ips\": \"10.10.10.10,10.10.10.11\",\n    \"hostname\": \"test\",\n    \"app_name\": \"test\",\n    \"set_name\": \"test\",\n    \"module_name\": \"test\",\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": null\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/bk/apis/cc/apidoc/enter_ip.js",
    "groupTitle": "API_CC"
  },
  {
    "type": "get",
    "url": "/api/c/compapi/cc/get_app_agent_status/",
    "title": "get_app_agent_status",
    "name": "get_app_agent_status",
    "group": "API_CC",
    "version": "1.0.0",
    "description": "<p>查询业务下Agent状态</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "app_id",
            "description": "<p>业务ID</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"app_id\": 1\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"message\": \"\",\n    \"code\": \"00\",\n    \"data\": {\n        \"agentNorList\": [ ],\n        \"agentAbnorCnt\": 3,\n        \"agentNorCnt\": 0,\n        \"agentAbnorList\": [\n            {\n                \"Ip\": \"10.0.0.1\",\n                \"PlatId\": \"1\",\n                \"CompanyId\": 0\n            },\n            {\n                \"Ip\": \"10.0.0.2\",\n                \"PlatId\": \"1\",\n                \"CompanyId\": 0\n            },\n            {\n                \"Ip\": \"10.0.0.3\",\n                \"PlatId\": \"1\",\n                \"CompanyId\": 0\n            },\n        ]\n    },\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"code\": \"50000\",\n    \"error\": {\n        \"error_data\": {\n            \"api_spec\": {\n            }\n        }\n    },\n    \"result\": false,\n    \"message\": \"没权利访问业务\",\n    \"data\": null\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/bk/apis/cc/apidoc/get_app_agent_status.js",
    "groupTitle": "API_CC"
  },
  {
    "type": "get",
    "url": "/api/c/compapi/cc/get_app_by_id/",
    "title": "get_app_by_id",
    "name": "get_app_by_id",
    "group": "API_CC",
    "version": "1.0.0",
    "description": "<p>查询业务信息</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "app_id",
            "description": "<p>业务ID</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"app_id\": 516\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": [\n        {\n            \"ApplicationName\": \"测试版\",\n            \"GroupName\": \"\",\n            \"Description\": \"\",\n            \"BusinessDeptName\": \"\",\n            \"Creator\": \"2323232\",\n            \"Default\": \"0\",\n            \"ApplicationID\": \"51\",\n            \"DeptName\": \"23223\",\n            \"CompanyID\": \"6\",\n            \"LifeCycle\": \"内测\",\n            \"Source\": \"qcloud\",\n            \"Maintainers\": \"12345\",\n            \"CreateTime\": \"2015-12-17 17:12:14\",\n            \"ProjectID\": \"0\",\n            \"Owner\": \"232232\",\n            \"ProductPm\": \"2323232\",\n            \"Level\": \"3\",\n            \"LastTime\": \"2016-05-16 10:27:39\",\n            \"Type\": \"1\",\n            \"Display\": \"1\"\n        }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"code\": \"50000\",\n    \"error\": {\n        \"error_data\": {\n            \"api_spec\": {\n            }\n        }\n    },\n    \"result\": false,\n    \"message\": \"没权利访问业务\",\n    \"data\": null\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/bk/apis/cc/apidoc/get_app_by_id.js",
    "groupTitle": "API_CC"
  },
  {
    "type": "get",
    "url": "/api/c/compapi/cc/get_app_by_user/",
    "title": "get_app_by_user",
    "name": "get_app_by_user",
    "group": "API_CC",
    "version": "1.0.0",
    "description": "<p>查询用户有权限的业务</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "bool",
            "optional": true,
            "field": "filter_only",
            "description": "<p>是否不显示已经停止运行的业务，默认为False</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": [\n        {\n            \"ApplicationName\": \"示例业务\",\n            \"GroupName\": \"\",\n            \"Description\": \"\",\n            \"BusinessDeptName\": \"\",\n            \"Creator\": \"admin\",\n            \"Default\": \"0\",\n            \"ApplicationID\": \"2\",\n            \"DeptName\": \"公司名称\",\n            \"Level\": \"3\",\n            \"LifeCycle\": \"公测\",\n            \"Source\": \"\",\n            \"Maintainers\": \"admin\",\n            \"CreateTime\": \"2016-08-10 20:43:38\",\n            \"CompanyID\": \"0\",\n            \"Owner\": \"公司名称\",\n            \"ProductPm\": \"admin\",\n            \"LastTime\": \"2016-08-10 20:43:38\",\n            \"Type\": \"0\",\n            \"Display\": \"1\"\n        }\n    ],\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "Default",
            "description": "<p>为1表示系统默认创建业务</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"code\": \"50000\",\n    \"error\": {\n        \"error_data\": {\n            \"api_spec\": {\n                \"msg\": \"only right to app\",\n                \"extmsg\": \"没权利访问业务\",\n                \"code\": \"0006\"\n            }\n        }\n    },\n    \"result\": false,\n    \"request_id\": \"bb8e27bbd86e4802ada9027e2d933cc1\",\n    \"message\": \"没权利访问业务\",\n    \"data\": null\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "dict",
            "optional": false,
            "field": "error",
            "description": "<p>错误详情，api_spec为配置平台接口的错误信息</p>"
          }
        ]
      }
    },
    "filename": "esb/components/bk/apis/cc/apidoc/get_app_by_user.js",
    "groupTitle": "API_CC"
  },
  {
    "type": "get",
    "url": "/api/c/compapi/cc/get_app_by_user_role/",
    "title": "get_app_by_user_role",
    "name": "get_app_by_user_role",
    "group": "API_CC",
    "version": "1.0.0",
    "description": "<p>根据用户角色查询用户业务</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "user_role",
            "description": "<p>用户角色，多个以逗号分隔，可选值为：Maintainers,ProductPm,Cooperation等</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"user_role\": \"Maintainers,ProductPm\",\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": {\n        \"ProductPm\": [\n            {\n                \"ApplicationName\": \"蓝鲸\",\n                \"ApplicationID\": \"620\",\n                \"DeptName\": \"蓝鲸\",\n                \"Owner\": \"bk\"\n            }\n        ],\n        \"Maintainers\": [\n            {\n                \"ApplicationName\": \"蓝鲸\",\n                \"ApplicationID\": \"620\",\n                \"DeptName\": \"蓝鲸\",\n                \"Owner\": \"bk\"\n            }\n        ],\n        \"Cooperation\": []\n    },\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/bk/apis/cc/apidoc/get_app_by_user_role.js",
    "groupTitle": "API_CC"
  },
  {
    "type": "get",
    "url": "/api/c/compapi/cc/get_app_host_list/",
    "title": "get_app_host_list",
    "name": "get_app_host_list",
    "group": "API_CC",
    "version": "1.0.0",
    "description": "<p>查询业务主机列表</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_id",
            "description": "<p>业务ID</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"app_id\": \"1\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": [\n        {\n            \"Status\": \"\",\n            \"HardMemo\": \"\",\n            \"HostID\": \"1\",\n            \"BakOperator\": \"\",\n            \"SetName\": \"\",\n            \"AssetID\": \"test-1\",\n            \"InnerIP\": \"10.0.0.1\",\n            \"Region\": \"test\",\n            \"HostName\": \"host\",\n            \"IdcName\": \"\",\n            \"OSName\": \"\",\n            \"ModuleName\": \"空闲机\",\n            \"DeviceClass\": \"\",\n            \"ApplicationName\": \"资源池\",\n            \"OuterIP\": \"\",\n            \"Operator\": \"\",\n            \"SetID\": \"1\",\n            \"ApplicationID\": \"1\",\n            \"CreateTime\": \"2016-03-22 21:07:47\",\n            \"ModuleID\": \"1\"\n        }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/bk/apis/cc/apidoc/get_app_host_list.js",
    "groupTitle": "API_CC"
  },
  {
    "type": "get",
    "url": "/api/c/compapi/cc/get_app_list/",
    "title": "get_app_list",
    "name": "get_app_list",
    "group": "API_CC",
    "version": "1.0.0",
    "description": "<p>查询业务列表</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": [\n        {\n            \"ApplicationName\": \"示例业务\",\n            \"Type\": \"0\",\n            \"Description\": \"\",\n            \"BusinessDeptName\": \"\",\n            \"Creator\": \"admin\",\n            \"Default\": \"0\",\n            \"ApplicationID\": \"2\",\n            \"Level\": \"3\",\n            \"Display\": \"1\",\n            \"Source\": \"\",\n            \"GroupName\": \"\",\n            \"Maintainers\": \"admin\",\n            \"CompanyID\": \"0\",\n            \"Owner\": \"公司名称\",\n            \"ProductPm\": \"admin\",\n            \"LifeCycle\": \"公测\",\n            \"LastTime\": \"2016-03-25 04:02:05\",\n            \"DeptName\": \"公司名称\",\n            \"CreateTime\": \"2016-03-18 13:08:19\"\n        }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/bk/apis/cc/apidoc/get_app_list.js",
    "groupTitle": "API_CC"
  },
  {
    "type": "get",
    "url": "/api/c/compapi/cc/get_host_by_company_id/",
    "title": "get_host_by_company_id",
    "name": "get_host_by_company_id",
    "group": "API_CC",
    "version": "1.0.0",
    "description": "<p>根据开发商ID、子网ID、主机IP获取主机信息</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "company_id",
            "description": "<p>开发商ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "ip",
            "description": "<p>主机ip</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "plat_id",
            "description": "<p>子网ID</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"company_id\": 0,\n    \"ip\": \"10.0.0.1\",\n    \"plat_id\": 1,\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": {\n        \"ApplicationName\": \"示例业务\",\n        \"ModuleName\": \"示例模块\",\n        \"BakOperator\": \"admin\",\n        \"SetName\": \"示例集群\",\n        \"Operator\": \"admin\",\n        \"SetID\": \"3\",\n        \"ApplicationID\": \"1\",\n        \"ModuleID\": \"3\"\n    }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/bk/apis/cc/apidoc/get_host_by_company_id.js",
    "groupTitle": "API_CC"
  },
  {
    "type": "get",
    "url": "/api/c/compapi/cc/get_host_company_id/",
    "title": "get_host_company_id",
    "name": "get_host_company_id",
    "group": "API_CC",
    "version": "1.0.0",
    "description": "<p>获取主机开发商</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "ips",
            "description": "<p>主机内网IP，多个以逗号分隔</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"ips\": \"10.0.0.1,10.0.0.2\",\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": {\n        \"10.0.0.1\": {\n            \"102\": {\n                \"CompanyID\": \"0\",\n                \"AssetID\": \"\",\n                \"Region\": \"\",\n                \"Owner\": \"公司名称\",\n                \"PlatID\": \"1\",\n                \"ApplicationID\": \"1\"\n            }\n        },\n        \"10.0.0.2\": {\n            \"102\": {\n                \"CompanyID\": \"0\",\n                \"AssetID\": \"\",\n                \"Region\": \"\",\n                \"Owner\": \"公司名称\",\n                \"PlatID\": \"1\",\n                \"ApplicationID\": \"1\"\n            }\n        }\n    }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/bk/apis/cc/apidoc/get_host_company_id.js",
    "groupTitle": "API_CC"
  },
  {
    "type": "get",
    "url": "/api/c/compapi/cc/get_host_list_by_field/",
    "title": "get_host_list_by_field",
    "name": "get_host_list_by_field",
    "group": "API_CC",
    "version": "1.0.0",
    "description": "<p>根据主机属性的值group主机列表</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>app标识</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_id",
            "description": "<p>业务ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "field",
            "description": "<p>主机属性字段</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"appId\": \"1\",\n    \"field\": \"OSName\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"message\": \"\",\n    \"code\": \"00\",\n    \"data\": {\n      \"\": [\n        {\n          \"Source\": \"1\",\n          \"ApplicationID\": \"1\",\n          \"HostID\": \"66\",\n          \"InnerIP\": \"10.0.0.1\",\n          \"OSName\": \"\"\n        },\n        {\n          \"Source\": \"1\",\n          \"ApplicationID\": \"1\",\n          \"HostID\": \"67\",\n          \"InnerIP\": \"10.0.0.2\",\n          \"OSName\": \"\"\n        }\n      ]\n    },\n    \"result\": true\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/bk/apis/cc/apidoc/get_host_list_by_field.js",
    "groupTitle": "API_CC"
  },
  {
    "type": "get",
    "url": "/api/c/compapi/cc/get_host_list_by_ip/",
    "title": "get_host_list_by_ip",
    "name": "get_host_list_by_ip",
    "group": "API_CC",
    "version": "1.0.0",
    "description": "<p>根据IP查询主机信息</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_id",
            "description": "<p>业务ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "ip",
            "description": "<p>主机IP(内网IP或外网IP)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"app_id\": \"1\",\n    \"ip\": \"10.0.0.1\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": [\n        {\n            \"Status\": \"\",\n            \"HardMemo\": \"\",\n            \"HostID\": \"70\",\n            \"BakOperator\": \"\",\n            \"SetName\": \"\",\n            \"AssetID\": \"test-1\",\n            \"InnerIP\": \"10.0.0.1\",\n            \"Region\": \"test\",\n            \"HostName\": \"host\",\n            \"IdcName\": \"\",\n            \"OSName\": \"\",\n            \"ModuleName\": \"空闲机\",\n            \"DeviceClass\": \"\",\n            \"ApplicationName\": \"资源池\",\n            \"OuterIP\": \"\",\n            \"Operator\": \"\",\n            \"SetID\": \"1\",\n            \"ApplicationID\": \"1\",\n            \"CreateTime\": \"2016-03-22 21:07:47\",\n            \"ModuleID\": \"1\"\n        }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/bk/apis/cc/apidoc/get_host_list_by_ip.js",
    "groupTitle": "API_CC"
  },
  {
    "type": "get",
    "url": "/api/c/compapi/cc/get_hosts_by_property/",
    "title": "get_hosts_by_property",
    "name": "get_hosts_by_property",
    "group": "API_CC",
    "version": "1.0.0",
    "description": "<p>根据 set 属性查询主机</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_id",
            "description": "<p>业务ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "set_id",
            "description": "<p>大区ID，多个以逗号分隔</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "set_envi_type",
            "description": "<p>Set 环境类型，多个以逗号分隔</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "set_service_status",
            "description": "<p>Set 开放状态，多个以逗号分隔</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "module_name",
            "description": "<p>模块名称，多个以逗号分隔</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"app_id\": \"1\",\n    \"set_id\": \"1\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": [\n        {\n            \"OuterIP\": \"\",\n            \"HostID\": \"1\",\n            \"InnerIP\": \"10.0.0.1\",\n            \"Source\": \"1\"\n        }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/bk/apis/cc/apidoc/get_hosts_by_property.js",
    "groupTitle": "API_CC"
  },
  {
    "type": "get",
    "url": "/api/c/compapi/cc/get_ip_and_proxy_by_company/",
    "title": "get_ip_and_proxy_by_company",
    "name": "get_ip_and_proxy_by_company",
    "group": "API_CC",
    "version": "1.0.0",
    "description": "<p>查询业务下IP及ProxyIP</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "app_id",
            "description": "<p>业务ID</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "plat_id",
            "description": "<p>子网ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "ip_list",
            "description": "<p>内网IP列表，多个以逗号分隔</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"app_id\": 1,\n    \"plat_id\": 1,\n    \"ip_list\": \"10.0.0.1,10.0.0.2\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": {\n        \"proxy_list\": [],\n        \"ip_list\": [\n            \"10.0.0.1\",\n            \"10.0.0.2\",\n        ],\n        \"invalid_ips\": []\n    }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/bk/apis/cc/apidoc/get_ip_and_proxy_by_company.js",
    "groupTitle": "API_CC"
  },
  {
    "type": "get",
    "url": "/api/c/compapi/cc/get_module_host_list/",
    "title": "get_module_host_list",
    "name": "get_module_host_list",
    "group": "API_CC",
    "version": "1.0.0",
    "description": "<p>查询模块主机列表</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_id",
            "description": "<p>业务ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "module_id",
            "description": "<p>模块ID</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"app_id\": \"1\",\n    \"module_id\": \"1\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": [\n        {\n            \"ModuleName\": \"空闲机\",\n            \"IdcName\": \"\",\n            \"Source\": \"3\",\n            \"ApplicationID\": \"1\",\n            \"Status\": \"\",\n            \"HardMemo\": \"\",\n            \"Mem\": \"0\",\n            \"HostName\": \"host\",\n            \"DeviceClass\": \"\",\n            \"SetID\": \"1\",\n            \"ApplicationName\": \"资源池\",\n            \"HostID\": \"1\",\n            \"BakOperator\": \"\",\n            \"OuterIP\": \"\",\n            \"Region\": \"test\",\n            \"ModuleID\": \"1\",\n            \"SetName\": \"\",\n            \"AssetID\": \"test-1\",\n            \"OSName\": \"\",\n            \"Operator\": \"\",\n            \"InnerIP\": \"10.0.0.1\",\n            \"CreateTime\": \"2016-03-22 21:07:47\"\n        }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/bk/apis/cc/apidoc/get_module_host_list.js",
    "groupTitle": "API_CC"
  },
  {
    "type": "get",
    "url": "/api/c/compapi/cc/get_modules/",
    "title": "get_modules",
    "name": "get_modules",
    "group": "API_CC",
    "version": "1.0.0",
    "description": "<p>查询业务下的所有模块</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_id",
            "description": "<p>业务ID</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"app_id\": \"1\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": [\n        \"空闲机\"\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/bk/apis/cc/apidoc/get_modules.js",
    "groupTitle": "API_CC"
  },
  {
    "type": "get",
    "url": "/api/c/compapi/cc/get_modules_by_property/",
    "title": "get_modules_by_property",
    "name": "get_modules_by_property",
    "group": "API_CC",
    "version": "1.0.0",
    "description": "<p>根据 set 属性查询模块</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_id",
            "description": "<p>业务 ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "set_id",
            "description": "<p>大区ID，多个以逗号分隔</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "set_envi_type",
            "description": "<p>Set 环境类型，多个以逗号分隔</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "set_service_status",
            "description": "<p>Set 开放状态，多个以逗号分隔</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"app_id\": \"1\",\n    \"set_id\": \"1\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": [\n        \"空闲机\"\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/bk/apis/cc/apidoc/get_modules_by_property.js",
    "groupTitle": "API_CC"
  },
  {
    "type": "get",
    "url": "/api/c/compapi/cc/get_plat_id/",
    "title": "get_plat_id",
    "name": "get_plat_id",
    "group": "API_CC",
    "version": "1.0.0",
    "description": "<p>查询子网列表</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": [\n        {\n            \"platId\": \"1\",\n            \"platCompany\": \"0\",\n            \"platName\": \"esb_test\"\n        }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/bk/apis/cc/apidoc/get_plat_id.js",
    "groupTitle": "API_CC"
  },
  {
    "type": "get",
    "url": "/api/c/compapi/cc/get_process_port_by_app_id/",
    "title": "get_process_port_by_app_id",
    "name": "get_process_port_by_app_id",
    "group": "API_CC",
    "version": "1.0.0",
    "description": "<p>查询进程端口</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "app_id",
            "description": "<p>业务ID</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_id\": 1\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"message\": \"\",\n    \"code\": \"00\",\n    \"data\": [\n        {\n            \"ApplicationName\": \"示例业务\",\n            \"Process\": [\n                {\n                    \"WorkPath\": \"\",\n                    \"AutoTimeGap\": \"0\",\n                    \"LastTime\": \"2017-06-14 09:57:42\",\n                    \"StartCmd\": \"\",\n                    \"FuncID\": \"0\",\n                    \"BindIP\": \"10.0.0.1\",\n                    \"FuncName\": \"\",\n                    \"Flag\": \"\",\n                    \"User\": \"\",\n                    \"StopCmd\": \"\",\n                    \"ProcNum\": \"0\",\n                    \"ReloadCmd\": \"\",\n                    \"ProcessName\": \"nginx\",\n                    \"OpTimeout\": \"0\",\n                    \"KillCmd\": \"\",\n                    \"Protocol\": \"TCP\",\n                    \"Seq\": \"0\",\n                    \"ProcGrp\": \"\",\n                    \"Port\": \"80\",\n                    \"ReStartCmd\": \"\",\n                    \"AutoStart\": \"0\",\n                    \"CreateTime\": \"2017-06-14 09:55:02\",\n                    \"PidFile\": \"\"\n                }\n            ],\n            \"InnerIP\": \"10.0.0.1\",\n            \"Source\": \"2\",\n            \"OuterIP\": \"123.0.0.1\",\n            \"ApplicationID\": \"1\"\n        }\n    ],\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/bk/apis/cc/apidoc/get_process_port_by_app_id.js",
    "groupTitle": "API_CC"
  },
  {
    "type": "get",
    "url": "/api/c/compapi/cc/get_property_list/",
    "title": "get_property_list",
    "name": "get_property_list",
    "group": "API_CC",
    "version": "1.0.0",
    "description": "<p>查询属性列表</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_id",
            "description": "<p>业务 ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "type",
            "description": "<p>属性类型，包含1:业务，2:集群，3:模块，4:主机</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"app_id\": \"1\",\n    \"type\": \"4\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": [\n        {\n            \"standard\": {\n                \"HostID\": \"主机ID\",\n                \"OuterIP\": \"外网IP\",\n                \"InnerIP\": \"内网IP\"\n            }\n        }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/bk/apis/cc/apidoc/get_property_list.js",
    "groupTitle": "API_CC"
  },
  {
    "type": "get",
    "url": "/api/c/compapi/cc/get_set_host_list/",
    "title": "get_set_host_list",
    "name": "get_set_host_list",
    "group": "API_CC",
    "version": "1.0.0",
    "description": "<p>查询Set主机列表</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_id",
            "description": "<p>业务ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "set_id",
            "description": "<p>SetID</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"app_id\": \"1\",\n    \"set_id\": \"1\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": [\n        {\n            \"Status\": \"\",\n            \"HardMemo\": \"\",\n            \"HostID\": \"1\",\n            \"BakOperator\": \"\",\n            \"SetName\": \"\",\n            \"AssetID\": \"test-1\",\n            \"InnerIP\": \"10.0.0.1\",\n            \"Region\": \"test\",\n            \"HostName\": \"host\",\n            \"IdcName\": \"\",\n            \"OSName\": \"\",\n            \"Mem\": \"0\",\n            \"ModuleName\": \"空闲机\",\n            \"DeviceClass\": \"\",\n            \"ApplicationName\": \"资源池\",\n            \"OuterIP\": \"\",\n            \"Operator\": \"\",\n            \"SetID\": \"1\",\n            \"ApplicationID\": \"1\",\n            \"CreateTime\": \"2016-03-22 21:07:47\",\n            \"ModuleID\": \"1\"\n        }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/bk/apis/cc/apidoc/get_set_host_list.js",
    "groupTitle": "API_CC"
  },
  {
    "type": "get",
    "url": "/api/c/compapi/cc/get_set_property/",
    "title": "get_set_property",
    "name": "get_set_property",
    "group": "API_CC",
    "version": "1.0.0",
    "description": "<p>获取所有 set 属性</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": {\n        \"SetEnviType\": [\n            {\n                \"Property\": \"2\",\n                \"value\": \"开放4\"\n            }\n        ],\n        \"SetServiceStatus\": [\n            {\n                \"Property\": \"0\",\n                \"value\": \"开放4\"\n            }\n        ]\n    }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/bk/apis/cc/apidoc/get_set_property.js",
    "groupTitle": "API_CC"
  },
  {
    "type": "get",
    "url": "/api/c/compapi/cc/get_sets_by_property/",
    "title": "get_sets_by_property",
    "name": "get_sets_by_property",
    "group": "API_CC",
    "version": "1.0.0",
    "description": "<p>根据 set 属性获取 set</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_id",
            "description": "<p>业务 ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "set_envi_type",
            "description": "<p>Set 环境类型</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "set_service_status",
            "description": "<p>Set 开放状态</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"app_id\": \"1\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": [\n        {\n            \"SetID\": \"1\",\n            \"SetName\": \"空闲机池\"\n        }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/bk/apis/cc/apidoc/get_sets_by_property.js",
    "groupTitle": "API_CC"
  },
  {
    "type": "get",
    "url": "/api/c/compapi/cc/get_topo_tree_by_app_id/",
    "title": "get_topo_tree_by_app_id",
    "name": "get_topo_tree_by_app_id",
    "group": "API_CC",
    "version": "1.0.0",
    "description": "<p>查询业务拓扑树</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_id",
            "description": "<p>业务ID</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"app_id\": \"1\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": {\n        \"ApplicationName\": \"资源池\",\n        \"Type\": \"0\",\n        \"Children\": [\n            {\n                \"Capacity\": \"0\",\n                \"Description\": \"\",\n                \"SetName\": \"空闲机池\",\n                \"Default\": \"1\",\n                \"ServiceStatus\": \"\",\n                \"ChnName\": \"\",\n                \"EnviType\": \"\",\n                \"Children\": [\n                    {\n                        \"LastTime\": \"2016-03-18 13:08:19\",\n                        \"Description\": \"\",\n                        \"Default\": \"1\",\n                        \"ModuleName\": \"空闲机\",\n                        \"Operator\": \"\",\n                        \"HostNum\": 1,\n                        \"SetID\": \"1\",\n                        \"ModuleID\": \"1\",\n                        \"ApplicationID\": \"1\",\n                        \"CreateTime\": \"2016-03-18 13:08:19\",\n                        \"BakOperator\": \"\"\n                    }\n                ],\n                \"Openstatus\": \"\",\n                \"ParentID\": \"0\",\n                \"SetID\": \"1\",\n                \"LastTime\": \"2016-03-18 13:08:19\",\n                \"ApplicationID\": \"1\",\n                \"CreateTime\": \"2016-03-18 13:08:19\"\n            }\n        ],\n        \"Description\": \"\",\n        \"BusinessDeptName\": \"\",\n        \"Creator\": \"公司名称\",\n        \"Default\": \"1\",\n        \"ApplicationID\": \"1\",\n        \"Level\": \"2\",\n        \"Display\": \"1\",\n        \"Source\": \"0\",\n        \"GroupName\": \"\",\n        \"Maintainers\": \"公司名称\",\n        \"CompanyID\": \"0\",\n        \"Owner\": \"公司名称\",\n        \"ProductPm\": \"\",\n        \"LifeCycle\": \"\",\n        \"LastTime\": \"2016-03-18 13:08:19\",\n        \"DeptName\": \"\",\n        \"CreateTime\": \"2016-03-18 13:08:19\"\n    }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/bk/apis/cc/apidoc/get_topo_tree_by_app_id.js",
    "groupTitle": "API_CC"
  },
  {
    "type": "post",
    "url": "/api/c/compapi/cc/update_custom_property/",
    "title": "update_custom_property",
    "name": "update_custom_property",
    "group": "API_CC",
    "version": "1.0.0",
    "description": "<p>修改主机自定义属性</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "app_id",
            "description": "<p>业务ID</p>"
          },
          {
            "group": "Parameter",
            "type": "array",
            "optional": false,
            "field": "host_ids",
            "description": "<p>主机ID</p>"
          },
          {
            "group": "Parameter",
            "type": "dict",
            "optional": false,
            "field": "property",
            "description": "<p>自定义属性</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"app_id\": 1,\n    \"host_ids\": [\"1\"],\n    \"property\": {\n        \"a\": \"test\"\n    }\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": null,\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "result",
            "description": "<p>包含True和False，其中True表示成功，False表示失败</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>返回错误码，其中&quot;00&quot;表示成功，其它表示失败</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>返回数据，成功返回请求数据</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>返回错误消息</p>"
          }
        ]
      }
    },
    "filename": "esb/components/bk/apis/cc/apidoc/update_custom_property.js",
    "groupTitle": "API_CC"
  },
  {
    "type": "post",
    "url": "/api/c/compapi/cc/update_gse_proxy_status/",
    "title": "update_gse_proxy_status",
    "name": "update_gse_proxy_status",
    "group": "API_CC",
    "version": "1.0.0",
    "description": "<p>更新主机gse agent proxy 状态</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "app_id",
            "description": "<p>业务ID</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "plat_id",
            "description": "<p>主机子网ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "ip",
            "description": "<p>主机内网IP</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "status",
            "description": "<p>状态，包含1: 设置gse proxy, 0: 删除gse proxy</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"app_id\": 1,\n    \"plat_id\": 1,\n    \"ip\": \"10.0.0.1\",\n    \"status\": 1\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": null,\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/bk/apis/cc/apidoc/update_gse_proxy_status.js",
    "groupTitle": "API_CC"
  },
  {
    "type": "post",
    "url": "/api/c/compapi/cc/update_host_by_app_id/",
    "title": "update_host_by_app_id",
    "name": "update_host_by_app_id",
    "group": "API_CC",
    "version": "1.0.0",
    "description": "<p>更新主机的gse agent状态</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "app_id",
            "description": "<p>业务ID</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "plat_id",
            "description": "<p>子网ID</p>"
          },
          {
            "group": "Parameter",
            "type": "array",
            "optional": false,
            "field": "proxy_list",
            "description": "<p>Proxy信息，Proxy中每项包含内容见下面参数描述</p>"
          }
        ],
        "proxy_list": [
          {
            "group": "proxy_list",
            "type": "string",
            "optional": false,
            "field": "inner_ip",
            "description": "<p>内网IP</p>"
          },
          {
            "group": "proxy_list",
            "type": "string",
            "optional": true,
            "field": "outer_ip",
            "description": "<p>外网IP</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"app_id\": 2,\n    \"plat_id\": 1,\n    \"proxy_list\": [\n        {\n            \"inner_ip\": \"10.0.0.1\",\n            \"outer_ip\": \"\"\n        }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": null,\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/bk/apis/cc/apidoc/update_host_by_app_id.js",
    "groupTitle": "API_CC"
  },
  {
    "type": "post",
    "url": "/api/c/compapi/cc/update_host_info/",
    "title": "update_host_info",
    "name": "update_host_info",
    "group": "API_CC",
    "version": "1.0.0",
    "description": "<p>更新主机属性</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "app_id",
            "description": "<p>业务ID</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "host_id",
            "description": "<p>主机ID</p>"
          },
          {
            "group": "Parameter",
            "type": "dict",
            "optional": false,
            "field": "std_property",
            "description": "<p>标准属性数据, 数组格式；允许修改的标准属性：HostName, BakOperator, Operator, Description, Source, OSName, DeviceClass, Mem, Cpu, osType</p>"
          },
          {
            "group": "Parameter",
            "type": "dict",
            "optional": false,
            "field": "cus_property",
            "description": "<p>自定义属性</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"app_id\": 1,\n    \"host_id\": 12345,\n    \"std_property\": {\n        \"HostName\": \"hostname\",\n        \"OSName\": \"linux\",\n        \"Cpu\": 4,\n    }\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"data\": null,\n    \"message\": \"\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/bk/apis/cc/apidoc/update_host_info.js",
    "groupTitle": "API_CC"
  },
  {
    "type": "post",
    "url": "/api/c/compapi/cc/update_host_module/",
    "title": "update_host_module",
    "name": "update_host_module",
    "group": "API_CC",
    "version": "1.0.0",
    "description": "<p>修改主机模块</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "app_id",
            "description": "<p>业务ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "ip",
            "description": "<p>内网IP</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "plat_id",
            "description": "<p>子网ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "dst_module_id",
            "description": "<p>目标模块ID，多个以逗号分隔</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"app_id\": 12,\n    \"ip\": \"xxx.xxx.xxx.xxx\",\n    \"plat_id\": 2,\n    \"dst_module_id\": \"1232\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"data\": null,\n    \"message\": \"\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/bk/apis/cc/apidoc/update_host_module.js",
    "groupTitle": "API_CC"
  },
  {
    "type": "post",
    "url": "/api/c/compapi/cc/update_host_plat/",
    "title": "update_host_plat",
    "name": "update_host_plat",
    "group": "API_CC",
    "version": "1.0.0",
    "description": "<p>更新主机云子网</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "app_id",
            "description": "<p>业务ID</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "src_plat_id",
            "description": "<p>主机现子网ID</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "dst_plat_id",
            "description": "<p>变更后的子网ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "ip",
            "description": "<p>主机内网IP</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"app_id\": 2,\n    \"src_plat_id\": 1,\n    \"dst_plat_id\": 2,\n    \"ip\": \"10.0.0.1\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": null,\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/bk/apis/cc/apidoc/update_host_plat.js",
    "groupTitle": "API_CC"
  },
  {
    "type": "post",
    "url": "/api/c/compapi/cc/update_module_property/",
    "title": "update_module_property",
    "name": "update_module_property",
    "group": "API_CC",
    "version": "1.0.0",
    "description": "<p>更新模块属性</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "app_id",
            "description": "<p>业务ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "module_ids",
            "description": "<p>模块ID，多个以半角逗号分隔</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "module_name",
            "description": "<p>模块名称. 模块ID多个时，该值无效</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "operator",
            "description": "<p>维护人</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bak_operator",
            "description": "<p>备份维护人</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "module_type",
            "description": "<p>模块类型，包含1：普通模块 2：数据库</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"app_id\": 1,\n    \"module_ids\": \"4\",\n    \"module_name\": \"test\",\n    \"module_type\": 1\n   }",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": null,\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/bk/apis/cc/apidoc/update_module_property.js",
    "groupTitle": "API_CC"
  },
  {
    "type": "post",
    "url": "/api/c/compapi/cc/update_set_property/",
    "title": "update_set_property",
    "name": "update_set_property",
    "group": "API_CC",
    "version": "1.0.0",
    "description": "<p>更新集群属性</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "app_id",
            "description": "<p>业务ID</p>"
          },
          {
            "group": "Parameter",
            "type": "array",
            "optional": false,
            "field": "set_ids",
            "description": "<p>集群ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "set_name",
            "description": "<p>集群名称</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "chn_name",
            "description": "<p>中文名称</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "group_flag",
            "description": "<p>分组标识</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": true,
            "field": "env_type",
            "description": "<p>环境类型，包含1：测试 2：体验 3：正式，默认为3</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": true,
            "field": "service_status",
            "description": "<p>服务状态，包含0：关闭，1：开启，默认为1</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": true,
            "field": "capacity",
            "description": "<p>设计容量</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "des",
            "description": "<p>描述</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"app_id\": 3,\n    \"set_ids\": [\"1\"],\n    \"set_name\": \"test\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": null,\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "result",
            "description": "<p>包含True和False，其中True表示成功，False表示失败</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>返回错误码，其中&quot;00&quot;表示成功，其它表示失败</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>返回数据，成功返回请求数据</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>返回错误消息</p>"
          }
        ]
      }
    },
    "filename": "esb/components/bk/apis/cc/apidoc/update_set_property.js",
    "groupTitle": "API_CC"
  },
  {
    "type": "post",
    "url": "/api/c/compapi/cc/update_set_service_status/",
    "title": "update_set_service_status",
    "name": "update_set_service_status",
    "group": "API_CC",
    "version": "1.0.0",
    "description": "<p>修改集群服务状态</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "app_id",
            "description": "<p>业务ID</p>"
          },
          {
            "group": "Parameter",
            "type": "array",
            "optional": false,
            "field": "set_ids",
            "description": "<p>集群ID</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "status",
            "description": "<p>服务状态，包含0：关闭 1：开启</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"app_id\": 3,\n    \"set_ids\": [\"1\"],\n    \"status\": 1\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": null,\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "result",
            "description": "<p>包含True和False，其中True表示成功，False表示失败</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>返回错误码，其中&quot;00&quot;表示成功，其它表示失败</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>返回数据，成功返回请求数据</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>返回错误消息</p>"
          }
        ]
      }
    },
    "filename": "esb/components/bk/apis/cc/apidoc/update_set_service_status.js",
    "groupTitle": "API_CC"
  },
  {
    "type": "post",
    "url": "/api/c/compapi/cmsi/noc_notice/",
    "title": "noc_notice",
    "name": "noc_notice",
    "group": "API_CMSI",
    "version": "1.0.0",
    "description": "<p>公共语音通知</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "auto_read_message",
            "description": "<p>自动语音读字信息</p>"
          },
          {
            "group": "Parameter",
            "type": "array",
            "optional": true,
            "field": "user_list_information",
            "description": "<p>待通知的用户列表，自动语音通知列表，若user_list_information、receiver__username同时存在，以user_list_information为准</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "receiver__username",
            "description": "<p>待通知的用户列表，包含用户名，用户需在蓝鲸平台注册，多个以逗号分隔，若user_list_information、receiver__username同时存在，以user_list_information为准</p>"
          }
        ],
        "user_list_information": [
          {
            "group": "user_list_information",
            "type": "string",
            "optional": false,
            "field": "username",
            "description": "<p>被通知人</p>"
          },
          {
            "group": "user_list_information",
            "type": "string",
            "optional": true,
            "field": "mobile_phone",
            "description": "<p>被通知人手机号</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"auto_read_message\": \"This is a test\",\n    \"user_list_information\": [{\n        \"username\": \"admin\",\n        \"mobile_phone\": \"1234567890\",\n    }]\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": {\n        \"instance_id\": \"2662152044\"\n    }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/generic/apis/cmsi/apidoc/noc_notice.js",
    "groupTitle": "API_CMSI"
  },
  {
    "type": "post",
    "url": "/api/c/compapi/cmsi/send_mail/",
    "title": "send_mail",
    "name": "send_mail",
    "group": "API_CMSI",
    "version": "1.0.0",
    "description": "<p>发送邮件</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "receiver",
            "description": "<p>邮件接收者，包含邮件完整地址，多个以逗号分隔，若receiver、receiver__username同时存在，以receiver为准</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "receiver__username",
            "description": "<p>邮件接收者，包含用户名，用户需在蓝鲸平台注册，多个以逗号分隔，若receiver、receiver__username同时存在，以receiver为准</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "sender",
            "description": "<p>发件人</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "title",
            "description": "<p>邮件主题</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "content",
            "description": "<p>邮件内容</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "cc",
            "description": "<p>抄送人，包含邮件完整地址，多个以逗号分隔</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "cc__username",
            "description": "<p>抄送人，包含用户名，用户需在蓝鲸平台注册，多个以逗号分隔，若cc、cc__username同时存在，以cc为准</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "body_format",
            "description": "<p>邮件格式，包含'Html', 'Text'，默认为'Html'</p>"
          },
          {
            "group": "Parameter",
            "type": "bool",
            "optional": true,
            "field": "is_content_base64",
            "description": "<p>邮件内容是否base64编码，默认False，不编码，请使用base64.b64encode方法编码</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"receiver\": \"admin@bking.com\",\n    \"sender\": \"admin@bking.com\",\n    \"title\": \"This is a Test\",\n    \"content\": \"<html>Welcome to Blueking</html>\",\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"邮件发送成功。\",\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/generic/apis/cmsi/apidoc/send_mail.js",
    "groupTitle": "API_CMSI"
  },
  {
    "type": "post",
    "url": "/api/c/compapi/cmsi/send_mp_weixin/",
    "title": "send_mp_weixin",
    "name": "send_mp_weixin",
    "group": "API_CMSI",
    "version": "1.0.0",
    "description": "<p>发送公众号微信消息</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "receiver",
            "description": "<p>微信接收者，包含绑定在指定公众号上的微信用户的 openid，多个以逗号分隔</p>"
          },
          {
            "group": "Parameter",
            "type": "dict",
            "optional": false,
            "field": "data",
            "description": "<p>消息内容</p>"
          }
        ],
        "data": [
          {
            "group": "data",
            "type": "string",
            "optional": false,
            "field": "heading",
            "description": "<p>通知头部文字</p>"
          },
          {
            "group": "data",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>通知文字</p>"
          },
          {
            "group": "data",
            "type": "string",
            "optional": true,
            "field": "date",
            "description": "<p>通知发送时间，默认为当前时间 &quot;YYYY-mm-dd HH:MM&quot;</p>"
          },
          {
            "group": "data",
            "type": "string",
            "optional": true,
            "field": "remark",
            "description": "<p>通知尾部文字</p>"
          },
          {
            "group": "data",
            "type": "bool",
            "optional": true,
            "field": "is_message_base64",
            "description": "<p>通知文字message是否base64编码，默认False，不编码，若编码请使用base64.b64encode方法</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"receiver\": \"xxx\",\n    \"data\": {\n        \"heading\": \"蓝鲸平台通知\",\n        \"message\": \"This 是 a test.\",\n        \"date\": \"2017-02-22 15:36\",\n        \"remark\": \"zhen 是一个测试！\"\n    }\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"微信消息发送成功。\",\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/generic/apis/cmsi/apidoc/send_mp_weixin.js",
    "groupTitle": "API_CMSI"
  },
  {
    "type": "post",
    "url": "/api/c/compapi/cmsi/send_sms/",
    "title": "send_sms",
    "name": "send_sms",
    "group": "API_CMSI",
    "version": "1.0.0",
    "description": "<p>发送短信</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "receiver",
            "description": "<p>短信接收者，包含接收者电话号码，多个以逗号分隔，若receiver、receiver__username同时存在，以receiver为准</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "receiver__username",
            "description": "<p>短信接收者，包含用户名，用户需在蓝鲸平台注册，多个以逗号分隔，若receiver、receiver__username同时存在，以receiver为准</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "content",
            "description": "<p>短信内容</p>"
          },
          {
            "group": "Parameter",
            "type": "bool",
            "optional": true,
            "field": "is_content_base64",
            "description": "<p>消息内容是否base64编码，默认False，不编码，请使用base64.b64encode方法编码</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"receiver\": \"1234567890\",\n    \"receiver__username\": \"admin\",\n    \"content\": \"Welcome to Blueking\",\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"短信发送成功。\",\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/generic/apis/cmsi/apidoc/send_sms.js",
    "groupTitle": "API_CMSI"
  },
  {
    "type": "post",
    "url": "/api/c/compapi/cmsi/send_weixin/",
    "title": "send_weixin",
    "name": "send_weixin",
    "group": "API_CMSI",
    "version": "1.0.0",
    "description": "<p>发送微信消息</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "receiver",
            "description": "<p>微信接收者，包含绑定在指定公众号上的微信用户的 openid 或 企业号上的微信用户的用户ID，多个以逗号分隔 |</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "receiver__username",
            "description": "<p>微信接收者，包含用户名，用户需在蓝鲸平台注册，多个以逗号分隔，若receiver、receiver__username同时存在，以receiver为准</p>"
          },
          {
            "group": "Parameter",
            "type": "dict",
            "optional": false,
            "field": "data",
            "description": "<p>消息内容</p>"
          }
        ],
        "data": [
          {
            "group": "data",
            "type": "string",
            "optional": false,
            "field": "heading",
            "description": "<p>通知头部文字</p>"
          },
          {
            "group": "data",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>通知文字</p>"
          },
          {
            "group": "data",
            "type": "string",
            "optional": true,
            "field": "date",
            "description": "<p>通知发送时间，默认为当前时间 &quot;YYYY-mm-dd HH:MM&quot;</p>"
          },
          {
            "group": "data",
            "type": "string",
            "optional": true,
            "field": "remark",
            "description": "<p>通知尾部文字</p>"
          },
          {
            "group": "data",
            "type": "bool",
            "optional": true,
            "field": "is_message_base64",
            "description": "<p>通知文字message是否base64编码，默认False，不编码，若编码请使用base64.b64encode方法</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"receiver\": \"xxx\",\n    \"data\": {\n        \"heading\": \"蓝鲸平台通知\",\n        \"message\": \"This 是 a test.\",\n        \"date\": \"2017-02-22 15:36\",\n        \"remark\": \"zhen 是一个测试！\"\n    }\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"微信消息发送成功。\",\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/generic/apis/cmsi/apidoc/send_weixin.js",
    "groupTitle": "API_CMSI"
  },
  {
    "type": "post",
    "url": "/api/c/compapi/job/change_cron_status/",
    "title": "change_cron_status",
    "name": "change_cron_status",
    "group": "API_JOB",
    "version": "1.0.0",
    "description": "<p>更新定时作业状态 ，如启动或暂停；操作者必须是业务的创建人或运维</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "app_id",
            "description": "<p>业务ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "status",
            "description": "<p>作业状态，1.启动、2.暂停</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "crontab_task_id",
            "description": "<p>定时任务ID</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"app_id\": 46,\n    \"status\": \"1\",\n    \"crontab_task_id\": 123,\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": {\n        \"crontabTaskId\": 2\n    }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/bk/apis/job/apidoc/change_cron_status.js",
    "groupTitle": "API_JOB"
  },
  {
    "type": "post",
    "url": "/api/c/compapi/job/execute_task/",
    "title": "execute_task",
    "name": "execute_task",
    "group": "API_JOB",
    "version": "1.0.0",
    "description": "<p>根据作业模板ID启动作业</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "app_id",
            "description": "<p>业务ID</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "task_id",
            "description": "<p>作业ID</p>"
          },
          {
            "group": "Parameter",
            "type": "array",
            "optional": false,
            "field": "steps",
            "description": "<p>步骤参数，每项的具体参数见下面描述</p>"
          }
        ],
        "steps": [
          {
            "group": "steps",
            "type": "int",
            "optional": true,
            "field": "scriptTimeout",
            "description": "<p>脚本超时时间</p>"
          },
          {
            "group": "steps",
            "type": "string",
            "optional": true,
            "field": "scriptParam",
            "description": "<p>脚本参数</p>"
          },
          {
            "group": "steps",
            "type": "int",
            "optional": true,
            "field": "scriptId",
            "description": "<p>脚本ID</p>"
          },
          {
            "group": "steps",
            "type": "int",
            "optional": false,
            "field": "stepId",
            "description": "<p>步骤ID，可以只指定某几步执行</p>"
          },
          {
            "group": "steps",
            "type": "string",
            "optional": false,
            "field": "ipList",
            "description": "<p>IP列表格式：子网ID:IP，多个之间逗号，分割，例如：1:10.0.0.1,1:10.0.0.2</p>"
          },
          {
            "group": "steps",
            "type": "string",
            "optional": true,
            "field": "account",
            "description": "<p>执行账户账户名</p>"
          },
          {
            "group": "steps",
            "type": "string",
            "optional": true,
            "field": "fileTargetPath",
            "description": "<p>目标路径</p>"
          },
          {
            "group": "steps",
            "type": "array",
            "optional": true,
            "field": "fileSource",
            "description": "<p>源文件信息，整个参数替换，不支持内部某个变量替换。格式参考下面说明</p>"
          }
        ],
        "fileSource": [
          {
            "group": "fileSource",
            "type": "string",
            "optional": false,
            "field": "file",
            "description": "<p>源文件路径，如：/tmp/t.txt</p>"
          },
          {
            "group": "fileSource",
            "type": "string",
            "optional": false,
            "field": "ipList",
            "description": "<p>源文件服务器地址，格式为：子网ID:IP，多个之间逗号分割</p>"
          },
          {
            "group": "fileSource",
            "type": "string",
            "optional": false,
            "field": "account",
            "description": "<p>源文件机器执行账户账户名</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"app_id\": \"1\",\n    \"task_id\": \"195\",\n    \"steps\": [{\n        \"scriptTimeout\": 1000,\n        \"scriptParam\": \"-a\",\n        \"ipList\": \"1:10.0.0.1,1:10.0.0.2\",\n        \"scriptId\": 203,\n        \"stepId\": 244,\n        \"account\": \"root\",\n    },\n    {\n        \"fileTargetPath\": \"/tmp/[FILESRCIP]/\",\n        \"fileSource\": [{\n            \"file\": \"/tmp/t.txt\",\n            \"ipList\": \"1:10.0.0.3,1:10.0.0.4\",\n            \"account\": \"root\",\n        }],\n        \"ipList\": \"1:10.0.0.1,1:10.0.0.2\",\n        \"stepId\": 246,\n        \"account\": \"root\",\n    }]\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": {\n        \"taskInstanceName\": \"测试\",\n        \"taskInstanceId\": 10000\n    }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/bk/apis/job/apidoc/execute_task.js",
    "groupTitle": "API_JOB"
  },
  {
    "type": "post",
    "url": "/api/c/compapi/job/execute_task_ext/",
    "title": "execute_task_ext",
    "name": "execute_task_ext",
    "group": "API_JOB",
    "version": "1.0.0",
    "description": "<p>启动作业Ext(带全局变量启动)</p> <p>如果全局变量的类型为IP，参数值必须包含groupIds或ipList。没有设置的参数将使用作业模版中的默认值</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "app_id",
            "description": "<p>业务ID</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "task_id",
            "description": "<p>作业ID</p>"
          },
          {
            "group": "Parameter",
            "type": "array",
            "optional": false,
            "field": "global_var",
            "description": "<p>全局变量信息，作业包含的全局变量和类型可以通过接口“查询作业模板详情”(get_task_detail)获取</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"app_id\": \"46\",\n    \"task_id\": \"195\",\n    \"global_var\": [{\n        \"id\": 436,\n        \"ipList\": \"1:10.0.0.1\",\n    },\n    {\n        \"id\": 437,\n        \"value\": \"newValue\",\n    }]\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": {\n        \"taskInstanceName\": \"测试\",\n        \"taskInstanceId\": 10000\n    }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/bk/apis/job/apidoc/execute_task_ext.js",
    "groupTitle": "API_JOB"
  },
  {
    "type": "post",
    "url": "/api/c/compapi/job/fast_execute_script/",
    "title": "fast_execute_script",
    "name": "fast_execute_script",
    "group": "API_JOB",
    "version": "1.0.0",
    "description": "<p>快速执行脚本</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "app_id",
            "description": "<p>业务ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "content",
            "description": "<p>执行脚本步骤的脚本内容，base64编码后的内容</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": true,
            "field": "script_timeout",
            "description": "<p>脚本执行超时时间，范围60~3600，默认1000</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "script_param",
            "description": "<p>脚本执行参数</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "type",
            "description": "<p>脚本类型：1(shell脚本)、2(bat脚本)、3(perl脚本)、4(python脚本)、5(Powershell脚本)</p>"
          },
          {
            "group": "Parameter",
            "type": "array",
            "optional": false,
            "field": "ip_list",
            "description": "<p>目标机器，包含以下内容：</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "account",
            "description": "<p>目标机器账户名</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "is_param_sensitive",
            "description": "<p>是否敏感参数: 1是, 0不是(默认为0)</p>"
          }
        ],
        "ip_list": [
          {
            "group": "ip_list",
            "type": "string",
            "optional": false,
            "field": "ip",
            "description": "<p>IP地址</p>"
          },
          {
            "group": "ip_list",
            "type": "int",
            "optional": false,
            "field": "source",
            "description": "<p>子网ID</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"app_id\": 1,\n    \"content\": \"xxx\",\n    \"ip_list\": [\n        {\n            \"ip\": \"10.0.0.1\",\n            \"source\": 1\n        }\n    ],\n    \"type\": 1,\n    \"account\": \"root\",\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": {\n        \"taskInstanceName\": \"API执行脚本1456715609220\",\n        \"taskInstanceId\": 10000\n    },\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/bk/apis/job/apidoc/fast_execute_script.js",
    "groupTitle": "API_JOB"
  },
  {
    "type": "post",
    "url": "/api/c/compapi/job/fast_push_file/",
    "title": "fast_push_file",
    "name": "fast_push_file",
    "group": "API_JOB",
    "version": "1.0.0",
    "description": "<p>快速分发文件</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "app_id",
            "description": "<p>业务ID</p>"
          },
          {
            "group": "Parameter",
            "type": "array",
            "optional": false,
            "field": "file_source",
            "description": "<p>源文件信息，包含内容见下面参数描述</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "file_target_path",
            "description": "<p>目标路径</p>"
          },
          {
            "group": "Parameter",
            "type": "array",
            "optional": false,
            "field": "ip_list",
            "description": "<p>目标机器，包含内容见下面参数描述</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": true,
            "field": "target_app_id",
            "description": "<p>目标机器所属业务，全业务需要</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "account",
            "description": "<p>目标机器账户名</p>"
          }
        ],
        "file_source": [
          {
            "group": "file_source",
            "type": "int",
            "optional": true,
            "field": "source_app_id",
            "description": "<p>为源机器所属业务，全业务需要</p>"
          },
          {
            "group": "file_source",
            "type": "string",
            "optional": false,
            "field": "file",
            "description": "<p>源文件路径</p>"
          },
          {
            "group": "file_source",
            "type": "array",
            "optional": false,
            "field": "ip_list",
            "description": "<p>IP信息，其中包含ip（源文件服务器IP）和source（IP的子网ID）</p>"
          },
          {
            "group": "file_source",
            "type": "string",
            "optional": false,
            "field": "account",
            "description": "<p>源文件服务器账户名</p>"
          }
        ],
        "ip_list": [
          {
            "group": "ip_list",
            "type": "string",
            "optional": false,
            "field": "ip",
            "description": "<p>IP地址</p>"
          },
          {
            "group": "ip_list",
            "type": "int",
            "optional": false,
            "field": "source",
            "description": "<p>子网ID</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"app_id\": \"46\",\n    \"file_source\": [\n        {\n            \"account\": \"root\",\n            \"ip_list\": [\n                {\n                    \"ip\": \"10.0.0.1\",\n                    \"source\": 1\n                }\n            ],\n            \"file\": \"/tmp/tmp.txt\"\n        }\n    ],\n    \"account\": \"root\",\n    \"file_target_path\": \"/tmp\",\n    \"ip_list\": [\n        {\n            \"ip\": \"10.0.0.2\",\n            \"source\": 1\n        }\n    ],\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": {\n        \"taskInstanceName\": \"API分发文件1456316951760\",\n        \"taskInstanceId\": 10000\n    }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/bk/apis/job/apidoc/fast_push_file.js",
    "groupTitle": "API_JOB"
  },
  {
    "type": "post",
    "url": "/api/c/compapi/job/get_agent_status/",
    "title": "get_agent_status",
    "name": "get_agent_status",
    "group": "API_JOB",
    "version": "1.0.0",
    "description": "<p>查询Agent状态</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "app_id",
            "description": "<p>业务ID</p>"
          },
          {
            "group": "Parameter",
            "type": "array",
            "optional": false,
            "field": "ip_infos",
            "description": "<p>IP信息，每项条目包含信息见下面参数描述</p>"
          }
        ],
        "ip_infos": [
          {
            "group": "ip_infos",
            "type": "string",
            "optional": false,
            "field": "ip",
            "description": "<p>IP地址</p>"
          },
          {
            "group": "ip_infos",
            "type": "int",
            "optional": false,
            "field": "plat_id",
            "description": "<p>子网ID</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"app_id\": 1,\n    \"ip_infos\": [\n        {\n            \"ip\": \"10.0.0.1\",\n            \"plat_id\": 1,\n        }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": [\n        {\n            \"status\": 1,\n            \"ip\": \"10.0.0.1\"\n        }\n    ]\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "result",
            "description": "<p>包含True和False，其中True表示成功，False表示失败</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>返回错误码，其中&quot;00&quot;表示成功，其它表示失败</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>返回错误消息</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>返回数据，成功返回请求数据</p>"
          }
        ],
        "data": [
          {
            "group": "data",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>主机Agent状态码，1.正常; 0.异常</p>"
          }
        ]
      }
    },
    "filename": "esb/components/bk/apis/job/apidoc/get_agent_status.js",
    "groupTitle": "API_JOB"
  },
  {
    "type": "get",
    "url": "/api/c/compapi/job/get_cron/",
    "title": "get_cron",
    "name": "get_cron",
    "group": "API_JOB",
    "version": "1.0.0",
    "description": "<p>查询业务下定时作业信息</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "app_id",
            "description": "<p>业务ID</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": true,
            "field": "crontab_task_id",
            "description": "<p>定时任务ID，如果存在，则忽略其他筛选条件，只查询这个指定的作业信息</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "name",
            "description": "<p>定时作业的名称</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "status",
            "description": "<p>作业的状态：1.已启动、2.已暂停、3.已完成</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "creater",
            "description": "<p>作业创建人</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "last_modify_user",
            "description": "<p>最后修改人</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "create_time_start",
            "description": "<p>创建起始时间，YYYY-MM-DD格式</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "create_time_end",
            "description": "<p>创建结束时间，YYYY-MM-DD格式</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "last_modify_time_start",
            "description": "<p>最后修改起始时间，YYYY-MM-DD格式</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "last_modify_time_end",
            "description": "<p>最后修改结束时间，YYYY-MM-DD格式</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"app_id\": 46,\n    \"crontab_task_id\": 123456,\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": [\n        {\n            \"status\": 1,\n            \"lastModifyUser\": \"admin\",\n            \"des\": \"\",\n            \"createTime\": \"2017-03-01 19:45:51\",\n            \"creater\": \"admin\",\n            \"lastModifyTime\": \"2017-03-01 20:01:08\",\n            \"cronExpression\": \"2 0/5 * * * ?\",\n            \"taskId\": 5,\n            \"appId\": 3,\n            \"taskName\": \"de\",\n            \"type\": 0,\n            \"id\": 2,\n            \"name\": \"hello test2 a\"\n        }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/bk/apis/job/apidoc/get_cron.js",
    "groupTitle": "API_JOB"
  },
  {
    "type": "get",
    "url": "/api/c/compapi/job/get_task/",
    "title": "get_task",
    "name": "get_task",
    "group": "API_JOB",
    "version": "1.0.0",
    "description": "<p>查询作业模板</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "app_id",
            "description": "<p>业务ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "name",
            "description": "<p>作业名称</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "creater",
            "description": "<p>创建人QQ号</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "last_modify_user",
            "description": "<p>最后修改人QQ号</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "create_time_start",
            "description": "<p>创建起始时间，YYYY-MM-DD格式</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "create_time_end",
            "description": "<p>创建结束时间 YYYY-MM-DD格式</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "last_modify_time_start",
            "description": "<p>最后修改起始时间 YYYY-MM-DD格式</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "last_modify_time_end",
            "description": "<p>最后修改结束时间YYYY-MM-DD格式</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"app_id\": 46,\n    \"name\": \"hotest\",\n    \"creater\": \"12345\",\n    \"last_modify_user\": \"12345\",\n    \"create_time_start\": \"2016-02-22 23:12:34\",\n    \"create_time_end\": \"2016-02-22 23:12:34\",\n    \"last_modify_time_start\": \"2016-02-22 23:12:34\",\n    \"last_modify_time_end\": \"2016-02-22 23:12:34\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": [\n        {\n            \"account\": \"\",\n            \"name\": \"hotest\",\n            \"creater\": \"12345\",\n            \"stepNum\": 1,\n            \"serverSetId\": 0,\n            \"nmStepBeanList\": [],\n            \"lastModifyTime\": \"2016-02-22 23:12:34\",\n            \"appId\": 46,\n            \"id\": 190,\n            \"ipList\": \"\",\n            \"createTime\": \"2016-02-22 23:12:34\",\n            \"lastModifyUser\": \"12345\"\n        },\n    ],\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/bk/apis/job/apidoc/get_task.js",
    "groupTitle": "API_JOB"
  },
  {
    "type": "get",
    "url": "/api/c/compapi/job/get_task_detail/",
    "title": "get_task_detail",
    "name": "get_task_detail",
    "group": "API_JOB",
    "version": "1.0.0",
    "description": "<p>查询作业模板详情</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "app_id",
            "description": "<p>业务ID</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "task_id",
            "description": "<p>作业模板ID</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"app_id\": 1,\n    \"task_id\": 192\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": {\n        \"account\": \"\",\n        \"name\": \"demo演示\",\n        \"creater\": \"12345\",\n        \"stepNum\": 0,\n        \"serverSetId\": 0,\n        \"nmStepBeanList\": [\n            {\n                \"ccScriptName\": \"\",\n                \"text\": \"\",\n                \"serverSetId\": 0,\n                \"stepId\": 524,\n                \"ipList\": \"1:10.0.0.1\",\n                \"serverSetName\": \"\",\n                \"ccScriptId\": 0,\n                \"fileSpeedLimit\": 0,\n                \"scriptTimeout\": 1000,\n                \"scriptParam\": \"\",\n                \"scriptContent\": \"xxx\",\n                \"lastModifyTime\": \"\",\n                \"fileSource\": \"\",\n                \"type\": 1,\n                \"scriptType\": 4,\n                \"lastModifyUser\": \"\",\n                \"blockName\": \"step1\",\n                \"paramType\": 1,\n                \"fileTargetPath\": \"\",\n                \"scriptId\": 523,\n                \"taskId\": 195,\n                \"appId\": 46,\n                \"isPause\": 0,\n                \"ord\": 1,\n                \"createTime\": \"2016-02-24 21:50:31\",\n                \"account\": \"root\",\n                \"name\": \"作业执行步骤1\",\n                \"companyId\": 15,\n                \"creater\": \"12345\",\n                \"ccScriptParam\": \"\",\n                \"blockOrd\": 1\n            },\n        ],\n        \"lastModifyTime\": \"2016-02-26 16:15:43\",\n        \"appId\": 46,\n        \"id\": 195,\n        \"ipList\": \"\",\n        \"createTime\": \"2016-02-24 21:50:31\",\n        \"lastModifyUser\": \"12345\",\n        \"globalVarList\":[\n            {\n                \"id\": 11,\n                \"type\": 1,\n                \"name\": \"varA1\",\n                \"defaultValue\": \"valueisMe\",\n                \"appId\": 3,\n                \"taskId\": 13,\n                \"description\": \"字符串全局变量\",\n                \"stepIds\": \"1\",\n                \"ipListStatus\": [],\n                \"ccGroupInfoList\": []\n            },\n            {\n                \"id\": 12,\n                \"type\": 2,\n                \"name\": \"id-201782815057397\",\n                \"ipList\": \"1:10.0.0.1,1:10.0.0.2\",\n                \"serverSetId\": \"\",\n                \"ccServerSetId\": \"\",\n                \"appId\": 3,\n                \"taskId\": 13,\n                \"description\": \"IP全局变量\",\n                \"stepIds\": \"13\",\n                \"ipListStatus\": [\n                    {\n                        \"ip\": \"10.0.0.1\",\n                        \"source\": 1,\n                        \"alived\": 0,\n                        \"valid\": 1,\n                        \"name\": \"host\",\n                        \"displayIp\": \"10.0.0.1\"\n                    },\n                    {\n                        \"ip\": \"10.0.0.2\",\n                        \"source\": 1,\n                        \"alived\": 0,\n                        \"valid\": 1,\n                        \"name\": \"host\",\n                        \"displayIp\": \"10.0.0.2\"\n                    }\n                ],\n                \"ccGroupInfoList\": []\n            }\n        ]\n    },\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/bk/apis/job/apidoc/get_task_detail.js",
    "groupTitle": "API_JOB"
  },
  {
    "type": "get",
    "url": "/api/c/compapi/job/get_task_ip_log/",
    "title": "get_task_ip_log",
    "name": "get_task_ip_log",
    "group": "API_JOB",
    "version": "1.0.0",
    "description": "<p>根据作业实例ID查询作业执行日志</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "task_instance_id",
            "description": "<p>作业实例ID</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"task_instance_id\": \"100932\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": [\n        {\n            \"isFinished\": true,\n            \"stepInstanceName\": \"读取文件\",\n            \"stepAnalyseResult\": [\n                {\n                    \"count\": \"1\",\n                    \"resultType\": 9,\n                    \"ipLogContent\": [\n                        {\n                            \"status\": 9,\n                            \"totalTime\": 0.24799999594688416,\n                            \"stepInstanceId\": 156965,\n                            \"isJobIp\": 1,\n                            \"ip\": \"xxx.xxx.xxx.xxx\",\n                            \"errCode\": 0,\n                            \"source\": 1,\n                            \"logContent\": \"QlpoOTFBWSZTWekFHDQAGcHf+XMyQA...\",\n                            \"startTime\": \"2016-06-12 14:29:39\",\n                            \"retryCount\": 0,\n                            \"endTime\": \"2016-06-12 14:29:39\",\n                            \"exitCode\": 0\n                        }\n                    ],\n                    \"resultTypeText\": \"执行成功\"\n                }\n            ],\n            \"stepInstanceId\": 156965,\n            \"stepInstanceStatus\": 3\n        }\n    ]\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "result",
            "description": "<p>包含True和False，其中True表示成功，False表示失败</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>返回错误码，其中&quot;00&quot;表示成功，其它表示失败</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>返回错误消息</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>返回数据，成功返回请求数据</p>"
          }
        ],
        "ipLogContent": [
          {
            "group": "ipLogContent",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>主机任务状态码， 1.Agent异常; 3.上次已成功; 5.等待执行; 7.正在执行; 9.执行成功; 11.任务失败; 12.任务下发失败; 13.任务超时; 15.任务日志错误; 101.脚本执行失败; 102.脚本执行超时; 103.脚本执行被终止; 104.脚本返回码非零; 202.文件传输失败; 203.源文件不存在; 310.Agent异常; 311.用户名不存在; 320.文件获取失败; 321.文件超出限制; 329.文件传输错误; 399.任务执行出错</p>"
          }
        ]
      }
    },
    "filename": "esb/components/bk/apis/job/apidoc/get_task_ip_log.js",
    "groupTitle": "API_JOB"
  },
  {
    "type": "get",
    "url": "/api/c/compapi/job/get_task_result/",
    "title": "get_task_result",
    "name": "get_task_result",
    "group": "API_JOB",
    "version": "1.0.0",
    "description": "<p>根据作业实例 ID 查询作业执行状态</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "task_instance_id",
            "description": "<p>作业实例ID</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"task_instance_id\": \"65\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": {\n        \"isFinished\": true,\n        \"taskInstance\": {\n            \"status\": 3,\n            \"totalTime\": 0,\n            \"endTime\": \"2015-09-09 15:05:32\",\n            \"startTime\": \"2015-09-09 15:05:32\",\n            \"operationList\": [],\n            \"startWay\": 1,\n            \"taskId\": -1,\n            \"appId\": 1,\n            \"operator\": \"2797261603\",\n            \"taskInstanceId\": 65,\n            \"currentStepId\": 75,\n            \"createTime\": \"2015-09-09 15:05:31\",\n            \"name\": \"执行脚本-20158915516182\"\n        },\n        \"blocks\": [\n            {\n                \"type\": 1,\n                \"stepInstances\": [\n                    {\n                        \"totalTime\": 0,\n                        \"failIPNum\": 0,\n                        \"text\": null,\n                        \"successIPNum\": 2,\n                        \"isPause\": 0,\n                        \"operator\": \"2797261603\",\n                        \"stepInstanceId\": 75,\n                        \"taskInstanceId\": 65,\n                        \"type\": 1,\n                        \"badIPNum\": 0,\n                        \"status\": 3,\n                        \"stepId\": -1,\n                        \"blockName\": \"执行脚本-20158915516182\",\n                        \"operationList\": [],\n                        \"startTime\": \"2015-09-09 15:05:32\",\n                        \"appId\": 1,\n                        \"totalIPNum\": 2,\n                        \"ord\": 1,\n                        \"createTime\": \"2015-09-09 15:05:31\",\n                        \"name\": \"执行脚本-20158915516182\",\n                        \"blockOrd\": 1,\n                        \"retryCount\": 0,\n                        \"endTime\": \"2015-09-09 15:05:32\",\n                        \"runIPNum\": 2\n                    }\n                ],\n                \"blockOrd\": 1,\n                \"blockName\": \"执行脚本-20158915516182\"\n            }\n        ]\n    },\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "result",
            "description": "<p>包含True和False，其中True表示成功，False表示失败</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>返回错误码，其中&quot;00&quot;表示成功，其它表示失败</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>返回错误消息</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>返回数据，成功返回请求数据</p>"
          }
        ],
        "data": [
          {
            "group": "data",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>任务状态码， 1.未执行; 2.正在执行; 3.执行成功; 4.执行失败; 5.跳过; 6.忽略错误; 7.等待用户; 8.手动结束; 9.状态异常; 10.步骤强制终止中; 11.步骤强制终止成功; 12.步骤强制终止失败</p>"
          }
        ]
      }
    },
    "filename": "esb/components/bk/apis/job/apidoc/get_task_result.js",
    "groupTitle": "API_JOB"
  },
  {
    "type": "post",
    "url": "/api/c/compapi/job/save_cron/",
    "title": "save_cron",
    "name": "save_cron",
    "group": "API_JOB",
    "version": "1.0.0",
    "description": "<p>新建或保存定时作业 ；新建定时作业，作业状态默认为暂停；操作者必须是业务的创建人或运维</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_code",
            "description": "<p>应用ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "app_secret",
            "description": "<p>应用TOKEN，可以通过 蓝鲸智云开发者中心 -&gt; 点击应用ID -&gt; 基本信息 获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "bk_token",
            "description": "<p>当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>当前用户用户名，白名单中app可使用</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "app_id",
            "description": "<p>业务ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>定时作业的名称</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "task_id",
            "description": "<p>要定时执行的作业的作业ID</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": true,
            "field": "crontab_task_id",
            "description": "<p>定时任务ID，更新定时任务时，必须传这个值</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "cron_expression",
            "description": "<p>定时任务crontab的定时规则，各自段含义为：秒 分 时 日 月 周 年（可选），如: 0 0/5 * * * ?  表示每5分钟执行一次</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"app_code\": \"esb_test\",\n    \"app_secret\": \"xxx\",\n    \"bk_token\": \"xxx\",\n    \"app_id\": 46,\n    \"name\": \"hotest\",\n    \"task_id\": 123,\n    \"cron_expression\": \"0 0/5 * * * ?\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    \"result\": true,\n    \"code\": \"00\",\n    \"message\": \"\",\n    \"data\": {\n        \"crontabTaskId\": 2\n    }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "esb/components/bk/apis/job/apidoc/save_cron.js",
    "groupTitle": "API_JOB"
  }
] });
