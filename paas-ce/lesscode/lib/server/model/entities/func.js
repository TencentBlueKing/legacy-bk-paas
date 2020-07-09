import { Entity, Column } from "typeorm";
import base from './base'

@Entity()
export class func extends base {
    // 函数名字
    @Column({ type: "varchar", length: 255 })
    funcName

    // 函数参数
    @Column({ type: "tinytext" })
    funcParams

    // 函数内容
    @Column({ type: "mediumtext" })
    funcBody

    // 函数分类ID
    @Column({ type: "int", length: 11 })
    funcGroupId

    // 函数简介
    @Column({ type: "tinytext" })
    funcSummary

    // 函数模板类型
    @Column({ type: "varchar", length: 255 })
    funcType

    // 远程函数方法
    @Column({ type: "varchar", length: 255 })
    funcMethod

    // 远程函数数据体
    @Column({ type: "text" })
    funcApiData

    // 是否公开
    @Column({ type: "int", length: 11 })
    publicFlag
}
