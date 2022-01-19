<template>
    <component
        :is="com"
        :template-data="curTemplateData" />
</template>
<script>
    import { mapGetters } from 'vuex'
    import LC from '@/element-materials/core'
    import ComponentModifier from './component'
    import TemplateModifier from './template'

    const comMap = {
        template: TemplateModifier,
        component: ComponentModifier
    }

    export default {
        name: 'element-modifier',
        data () {
            return {
                panel: 'component',
                templateInfo: {}
            }
        },
        computed: {
            ...mapGetters('drag', [
                'curTemplateData'
            ]),
            com () {
                if (comMap.hasOwnProperty(this.panel)) {
                    return comMap[this.panel]
                }
                return ComponentModifier
            }
        },
        watch: {
            // template没有指定面板，展示component修改器
            curTemplateData (curTemplateData) {
                if (curTemplateData.panelActive) {
                    this.panel = 'template'
                } else {
                    this.panel = 'component'
                }
            }
        },
        created () {
            const activeCallback = () => {
                this.panel = 'component'
            }
            LC.addEventListener('active', activeCallback)
            this.$once('hook:beforeDestroy', () => {
                LC.removeEventListener('active', activeCallback)
            })
        }
    }
</script>
