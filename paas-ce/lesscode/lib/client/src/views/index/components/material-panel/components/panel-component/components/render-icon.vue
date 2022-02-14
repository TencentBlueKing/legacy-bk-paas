<template>
    <div class="render-icon">
        <search-box
            :list="searchList"
            @on-change="handleSearchChange" />
        <group-box
            v-for="(componentList, groupName) in renderGroupIconMap"
            :key="groupName"
            :list="componentList"
            :group-name="groupName">
            <render-icon
                v-for="component in componentList"
                :key="component.name"
                :data="component" />
        </group-box>
    </div>
</template>
<script>
    import iconComponentList from '@/element-materials/materials/icon-list.js'
    import GroupBox from '../../common/group-box'
    import SearchBox from '../../common/search-box'
    import RenderIcon from '../../common/group-box/render-icon'

    export default {
        name: '',
        components: {
            GroupBox,
            SearchBox,
            RenderIcon
        },
        data () {
            return {
                groupIconMap: {},
                renderGroupIconMap: {},
                searchList: []
            }
        },
        created () {
            // ['小图标', '填充图标', '线性图标']
            const groupIconMap = {
                '小图标': [],
                '填充图标': [],
                '线性图标': []
            }
            const searchList = []
            iconComponentList.forEach(icon => {
                groupIconMap[icon.group].push(icon)
                searchList.push(icon)
            })
            this.groupIconMap = Object.freeze(groupIconMap)
            this.renderGroupIconMap = Object.freeze(groupIconMap)
            this.searchList = Object.freeze(searchList)
            console.log('from icon list = ', groupIconMap)
        },
        methods: {
            /**
             * @desc icon搜索
             */
            handleSearchChange (data) {
                if (!data) {
                    this.renderGroupIconMap = Object.freeze(this.groupIconMap)
                    return
                }
                const renderGroupIconMap = {}
                Object.keys(this.groupIconMap).forEach(groupName => {
                    const groupList = this.groupIconMap[groupName]
                    groupList.forEach(icon => {
                        if (icon.name === data.name) {
                            if (!renderGroupIconMap[groupName]) {
                                renderGroupIconMap[groupName] = []
                            }
                            renderGroupIconMap[groupName].push(icon)
                        }
                    })
                })
                this.renderGroupIconMap = Object.freeze(renderGroupIconMap)
            }
        }
    }
</script>
<style lang="postcss" scoped>
    .render-icon{
    }
</style>
