import { getConnection, getRepository, In } from 'typeorm'
import ApiMigraion from '../model/entities/api-migration'
import Project from '../model/entities/project'
import PageTemplateCategory from '../model/entities/page-template-category'

// 将函数名称写到这个数组里，函数会自动执行，返回成功则后续不会再执行
const apiArr = ['setDefaultPageTemplateCategory']

export const executeApi = async () => {
    const apiRecords = await getRepository(ApiMigraion).find()
    apiArr.forEach(async api => {
        if (!apiRecords.find(item => item.name === api)) {
            const result = await eval(`${api}('${api}')`)
            if (result && result.code === 0) {
                console.log(result.message)
            }
        }
    })
}

/**
 * 为老项目设置页面模板的默认类别
 */
async function setDefaultPageTemplateCategory (apiName) {

    const projectRepo = getRepository(Project)
    try {
        await getConnection().transaction(async transactionalEntityManager => {

            const projectList = await projectRepo.find()

            const PageTemplateCategoryList = projectList.map(project => {
                const { id, createTime, updateTime, createUser, updateUser } = project
                return {
                    name: '默认分类',
                    belongProjectId: id,
                    createTime,
                    updateTime,
                    createUser,
                    updateUser
                }
            })
            await transactionalEntityManager.save(PageTemplateCategory, PageTemplateCategoryList)
            await transactionalEntityManager.save(ApiMigraion, [{ name: apiName }])
        })
        return {
            code: 0,
            message: `${apiName}: Insert success`
        }
    } catch (err) {
        return {
            code: -1,
            message: `${apiName}: ${err.message || err}`
        }
    }
}