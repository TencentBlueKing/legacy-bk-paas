import { Entity, Column } from 'typeorm'
import Base from './base'

@Entity({ name: 'comp_category', comment: '组件分类表' })
export default class extends Base {
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
