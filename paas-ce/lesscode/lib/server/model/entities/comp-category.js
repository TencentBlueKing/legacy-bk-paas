import { Entity, Column } from 'typeorm'
import Base from './base'

@Entity({ name: 'comp_category', comment: '组件分类表' })
export default class extends Base {
    @Column({ type: 'varchar' })
    name

    @Column({ type: 'int' })
    belongProjectId

    @Column({ type: 'int' })
    order
}
