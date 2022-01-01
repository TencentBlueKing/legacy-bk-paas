<template>
    <menu-item :item="item"></menu-item>
</template>

<script>
    import MenuItem from './menu-item'
    import LC from '@/element-materials/core'
    // import { circleJSON } from '@/common/util.js'
    import { mapGetters } from 'vuex'

    import html2canvas from 'html2canvas'
    import previewErrorImg from '@/images/preview-error.png'

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
    
    export default {
        components: {
            MenuItem
        },
        data () {
            return {
                item: {
                    icon: 'bk-drag-icon bk-drag-play',
                    text: '预览',
                    func: this.handlePreview
                }
            }
        },
        computed: {
            ...mapGetters('functions', ['funcGroups']),
            ...mapGetters('variable', ['variableList']),
            ...mapGetters('page', [
                'pageDetail'
            ]),
            ...mapGetters('drag', [
                'curTemplateData'
            ]),
            // ...mapGetters('page', ['pageDetail']),
            projectId () {
                return this.$route.params.projectId || ''
            }
        },
        methods: {
            async handlePreview () {
                await this.handleSave()
                // localStorage.removeItem('layout-target-data')
                // localStorage.setItem('layout-target-data', circleJSON(LC.getRoot().toJSON().renderSlots.default))
                const routerUrl = `/preview/project/${this.projectId}/?pageCode=${this.pageDetail.pageCode}`
                window.open(routerUrl, '_blank')
            },

            updatePreviewImg () {
                html2canvas(document.querySelector('.main-content')).then(async (canvas) => {
                    const imgData = canvas.toDataURL('image/png')
                    this.$store.dispatch('page/update', {
                        data: {
                            projectId: this.projectId,
                            pageData: {
                                id: parseInt(this.$route.params.pageId),
                                previewImg: imgData || previewErrorImg
                            }
                        }
                    })
                })
            },
            async handleSave () {
                const targetData = LC.getRoot().children

                console.log('from processTargetData = ', targetData, this.variableList, this.funcGroups)

                const customComponentMap = {}
                const relatedVariableCodeMap = {}
                const relatedMethodCodeMap = {}

                const recTree = node => {
                    if (!node) {
                        return
                    }
                    // 手机页面使用的自定义组件
                    if (node.isCustomComponent) {
                        customComponentMap[node.type] = true
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

                const errorStack = []
                // 项目中所有变量，以 variableCode 作为索引 key
                const projectVarialbeMap = this.variableList.reduce((result, variableData) => {
                    result[variableData.variableCode] = variableData
                    return result
                }, {})
                // 项目中所有函数，以 funcCode 作为索引 key
                const projectMethodMap = this.funcGroups.reduce((result, methodGroup) => {
                    methodGroup.functionList.forEach(methodData => {
                        result[methodData.funcCode] = methodData
                    })
                    return result
                }, {})

                // 检测 varaible 有效性
                Object.keys(relatedVariableCodeMap).forEach(variableCode => {
                    if (!projectVarialbeMap.hasOwnProperty(variableCode)) {
                        relatedVariableCodeMap[variableCode].forEach(record => {
                            errorStack.push(`组件【${record.componentId}】使用的变量【${variableCode}】不存在`)
                        })
                    }
                })

                // 检测 method 有效性
                // 解析被引用 method 的 funcBody 内使用的 method、variable
                Object.keys(relatedMethodCodeMap).forEach(methodCode => {
                    if (!projectMethodMap.hasOwnProperty(methodCode)) {
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
                    const funcbody = projectMethodMap[methodCode].funcBody
                    // 使用的函数在检测变量时需要解析出 funcbody 引用的变量，并判断变量的有效性
                    Object.assign(funcBodyContainontainMethodMap, parseFuncBodyMethod(funcbody))
                    Object.assign(funcBodyContainontainVariableMap, parseFuncBodyVariable(funcbody))
                    Object.keys(funcBodyContainontainVariableMap).forEach(variableCode => {
                        if (!projectVarialbeMap.hasOwnProperty(variableCode)) {
                            errorStack.push(`函数【${methodCode}】函数体中标识为【${variableCode}】的变量不存在`)
                        }
                    })
                    Object.keys(funcBodyContainontainMethodMap).forEach(code => {
                        if (!projectMethodMap.hasOwnProperty(code)) {
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

                // 页面模板数据
                const {
                    layoutType,
                    logo,
                    siteName,
                    menuList = [],
                    topMenuList = [],
                    renderProps = {}
                } = this.curTemplateData

                const templateData = layoutType === 'empty' ? {} : {
                    logo,
                    siteName,
                    menuList,
                    topMenuList,
                    renderProps
                }

                await this.$store.dispatch('page/update', {
                    data: {
                        from: '',
                        projectId: this.$route.params.projectId,
                        pageCode: this.pageDetail.pageCode,
                        pageData: {
                            id: parseInt(this.$route.params.pageId),
                            content: JSON.stringify(LC.getRoot().toJSON().renderSlots.default)
                        },
                        // TODO.
                        customCompData: [],
                        functionData: releateMethodIdList,
                        usedVariableMap: releateMethodIdList,
                        templateData
                    }
                })
                this.updatePreviewImg()

                this.messageSuccess('保存成功')

                console.log('print processTargetData result = ', customComponentMap, releateMethodIdList, relateVariableIdMap, templateData)
            }
        }
    }
</script>
