<template>
    <menu-item :item="item"></menu-item>
</template>

<script>
    import { mapGetters } from 'vuex'
    import LC from '@/element-materials/core'
    import MenuItem from './menu-item'
    
    export default {
        components: {
            MenuItem
        },
        data () {
            return {
                item: {
                    icon: 'bk-drag-icon bk-drag-save',
                    text: '保存',
                    func: this.handleSave
                }
            }
        },
        computed: {
            ...mapGetters('functions', ['funcGroups']),
            ...mapGetters('variable', ['variableList'])
        },
        methods: {
            handleSave () {
                const targetData = LC.getRoot().children

                console.log('from processTargetData = ', targetData, this.variableList, this.funcGroups)

                const customComponentMap = {}
                const relatedVariableCodeMap = {}
                const relatedMethodCodeMap = {}
                const recTree = node => {
                    if (!node) {
                        return
                    }
                    if (node.isCustomComponent) {
                        customComponentMap[node.type] = true
                    }
                    Object.keys(node.method).forEach(methodCode => {
                        relatedMethodCodeMap[methodCode] = true
                    })
                    Object.keys(node.variable).forEach(variableStyle => {
                        const variableCode = node.variable[variableStyle].val
                        if (!relatedVariableCodeMap[variableCode]) {
                            relatedVariableCodeMap[variableCode] = []
                        }
                        relatedVariableCodeMap[variableCode].push(Object.assign({
                            componentId: node.componentId
                        }, node.variable[variableStyle]))
                    })
                    node.children.forEach(childNode => recTree(childNode))
                }
                recTree(LC.getRoot())

                const errorStack = []
                const projectVarialbeMap = this.variableList.reduce((result, variableData) => {
                    result[variableData.variableCode] = variableData
                    return result
                }, {})
                const projectMethodMap = this.funcGroups.reduce((result, methodGroup) => {
                    methodGroup.functionList.forEach(method => {
                        result[method.funcCode] = method
                    })
                    return result
                }, {})

                // 检测 varaible 有效性
                Object.keys(relatedVariableCodeMap).forEach(variableCode => {
                    if (!projectVarialbeMap.hasOwnProperty(variableCode)) {
                        errorStack.push(`组件【${relatedVariableCodeMap[variableCode].componentId}】使用的变量【${variableCode}】不存在，请修改后再试`)
                    }
                })
                // 检测 method 有效性
                Object.keys(relatedMethodCodeMap).forEach(methodCode => {
                    if (!projectMethodMap.hasOwnProperty(methodCode)) {
                        errorStack.push(`函数【${methodCode}】未找到，请修改后再试`)
                    }
                })
                // 检测 variable 和 method 重名
                Object.keys(relatedVariableCodeMap).forEach(variableCode => {
                    if (relatedMethodCodeMap[variableCode]) {
                        errorStack.push(`页面中使用了函数【${variableCode}】，与使用的变量【${variableCode}】的标识存在冲突，请修改后再试`)
                    }
                })
                // 错误提示
                if (errorStack.length > 0) {
                    this.messageError(errorStack.join('\n'))
                    return
                }

                // 转换 variableCode、methodCode 到具体的资源 id
                const relateVariableIdMap = Object.keys(relatedVariableCodeMap).reduce((result, variableCode) => {
                    result[projectVarialbeMap[variableCode].id] = relatedVariableCodeMap[variableCode]
                    return result
                }, {})
                const releateMethodIdList = Object.keys(relatedMethodCodeMap).reduce((result, methodCode) => {
                    result.push(projectMethodMap[methodCode].id)
                    return result
                }, [])

                console.log('print processTargetData result = ', customComponentMap, releateMethodIdList, relateVariableIdMap)
            }
        }
    }
</script>
