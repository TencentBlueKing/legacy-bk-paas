<template>
    <article>
        <renderSlot
            v-for="(slotConfig, slotName) in materialConfig"
            :key="slotName"
            :slot-name="slotName"
            :slot-val="renderSlots[slotName]"
            :slot-config="slotConfig"
            :render-props="renderProps"
            @change="change"
            @batchUpdate="batchUpdate"
            class="modifier-slot"
        ></renderSlot>
        <span v-if="Object.keys(materialConfig).length <= 0 && Object.keys(curSelectedComponentData).length" class="no-slot">该组件暂无插槽</span>
    </article>
</template>

<script>
    import { mapGetters } from 'vuex'
    import renderSlot from './slot.vue'

    export default {
        components: {
            renderSlot
        },

        props: {
            materialConfig: Object,
            lastSlots: Object,
            lastProps: Object
        },

        data () {
            return {
                renderSlots: {},
                renderProps: {},
                mutlTypeValue: {
                    name: '',
                    type: ''
                }
            }
        },

        computed: {
            ...mapGetters('drag', ['curSelectedComponentData'])
        },

        created () {
            this.renderSlots = this.lastSlots
            this.renderProps = this.lastProps
        },

        methods: {
            change (name, slotVal) {
                this.renderSlots[name] = slotVal
                const renderData = {
                    renderSlots: this.renderSlots
                }
                this.batchUpdate(renderData)
            },

            batchUpdate (renderData) {
                this.$emit('on-change', renderData)
            }
        }
    }
</script>

<style lang="postcss" scoped>
    .modifier-slot {
        padding: 0 10px;
    }
</style>
