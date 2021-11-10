import { Entity, Column } from 'typeorm'
import Base from './base'

@Entity({ name: 'r_page_variable', comment: '页面变量关联表' })
export default class extends Base {
    @Column({ type: 'varchar', length: 255, comment: '页面pageCode' })
    pageCode

    @Column({ type: 'int', comment: '项目id' })
    projectId

    @Column({ type: 'int', comment: '变量Id' })
    variableId

    @Column({
        type: 'int',
        comment: 'project_version 表主键'
    })
    versionId

    @Column({ type: 'mediumtext', comment: '关联情况' })
    useInfo
}
