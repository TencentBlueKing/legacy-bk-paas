import { Entity, Column } from "typeorm";
import base from './base'

@Entity()
export class func_group extends base {
    // 函数文件夹名字
    @Column({ type: "varchar", length: 255 })
    groupName

    // 父group节点的id
    @Column({ type: "int", length: 11 })
    parentId
}
