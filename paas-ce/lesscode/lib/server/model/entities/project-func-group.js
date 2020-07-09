import { Entity, Column } from "typeorm";
import base from './base'

@Entity()
export class r_project_func_group extends base {
    // project 表主键
    @Column({ type: "int", length: 11 })
    projectId

    // function 表主键
    @Column({ type: "int", length: 11 })
    funcGroupId
}
