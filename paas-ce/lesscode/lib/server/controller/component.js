import { getConnection, getManager, getRepository } from 'typeorm'
import dayjs from 'dayjs'
import Project from '../model/entities/project'
import Comp from '../model/entities/comp'
import Version from '../model/entities/version'
import CompShare from '../model/entities/comp-share'
import * as ComponentModel from '../model/component'
import * as VersionModel from '../model/version'
import * as PageCompModel from '../model/page-comp'
import * as CompShareModel from '../model/comp-share'
import ProjectModel from '../model/project'
import { npmPublish } from '../utils/npm/index'
import fileService from '../utils/file-service/index'
import { RequestContext } from '../middleware/request-context'
import OperationLogger from '../service/operation-logger'
import { POST_COMPONENT_CREATE, POST_COMPONENT_UPDATE } from '../conf/operate-log'
import { whereVersionLiteral } from '../model/common'

// 所有组件
export const list = async (ctx) => {
    try {
        const {
            categoryId,
            belongProjectId,
            compType
        } = ctx.query
        const params = {}
        const query = {
            condition: [],
            conParams: {}
        }

        if (categoryId) {
            params.categoryId = categoryId
        }
        if (belongProjectId) {
            params.belongProjectId = belongProjectId
        }
        if (compType === 'MOBILE') {
            params.compType = compType
        } else if (compType === 'PC') {
            query.condition = 'comp.compType != :q'
            query.conParams = { q: 'MOBILE' }
        }

        const onlineList = await ComponentModel.all({
            ...params,
            status: 0
        }, query.condition, query.conParams)
        const offlineList = await ComponentModel.all({
            ...params,
            status: 1
        }, query.condition, query.conParams)
        // 每页条数
        const length = parseInt(ctx.query.limit)
        // 当前页面，从1开始
        const current = parseInt(ctx.query.current)

        let start = 0
        if (Number(current)) {
            start = (Math.abs(Number(current)) - 1) * length
        }
        const all = [...onlineList, ...offlineList]
        const pageList = all.slice(start, length * current).map(item => ({
            ...item,
            createTime: item.createTime ? dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss') : '--',
            updateTime: item.updateTime ? dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss') : '--'
        }))

        // 公开范围数据
        const compIds = pageList.map(item => item.id)
        const publicScope = {
            specify: {},
            all: []
        }
        if (compIds.length) {
            const [publicList, publicAll] = await Promise.all([
                CompShareModel.getTargetProjectByCompIds(compIds),
                ComponentModel.getPublicByIds(compIds)
            ])
            const publicListMap = {}
            publicList.forEach(item => {
                if (publicListMap[item.compId]) {
                    publicListMap[item.compId].push(item)
                } else {
                    publicListMap[item.compId] = [item]
                }
            })
            publicScope.specify = publicListMap
            publicScope.all = publicAll
        }

        ctx.send({
            code: 0,
            message: 'success',
            data: {
                data: pageList,
                publicScope,
                count: all.length,
                current: current,
                limit: length
            }
        })
    } catch (error) {
        ctx.send({
            code: -1,
            message: error.message,
            data: null
        })
    }
}

