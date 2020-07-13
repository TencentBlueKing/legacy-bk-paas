import { Entity, Column } from 'typeorm'
import Base from './base'

@Entity({ name: 'page', comment: '页面表' })
export default class extends Base {
    @Column({
        type: 'varchar',
        comment: '项目 ID 即英文名称'
    })
    pageName

    @Column({
        type: 'mediumtext',
        comment: '页面的 targetData（JSON 串）'
    })
    content

    @Column({
        type: 'mediumtext',
        comment: '页面源代码'
    })
    sourceCode

    @Column({
        type: 'int',
        nullable: false,
        default: '0',
        comment: '项目状态：0 为正常，1 为私有，2 为删除'
    })
    status

    @Column({
        type: 'varchar',
        nullable: true,
        comment: '创建人，默认当前用户'
    })
    createUser

    @Column({
        type: 'varchar',
        nullable: true,
        comment: '更新人，默认当前用户'
    })
    updateUser
}
