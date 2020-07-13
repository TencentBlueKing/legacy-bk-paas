import { Entity, Column } from 'typeorm'
import Base from './base'

@Entity({ name: 'r_project_comp', comment: '项目使用的自定义组件关联表' })
export default class extends Base {
    @Column({
        type: 'int',
        comment: 'project 表主键'
    })
    projectId

    @Column({
        type: 'int',
        comment: 'component 表主键'
    })
    compId

    @Column({
        type: 'int',
        comment: '当前使用的自定义组件的版本 id'
    })
    useVersionId

    @Column({
        type: 'varchar',
        default: '[]',
        comment: 'page 表主键的集合'
    })
    pageIds
}