// 使用中的组件
export const useing = async (ctx) => {
    try {
        const { belongProjectId, projectVersionId } = ctx.query
        if (!belongProjectId) {
            throw new Error('项目id不能为空')
        }
        const useingCompList = await PageCompModel.getAll({
            projectId: belongProjectId,
            projectVersionId: whereVersionLiteral(projectVersionId)
        })

        let list = []

        if (useingCompList.length > 0) {
            const compIds = useingCompList.map(comp => comp.compId)
            const componentList = await ComponentModel.getDataByCompIds([...new Set(compIds)])

            const sourceProjectList = await ProjectModel.getDataByIds(componentList.map(_ => _.belongProjectId))
            const sourceProjectMap = sourceProjectList.reduce((result, item) => {
                result[item.id] = item
                return result
            }, {})

            const compPageData = await PageCompModel.getPageAndVersion({
                projectId: belongProjectId,
                projectVersionId: whereVersionLiteral(projectVersionId)
            })
            const compRelatePageMap = compPageData.reduce((result, item) => {
                const compId = item.compId
                if (!result[compId]) {
                    result[compId] = []
                }
                result[compId].push(item)
                return result
            }, {})

            list = componentList.map(item => {
                let useingVersion = {}
                // 有使用记录默认取第一个作为使用版本信息
                if (compRelatePageMap[item.id].length > 0) {
                    const currentPageUseing = compRelatePageMap[item.id][0]
                    useingVersion = {
                        versionId: currentPageUseing.versionId,
                        isLast: currentPageUseing.isLast,
                        version: currentPageUseing.version,
                        versionLog: currentPageUseing.versionLog
                    }
                }
                return {
                    ...item,
                    belongProjectId: parseInt(belongProjectId), // 使用中的组件项目id为当前项目
                    sourceProject: sourceProjectMap[item.belongProjectId] || {},
                    pageList: compRelatePageMap[item.id],
                    useingVersion: useingVersion
                }
            })
        }

        ctx.send({
            code: 0,
            message: 'success',
            data: list
        })
    } catch (error) {
        ctx.send({
            code: -1,
            message: error.message,
            data: null
        })
    }
}

export const updatePageComp = async (ctx) => {
    const operationLogger = new OperationLogger(ctx)
    const { projectId, projectVersionId, compId, versionId } = ctx.request.body
    const { affected } = await PageCompModel.update({
        projectId,
        projectVersionId: whereVersionLiteral(projectVersionId),
        compId
    }, { versionId })
    operationLogger.success({
        operateTarget: `组件名称：${ctx.request.body.displayName}`
    })
    ctx.send({
        code: 0,
        message: 'success',
        data: affected
    })
}

// 新建组件
export const create = async (ctx) => {
    const operationLogger = new OperationLogger(ctx)
    try {
        const {
            name,
            displayName,
            type,
            dest,
            version,
            categoryId,
            isPublic,
            description,
            log,
            belongProjectId,
            compType
        } = ctx.request.body

        const checkFileds = ['name', 'displayName', 'type', 'dest', 'version', 'categoryId', 'description', 'log', 'belongProjectId', 'compType']
        for (let i = 0; i < checkFileds.length; i++) {
            const currentfield = checkFileds[i]
            const currentFieldValue = ctx.request.body[currentfield]
            if (!currentFieldValue) {
                throw new Error(`${currentfield}不能为空`)
            }
        }

        const row = await ComponentModel.getOne({
            type: type
        })
        if (row) {
            throw new Error('存在同名组件')
        }
        const path = require('path')
        const md5 = require('md5')
        // 组件存放目录md5计算时间戳
        const componentDirName = md5(`${type}_${Date.now()}`)

        // 下载组件源码存放路径（下载s3已上传的组件源码到temp目录）
        const tempDir = path.resolve(__dirname, `../temp/${componentDirName}`)
        await fileService.downloadFile(`${dest}/config.json`, path.resolve(tempDir, 'config.json'))
        await fileService.downloadFile(`${dest}/index.iife.min.js`, path.resolve(tempDir, 'index.iife.min.js'))
        await fileService.downloadFile(`${dest}/index.umd.min.js`, path.resolve(tempDir, 'index.umd.min.js'))

        await getConnection().transaction(async transactionalEntityManager => {
            // s3存储（下载的组件源码推到s3的component目录）
            const s3ComponentPath = `component/${componentDirName}`
            await fileService.uploadFolder(tempDir, s3ComponentPath)
            // 推送tnpm
            await npmPublish({
                sourceDir: path.resolve(__dirname, tempDir),
                componentDirName: componentDirName,
                name: type,
                version,
                description
            })

            const currentUser = RequestContext.getCurrentUser()
            const nowDate = new Date()

            // 数据插入记录
            const newComp = await transactionalEntityManager.save(Comp, {
                name,
                displayName,
                type,
                categoryId,
                belongProjectId,
                compType,
                isPublic: isPublic,
                createTime: nowDate,
                createUser: currentUser.username,
                updateTime: nowDate,
                updateUser: currentUser.username
            })
            await transactionalEntityManager.save(Version, {
                version,
                versionLog: log,
                componentId: newComp.id,
                componentDest: s3ComponentPath,
                description,
                isLast: 1,
                createTime: nowDate,
                createUser: currentUser.username,
                updateTime: nowDate,
                updateUser: currentUser.username
            })
        })
        const fse = require('fs-extra')
        fse.remove(tempDir)
        operationLogger.success({
            operateTarget: `组件名称：${displayName}`
        })
        ctx.send({
            code: 0,
            message: 'success',
            data: ''
        })
    } catch (error) {
        operationLogger.error(error, {
            operateTarget: `组件名称：${ctx.request.body.displayName}`
        })
        ctx.send({
            code: -1,
            message: error.message,
            data: null
        })
    }
}

