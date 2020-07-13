import { Entity, Column } from 'typeorm'
import Base from './base'

@Entity({ name: 'r_favourite', comment: '项目收藏表' })
export default class extends Base {
    @Column({
        type: 'int',
        comment: 'user 表主键'
    })
    userId

    @Column({
        type: 'int',
        comment: 'project 表主键'
    })
    projectId
}
