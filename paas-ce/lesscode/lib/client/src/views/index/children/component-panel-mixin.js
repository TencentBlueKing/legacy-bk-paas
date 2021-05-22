import { mapGetters, mapMutations } from 'vuex'
import cloneDeep from 'lodash.clonedeep'
import { uuid } from '@/common/util'
import { bus } from '@/common/bus'

export default {
    props: {
        componentList: {
            type: Array,
            default: () => ([])
        },
        searchResult: {
            type: Object,
            default: () => ({})
        },
        dragingComponent: {
            type: Object,
            default: null
        }
    },
    data () {
        return {
            componentGroupFolded: {},
            placeholderElemDisplay: '',
            curDragingComponent: this.dragingComponent
        }
    },
    computed: {
        ...mapGetters('drag', [
            'draggableSourceGroup',
            'targetData'
        ]),
        ...mapGetters('components', ['interactiveComponents']),
        componentGroups () {
            const componentGroups = {}
            // 分组
            this.componentList.forEach(component => {
                const groupName = component.group
                const componentGroup = componentGroups[groupName]
                if (componentGroup) {
                    componentGroup.push(component)
                } else {
                    componentGroups[groupName] = [component]
                }
            })

            // 组内排序
            Object.values(componentGroups).forEach(list => {
                list.sort((a, b) => a.order - b.order)
            })

            return componentGroups
        }
    },
    activated () {
    },
    deactivated () {
    },
    methods: {
        ...mapMutations('drag', [
            'setDraggableSourceGroup',
            'setFreeLayoutItemPlaceholderPointerEvents',
            'setCurSelectedComponentData'
        ]),

        /**
         * 判断是否显示组件组
         *
         * @param {String} group 组名
         */
        isShowComponentGroup (group) {
            return !this.searchResult || group === this.searchResult.group
        },

        /**
         * 获取组件组的class
         *
         * @param {String} group 组名
         * @param {Number} group 索引
         */
        getComponentGroupClass (group, groupIndex) {
            return [
                'component-group',
                {
                    'first': groupIndex === 0,
                    'folded': this.componentGroupFolded[group],
                    'search-show': this.searchResult && group === this.searchResult.group
                }
            ]
        },

        handleCompGroupFold (group) {
            this.$set(this.componentGroupFolded, group, !this.componentGroupFolded[group])
        },

        /**
         * 左侧组件列表区域拖拽 choose 回调函数
         * 事件触发顺序 onChoose cloneFunc onStart moveFunc(n) onEnd
         *
         * @param {Object} e 事件对象
         * @param {string} group group 标识
         */
        onChoose (e, group) {
            const uid = uuid()
            const component = cloneDeep(this.componentGroups[group][e.oldIndex])
            const { name = '', type = '', props = {}, directives = [], isComplexComponent = false } = component
            const id = component.name + '-' + uid
            const renderDirectives = directives
            const renderProps = Object.assign({}, ['bk-dialog', 'bk-sideslider'].includes(type) ? {
                transfer: {
                    type: Boolean,
                    val: false
                }
            } : {})

            Object.keys(props).forEach(k => {
                if (props[k].hasOwnProperty('val') && props[k].val !== '') {
                    renderProps[k] = props[k]
                }
            })

            const renderStyles = {}
            const styles = component.styles || []
            console.log(styles, 'styles')
            const componentDefaultStyles = component.renderStyles || {}
            styles.forEach(st => {
                if (st === 'size') {
                    if (componentDefaultStyles.hasOwnProperty('height')) {
                        renderStyles['height'] = component.renderStyles['height']
                    }
                    if (componentDefaultStyles.hasOwnProperty('width')) {
                        renderStyles['width'] = component.renderStyles['width']
                    }
                } else if (st === 'font') {
                    if (componentDefaultStyles.hasOwnProperty('fontSize')) {
                        renderStyles['fontSize'] = component.renderStyles['fontSize']
                    }
                    if (componentDefaultStyles.hasOwnProperty('fontFamily')) {
                        renderStyles['fontFamily'] = component.renderStyles['fontFamily']
                    }
                    if (componentDefaultStyles.hasOwnProperty('fontWeight')) {
                        renderStyles['fontWeight'] = component.renderStyles['fontWeight']
                    }
                    if (componentDefaultStyles.hasOwnProperty('fontStyle')) {
                        renderStyles['fontStyle'] = component.renderStyles['fontStyle']
                    }
                    if (componentDefaultStyles.hasOwnProperty('fontVariant')) {
                        renderStyles['fontVariant'] = component.renderStyles['fontVariant']
                    }
                    if (componentDefaultStyles.hasOwnProperty('fontVariant')) {
                        renderStyles['fontVariant'] = component.renderStyles['fontVariant']
                    }
                    if (componentDefaultStyles.hasOwnProperty('whiteSpace')) {
                        renderStyles['whiteSpace'] = component.renderStyles['whiteSpace']
                    }
                    if (componentDefaultStyles.hasOwnProperty('wordBreak')) {
                        renderStyles['wordBreak'] = component.renderStyles['wordBreak']
                    }
                    // if (componentDefaultStyles.hasOwnProperty('lineHeight')) {
                    //     renderStyles['lineHeight'] = component.renderStyles['lineHeight']
                    // }
                } else {
                    if (componentDefaultStyles.hasOwnProperty(st)) {
                        renderStyles[st] = component.renderStyles[st]
                    }
                }
            })
            if (renderStyles.hasOwnProperty('display')) {
                this.placeholderElemDisplay = renderStyles['display']
            } else {
                this.placeholderElemDisplay = 'block'
            }

            this.curDragingComponent = {
                componentId: id,
                tabPanelActive: 'props', // 默认tab选中的面板
                renderKey: uuid(),
                name,
                type,
                renderProps: renderProps,
                renderStyles: { ...renderStyles },
                renderEvents: {},
                interactiveShow: component.interactiveShow || false,
                isComplexComponent: isComplexComponent,
                renderDirectives
            }
            this.$emit('update:dragingComponent', this.curDragingComponent)

            let groupName = ''
            if (type === 'render-grid') {
                groupName = 'render-grid'
            } else if (type === 'free-layout') {
                groupName = 'free-layout'
            } else if (this.interactiveComponents.includes(type)) {
                groupName = 'interactive'
            } else {
                groupName = 'component'
            }
            this.setDraggableSourceGroup(Object.assign({}, this.draggableSourceGroup, {
                name: groupName
            }))
        },

        /**
         * vue-draggable clone 回调函数
         *
         * @param {Object} original 当前拖拽的对象（左侧组件列表中的组件）
         */
        cloneFunc (original) {
            // this.setDraggableSourceGroup(Object.assign({}, this.draggableSourceGroup, {
            //     name: original.type === 'render-grid' ? 'render-grid' : 'component'
            // }))
            // console.log('from clonexxx', this.curDragingComponent)

            // let name = ''
            // if (original.type === 'render-grid') {
            //     name = 'render-grid'
            // } else if (original.type === 'free-layout') {
            //     name = 'free-layout'
            // } else {
            //     name = 'component'
            // }
            // this.setDraggableSourceGroup(Object.assign({}, this.draggableSourceGroup, {
            //     name
            // }))

            // console.error(name)
            // console.warn(JSON.stringify(this.draggableSourceGroup, null, 2))
            // console.error(JSON.stringify(this.draggableTargetGroup, null, 2))

            // debugger
            // // 这里需要换 id，否则同样的组件拖到右边后，id 是一样的，右边同样的组件之间就没法拖动
            // // return Object.assign({}, original, { componentId: uuid() })
            return this.curDragingComponent
        },

        sourceAreaStartHandler (e) {
            this.setFreeLayoutItemPlaceholderPointerEvents('all')
            console.log('sourceAreaStartHandler', e, this.curDragingComponent)
        },

        dragstartHandler (e) {
            // console.log('dragstartHandler')
            // e.dataTransfer.setData('free-layout-data', JSON.stringify(this.curDragingComponent))
        },

        onMove (e) {
            // console.error('onMove')
        },

        /**
         * 左侧组件列表区域拖拽 end 回调函数
         * 当把左侧组件列表区的组件拖入到右侧拖拽区中时会触发（拖拽到右侧拖拽区以及拖拽到右侧拖拽区的组件中两种情况均会触发）
         *
         * @param {Object} e 事件对象
         */
        sourceAreaEndHandler (e) {
            // 如果是交互式组件，设置当前拖拽的新组建为可见，其他组件设置为不可见
            if (this.interactiveComponents.includes(this.curDragingComponent.type)) {
                const id = this.curDragingComponent.componentId
                const targetNode = this.$td().setCurInteractiveVisible(id, true)
                this.setCurSelectedComponentData(cloneDeep(targetNode))
                bus.$emit('selected-tree', id)
            }

            this.placeholderElemDisplay = ''
            this.setFreeLayoutItemPlaceholderPointerEvents('none')
            console.warn('sourceAreaEndHandler', this.curDragingComponent)
            console.warn('left to right end, targetData: ', this.targetData)
            console.warn('左侧面板拖动 grid 和 component 到画布中 end', e)
        }
    }
}
