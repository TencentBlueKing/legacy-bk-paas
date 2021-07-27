<template>
    <remote
        :payload="methodPayload"
        :default-value="copySlotVal.val"
        :remote-validate="slotConfig.remoteValidate"
        :change="remoteChange"
    ></remote>
</template>

<script>
    import remote from '@/element-materials/modifier/component/props/components/strategy/remote'
    import safeStringify from '@/common/json-safe-stringify'

    export default {
        components: {
            remote
        },

        props: {
            slotVal: {
                type: Object,
                required: true
            },
            slotConfig: {
                type: Object,
                default: () => ({})
            },
            change: {
                type: Function,
                default: () => {}
            }
        },

        data () {
            return {
                copySlotVal: JSON.parse(safeStringify(this.slotVal))
            }
        },

        computed: {
            methodPayload () {
                const payload = this.copySlotVal.payload || {}
                return payload.methodData || {}
            }
        },

        methods: {
            remoteChange (name, val, type, methodData) {
                const slot = {
                    ...this.slotVal,
                    val,
                    payload: {
                        methodData
                    }
                }
                this.change(slot)
            }
        }
    }
</script>
