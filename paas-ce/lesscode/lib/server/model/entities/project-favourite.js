import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity({ name: 'r_favourite', comment: '项目收藏表' })
export default class ProjectComp {
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
}
