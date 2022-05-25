import {
    LCDataService,
    TABLE_FILE_NAME
} from './data-service'

export const getAll = async (projectId) => {
    const query = {
        projectId,
        deleteFlag: 0
    }
    const list = await LCDataService.get({
        tableFileName: TABLE_FILE_NAME.FILE,
        query
    })

    return list
}
