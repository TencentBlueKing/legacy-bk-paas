import { Entity, Column } from 'typeorm'
import Base from './base'

@Entity({ name: 'r_func_variable', comment: '函数使用的变量关联表' })
export default class extends Base {
    @Column({ type: 'varchar', length: 255, comment: '函数funcCode' })
    funcCode

    @Column({ type: 'int', comment: '项目id' })
    projectId

    @Column({ type: 'int', comment: '变量Id' })
    variableId
}
