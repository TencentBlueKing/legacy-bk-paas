import { Entity, Column } from 'typeorm'
import Base from './base'

@Entity({ name: 'r_project_page', comment: '项目/页面关联表' })
export default class extends Base {
    @Column({
        type: 'int',
        comment: 'project 表主键'
    })
    projectId

    @Column({
        type: 'int',
        comment: 'page 表主键'
    })
    pageId
}
