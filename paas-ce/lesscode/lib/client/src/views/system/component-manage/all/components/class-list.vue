<template>
    <div class="class-list">
        <div class="header">
            <bk-input />
        </div>
        <div class="container">
            <div class="item">标准运维</div>
            <div class="item">标准运维</div>
            <div class="item">标准运维</div>
            <div class="item active">标准运维</div>
            <div class="item">标准运维</div>
            <div class="item">标准运维</div>
            <div class="item">标准运维</div>
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
<style lang='postcss' scoped>
    .class-list{
        .header{
            padding: 16px 18px;
        }
        .container{
            .item{
                display: flex;
                align-items: center;
                height: 40px;
                padding: 0 19px 0 21px;
                cursor: pointer;
                &.active,
                &:hover{
                    color: #3A84FF;
                    background: #E1ECFF;
                }
            }
        }
    }
</style>
