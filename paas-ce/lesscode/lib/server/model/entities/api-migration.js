import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm'

@Entity({ name: 'api_migration', comment: 'api-migration记录表' })
export default class {
    // 自动增量值自动生成ID
    @PrimaryGeneratedColumn()
    id

    @Column({ type: 'varchar' })
    name

    // 创造时间，自动生成
    @CreateDateColumn()
    createTime
}
