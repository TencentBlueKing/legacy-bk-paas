import { Entity, Column } from 'typeorm'
import Base from './base'

@Entity({ name: 'version', comment: '自定义组件版本表' })
export default class extends Base {
    @Column({ type: 'int' })
    componentId

    @Column({ type: 'varchar' })
    componentDest

    @Column({ type: 'varchar' })
    version

    @Column({ type: 'varchar' })
    versionLog

    @Column({ type: 'varchar' })
    description

    @Column({ type: 'int' })
    isLast
}
