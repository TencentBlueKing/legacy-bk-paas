/**
 * Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 * Copyright (C) 2017-2019 THL A29 Limited, a Tencent company. All rights reserved.
 * Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://opensource.org/licenses/MIT
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */
import targetDataTool from '@/common/targetData.js'
import cloneDeep from 'lodash.clonedeep'

export default {
    namespaced: true,
    state: {
        // 左侧组件列表 draggable 的 group 配置
        draggableSourceGroup: { name: 'render-grid', pull: 'clone', put: false },
        // 右侧组件列表 draggable 的 group 配置
        draggableTargetGroup: { name: 'render-grid', put: ['render-grid'] },
        // 当前选中的组件的数据
        curSelectedComponentData: {},
        targetData: [],

        pageData: {
            lifeCycle: {
                beforeCreate: '',
                created: '',
                beforeMount: '',
                mounted: '',
                beforeupdate: '',
                updated: '',
                beforeDestroy: '',
                destroyed: ''
            }
        },

        copyData: {},

        targetHistory: [],

        curHistoryIndex: 0,

        // 用于生成 json 配置的数据
        astData: []
    },
    mutations: {
        setCopyData (state, selectedComponent) {
            state.copyData = selectedComponent
        },
        setDraggableSourceGroup (state, group) {
            state.draggableSourceGroup = Object.assign({}, group)
        },
        setDraggableTargetGroup (state, group) {
            state.draggableTargetGroup = Object.assign({}, group)
        },
        setTargetData (state, targetData) {
            state.targetData.splice(0, state.targetData.length, ...targetData)
        },
        setAstData (state, astData) {
            state.astData.splice(0, state.astData.length, ...astData)
        },
        setCurSelectedComponentData (state, selectedComponent) {
            state.curSelectedComponentData = Object.assign({}, selectedComponent)
            // state.curSelectedComponentData = selectedComponent
        },
        setPageData (state, pageData) {
            state.pageData = Object.assign({}, pageData)
        },

        pushTargetHistory (state, pushData) {
            state.targetHistory = state.targetHistory.slice(state.curHistoryIndex)
            state.curHistoryIndex = 0
            const topPushData = state.targetHistory[0] || {}
            const isExis = pushData.component && !Array.isArray(targetDataTool(pushData.component.componentId).value())
            if (pushData.type === 'remove' && topPushData.type === 'add' && topPushData.component.componentId === pushData.component.componentId && isExis) {
                topPushData.type = 'move'
                topPushData.sourceParentNodeId = pushData.parentId
                topPushData.sourceColumnIndex = pushData.columnIndex
                topPushData.sourceChildrenIndex = pushData.childrenIndex

                topPushData.targetParentNodeId = topPushData.parentId
                topPushData.targetColumnIndex = topPushData.columnIndex
                topPushData.targetChildrenIndex = topPushData.childrenIndex
            } else {
                state.targetHistory.unshift(cloneDeep(pushData))
            }
            if (state.targetHistory.length > 50) state.targetHistory.pop()
        },

        backTargetHistory (state) {
            if (state.curHistoryIndex >= state.targetHistory.length) return
            const pushData = state.targetHistory[state.curHistoryIndex]
            state.curHistoryIndex++
            const targetData = targetDataTool()
            const component = pushData.component
            const parentId = pushData.parentId
            switch (pushData.type) {
                case 'update':
                    targetData.update(component)
                    break
                case 'add':
                    targetData.remove(component.componentId)
                    break
                case 'remove':
                    targetData.appendChildByIndex(component, parentId, pushData.columnIndex, pushData.childrenIndex)
                    break
                case 'move':
                    targetData.move(pushData.targetParentNodeId, pushData.targetColumnIndex, pushData.targetChildrenIndex, pushData.sourceParentNodeId, pushData.sourceColumnIndex, pushData.sourceChildrenIndex)
                    break
                case 'clear':
                    targetData.setTargetData(pushData.oldTargetData)
                    break
            }
        },

        forwardTargetHistory (state) {
            if (state.curHistoryIndex <= 0) return
            state.curHistoryIndex--
            const pushData = state.targetHistory[state.curHistoryIndex]
            const targetData = targetDataTool()
            const component = pushData.component
            const parentId = pushData.parentId
            switch (pushData.type) {
                case 'update':
                    const modifier = pushData.modifier
                    targetData.update(Object.assign({}, component, modifier))
                    break
                case 'add':
                    targetData.appendChildByIndex(component, parentId, pushData.columnIndex, pushData.childrenIndex)
                    break
                case 'remove':
                    targetData.remove(component.componentId)
                    break
                case 'move':
                    targetData.move(pushData.sourceParentNodeId, pushData.sourceColumnIndex, pushData.sourceChildrenIndex, pushData.targetParentNodeId, pushData.targetColumnIndex, pushData.targetChildrenIndex)
                    break
                case 'clear':
                    targetData.setTargetData(pushData.newTargetData)
                    break
            }
        }
    },
    getters: {
        draggableSourceGroup: state => state.draggableSourceGroup,
        draggableTargetGroup: state => state.draggableTargetGroup,
        targetData: state => state.targetData,
        copyData: state => state.copyData,
        astData: state => state.astData,
        curSelectedComponentData: state => state.curSelectedComponentData,
        pageData: state => state.pageData
    },
    actions: {

    }
}
