<template>
    <section>
        <template v-for="(item, index) in list">
            <span :key="index" class="variable-txt">{{item.txt}}：</span>
            <monaco class="variable-code" :key="item.key" :value="value[item.key]" @change="change(item.key, ...arguments)"></monaco>
        </template>
    </section>
</template>

<script>
    import mixins from './variable.mixin'
    import monaco from '@/components/methods/monaco'

    export default {
        components: {
            monaco
        },

        mixins: [mixins]
    }
</script>

<style lang="postcss" scoped>
    .variable-txt {
        display: inline-block;
        margin-top: 10px;
        font-size: 12px;
    }
</style>
