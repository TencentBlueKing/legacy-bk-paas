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

import { PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, Column, BeforeInsert, BeforeUpdate } from 'typeorm'

export const curLoginUsername = {}

export default class Base {
    // 自动增量值自动生成ID
    @PrimaryGeneratedColumn()
    id

    // 更新时间，自动生成
    @UpdateDateColumn()
    updateTime

    // 创造时间，自动生成
    @CreateDateColumn()
    createTime

    // 创造该记录用户，自动生成
    @Column({ type: 'varchar', length: 255 })
    createUser

    // 更新该记录用户，自动生成
    @Column({ type: 'varchar', length: 255 })
    updateUser

    // 是否删除，默认值为0，表示未删除，1为已删除
    @Column({ type: 'int' })
    deleteFlag

    // 插入数据写入用户名
    // tofix: 登陆以后，拿到登陆用户名取代admin
    @BeforeInsert()
    beforeInsert () {
        console.log('beforeInsert curLoginUsername', curLoginUsername)
        this.createUser = 'admin'
        this.updateUser = 'admin'
        this.updateTime = new Date()
    }

    // 更新数据写入用户名
    // tofix: 登陆以后，拿到登陆用户名取代admin
    @BeforeUpdate()
    updateUpdateUser () {
        console.log('updateUpdateUser curLoginUsername', curLoginUsername)
        this.updateUser = 'admin'
    }
}