// 编辑组件
export const update = async (ctx) => {
    const operationLogger = new OperationLogger(ctx)
    try {
        const {
            dest,
            version,
            categoryId,
            description,
            log
        } = ctx.request.body

        const id = parseInt(ctx.request.body.id)
        if (id < 1) {
            throw new Error('组件id不能为空')
        }
        const checkFileds = ['dest', 'version', 'categoryId', 'description', 'log']
        for (let i = 0; i < checkFileds.length; i++) {
            const currentfield = checkFileds[i]
            const currentFieldValue = ctx.request.body[currentfield]
            if (!currentFieldValue) {
                throw new Error(`${currentfield}不能为空`)
            }
        }
        const editComp = await ComponentModel.findById(id)
        if (!editComp) {
            throw new Error('组件不存在')
        }

        const compVersion = await VersionModel.getOne({
            componentId: id,
            version: version
        })
        if (compVersion) {
            throw new Error(`${editComp.type}的${version}版本已存在`)
        }

        const path = require('path')
        const md5 = require('md5')
        // 组件存放目录md5计算时间戳
        const componentDirName = md5(`${editComp.type}_${Date.now()}`)

        // 下载组件源码存放路径（下载s3已上传的组件源码到temp目录）
        const tempDir = path.resolve(__dirname, `../temp/${componentDirName}`)
        await fileService.downloadFile(`${dest}/config.json`, path.resolve(tempDir, 'config.json'))
        await fileService.downloadFile(`${dest}/index.iife.min.js`, path.resolve(tempDir, 'index.iife.min.js'))
        await fileService.downloadFile(`${dest}/index.umd.min.js`, path.resolve(tempDir, 'index.umd.min.js'))

        await getManager().transaction(async transactionalEntityManager => {
            // s3存储（下载的组件源码推到s3的component目录）
            const s3ComponentPath = `component/${componentDirName}`
            await fileService.uploadFolder(tempDir, s3ComponentPath)
            // 推送tnpm
            await npmPublish({
                sourceDir: path.resolve(__dirname, tempDir),
                componentDirName: componentDirName,
                name: editComp.type,
                version,
                description
            })

            const currentUser = RequestContext.getCurrentUser()
            const nowDate = new Date()

            editComp.categoryId = categoryId
            editComp.updateTime = nowDate
            editComp.updateUser = currentUser.username

            await transactionalEntityManager.save(editComp)

            await transactionalEntityManager.update(Version, {
                componentId: id
            }, {
                isLast: 0,
                updateTime: nowDate,
                updateUser: currentUser.username
            })
            await transactionalEntityManager.save(Version, {
                version,
                versionLog: log,
                componentId: id,
                componentDest: s3ComponentPath,
                description,
                createTime: nowDate,
                createUser: currentUser.username,
                updateTime: nowDate,
                updateUser: currentUser.username,
                isLast: 1
            })
        })

        operationLogger.success({
            operateTarget: `组件名称：${ctx.request.body.displayName}`
        })
        ctx.send({
            code: 0,
            message: 'success',
            data: editComp
        })
    } catch (error) {
        operationLogger.error(error, {
            operateTarget: `组件名称：${ctx.request.body.displayName}`
        })
        ctx.send({
            code: -1,
            message: error.message,
            data: ''
        })
    }
}

