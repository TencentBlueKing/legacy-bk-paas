<template>
    <div
        id="editPageLeftSideBar"
        class="draw-page-material-panel">
        <select-panel
            v-model="activePanel"
            class="panel-list"
            @on-change="handlePanelChange" />
        <div class="panel-content">
            <component :is="panelCom" />
        </div>
    </div>
</template>
<script>
    import SelectPanel from './components/select-panel'
    import PanelComponent from './components/panel-component'
    import PanelTemplate from './components/panel-template'
    import PanelTree from './components/panel-tree'

    export default {
        name: '',
        components: {
            SelectPanel,
            PanelComponent,
            PanelTemplate,
            PanelTree
        },
        data () {
            return {
                isCollapse: false,
                activePanel: 'component'
            }
        },
        computed: {
            panelCom () {
                const comMap = {
                    component: PanelComponent,
                    template: PanelTemplate,
                    tree: PanelTree
                }
                return comMap[this.activePanel]
            }
        },
        methods: {
            /**
             * @desc 切换面板
             * @param { String } panel
             */
            handlePanelChange (panel) {
                this.activePanel = panel
            }
        }
    }
</script>
<style lang="postcss" scoped>
    @import "@/css/mixins/scroller";
    @import "@/css/mixins/ellipsis";

    .draw-page-material-panel {
        display: flex;
        position: relative;
        height: 100%;
        
        .panel-list{
            flex: 0 0 42px;
            height: 100%;
        }
        .panel-content{
            flex: 0 0 calc(100% - 42px);
        }
    }
</style>
