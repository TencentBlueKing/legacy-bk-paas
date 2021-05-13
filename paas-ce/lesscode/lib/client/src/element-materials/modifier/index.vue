<template>
    <component
        :is="com"
        :template-data="curTemplateData" />
</template>
<script>
    import { mapGetters } from 'vuex'
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
                'curSelectedComponentData',
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
            curSelectedComponentData () {
                this.panel = 'component'
            },
            // template没有指定面板，展示component修改器
            curTemplateData (curTemplateData) {
                if (curTemplateData.panelActive) {
                    this.panel = 'template'
                } else {
                    this.panel = 'component'
                }
            }
        }
    }
</script>
