import { PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, Column, BeforeInsert, BeforeUpdate } from 'typeorm'
import { RequestContext } from '../../middleware/request-context'

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

    // 插入数据写入用户名
    @BeforeInsert()
    beforeInsert () {
        const currentUser = RequestContext.getCurrentUser() || {}
        this.createUser = currentUser.username || this.createUser
        this.updateUser = currentUser.username || this.updateUser
        this.createTime = new Date()
        this.updateTime = new Date()
    }

    // 更新数据写入用户名
    @BeforeUpdate()
    updateUpdateUser () {
        const currentUser = RequestContext.getCurrentUser() || {}
        this.updateUser = currentUser.username || this.updateUser
        this.updateTime = new Date()
    }
}
