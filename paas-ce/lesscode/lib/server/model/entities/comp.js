import { Entity, Column } from 'typeorm'
import Base from './base'

@Entity({ name: 'comp', comment: '自定义组件表' })
export default class extends Base {
    @Column({ type: 'int' })
    id

    @Column({ type: 'varchar', comment: '自定义组件类型：PC 或 MOBILE' })
    compType

    @Column({ type: 'varchar' })
    type

    @Column({ type: 'varchar' })
    name

    @Column({ type: 'varchar' })
    displayName

    @Column({ type: 'int' })
    categoryId

    @Column({ type: 'int' })
    belongProjectId

    @Column({
        type: 'int',
        comment: '组件公开：0 不公开，1 公开'
    })
    isPublic

    @Column({
        type: 'int',
        comment: '组件状态：0 为已发布，1 为已下架'
    })
    status
}