// 下线
export const off = async (ctx) => {
    const operationLogger = new OperationLogger(ctx)
    try {
        const id = Number(ctx.request.body.id)
        if (id < 1) {
            throw new Error('组件id不能为空')
        }
        const res = await ComponentModel.updateById(id, {
            status: 1
        })

        ctx.send({
            code: 0,
            message: 'success',
            data: res
        })
        operationLogger.success({
            operateTarget: `组件名称：${res.displayName}`
        })
    } catch (error) {
        operationLogger.error(error, {
            operateTarget: `组件ID：${ctx.request.body.id}`
        })
        ctx.send({
            code: -1,
            message: error.message,
            data: null
        })
    }
}

// 上线
export const online = async (ctx) => {
    const operationLogger = new OperationLogger(ctx)
    try {
        const id = Number(ctx.request.body.id)
        if (id < 1) {
            throw new Error('组件id不能为空')
        }
        const res = await ComponentModel.updateById(id, {
            status: 0
        })

        ctx.send({
            code: 0,
            message: 'success',
            data: ''
        })
        operationLogger.success({
            operateTarget: `组件名称：${res.displayName}`
        })
    } catch (error) {
        operationLogger.error(error, {
            operateTarget: `组件ID：${ctx.request.body.id}`
        })
        ctx.send({
            code: -1,
            message: error.message,
            data: null
        })
    }
}

// 详情
export const detail = async (ctx) => {
    try {
        const id = Number(ctx.query.id)
        if (id < 1) {
            throw new Error('参数错误')
        }
        const res = await ComponentModel.all({
            id
        })
        if (res.length < 1) {
            throw new Error('组件版本不存在')
        }

        ctx.send({
            code: 0,
            message: 'success',
            data: res[0]
        })
    } catch (error) {
        ctx.send({
            code: -1,
            message: error.message,
            data: null
        })
    }
}

// 组件版本对应的详情
export const versionDetail = async (ctx) => {
    try {
        const versionId = Number(ctx.query.versionId)
        if (versionId < 1) {
            throw new Error('参数错误')
        }
        const res = await ComponentModel.getDataByVersion([versionId])
        if (res.length < 1) {
            throw new Error('组件版本不存在')
        }
        ctx.send({
            code: 0,
            message: 'success',
            data: res[0]
        })
    } catch (error) {
        ctx.send({
            code: -1,
            message: error.message,
            data: null
        })
    }
}

// 删除组件
export const compDelete = async (ctx) => {
    try {
        const id = Number(ctx.query.id)
        if (id < 1) {
            throw new Error('组件不存在')
        }
        // 权限
        const record = await ComponentModel.getOne({
            id
        })
        const userInfo = ctx.session.userInfo || {}
        ctx.hasPerm = (record.createUser === userInfo.username) || ctx.hasPerm
        if (!ctx.hasPerm) return

        await ComponentModel.remove(id)
        ctx.send({
            code: 0,
            message: 'success',
            data: ''
        })
    } catch (error) {
        ctx.send({
            code: -1,
            message: error.message,
            data: null
        })
    }
}

