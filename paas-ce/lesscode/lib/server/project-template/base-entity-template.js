import { PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, Column, BeforeInsert, BeforeUpdate } from 'typeorm'
import { RequestContext } from '../../middleware/request-context'
 
export default class Base {
     // 自动增量值自动生成ID
     @PrimaryGeneratedColumn()
     id
 
     // 更新时间，自动生成
     @UpdateDateColumn()
     updateTime
 
     // 创造时间，自动生成
     @CreateDateColumn()
     createTime
 
     // 创造该记录用户，自动生成
     @Column({ type: 'varchar', length: 255 })
     createUser
 
     // 更新该记录用户，自动生成
     @Column({ type: 'varchar', length: 255 })
     updateUser
 
     // 是否删除，默认值为0，表示未删除，1为已删除
     @Column({ type: 'int' })
     deleteFlag
 
     // 插入数据写入用户名
     @BeforeInsert()
     beforeInsert () {
         const username = RequestContext.getCurrentUser() || {}
         this.createUser = username || this.createUser
         this.updateUser = username || this.updateUser
         this.createTime = new Date()
         this.updateTime = new Date()
     }
 
     // 更新数据写入用户名
     @BeforeUpdate()
     updateUpdateUser () {
         const username = RequestContext.getCurrentUser() || {}
         this.updateUser = username || this.updateUser
         this.updateTime = new Date()
     }
}
