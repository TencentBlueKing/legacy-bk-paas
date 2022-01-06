<template>
    <div>
        <search-box
            :list="searchList"
            @on-change="handleSearchChange" />
        <div>
            <group-box
                v-for="(comList, groupName) in renderGroupComponentMap"
                :key="groupName"
                :list="comList"
                :group-name="groupName">
                <template v-for="component in comList">
                    <render-icon
                        v-if="groupName === '图标集合'"
                        :key="component.name"
                        :data="component" />
                    <render-component
                        v-else
                        :key="component.name"
                        :data="component" />
                </template>
            </group-box>
        </div>
    </div>
</template>
<script>
    import MaterialConfig from '@/element-materials/materials'
    import SearchBox from '../../common/search-box'
    import GroupBox from '../../common/group-box'
    import RenderComponent from '../../common/group-box/render-component'
    import RenderIcon from '../../common/group-box/render-icon.vue'

    console.log('from base component = ', MaterialConfig)

    export default {
        components: {
            SearchBox,
            GroupBox,
            RenderComponent,
            RenderIcon
        },
        props: {
            baseComponent: {
                type: String,
                validator: function (value) {
                    return ['bk', 'element'].includes(value)
                }
            }
        },
        data () {
            return {
                renderGroupComponentMap: {},
                searchList: []
            }
        },
        computed: {
            /**
             * @desc 选中组件库的分组列表
             * @returns { Array }
             */
            groupList () {
                const groupNameMap = {
                    bk: 'bkComponentGroupList',
                    element: 'elementComponentGroupList'
                }
                return MaterialConfig[groupNameMap[this.baseComponent]]
            },
            /**
             * @desc 选中组件库的组件列表
             * @returns { Array }
             */
            componentList () {
                return MaterialConfig[this.baseComponent]
            }
        },
        watch: {
            baseComponent: {
                handler () {
                    this.init()
                },
                immediate: true
            }
        },
        methods: {
            init () {
                const searchList = []

                const groupComponentMap = this.groupList.reduce((result, groupName) => {
                    result[groupName] = []
                    return result
                }, {})

                this.componentList.forEach(component => {
                    if (component.display === 'none') {
                        return
                    }
                    searchList.push(component)
                    groupComponentMap[component.group].push(component)
                })

                this.searchList = searchList
                this.groupComponentMap = Object.freeze(groupComponentMap)
                this.renderGroupComponentMap = Object.freeze(groupComponentMap)
            },
            /**
             * @desc 组件搜索
             */
            handleSearchChange (data) {
                if (!data) {
                    this.renderGroupComponentMap = Object.freeze(this.groupComponentMap)
                    return
                }
                const renderGroupComponentMap = {}
                Object.keys(this.groupComponentMap).forEach(groupName => {
                    const groupList = this.groupComponentMap[groupName]
                    groupList.forEach(component => {
                        if (component.name === data.name) {
                            if (!renderGroupComponentMap[groupName]) {
                                renderGroupComponentMap[groupName] = []
                            }
                            renderGroupComponentMap[groupName].push(component)
                        }
                    })
                })
                this.renderGroupComponentMap = Object.freeze(renderGroupComponentMap)
            }
        }
    }
</script>
