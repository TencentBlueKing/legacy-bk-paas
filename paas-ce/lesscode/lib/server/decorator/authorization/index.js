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
import {
    LCDataService,
    TABLE_FILE_NAME
} from '../../service/data-service'
import projectModel from '../../model/project'

/**
 * 权限校验
 * @param {*} perm string | string[] 传递需要校验的权限code
 */
export const Authorization = (perm) => {
    return (target, propertyKey, descriptor) => {
        const originValue = descriptor.value
        descriptor.value = async (ctx) => {
            try {
                const needPerms = Array.isArray(perm) ? perm : [perm]
                if (needPerms.length) {
                    const userPermsInfo = ctx.session.permsInfo
                    const exitPermCodes = userPermsInfo.permCodes || []
                    const noPermission = needPerms.some(perm => !exitPermCodes.includes(perm))
                    if (noPermission) throw new global.BusinessError('暂无执行该操作权限，请联系应用管理员开通权限后重试', 403, 403)
                }

                return await originValue.apply(this, [ctx])
            } catch (error) {
                throw error
            }
        }
    }
}

/**
 * 删除权限校验
 * 权限通过情况：1. 拥有删除权限 2. 是该资源的创建者
 * @param {*} options { perm: string | string[], tableName: string, getId: Function } 分别表示：权限code、删除数据的表名、获取id的方法
 */
export const DeleteAuthorization = ({ perm, tableName, getId = ctx => ctx.request.query.id }) => {
    const isErrorParameter = [perm, tableName, getId].some(x => ['', undefined, null].includes(x))
    if (isErrorParameter) throw Error('DeleteAuthorization Decorator is used, but the parameter is invalid')

    return (target, propertyKey, descriptor) => {
        const originValue = descriptor.value
        descriptor.value = async (ctx) => {
            try {
                const needPerms = Array.isArray(perm) ? perm : [perm]
                if (needPerms.length) {
                    // 判断是否拥有删除权限
                    const userPermsInfo = ctx.session.permsInfo || {}
                    const exitPermCodes = userPermsInfo.permCodes || []
                    const noPermission = needPerms.some(perm => !exitPermCodes.includes(perm))
                    // 判断是不是该资源的创建者
                    const record = await LCDataService.findOne(tableName, { id: getId(ctx), deleteFlag: 0 }) || {}
                    const userInfo = ctx.session.userInfo
                    const notCreateUser = record.createUser !== userInfo.username

                    if (noPermission && notCreateUser) throw new global.BusinessError('暂无执行该操作权限，请联系应用管理员开通权限后重试', 403, 403)
                }

                return await originValue.apply(this, [ctx])
            } catch (error) {
                throw error
            }
        }
    }
}

/**
 * 判断用户是否有该项目权限
 * @param {*} options { getId: Function } 获取 projectId 的方法
 */
export const ProjectAuthorization = ({ getId = ctx => ctx.request.query.projectId }) => {
    return (target, propertyKey, descriptor) => {
        const originValue = descriptor.value
        descriptor.value = async (ctx) => {
            try {
                const projectId = getId(ctx)
                const userInfo = ctx.session.userInfo
                const project = await projectModel.findUserProjectById(userInfo.id, projectId)
                if (!project) {
                    throw new global.BusinessError(`您没有应用[ID:${projectId}]的权限，请联系管理员授权后再试`, 403, 403)
                } else {
                    return await originValue.apply(this, [ctx])
                }
            } catch (error) {
                throw error
            }
        }
    }
}

/**
 * 判断用户是否是平台管理员
 */
export const PlatformAdminAuthorization = () => {
    return (target, propertyKey, descriptor) => {
        const originValue = descriptor.value
        descriptor.value = async (ctx) => {
            try {
                const userInfo = ctx.session.userInfo || {}
                const isPlatformAdmin = await LCDataService.has(TABLE_FILE_NAME.PLATFORM_ADMIN, {
                    username: userInfo.username
                })
                if (!isPlatformAdmin) {
                    throw new global.BusinessError('您不是平台管理员，请联系管理员授权后再试', 403, 403)
                } else {
                    return await originValue.apply(this, [ctx])
                }
            } catch (error) {
                throw error
            }
        }
    }
}
