import { Entity, Column } from 'typeorm'
import Base from './base'

@Entity({ name: 'r_variable_func', comment: '变量使用的函数关联表' })
export default class extends Base {
    @Column({ type: 'varchar', length: 255, comment: '函数funcCode' })
    funcCode

    @Column({ type: 'int', comment: '项目id' })
    projectId

    @Column({
        type: 'int',
        comment: 'project_version 表主键'
    })
    versionId

    @Column({ type: 'int', comment: '变量Id' })
    variableId
}
