import { Entity, Column } from 'typeorm'
import Base from './base'

@Entity({ name: 'project_version', comment: '项目版本表' })
export default class extends Base {
    @Column({
        type: 'int'
    })
    projectId

    @Column({
        type: 'varchar',
        comment: '项目版本'
    })
    version

    @Column({
        type: 'varchar',
        comment: '版本日志'
    })
    versionLog

    @Column({
        type: 'int',
        comment: '是否归档'
    })
    archiveFlag
}
