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

import { getRepository, In } from 'typeorm'
import User from './entities/user'
import UserProjectRole from './entities/user-project-role'
import Role from './entities/role'
import Perm from './entities/perm'
import RolePerm from './entities/role-perm'

module.exports = {
    findOneByBk (bkUserName) {
        return getRepository(User).findOne({ username: bkUserName })
    },

    // 创建用户
    addUser (data) {
        const repository = getRepository(User)
        const user = repository.create(data)
        return repository.save(user)
    },

    // 获取成员列表
    getMember (projectId, username) {
        return getRepository(UserProjectRole).createQueryBuilder('user_project_role')
            .leftJoin(Role, 'role', 'role.id = user_project_role.roleId AND role.deleteFlag = 0')
            .leftJoin(User, 'user', 'user.id = user_project_role.userId AND user.deleteFlag = 0')
            .where('user_project_role.projectId = :projectId AND user_project_role.deleteFlag = :deleteFlag AND user.username like :username', { projectId, deleteFlag: 0, username: `%${username}%` })
            .select('user.username AS username, user.id AS userId, user_project_role.*')
            .getRawMany()
    },

    // 获取当前用户在当前项目下的权限
    async getMemberPermInfo (projectId, userId) {
        return getRepository(User).createQueryBuilder('user')
            .leftJoinAndSelect(UserProjectRole, 'userProjectRole', 'user.id = userProjectRole.userId')
            .leftJoinAndSelect(Role, 'role', 'role.id = userProjectRole.roleId')
            .leftJoinAndSelect(RolePerm, 'rolePerm', 'rolePerm.roleId = role.id')
            .leftJoinAndSelect(Perm, 'perm', 'perm.id = rolePerm.permId')
            .where('user.id = :userId AND user.deleteFlag = 0 AND userProjectRole.deleteFlag = 0 AND role.deleteFlag = 0 AND rolePerm.deleteFlag = 0 AND perm.deleteFlag = 0', { userId })
            .andWhere('userProjectRole.projectId = :projectId', { projectId })
            .select('perm.permCode AS permCode, role.roleName AS roleName, role.id AS roleId')
            .getRawMany()
    },

    // 添加成员
    async addMembers (postData) {
        const userRepository = getRepository(User)
        const users = postData.users || []
        const exitUsers = await userRepository.find({ username: In(users) })
        const notExistUser = []
        users.forEach((username) => {
            const index = exitUsers.findIndex(x => x.username === username)
            if (index <= -1) notExistUser.push({ username })
        })
        const newUsers = userRepository.create(notExistUser)
        const userData = await userRepository.save(newUsers)

        const roleId = postData.roleId || 2
        const projectId = postData.projectId
        const roleList = [...exitUsers, ...userData].map((user) => {
            return {
                userId: user.id,
                roleId,
                projectId,
                deleteFlag: 0
            }
        })
        const roleUserRepository = getRepository(UserProjectRole)
        const exitProjectRoles = await roleUserRepository.find({ projectId })
        const exitRoles = []
        const notExitRoles = []
        roleList.forEach((role) => {
            const exitRole = exitProjectRoles.find((item) => item.userId === role.userId)
            if (exitRole) {
                Object.assign(exitRole, role)
                exitRoles.push(exitRole)
            } else {
                notExitRoles.push(role)
            }
        })
        // 不存在的关系就新建
        let newRoles = []
        if (notExitRoles.length > 0) newRoles = roleUserRepository.create(notExitRoles)
        await roleUserRepository.save([...newRoles, ...exitRoles])
    },

    // 修改成员
    async editMember (member) {
        const roleUserRepository = getRepository(UserProjectRole)
        const oldMember = await roleUserRepository.find({ id: member.id })
        Object.assign(oldMember, member)
        await roleUserRepository.save(oldMember)
    },

    // 删除成员
    async deleteMember (id) {
        const roleUserRepository = getRepository(UserProjectRole)
        const roleUser = await roleUserRepository.findOne({ where: { id } })
        roleUser.deleteFlag = 1
        await roleUserRepository.save(roleUser)
    },

    // 批量删除成员
    async deleteMultipleMember (ids) {
        const roleUserRepository = getRepository(UserProjectRole)
        const roleUser = await roleUserRepository.find({ id: In(ids) })
        roleUser.forEach(roleUserItem => {
            roleUserItem.deleteFlag = 1
        })
        await roleUserRepository.save(roleUser)
    }
}
