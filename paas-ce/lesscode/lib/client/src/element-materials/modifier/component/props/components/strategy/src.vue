<script>
    import { computed, defineComponent } from '@vue/composition-api'
    import SrcInput from '@/components/src-input/index.vue'

    export default defineComponent({
        components: {
            SrcInput
        },
        props: {
            defaultValue: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            type: {
                type: String,
                required: true
            },
            describe: {
                type: Object,
                required: true
            },
            change: {
                type: Function,
                required: true
            }
        },
        setup (props) {
            const url = computed({
                get () {
                    return this.defaultValue
                },
                set (val) {
                    props.change(props.name, val, props.type)
                }
            })

            const srcInputOtherProps = computed(() => {
                const otherProps = {}
                if (['href'].includes(props.name)) {
                    otherProps.triggerText = '选择文件'
                    otherProps.placeholder = '输入或选择文件作为链接地址'
                }
                return otherProps
            })

            return {
                url,
                srcInputOtherProps
            }
        }
    })
</script>

<template>
    <src-input v-model="url" v-bind="srcInputOtherProps" />
</template>
