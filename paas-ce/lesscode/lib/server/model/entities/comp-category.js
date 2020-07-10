const Base = require('./base')
const { Entity, Column } = require('typeorm')

@Entity()
class CompCategory extends Base {
    @Column({ type: 'int' })
    id

    @Column({ type: 'varchar' })
    category

    @Column({ type: 'datetime' })
    createTime

    @Column({ type: 'datetime' })
    updateTime

    @Column({ type: 'varchar' })
    createUser

    @Column({ type: 'varchar' })
    updateUser
}

module.exports = CompCategory
