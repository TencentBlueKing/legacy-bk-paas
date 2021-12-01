import { Entity, Column } from 'typeorm'
import Base from './base'

@Entity({ name: 'variable', comment: '变量' })
export default class extends Base {
    @Column({ type: 'varchar', length: 255, comment: '变量名称' })
    variableName

    @Column({ type: 'varchar', length: 255, comment: '变量标识' })
    variableCode

    @Column({ type: 'int', comment: '项目id' })
    projectId

    @Column({
        type: 'int',
        comment: 'project_version 表主键'
    })
    versionId

    @Column({ type: 'varchar', length: 255, comment: '页面pageCode' })
    pageCode

    @Column({ type: 'int', comment: '初始类型' })
    valueType

    @Column({ type: 'mediumtext', comment: '默认值' })
    defaultValue

    @Column({ type: 'int', comment: '默认值类型' })
    defaultValueType

    @Column({ type: 'int', comment: '生效范围' })
    effectiveRange

    @Column({ type: 'varchar', length: 255, comment: '变量说明' })
    description
}
