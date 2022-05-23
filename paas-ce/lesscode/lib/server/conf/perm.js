/**
 * Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 * Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
 * Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://opensource.org/licenses/MIT
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */
/**
 * 接口权限配置
 * permCodes: 需要的权限列表
 * message: 不满足权限给出的提示，默认值：暂无执行该操作权限，请联系项目管理员开通权限后重试
 */
module.exports = {
    'DELETE-/api/componentCategory/delete': {
        permCodes: ['delete_component_category'],
        message: '删除自定义组件的分类需要删除权限，请联系应用管理员开通权限后重试'
    },
    'DELETE-/api/component/delete': {
        permCodes: ['delete_component']
    },
    'DELETE-/api/function/deleteFuncGroup': {
        permCodes: ['delete_func_group']
    },
    'DELETE-/api/function/deleteFunction': {
        permCodes: ['delete_func']
    },
    'DELETE-/api/page/delete': {
        permCodes: ['delete_page']
    },
    'DELETE-/api/project/delete': {
        permCodes: ['delete_project']
    },
    'DELETE-/api/user/deleteMember': {
        permCodes: ['delete_member']
    },
    'POST-/api/user/addMembers': {
        permCodes: ['add_member']
    },
    'PUT-/api/user/editMember': {
        permCodes: ['edit_member']
    },
    'DELETE-/api/variable/deleteVariable': {
        permCodes: ['delete_variable']
    }
}
