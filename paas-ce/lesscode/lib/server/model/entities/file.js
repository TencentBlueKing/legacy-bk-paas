import { Entity, Column } from 'typeorm'
import Base from './base'

@Entity({ name: 'file', comment: '文件库' })
export default class extends Base {
    @Column({ type: 'int' })
    projectId

    @Column({
        type: 'varchar',
        comment: '文件名'
    })
    name

    @Column({
        type: 'varchar',
        comment: '访问地址'
    })
    url

    @Column({
        type: 'varchar',
        comment: 'mime类型'
    })
    mime

    @Column({
        type: 'varchar',
        comment: '后缀名'
    })
    ext

    @Column({
        type: 'int',
        comment: '存储大小'
    })
    size

    @Column({
        type: 'varchar',
        comment: '上传状态，ready | uploading | success | fail'
    })
    status
}
