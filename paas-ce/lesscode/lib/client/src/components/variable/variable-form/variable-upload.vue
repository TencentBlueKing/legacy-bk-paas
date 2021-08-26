<template>
    <section>
        <template v-for="(item, index) in list">
            <span :key="index" class="variable-txt">{{item.txt}}：</span>
            <bk-upload
                :key="item.key"
                :files="getFiles(item.key)"
                :multiple="false"
                :handle-res-code="handleRes"
                :limit="1"
                url="/api/variable/uploadImage"
                with-credentials
                @on-success="change(item.key, ...arguments)"
            ></bk-upload>
        </template>
    </section>
</template>

<script>
    import mixins from './variable.mixin'

    export default {
        mixins: [mixins],

        methods: {
            getFiles (key) {
                const files = []
                if (this.value[key]) files.push({ status: 'done', url: this.value[key] })
                return files
            },

            change (key, res) {
                const data = res.responseData || {}
                const copyVaule = JSON.parse(JSON.stringify(this.value))
                copyVaule[key] = data.data
                this.$emit('update:value', copyVaule)
            },

            handleRes (res) {
                return Boolean(res.data)
            }
        }
    }
</script>

<style lang="postcss" scoped>
    .variable-txt {
        display: inline-block;
        margin-top: 10px;
        font-size: 12px;
    }
</style>
