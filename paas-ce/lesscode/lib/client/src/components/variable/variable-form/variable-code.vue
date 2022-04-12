<template>
    <section>
        <template v-for="(item, index) in list">
            <span :key="index" class="variable-txt">{{item.txt}}：</span>
            <monaco
                class="variable-code"
                :height="300"
                :key="item.key"
                :form="{ funcBody: value[item.key] }"
                :function-list="functionList"
                :variable-list="variableList"
                @change="change(item.key, ...arguments)"
            >
            </monaco>
        </template>
    </section>
</template>

<script>
    import mixins from './variable.mixin'
    import monaco from '@/components/methods/forms/form-items/monaco.vue'
    import { mapGetters } from 'vuex'

    export default {
        components: {
            monaco
        },

        mixins: [mixins],

        computed: {
            ...mapGetters('functions', ['functionList']),
            ...mapGetters('variable', ['variableList'])
        }
    }
</script>

<style lang="postcss" scoped>
    .variable-txt {
        display: inline-block;
        font-size: 12px;
    }
</style>
