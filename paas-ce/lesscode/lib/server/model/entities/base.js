const { PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } = require('typeorm')

class Base {
    // 自动增量值自动生成ID
    @PrimaryGeneratedColumn()
    id

    // 更新时间，自动生成
    @UpdateDateColumn()
    updateTime

    // 创造时间，自动生成
    @CreateDateColumn()
    createTime

    // 创造该记录用户，需手动生成
    @Column({ type: "varchar", length: 255 })
    createUser

    // 更新该记录用户，需手动生成
    @Column({ type: "varchar", length: 255 })
    updateUser
}

module.exports = Base
