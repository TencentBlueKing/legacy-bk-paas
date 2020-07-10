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

import { getRepository } from "typeorm"

import { perm } from "./entities/perm"
import { role } from "./entities/role"
import { r_role_perm } from "./entities/role-perm"
import { user } from "./entities/user"
import { r_user_project_role } from "./entities/user-project-role"

module.exports = {
    getUserPerms (projectId, username) {
        return getRepository(user).createQueryBuilder('user')
            .leftJoinAndSelect(r_user_project_role, 'userProjectRole', 'user.id = userProjectRole.userId')
            .leftJoinAndSelect(role, 'role', 'role.id = userProjectRole.roleId')
            .leftJoinAndSelect(r_role_perm, 'rolePerm', 'rolePerm.roleId = role.id')
            .leftJoinAndSelect(perm, 'perm', 'perm.id = rolePerm.permId')
            .where('user.username = :username', { username })
            .andWhere('userProjectRole.projectId = :projectId', { projectId })
            .select('perm.permCode', 'permCode')
            .getRawMany()
    },

    async existingPermission (projectId, username, permCode) {
        const res = await getRepository(user).createQueryBuilder('user')
            .leftJoinAndSelect(r_user_project_role, 'userProjectRole', 'user.id = userProjectRole.userId')
            .leftJoinAndSelect(role, 'role', 'role.id = userProjectRole.roleId')
            .leftJoinAndSelect(r_role_perm, 'rolePerm', 'rolePerm.roleId = role.id')
            .leftJoinAndSelect(perm, 'perm', 'perm.id = rolePerm.permId')
            .where('user.username = :username', { username })
            .andWhere('userProjectRole.projectId = :projectId', { projectId })
            .andWhere('perm.permCode = :permCode', { permCode })
            .getRawMany()
        return res.length > 0
    }
}
