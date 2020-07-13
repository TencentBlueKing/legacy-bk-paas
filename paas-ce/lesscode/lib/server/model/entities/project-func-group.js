import { Entity, Column } from 'typeorm'
import Base from './base'

@Entity({ name: 'r_project_func_group', comment: '项目/函数关联表' })
export default class extends Base {
    @Column({
        type: 'int',
        comment: 'project 表主键'
    })
    projectId

    @Column({
        type: 'int',
        comment: 'function 表主键'
    })
    funcGroupId
}
