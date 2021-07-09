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
 import healthModel from '../model/health'

 const Health = {
     async check (ctx) {
         const bkTicket = ctx.cookies.get('bk_ticket')
         try {
            const bkRepoRes = await healthModel.checkBkRepo()
            const dbRes = await healthModel.checkDb()
 
             const checkList = [
                { type: 'bkRepo', code: bkRepoRes.code, result: bkRepoRes.result, message: bkRepoRes.message },
                { type: 'db', code: dbRes.code, result: dbRes.result, message: dbRes.message }
             ]
             ctx.send({
                 code: 0,
                 message: '',
                 data: checkList
             })
         } catch (err) {
             ctx.throwError({
                 message: err.message || err
             })
         }
     }
 }
 
 module.exports = Health
 