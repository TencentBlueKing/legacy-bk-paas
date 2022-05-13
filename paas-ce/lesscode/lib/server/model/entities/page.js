import { Entity, Column } from 'typeorm'
import Base from './base'

@Entity({ name: 'page', comment: '页面表' })
export default class extends Base {
    @Column({
        type: 'varchar',
        comment: '页面名称'
    })
    pageName

    @Column({
        type: 'varchar',
        comment: '页面 ID 即英文名称'
    })
    pageCode

    @Column({
        type: 'varchar',
        comment: '页面类型'
    })
    pageType

    @Column({
        type: 'varchar',
        comment: 'nocode页面类型'
    })
    nocodeType

    @Column({
        type: 'int'
    })
    flowId

    @Column({
        type: 'int'
    })
    formId

    @Column({
        type: 'mediumtext',
        comment: '页面的 targetData（JSON 串）'
    })
    content

    @Column({
        type: 'mediumtext',
        comment: '页面源代码'
    })
    sourceCode

    @Column({
        type: 'mediumtext',
        comment: '预览图base64'
    })
    previewImg

    @Column({
        type: 'tinytext',
        comment: '页面生命周期'
    })
    lifeCycle

    @Column({
        type: 'mediumtext',
        comment: '页面样式配置'
    })
    styleSetting

    @Column({
        type: 'int',
        nullable: false,
        default: '0',
        comment: '项目状态：0 为正常，1 为私有，2 为删除'
    })
    status

    @Column({
        type: 'varchar',
        nullable: true,
        comment: '创建人，默认当前用户'
    })
    createUser

    @Column({
        type: 'varchar',
        nullable: true,
        comment: '更新人，默认当前用户'
    })
    updateUser

    @Column({
        type: 'varchar',
        nullable: true,
        comment: '最后活跃用户'
    })
    activeUser

    @Column({
        type: 'datetime',
        comment: '最后活跃时间'
    })
    activeTime
}
