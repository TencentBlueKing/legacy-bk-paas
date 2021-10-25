<template>
    <bk-dialog
        theme="primary"
        width="1100"
        title="确认提交"
        :value="isShow"
        :loading="isLoading"
        @confirm="confirm"
        @after-leave="cancel">
        <h5 class="confirm-title">执行的 SQL 内容：（提交后将会在下次部署的时候执行该 SQL，且不可更改。请确认后再提交）</h5>
        <monaco
            read-only
            :height="500"
            :value="sql"
            :options="options"
        ></monaco>
    </bk-dialog>
</template>

<script lang="ts">
    import { defineComponent } from '@vue/composition-api'
    import monaco from '@/components/methods/monaco.vue'

    export default defineComponent({
        components: {
            monaco
        },

        props: {
            isShow: {
                type: Boolean
            },
            sql: {
                type: String
            },
            isLoading: {
                type: Boolean,
                default: false
            }
        },

        setup (_, { emit }) {
            const options = {
                language: 'sql'
            }

            const confirm = () => {
                emit('confirm')
            }

            const cancel = () => {
                emit('update:isShow', false)
            }

            return {
                options,
                confirm,
                cancel
            }
        }
    })
</script>

<style lang="postcss" scoped>
    .confirm-title {
        line-height: 22px;
        color: #313238;
        margin: 0 0 14px;
        font-size: 14px;
    }
</style>
