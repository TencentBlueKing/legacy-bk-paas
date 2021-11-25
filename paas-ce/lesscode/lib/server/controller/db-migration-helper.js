import { getConnection, getRepository } from 'typeorm'
import ApiMigraion from '../model/entities/api-migration'
import Project from '../model/entities/project'
import { logger } from '../logger'
import Page from '../model/entities/page'
import PageTemplateCategory from '../model/entities/page-template-category'
import { walkGrid, uuid } from '../util'

// 将函数名称写到这个数组里，函数会自动执行，返回成功则后续不会再执行
const apiArr = ['setDefaultPageTemplateCategory', 'updateCardSlot', 'fixCardsSlots']

export const executeApi = async () => {
    const apiRecords = await getRepository(ApiMigraion).find()
    apiArr.forEach(async api => {
        if (!apiRecords.find(item => item.name === api)) {
            const res = await getRepository(ApiMigraion).save([{ name: api }])
            const id = res[0] && res[0].id
            // eslint-disable-next-line no-eval
            const result = await eval(`${api}('${api}')`)
            if (result && result.code === 0) {
                console.log(result.message)
            } else {
                const deleteRes = await getRepository(ApiMigraion).delete({ id })
                console.log(deleteRes, 'delete')
            }
        }
    })
}

/**
 * 为老项目设置页面模板的默认类别
 */
// eslint-disable-next-line no-unused-vars
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

