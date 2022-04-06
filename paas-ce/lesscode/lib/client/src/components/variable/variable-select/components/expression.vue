<template>
    <div>
        <bk-input
            class="item-content"
            :value="formData.code"
            @change="handleChange"
            clearable
            placeholder="请输入表达式，如：curTab === 'Tab-1'"
            v-bind="$attrs"
            v-on="$listeners" />
    </div>
</template>
<script>

    export default {
        name: '',
        props: {
            options: {
                type: Object,
                required: true
            },
            formData: Object
        },
        methods: {
            handleChange (code) {
                this.$emit('on-change', {
                    code
                })
            }
        }
    }
</script>
