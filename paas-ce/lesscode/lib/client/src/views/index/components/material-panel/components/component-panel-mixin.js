import { mapGetters, mapMutations } from 'vuex'
import cloneDeep from 'lodash.clonedeep'
// import { bus } from '@/common/bus'
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
    created () {
        this.newNode = null
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
            // 自定义组件
            if (this.curNameMap[node.type]) {
                node.setProperty('isCustomComponent', true)
            }
            // 交互式组件
            if (LC.isInteractiveType(node.type)) {
                node.setProperty('isInteractiveComponent', true)
            }
            this.placeholderElemDisplay = node.style.display ? node.style.display : 'block'

            this.newNode = node

            let groupName = ''
            if (['free-layout', 'render-grid'].includes(type)) {
                groupName = 'layout'
            } else if (LC.isInteractiveType(type)) {
                groupName = 'interactive'
            } else {
                groupName = 'component'
            }

            this.setDraggableSourceGroup(Object.assign({}, this.draggableSourceGroup, { name: groupName }))
        },

        /**
         * vue-draggable clone 回调函数
         *
         * @param {Object} original 当前拖拽的对象（左侧组件列表中的组件）
         */
        cloneFunc (original) {
            return this.newNode
            // return this.curDragingComponent
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
            // if (this.interactiveComponents.includes(this.curDragingComponent.type)) {
            //     const id = this.curDragingComponent.componentId
            //     const targetNode = this.$td().setCurInteractiveVisible(id, true)
            //     this.setCurSelectedComponentData(cloneDeep(targetNode))
            //     bus.$emit('selected-tree', id)
            // }

            // this.placeholderElemDisplay = ''
            // this.setFreeLayoutItemPlaceholderPointerEvents('none')
            // console.warn('sourceAreaEndHandler', this.curDragingComponent)
            // console.warn('left to right end, targetData: ', this.targetData)
            // console.warn('左侧面板拖动 grid 和 component 到画布中 end', e)
        }
    }
}
