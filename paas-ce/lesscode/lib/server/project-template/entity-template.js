import { Entity${importColumnStr} } from 'typeorm'
import Base from './base'

@Entity({ name: '${tableName}' })
export default class extends Base {${tableFields}
}
