import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity({ name: 'r_project_func_group', comment: '项目/函数关联表' })
export default class ProjectComp {
    @PrimaryGeneratedColumn()
    id

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
