<template>
    <monaco
        :value.sync="copyForm.funcBody"
        :func="form"
        :height="height"
        @change="(val) => updateValue('funcBody', val)">
        <template v-slot:tools>
            <slot name="tools"></slot>
        </template>
    </monaco>
</template>

<script>
    import monaco from '../../monaco-func.vue'
    import mixins from './form-item-mixins'

    export default {
        components: {
            monaco
        },

        mixins: [mixins],

        props: {
            height: {
                type: [Number, String],
                default: 458
            }
        }
    }
</script>
