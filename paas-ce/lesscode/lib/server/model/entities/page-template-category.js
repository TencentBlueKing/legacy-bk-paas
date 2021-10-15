import { Entity, Column } from 'typeorm'
import Base from './base'

@Entity({ name: 'page_template_category', comment: '模板分类表' })
export default class extends Base {
    @Column({ type: 'varchar' })
    name

    @Column({ type: 'int' })
    belongProjectId

    @Column({ type: 'int' })
    order
}
