<template>
    <div :class="[extCls]" test-posi-id="bk-member-selector">
        <bk-user-selector
            :value="value"
            class="ui-user-selector"
            :fixed-height="true"
            :api="api"
            :disabled="disabled"
            :multiple="multiple"
            :placeholder="placeholder"
            @change="onChange">
        </bk-user-selector>
    </div>
</template>

<script>
    import BkUserSelector from '@blueking/user-selector'

    export default {
        name: 'MemberSelector',
        components: {
            BkUserSelector
        },
        model: {
            prop: 'value',
            event: 'change'
        },
        props: {
            placeholder: {
                type: String,
                default: '请选择'
            },
            disabled: {
                type: Boolean,
                default: false
            },
            // 多选
            multiple: {
                type: Boolean,
                default: true
            },
            value: {
                type: Array,
                default () {
                    return []
                }
            },
            // 外部设置的 class name
            extCls: {
                type: String,
                default: ''
            }
        },
        data () {
            return {
                users: []
            }
        },
        computed: {
            api () {
                const host = window.BK_USER_MANAGE_HOST || location.origin
                return `${host}/api/c/compapi/v2/usermanage/fs_list_users/`
            }
        },
        methods: {
            onChange (value) {
                this.$emit('change', value)
            }
        }
    }
</script>

<style lang="postcss" scoped>
.ui-user-selector {
  display: block;
  width: 100%;
}
</style>
