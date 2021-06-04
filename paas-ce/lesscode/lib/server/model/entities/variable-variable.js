import { Entity, Column } from 'typeorm'
import Base from './base'

@Entity({ name: 'r_variable_variable', comment: '变量与变量的关联表' })
export default class extends Base {
    @Column({ type: 'int', comment: '父级变量Id' })
    parentVariableId

    @Column({ type: 'int', comment: '项目id' })
    projectId

    @Column({ type: 'int', comment: '变量Id' })
    variableId
}
