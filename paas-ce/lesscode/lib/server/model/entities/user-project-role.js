import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity({ name: 'r_user_project_role', comment: '用户/项目/角色关联表' })
export default class UserProjectRole {
    @PrimaryGeneratedColumn()
    id

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

    @Column({
        type: 'int',
        comment: 'role 表主键'
    })
    roleId
}