// 上传组件
export const upload = async (ctx) => {
    const unzipper = require('unzipper')
    const path = require('path')
    const fs = require('fs')

    const id = Number(ctx.query.id)
    const belongProjectId = Number(ctx.query.belongProjectId)
    let operateTarget = `项目ID：${belongProjectId}`

    try {
        if (!belongProjectId) {
            throw new Error('项目 ID 不能为空')
        }
        const uploadComponent = ctx.request.files.upload_file

        if (!['application/x-zip', 'application/zip', 'application/x-zip-compressed'].includes(uploadComponent.type)) {
            throw new Error('自定义组件上传只支持zip包')
        }
        let exitComponent = null
        if (id) {
            exitComponent = await ComponentModel.getOne({
                id
            })
            if (!exitComponent) {
                throw new Error('需要更新的组件不存在，请先新建自定义组件')
            }
            operateTarget = `组件名称：${exitComponent.displayName}`
        }

        const componentPath = Date.now()
        const tempDir = path.resolve(__dirname, '../temp/')
        const componentDestDir = path.resolve(tempDir, `${componentPath}`)

        await fs.createReadStream(uploadComponent.path)
            .pipe(unzipper.Extract({ path: componentDestDir }))
            .promise()

        // 删除mac压缩 隐藏文件
        const fse = require('fs-extra')
        fse.removeSync(path.resolve(componentDestDir, '__MACOSX'))

        const componentDir = fs.readdirSync(componentDestDir)
        if (componentDir.length < 1) {
            throw new Error('上传失败')
        }

        const componentRealDir = componentDir[0]
        const componentRealPath = path.resolve(componentDestDir, componentRealDir)
        const componentChild = fs.readdirSync(componentRealPath)
        if (!componentChild.includes('config.json')) {
            throw new Error('组件包需包含config.json')
        }
        if (!componentChild.includes('index.iife.min.js') || !componentChild.includes('index.umd.min.js')) {
            throw new Error('请先编译组件源码')
        }

        // 解析组件的config.json
        let componentConfig = {}
        try {
            componentConfig = await fse.readJson(path.resolve(componentRealPath, 'config.json'))
        } catch {
            throw new Error('config.json解析失败')
        }
        const currentProject = await getRepository(Project).find({
            where: {
                id: belongProjectId
            }
        })
        const currentProjectCode = currentProject.length > 0 ? currentProject[0].projectCode : ''
        if (!currentProjectCode) {
            throw new Error('项目不存在')
        }
        // 验证组件名是否合法
        const { name, displayName, type } = componentConfig

        const realType = `${currentProjectCode}-${type}`

        // if (/^bk-/.test(type)) {
        //     throw new Error('组件type不支持以 bk- 开头命名')
        // }
        // const prefixRegx = new RegExp(`^${currentProjectCode}-`, 'i')
        // if (!prefixRegx.test(type)) {
        //     throw new Error(`组件type必须以项目ID(${currentProjectCode})为前缀，即：${currentProjectCode}-xxx`)
        // }
        // if (!/^[a-z][a-z\d]*(-[a-z\d]+)*$/.test(type)) {
        //     throw new Error(`组件type格式：以a-z开头，只允许a-z、0-9、-`)
        // }

        // 更新自定义组件不支持更新名字
        if (exitComponent) {
            if (name !== exitComponent.name
                || displayName !== exitComponent.displayName
                || realType !== exitComponent.type) {
                throw new Error('编辑组件不支持更新组件名称和ID')
            }
        }
        // 上传新的组件需要检测重名
        if (!exitComponent) {
            // 上传新组件需要检测重名
            const compRow = await ComponentModel.getOne({
                type: realType
            })
            if (compRow) {
                throw new Error(`存在同名组件type ${type}，请重新上传`)
            }
        }

        // 上传组件到s3的upload-temp目录
        const dest = `upload-temp/${componentPath}`
        await fileService.uploadFolder(componentRealPath, dest)

        // 上传s3成功删除本地临时目录
        fse.removeSync(componentDestDir)

        ctx.send({
            code: 0,
            message: 'success',
            data: {
                name,
                displayName,
                type: realType,
                dest: dest
            }
        })
    } catch (error) {
        console.log('id', id, '\n=====this.options.apiKey\n')
        const apiKey = id ? POST_COMPONENT_UPDATE : POST_COMPONENT_CREATE
        console.log('apiKey', apiKey, '\n=====this.options.apiKey\n')
        const operationLogger = new OperationLogger(ctx, { apiKey })
        operationLogger.error(error, { operateTarget })
        ctx.send({
            code: -1,
            message: error.message,
            data: null
        })
    }
}
// 分类组件数量
export const categoryCount = async (ctx) => {
    try {
        const belongProjectId = parseInt(ctx.query.belongProjectId)
        if (!belongProjectId) {
            throw new Error('项目id不能为空')
        }
        const res = await getRepository(Comp)
            .createQueryBuilder()
            .select('categoryId')
            .addSelect('COUNT(id)', 'count')
            .where({
                deleteFlag: 0,
                belongProjectId
            })
            .groupBy('categoryId')
            .getRawMany()

        ctx.send({
            code: 0,
            message: 'success',
            data: res
        })
    } catch (error) {
        ctx.send({
            code: -1,
            message: error.message,
            data: null
        })
    }
}

