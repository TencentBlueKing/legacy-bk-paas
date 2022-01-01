<template>
    <div
        id="editPageLeftSideBar"
        class="material-panel-box"
        :class="{
            'is-collapse': isCollapse
        }">
        <div class="wrapper">
            <select-panel
                v-model="activePanel"
                class="panel-list"
                @on-change="handlePanelChange" />
            <div class="panel-content">
                <component :is="panelCom" />
            </div>
        </div>
        <div
            class="panel-collapse-btn"
            v-bk-tooltips.right="{
                content: '查看所有组件',
                disabled: !isCollapse
            }"
            @click="handleCollapseSide">
            <i class="bk-drag-icon bk-drag-angle-left" />
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
            },
            /**
             * @desc 收起、隐藏面板
             */
            handleCollapseSide () {
                this.isCollapse = !this.isCollapse
            }
        }
    }
</script>
<style lang="postcss" scoped>
    @import "@/css/mixins/scroller";
    @import "@/css/mixins/ellipsis";

    .material-panel-box {
        display: flex;
        position: relative;
        flex-shrink: 0;
        height: 100%;
        background: #fff;
        box-shadow: 2px 0 4px 0 rgb(0 0 0 / 10%);
        &.is-collapse {
            .wrapper{
                width: 0;
                overflow: hidden;
            }
            
            .bk-drag-angle-left {
                transform: rotate(180deg);
            }
        }
        .wrapper{
            display: flex;
            width: 342px;
            transition: width .1s cubic-bezier(.4,0,.2,1);
        }
        .panel-list{
            flex: 0 0 42px;
            height: 100%;
        }
        .panel-content{
            flex: 0 0 calc(100% - 42px);
        }
        .panel-collapse-btn{
            position: absolute;
            top: 50%;
            left: 100%;
            border-radius: 0 8px 8px 0;
            width: 16px;
            height: 50px;
            line-height: 50px;
            background: #C4C6CC;
            transform: translateY(-50%);
            text-align: center;
            font-size: 12px;
            color: #fff;
            cursor: pointer;
            &:hover {
                background: #3A84FF;
            }
        }
    }
</style>
