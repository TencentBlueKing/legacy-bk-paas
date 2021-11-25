/* eslint-disable no-unused-vars */
import { getConnection, getRepository } from 'typeorm'
import ProjectVersion from '../model/entities/project-version'
import projectVersionModel from '../model/project-version'
import lcCompose from '../utils/lc-compose'
import pageService from './page'
import layoutService from './layout'
import routeService from './route'
import functionService from './function'
import variableService from './variable'
import prop from 'lodash/fp/prop'
import map from 'lodash/fp/map'

const has = async (projectId, version) => {
    const versionData = await projectVersionModel.getOne({ projectId, version, deleteFlag: 0 })
    return versionData && versionData.id
}

const getVersionContext = (properties) => {
    const ctx = Object.create(null)
    for (const [key, value] of Object.entries(properties)) {
        Object.defineProperty(ctx, key, { value })
    }

    return new Proxy(ctx, {
        set: function (obj, prop, value) {
            Object.defineProperty(obj, prop, { value })
            return true
        }
    })
}

const getQueryRunner = () => getConnection().createQueryRunner()

const getVersionTask = map(prop('versionTask'))
const versionRunner = lcCompose(getVersionTask([
    functionService,
    pageService,
    layoutService,
    routeService,
    variableService
]))

const create = async (data) => {
    const { projectId, version, versionLog, versionId } = data

    const newProjectVersion = getRepository(ProjectVersion).create({ projectId, version, versionLog })

    // 获取连接并创建queryRunner
    const queryRunner = getQueryRunner()
    await queryRunner.connect()

    // 建立生产版本的ctx
    const versionCtx = getVersionContext({ projectId, versionId, queryRunner })

    // 开始事务
    await queryRunner.startTransaction()

    // 创建新版本
    const { id: newVersionId } = await queryRunner.manager.save(newProjectVersion)

    // 将新版本ID放入ctx供后续使用
    versionCtx.newVersionId = newVersionId

    try {
        await versionRunner(versionCtx)

        // 提交事务
        await queryRunner.commitTransaction()

        // 成功返回版本ID
        return Promise.resolve(newVersionId)
    } catch (err) {
        // 有错误则回滚
        await queryRunner.rollbackTransaction()

        return Promise.reject(err)
    }
}

const update = async (id, data) => {
    return getRepository(ProjectVersion).update(id, data)
}

const getList = async (projectId, fields = []) => {
    const select = fields.length ? ['id'].concat(fields) : null
    const list = await getRepository(ProjectVersion).find({
        select,
        where: { projectId, deleteFlag: 0 },
        order: { archiveFlag: 'ASC', id: 'DESC' }
    })
    return list
}

const getOptionList = async (projectId) => {
    const list = await getRepository(ProjectVersion).find({
        select: ['id', 'version'],
        where: { projectId, archiveFlag: 0, deleteFlag: 0 },
        order: { id: 'DESC' }
    })
    return list
}

export default {
    has,
    create,
    getList,
    getOptionList,
    update
}
