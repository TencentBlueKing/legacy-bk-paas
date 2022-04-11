import Vue from 'vue'
import { ref, computed, getCurrentInstance } from '@vue/composition-api'
import LC from '@/element-materials/core'
import { useStore } from '@/store'
import { useRoute } from '@/router'

const parseFuncBodyVariable = str => {
    const pat = /lesscode\['\$\{prop:([^}]+)\}'\]/g
    const res = {}
    let match = null
    while ((match = pat.exec(str)) !== null) {
        res[match[1]] = true
    }
    return res
}

const parseFuncBodyMethod = str => {
    const pat = /lesscode\['\$\{func:([^}]+)\}'\]/g
    const res = {}
    let match = null
    while ((match = pat.exec(str)) !== null) {
        res[match[1]] = true
    }
    return res
}

export default () => {
    const store = useStore()
    const route = useRoute()

    const isLoading = ref(false)
    const functionList = computed(() => store.getters['functions/functionList'])
    const variableList = computed(() => store.getters['variable/variableList'])
    const curTemplateData = computed(() => store.getters['drag/curTemplateData'])
    const pageDetail = computed(() => store.getters['page/pageDetail'])
    const versionId = computed(() => store.getters['projectVersion/versionId'])
    
    const currentInstance = getCurrentInstance()

    const submit = () => {
        const relatedCustomComponentMap = {}
        const relatedVariableCodeMap = {}
        const relatedMethodCodeMap = {}

        const recTree = node => {
            if (!node) {
                return
            }

            // 收集页面使用的自定义组件
            if (node.isCustomComponent) {
                relatedCustomComponentMap[node.type] = true
            }
            Object.keys(node.method).forEach(methodPathKey => {
                relatedMethodCodeMap[node.method[methodPathKey].code] = Object.assign(node.method[methodPathKey], {
                    componentId: node.componentId
                })
            })
            Object.keys(node.variable).forEach(variablePathKey => {
                const variableCode = node.variable[variablePathKey].code
                if (!variableCode) {
                    return
                }
                // 一个变量可能被一个组件多次使用
                // 需要记录变量的每一处使用细节
                if (!relatedVariableCodeMap[variableCode]) {
                    relatedVariableCodeMap[variableCode] = []
                }
                relatedVariableCodeMap[variableCode].push(Object.assign(node.variable[variablePathKey], {
                    componentId: node.componentId
                }))
            })
            node.children.forEach(childNode => recTree(childNode))
        }
        // 遍历 node tree 收集组件中 variable、method 的引用信息
        recTree(LC.getRoot())

        // 收集生命周期中的函数
        Object.keys(pageDetail.value.lifeCycle).forEach((key) => {
            const value = pageDetail.value.lifeCycle[key]
            const methodCode = typeof value === 'object' ? value.methodCode : value
            if (methodCode) {
                relatedMethodCodeMap[methodCode] = methodCode
            }
        })

        const errorStack = []
        // 项目中所有变量，以 variableCode 作为索引 key
        const projectVarialbeCodeMap = variableList.value.reduce((result, variableData) => {
            result[variableData.variableCode] = variableData
            return result
        }, {})
        // 项目中所有函数，以 funcCode 作为索引 key
        const projectMethodCodeMap = functionList.value.reduce((result, methodData) => {
            result[methodData.funcCode] = methodData
            return result
        }, {})

        // 检测 varaible 有效性
        Object.keys(relatedVariableCodeMap).forEach(variableCode => {
            if (!projectVarialbeCodeMap.hasOwnProperty(variableCode)) {
                relatedVariableCodeMap[variableCode].forEach(record => {
                    errorStack.push(`组件【${record.componentId}】使用的变量【${variableCode}】不存在`)
                })
            }
        })

        // 检测 method 有效性
        // 解析被引用 method 的 funcBody 内使用的 method、variable
        Object.keys(relatedMethodCodeMap).forEach(methodCode => {
            if (!projectMethodCodeMap.hasOwnProperty(methodCode)) {
                const {
                    componentId,
                    source,
                    key
                } = relatedMethodCodeMap[methodCode]
                errorStack.push(`组件【${componentId}】的 ${source} ${key} 引用标识为【${methodCode}】的函数不存在`)
                return
            }
            const funcBodyContainontainMethodMap = {}
            const funcBodyContainontainVariableMap = {}
            const funcbody = projectMethodCodeMap[methodCode].funcBody
            // 使用的函数在检测变量时需要解析出 funcbody 引用的变量，并判断变量的有效性
            Object.assign(funcBodyContainontainMethodMap, parseFuncBodyMethod(funcbody))
            Object.assign(funcBodyContainontainVariableMap, parseFuncBodyVariable(funcbody))
            Object.keys(funcBodyContainontainVariableMap).forEach(variableCode => {
                if (!projectVarialbeCodeMap.hasOwnProperty(variableCode)) {
                    errorStack.push(`函数【${methodCode}】函数体中标识为【${variableCode}】的变量不存在`)
                }
            })
            Object.keys(funcBodyContainontainMethodMap).forEach(code => {
                if (!projectMethodCodeMap.hasOwnProperty(code)) {
                    errorStack.push(`函数【${methodCode}】函数体中标识为【${code}】的函数不存在`)
                }
            })
        })
        // 检测 variable 和 method 重名
        Object.keys(relatedVariableCodeMap).forEach(variableCode => {
            if (relatedMethodCodeMap[variableCode]) {
                errorStack.push(`页面中标识为【${variableCode}】的函数与标识为【${variableCode}】的变量存在冲突`)
            }
        })
        
        // 错误提示
        if (errorStack.length > 0) {
            const h = currentInstance.proxy.$createElement
            currentInstance.proxy.$bkMessage({
                theme: 'error',
                offsetY: 80,
                ellipsisLine: 0,
                message: h('div', {}, errorStack.map(errorText => h('div', errorText)))
            })
            return Promise.reject(new Error('数据不完整'))
        }

        // 转换 variableCode、methodCode 到具体的资源 id
        const relateVariableIdMap = Object.keys(relatedVariableCodeMap).reduce((result, variableCode) => {
            result[projectVarialbeCodeMap[variableCode].id] = relatedVariableCodeMap[variableCode]
            return result
        }, {})
        const releateMethodIdList = Object.keys(relatedMethodCodeMap).reduce((result, methodCode) => {
            result.push(projectMethodCodeMap[methodCode].id)
            return result
        }, [])

        // 页面模板数据
        const {
            layoutType,
            logo,
            siteName,
            menuList = [],
            topMenuList = [],
            renderProps = {}
        } = curTemplateData.value

        const templateData = layoutType === 'empty' ? {} : {
            logo,
            siteName,
            menuList,
            topMenuList,
            renderProps
        }

        // 关联自定义组件的id、versionId
        const customCompData = window.customCompontensPlugin.reduce((result, registerCallback) => {
            const [
                config,
                ,
                baseInfo
            ] = registerCallback(Vue)
            if (relatedCustomComponentMap[config.type]) {
                result.push({
                    compId: baseInfo.id,
                    versionId: baseInfo.versionId
                })
            }
            return result
        }, [])

        isLoading.value = true
        return store.dispatch('page/update', {
            data: {
                from: '',
                projectId: route.params.projectId,
                pageCode: pageDetail.value.pageCode,
                versionId: versionId.vlaue,
                pageData: {
                    id: parseInt(route.params.pageId),
                    content: JSON.stringify(LC.getRoot().toJSON().renderSlots.default)
                },
                customCompData: customCompData,
                functionData: releateMethodIdList,
                usedVariableMap: relateVariableIdMap,
                templateData
            }
        }).then(() => {
            currentInstance.proxy.messageSuccess('保存成功')
        }).finally(() => {
            isLoading.value = false
        })
    }

    return [
        isLoading,
        submit
    ]
}