export const nameMap = async (ctx) => {
    try {
        const data = await ComponentModel.getNameMap()
        ctx.send({
            code: 0,
            message: 'success',
            data
        })
    } catch (error) {
        ctx.send({
            code: -1,
            message: error.message,
            data: null
        })
    }
}

const downloadComponentSource = async (list, projectId, publicComponentMap = {}, callback = 'register') => {
    const result = []
    for (let i = 0; i < list.length; i++) {
        const {
            id,
            name,
            type,
            dest,
            belongProjectId,
            version,
            versionId,
            category,
            categoryId,
            categoryOrder
        } = list[i]

        let offline = Boolean(list[i].status)
        try {
            const configContent = await fileService.downloadFile(`${dest}/config.json`)
            const indexContent = await fileService.downloadFile(`${dest}/index.iife.min.js`)
            const isPublic = `${projectId}` !== `${belongProjectId}`

            // 是公开组件，但是不存于公开记录中
            // 组件的公开状态被改变，按下线状态处理
            if (isPublic && !publicComponentMap[id]) {
                offline = true
            }
            const configObj = JSON.parse(configContent)
            configObj.type = type

            result.push(`
                try {
                    ${callback}(function(Vue) {
                        return [
                            ${JSON.stringify(configObj)},
                            function (resolve, reject) {
                                ${indexContent}
                                resolve(lesscodeCustomComponentLibrary.default)
                            },
                            {
                                id: ${id},
                                versionId: ${versionId},
                                version: "${version}",
                                category: "${category}",
                                categoryId: ${categoryId},
                                categoryOrder: ${categoryOrder},
                                isPublic: ${isPublic},
                                offline: ${offline}
                            }
                        ]
                    })
                } catch {
                    console.error("* 自定义组件 ${name} * 注册失败")
                }
            `)
        } catch (error) {
            throw new Error(`自定义组件 ${name} 下载失败`)
        }
    }
    return result
}
// 页面编辑组件注册
export const register = async (ctx) => {
    ctx.res.setHeader('Content-type', 'application/javascript; charset=utf-8')
    const responseBody = ['window.customCompontensPlugin = []']
    try {
        const requestParams = ctx.request.path.match(/(\d+)/g)
        if (!requestParams) {
            throw new Error('路由参数不合法')
        }

        const [belongProjectId, pageId] = requestParams

        const registeromponentMap = {}

        // 本项目所有组件（不包含已下线组件）
        const onlineComponentList = await ComponentModel.all({
            belongProjectId,
            status: 0,
            deleteFlag: 0
        })

        onlineComponentList.forEach((item) => {
            registeromponentMap[item.id] = item
        })

        const publicComponentMap = {}
        // 对所有项目公开的组件（不包含已下线组件）
        const publicComponentList = await ComponentModel.all({
            isPublic: 1,
            status: 0,
            deleteFlag: 0
        })
        publicComponentList.forEach(item => {
            registeromponentMap[item.id] = item
            publicComponentMap[item.id] = item
        })

        // 指定对当前项目公开的组件（不包含已下线组件）
        const shareList = await CompShareModel.getAll({
            targetProjectId: belongProjectId
        })
        if (shareList.length > 0) {
            const allShareId = shareList.map(_ => _.compId)
            const shareComponentList = await ComponentModel.getDataByCompIds(allShareId)
            shareComponentList.forEach(item => {
                if (item.status === 0) {
                    registeromponentMap[item.id] = item
                    publicComponentMap[item.id] = item
                }
            })
        }
        // 页面中使用到的组件
        const useingVersionList = await PageCompModel.getAll({
            projectId: belongProjectId,
            pageId
        })
        if (useingVersionList.length > 0) {
            const allUseingVersion = useingVersionList.map(_ => _.versionId)
            const useingComponentList = await ComponentModel.getDataByVersion(allUseingVersion)
            useingComponentList.forEach(item => {
                registeromponentMap[item.id] = item
            })
        }
        // 下载所有组件源码
        const componentList = Object.values(registeromponentMap)
        const componentSource = await downloadComponentSource(componentList, belongProjectId, publicComponentMap)

        ctx.response.body = [...responseBody, ...componentSource].join(';\n')
    } catch (error) {
        ctx.response.body = `${responseBody.join(';\n')}; console.log("自定义组件debug info : ${error.message}")`
    }
}

