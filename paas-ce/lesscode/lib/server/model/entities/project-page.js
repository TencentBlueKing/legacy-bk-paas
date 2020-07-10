import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity({ name: 'r_project_page', comment: '项目/页面关联表' })
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
        comment: 'page 表主键'
    })
    pageId
}
