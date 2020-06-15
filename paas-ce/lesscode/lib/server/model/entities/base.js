const { PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } = require('typeorm')

class Base {
    @PrimaryGeneratedColumn()
    id

    @UpdateDateColumn()
    updateTime

    @CreateDateColumn()
    createTime
}

module.exports = Base
