<template>
    <div class="all-component-page-layout">
        <div class="layout-left">
            <slot name="left" />
            <div class="toggle-btn"></div>
        </div>
        <div class="layout-right">
            <slot />
        </div>
    </div>
</template>
<script>
    export default {
        name: '',

        data () {
            return {}
        },

        methods: {}
    }
</script>
<style lang='postcss'>
    .all-component-page-layout{
        display: flex;
        min-height: 100vh;
        .layout-left{
            position: relative;
            flex: 0 0 337px;
            border-right: 1px solid #DCDEE5;
            background: #FAFBFD;
            .toggle-btn{
                position: absolute;
                top: 50%;
                right: -16px;
                width: 16px;
                height: 50px;
                border-radius: 0 8px 8px 0;
                background: #3A84FF;
                cursor: pointer;
            }
        }
        .layout-right{
            flex: 1;
            background: #fff;
        }
    }
</style>
