const Base = require('./base')
const { Entity, Column } = require('typeorm')

@Entity()
class Comp extends Base {
    @Column({ type: 'int' })
    id

    @Column({ type: 'varchar' })
    compCode

    @Column({ type: 'varchar' })
    compName

    @Column({ type: 'varchar' })
    compPath

    @Column({ type: 'int' })
    belongProjectId

    @Column({ type: 'int' })
    categoryId

    @Column({ type: 'int' })
    latestVersionId

    @Column({ type: 'int' })
    isPublic

    @Column({ type: 'int' })
    status

    @Column({ type: 'datetime' })
    createTime

    @Column({ type: 'datetime' })
    updateTime

    @Column({ type: 'varchar' })
    createUser

    @Column({ type: 'varchar' })
    updateUser
}

module.exports = Comp
