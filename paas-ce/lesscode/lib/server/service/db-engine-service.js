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
// 用于 lesscode 操作db
const mysql = require('mysql2')
const util = require('../util')
const fs = require('fs')

class DBEngineService {
    options = {}
    pool = {}

    constructor (options) {
        this.options = {
            ...options,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            charset: 'utf8'
        }
    }

    /**
     * @returns pool promise
     */
    getPoolPromise () {
        this.close()
        this.pool = mysql.createPool(this.options)
        return this.pool.promise()
    }

    /**
     * 关闭连接池
     */
    close () {
        if (!this.pool._closed) this.pool.end && this.pool.end()
    }

    /**
     * 执行单条sql
     * @param sql 传入sql会执行sql字符串
     * @returns 执行结果 Array
     */
    async execSql (sql) {
        const pool = this.getPoolPromise()
        const [res] = await pool.query(sql)
        this.close()
        return res
    }

    /**
     * 执行多条sql语句
     * @param sqls
     */
    async execMultSql (sqls) {
        // build sql array
        const sqlArr = util.splitSql(sqls)
        // connect and exec sql
        const pool = this.getPoolPromise()
        const res = []
        for (const sql of sqlArr) {
            const [execResult] = await pool.query(sql)
            res.push(execResult)
        }
        this.close()
        return res
    }

    /**
     * 执行 sql 文件
     * @param sqlPath
     */
    async execSqlFile (sqlPath) {
        // build sql array
        const sqlStr = fs.readFileSync(sqlPath)
        const sqlArr = util.splitSql(sqlStr)
        // connect and exec sql
        const pool = this.getPoolPromise()
        const res = []
        for (const sql of sqlArr) {
            const [execResult] = await pool.query(sql)
            res.push(execResult)
        }
        this.close()
        return res
    }

    /**
     * 通过函数的方式直接操作db，cb传入连接池
     * @param cb 回调函数
     */
    async execCb (cb) {
        const pool = this.getPoolPromise()
        await cb(pool)
        this.close()
    }
}

export default DBEngineService
