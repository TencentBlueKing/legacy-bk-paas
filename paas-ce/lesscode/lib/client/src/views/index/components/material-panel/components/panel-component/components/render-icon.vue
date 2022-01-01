<template>
    <div class="render-icon">
        <group-box
            v-for="(componentList, groupName) in groupIconMap"
            :key="groupName"
            :list="componentList"
            :group="groupName">
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
    import RenderIcon from '../../common/group-box/render-icon'

    export default {
        name: '',
        components: {
            GroupBox,
            RenderIcon
        },
        data () {
            return {
                groupIconMap: {}
            }
        },
        created () {
            // ['小图标', '填充图标', '线性图标']
            const groupIconMap = {
                '小图标': [],
                '填充图标': [],
                '线性图标': []
            }
            iconComponentList.forEach(icon => {
                groupIconMap[icon.group].push(icon)
            })
            this.groupIconMap = Object.freeze(groupIconMap)
            console.log('from icon list = ', groupIconMap)
        }
    }
</script>
<style lang="postcss" scoped>
    .render-icon{
        padding-top: 12px;
    }
</style>