// eslint-disable-next-line no-unused-vars
async function updateCardSlot () {
    try {
        const pageRepository = getRepository(Page)
        const allPageData = await pageRepository.find()
        allPageData.forEach(page => {
            let targetData = []
            try {
                targetData = (typeof page.content) === 'string' ? JSON.parse(page.content) : page.content
            } catch (err) {
                targetData = []
            }
            if (!targetData || targetData === 'null') {
                logger.warn('targetData does not exist or is \'null\'')
                targetData = []
            }

            (targetData || []).forEach((grid, index) => {
                const callBack = (component) => {
                /** renderSlots如果没有header，证明是旧数据，应该格式化其结构 */
                    if (component.type === 'bk-card' && component.renderSlots.header === undefined) {
                        const originValue = component.renderProps.title.val
                        component.renderProps['disable-header-style'] = { 'type': 'hidden', 'val': true, 'payload': {}, 'attrs': [] }
                        component.renderSlots = {
                            'default': {
                                'name': 'layout',
                                'type': 'free-layout',
                                'display': 'hidden',
                                'val': {
                                    'name': 'free-layout',
                                    'type': 'free-layout',
                                    'slotName': '',
                                    'slotContainer': true,
                                    'renderProps': {

                                    },
                                    'renderStyles': {
                                        'height': '200px',
                                        'pointer-events': 'auto'
                                    },
                                    'renderEvents': {

                                    },
                                    'renderDirectives': [

                                    ],
                                    'renderSlots': {
                                        'default': {
                                            'type': 'free-layout-item',
                                            'val': [
                                                {
                                                    'children': [

                                                    ]
                                                }
                                            ]
                                        }
                                    },
                                    'componentId': 'free-layout-247bde35'
                                }
                            },
                            'header': {
                                'name': 'layout',
                                'type': 'free-layout',
                                'display': 'hidden',
                                'val': {
                                    'name': 'free-layout',
                                    'type': 'free-layout',
                                    'slotName': '',
                                    'slotContainer': true,
                                    'renderProps': {
                                        'no-response': true
                                    },
                                    'renderStyles': {
                                        'height': '50px',
                                        'pointer-events': 'auto'
                                    },
                                    'renderEvents': {

                                    },
                                    'renderDirectives': [

                                    ],
                                    'renderSlots': {
                                        'default': {
                                            'type': 'free-layout-item',
                                            'val': [
                                                {
                                                    'children': [
                                                        {
                                                            'componentId': 'text-28a11b0c',
                                                            'tabPanelActive': 'styles',
                                                            'renderKey': 'dcadd06d',
                                                            'name': 'text',
                                                            'type': 'span',
                                                            'renderProps': {
                                                                'inFreeLayout': {
                                                                    'val': true
                                                                },
                                                                'title': {
                                                                    'type': 'string',
                                                                    'val': '',
                                                                    'payload': {

                                                                    },
                                                                    'attrs': [

                                                                    ]
                                                                }
                                                            },
                                                            'renderStyles': {
                                                                'display': 'inline-block',
                                                                'fontSize': '16px',
                                                                'textAlign': 'center',
                                                                'top': '12px',
                                                                'left': '7px'
                                                            },
                                                            'renderEvents': {

                                                            },
                                                            'interactiveShow': false,
                                                            'isComplexComponent': false,
                                                            'renderDirectives': [

                                                            ],
                                                            'renderSlots': {
                                                                'default': {
                                                                    'name': 'text',
                                                                    'type': 'text',
                                                                    'displayName': '文本配置',
                                                                    'val': originValue,
                                                                    'regExp': {

                                                                    },
                                                                    'regErrorText': '文本配置不能为空'
                                                                }
                                                            },
                                                            'isCustomComponent': false
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    },
                                    'componentId': 'free-layout-653078f9',
                                    'renderKey': '8bf3d94e'
                                }
                            },
                            'footer': {
                                'name': 'layout',
                                'type': 'free-layout',
                                'display': 'hidden',
                                'val': {
                                    'name': 'free-layout',
                                    'type': 'free-layout',
                                    'slotName': '',
                                    'slotContainer': true,
                                    'renderProps': {

                                    },
                                    'renderStyles': {
                                        'height': '50px',
                                        'pointer-events': 'auto'
                                    },
                                    'renderEvents': {

                                    },
                                    'renderDirectives': [

                                    ],
                                    'renderSlots': {
                                        'default': {
                                            'type': 'free-layout-item',
                                            'val': [
                                                {
                                                    'children': [

                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                walkGrid(targetData, grid, callBack, callBack, index)
            })
            page.content = JSON.stringify(targetData)
            page.updateBySystem = true
        })

        await pageRepository.save(allPageData)
        return {
            code: 0,
            message: 'card存量数据更新成功'
        }
    } catch (error) {
        return {
            code: -1,
            message: error.message || error,
            data: null
        }
    }
}

// eslint-disable-next-line no-unused-vars
async function fixCardsSlots () {
    try {
        const pageRepository = getRepository(Page)
        const allPageData = await pageRepository.find()
        allPageData.forEach(page => {
            let targetData = []
            try {
                targetData = (typeof page.content) === 'string' ? JSON.parse(page.content) : page.content
            } catch (err) {
                targetData = []
            }
            if (!targetData || targetData === 'null') {
                logger.warn('targetData does not exist or is \'null\'')
                targetData = []
            }

            (targetData || []).forEach((grid, index) => {
                const callBack = (component) => {
                /** 对card的componentId做唯一处理 */
                    if (component.type === 'bk-card') {
                        const slots = component.renderSlots
                        const headerSlot = slots.header.val.renderSlots.default.val[0].children[0]
                        slots.default.val.componentId = `free-layout-${uuid()}`
                        slots.header.val.componentId = `free-layout-${uuid()}`
                        slots.footer.val.componentId = `free-layout-${uuid()}`
                        if (headerSlot) {
                            headerSlot.componentId = `text-${uuid()}`
                            headerSlot.renderStyles.textAlign = 'left'
                        }
                    }
                }
                walkGrid(targetData, grid, callBack, callBack, index)
            })
            page.content = JSON.stringify(targetData)
            page.updateBySystem = true
        })

        await pageRepository.save(allPageData)
        return {
            code: 0,
            message: 'card修复成功'
        }
    } catch (error) {
        console.log(error)
        return {
            code: -1,
            message: error.message || error,
            data: null
        }
    }
}
