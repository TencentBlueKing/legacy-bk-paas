import { mapGetters, mapMutations } from 'vuex'
import cloneDeep from 'lodash.clonedeep'
import { isInteractiveCompActive } from '@/common/util'
import { bus } from '@/common/bus'
import LC from '@/element-materials/core'

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
        ...mapGetters('components', [
            'interactiveComponents',
            'curNameMap'
        ]),
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
            console.log('from on panel choose ', e, group)
            const {
                type,
                name
            } = cloneDeep(this.componentGroups[group][e.oldIndex])

            const node = LC.createNode(type)

            if (type === 'render-grid') {
                if (name === 'grid2') {
                    node.appendChild(LC.createNode('render-column'))
                } else if (name === 'grid3') {
                    node.appendChild(LC.createNode('render-column'))
                    node.appendChild(LC.createNode('render-column'))
                } else if (name === 'grid4') {
                    node.appendChild(LC.createNode('render-column'))
                    node.appendChild(LC.createNode('render-column'))
                    node.appendChild(LC.createNode('render-column'))
                }
            }
            // todo 判断组件是否是自定义组件
            if (this.curNameMap[node.type]) {
                node.setProperty('isCustomComponent', true)
            }
            
            this.curDragingComponent = node
            if (node.style.display) {
                this.placeholderElemDisplay = node.style.display
            } else {
                this.placeholderElemDisplay = 'block'
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

            /**
             * 当交互式组件激活时，仅允许拖拽到交互式组件的slots中，且交互式组件内部不允许嵌套交互式组件
             * 当有交互式组件打开时，禁用蒙层下方的画布拖拽和交互
             */
            const dragableSourceGroup = Object.assign({}, this.draggableSourceGroup, {
                name: isInteractiveCompActive() && groupName !== 'interactive' ? 'interactiveInnerComp' : groupName
            })

            this.setDraggableSourceGroup(dragableSourceGroup)
        },

        /**
         * vue-draggable clone 回调函数
         *
         * @param {Object} original 当前拖拽的对象（左侧组件列表中的组件）
         */
        cloneFunc (original) {
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