// 页面预览组件注册
export const previewRegister = async (ctx) => {
    ctx.res.setHeader('Content-type', 'application/javascript; charset=utf-8')
    const responseBody = ['window.previewCustomCompontensPlugin = []']
    try {
        const requestParams = ctx.request.url.match(/(\d+)/g)
        if (!requestParams) {
            throw new Error('路由参数不合法')
        }
        const [belongProjectId] = requestParams
        const { v: projectVersionId } = ctx.query

        const registeromponentMap = {}

        // 本项目所有组件
        const projectComponentList = await ComponentModel.all({
            belongProjectId,
            deleteFlag: 0
        })
        projectComponentList.forEach((item) => {
            registeromponentMap[item.id] = item
        })

        // 对所有项目公开的组件
        const publicComponentList = await ComponentModel.all({
            isPublic: 1,
            deleteFlag: 0
        })
        publicComponentList.forEach(item => {
            registeromponentMap[item.id] = item
        })

        // 指定对当前项目公开的组件
        const shareList = await CompShareModel.getAll({
            targetProjectId: belongProjectId
        })
        if (shareList.length > 0) {
            const allShareId = shareList.map(_ => _.compId)
            const shareComponentList = await ComponentModel.getDataByCompIds(allShareId)
            shareComponentList.forEach(item => {
                registeromponentMap[item.id] = item
            })
        }

        // 页面中使用到的组件
        const useingVersionList = await PageCompModel.getAll({
            projectId: belongProjectId,
            projectVersionId
        })
        if (useingVersionList.length > 0) {
            const allUseingVersion = useingVersionList.map(_ => _.versionId)
            const useingComponentList = await ComponentModel.getDataByVersion(allUseingVersion)
            useingComponentList.forEach(item => {
                registeromponentMap[item.id] = item
            })
        }
        const componentList = Object.values(registeromponentMap)
        const componentSource = await downloadComponentSource(componentList, belongProjectId, {}, 'registerPreview')
        ctx.response.body = [...responseBody, ...componentSource].join(';\n')
    } catch {
        ctx.response.body = responseBody.join(';\n')
    }
}

// 设置组件公开范围
export const scope = async (ctx) => {
    const { scope, compId, projectId, targetProjects } = ctx.request.body

    try {
        await getConnection().transaction(async transactionalEntityManager => {
            await transactionalEntityManager.delete(CompShare, {
                compId
            })

            if (scope === 0) {
                // 仅本项目，清空所有共享记录，isPublic=0
                await transactionalEntityManager.update(Comp, compId, { isPublic: 0 })
            } else if (scope === -1) {
                // 特定项目，仅保留最终设置的共享记录，isPublic=0
                const currentUser = RequestContext.getCurrentUser()
                await transactionalEntityManager.update(Comp, compId, { isPublic: 0 })

                const nowDate = new Date()
                await transactionalEntityManager.insert(CompShare, targetProjects.map(targetProjectId => ({
                    compId,
                    sourceProjectId: projectId,
                    targetProjectId,
                    createUser: currentUser.username,
                    createTime: nowDate,
                    updateTime: nowDate,
                    updateUser: currentUser.username
                })))
            } else if (scope === 1) {
                // 所有项目公开
                await transactionalEntityManager.update(Comp, compId, { isPublic: 1 })
            }
        })

        ctx.send({
            code: 0,
            message: 'success'
        })
    } catch (err) {
        ctx.throwError({
            message: err.message
        })
    }
}
