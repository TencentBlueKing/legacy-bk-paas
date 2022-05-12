import {
    LCDataService,
    TABLE_FILE_NAME
} from '../service/data-service'
import {
    DataParse,
    StructJsonParser,
    StructSqlParser
} from '../../shared/data-source'
import DBEngineService from '../service/db-engine-service'
import {
    getPreviewDbConfig
} from '../service/preview-db-service'

/**
 * 预览环境 DB 执行 sql
 * @param {*} sql sql
 * @param {*} projectId 项目 id
 */
const execSqlInPreviewDb = async (sql, projectId) => {
    const previewDbConfig = await getPreviewDbConfig(projectId)
    const dbEngine = new DBEngineService(previewDbConfig)
    await dbEngine.execMultSql(sql)
}

/**
 * 生成 no code 表
 * @param { tableName: 表名, projectId: 项目id, columns: 字段 json, comment: 备注 } dataTable 表数据
 * @returns 新增数据
 */
export const createNCTable = async (dataTable) => {
    // 判断是否已经存着同名表
    const hasSameTable = await LCDataService.has(
        TABLE_FILE_NAME.DATA_TABLE,
        {
            tableName: dataTable.tableName,
            projectId: dataTable.projectId,
            deleteFlag: 0
        }
    )
    if (hasSameTable) {
        throw new Error(`已存在表名为【${dataTable.tableName}】的表`)
    }
    // 入库
    let data = {}
    await LCDataService.transaction(async (transactionalEntityManager) => {
        // 构造数据入库 DATA_TABLE
        const newTable = {
            ...dataTable,
            columns: JSON.stringify(dataTable.columns)
        }
        data = await transactionalEntityManager.add(TABLE_FILE_NAME.DATA_TABLE, newTable)
        // 构造新增表 sql
        const dataParse = new DataParse()
        const structJsonParser = new StructJsonParser(dataTable)
        const structSqlParser = new StructSqlParser()
        const sql = dataParse.import(structJsonParser).export(structSqlParser)
        // 构造数据入库 DATA_TABLE_MODIFY_RECORD
        const tableModifyRecord = {
            sql,
            tableId: data.id,
            projectId: dataTable.projectId
        }
        await transactionalEntityManager.add(TABLE_FILE_NAME.DATA_TABLE_MODIFY_RECORD, tableModifyRecord)
        // 对预览环境执行 sql
        await execSqlInPreviewDb(sql, dataTable.projectId)
    })
    return data
}

/**
 * 更新 no code 表
 * @param { id: 要更新的表id, tableName: 表名, projectId: 项目id, columns: 字段 json, comment: 备注 } dataTable 表数据
 * @returns 更新数据
 */
export const updateNCTable = async (dataTable) => {
    return LCDataService.transaction(async (transactionalEntityManager) => {
        // 获取原始 table
        const originData = await LCDataService.findOne(
            TABLE_FILE_NAME.DATA_TABLE,
            {
                id: dataTable.id
            }
        )
        // 构造数据入库 DATA_TABLE
        const updateTable = {
            ...dataTable,
            columns: JSON.stringify(dataTable.columns)
        }
        const data = await transactionalEntityManager.update(TABLE_FILE_NAME.DATA_TABLE, updateTable)
        // 构造数据入库 DATA_TABLE_MODIFY_RECORD
        const originTable = {
            ...originData,
            columns: JSON.parse(originData.columns)
        }
        const dataParse = new DataParse(originTable)
        const structJsonParser = new StructJsonParser(dataTable)
        const structSqlParser = new StructSqlParser()
        const sql = dataParse.import(structJsonParser).export(structSqlParser)
        const tableModifyRecord = {
            sql,
            tableId: data.id,
            projectId: dataTable.projectId
        }
        await transactionalEntityManager.add(TABLE_FILE_NAME.DATA_TABLE_MODIFY_RECORD, tableModifyRecord)
        // 对预览环境执行 sql
        await execSqlInPreviewDb(sql, dataTable.projectId)
        return data
    })
}
