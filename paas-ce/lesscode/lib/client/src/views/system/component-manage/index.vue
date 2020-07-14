<template>
    <div class="component-manage-page">
        <div class="component-page-tab">
            <div class="tab-item active">所有组件</div>
            <div class="tab-item">使用中的组件</div>
        </div>
        <all-component />
    </div>
</template>
<script>
    import AllComponent from './all'
    
    export default {
        name: '',
        components: {
            AllComponent
        },
        data () {
            return {}
        },

        methods: {}
    }
</script>
<style lang='postcss'>
    .component-manage-page{
        .component-page-tab{
            position: relative;
            z-index: 1;
            display: flex;
            padding-left: 18px;
            font-size: 14px;
            color: #63656E;
            background: #fff;
            box-shadow: 0px 2px 2px 0px rgba(0,0,0,0.1);
            .tab-item{
                position: relative;
                display: flex;
                align-items: center;
                height: 44px;
                padding: 0 14px;
                cursor: pointer;
                &.active{
                    &:after{
                        content: '';
                        position: absolute;
                        bottom: -1px;
                        left: 0;
                        width: 100%;
                        height: 2px;
                        background: #3A84FF;
                    }
                }
            }
        }
    }
</style>
