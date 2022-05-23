<template>
    <bk-exception class="exception-wrap-item" type="500">
        <div>
            {{ message }}
        </div>
    </bk-exception>
</template>

<script>
    export default {
        data () {
            return {
                message: ''
            }
        },
        mounted () {
            this.message = this.$route.meta.message
        }
    }
</script>

<style scoped>
    .exception-wrap-item {
        margin: 150px auto 0 !important;
        height: 420px;
        padding-top: 22px;
    }
</style>
