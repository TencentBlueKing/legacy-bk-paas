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

        functionGroup: [],

        // 用于生成 json 配置的数据
        astData: []
    },
    mutations: {
        setFunctionGroup (state, functionGroup) {
            localStorage.setItem('functionGroup', JSON.stringify(functionGroup))
            state.functionGroup = functionGroup
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
        }
    },
    getters: {
        draggableSourceGroup: state => state.draggableSourceGroup,
        draggableTargetGroup: state => state.draggableTargetGroup,
        targetData: state => state.targetData,
        astData: state => state.astData,
        curSelectedComponentData: state => state.curSelectedComponentData,
        pageData: state => state.pageData,
        functionGroup (state) {
            if (state.functionGroup && state.functionGroup.length) {
                return state.functionGroup
            } else {
                const res = JSON.parse(localStorage.getItem('functionGroup'))
                        || [{
                            name: '系统方法',
                            id: 'system',
                            children: [
                                {
                                    name: 'getMockData',
                                    id: 'getMockData',
                                    funName: 'getMockData',
                                    funParam: [],
                                    funBody: [
                                        'this.$http.get("/test/getMockData")',
                                        '.then((res) => {',
                                        '\tconst data = JSON.stringify(res)',
                                        '\talert(data)',
                                        '})'
                                    ].join('\n'),
                                    code: [
                                        'function getMockData (res) {',
                                        '\tthis.$http.get("/test/getMockData")',
                                        '\t.then((res) => {',
                                        '\t\tconst data = JSON.stringify(res)',
                                        '\t\talert(data)',
                                        '\t})',
                                        '}'
                                    ].join('\n')
                                },
                                {
                                    name: 'clearData',
                                    id: 'clearData',
                                    funName: 'clearData',
                                    funParam: ['res'],
                                    funBody: [
                                        'return res.data'
                                    ].join('\n'),
                                    code: [
                                        'function clearData (res) {',
                                        '\treturn res.data',
                                        '}'
                                    ].join('\n')
                                }
                            ]
                        }]
                state.functionGroup = res
                return res
            }
        },
        getMethodById: (state) => (methodId) => {
            let returnMethod = {
                id: '',
                funName: '',
                code: 'function emptyFunc () {}'
            }
            state.functionGroup.forEach((group) => {
                const funChildren = group.children || []
                const method = funChildren.find(x => x.id === methodId)
                if (method) {
                    returnMethod = method
                }
            })
            return returnMethod
        }
    },
    actions: {

    }
}
