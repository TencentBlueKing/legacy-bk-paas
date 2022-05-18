import { Entity, Column } from 'typeorm'
import Base from './base'

@Entity({ name: 'page_template', comment: '模板表' })
export default class extends Base {
    @Column({
        type: 'varchar',
        comment: '模板名称'
    })
    templateName

    @Column({
        type: 'varchar',
        comment: '模板 ID 即英文名称'
    })
    templateCode

    @Column({ type: 'varchar', comment: '模板类型：PC 或 MOBILE' })
    templateType

    @Column({
        type: 'varchar',
        comment: '来源pageCode'
    })
    fromPageCode

    @Column({
        type: 'mediumtext',
        comment: '模板的 targetData（JSON 串）'
    })
    content

    @Column({
        type: 'mediumtext',
        comment: '预览图base64'
    })
    previewImg

    @Column({
        type: 'int',
        nullable: false,
        default: '0',
        comment: '是否官方模板：0 为私有，1 为官方'
    })
    isOffcial

    @Column({
        type: 'varchar',
        comment: '官方模板类型'
    })
    offcialType

    @Column({
        type: 'int',
        default: '0',
        comment: '分类id'
    })
    categoryId

    @Column({
        type: 'int',
        comment: '父级模板id'
    })
    parentId

    @Column({
        type: 'int',
        comment: '所属项目id'
    })
    belongProjectId

    @Column({
        type: 'int',
        comment: 'project_version 表主键'
    })
    versionId
}
