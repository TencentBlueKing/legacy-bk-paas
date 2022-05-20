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

            return {
                url
            }
        }
    })
</script>

<template>
    <src-input v-model="url" />
</template>
