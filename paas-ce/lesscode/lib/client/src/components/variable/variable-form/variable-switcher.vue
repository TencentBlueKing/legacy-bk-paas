<template>
    <section class="variable-switchers">
        <template v-for="(item, index) in list">
            <span :key="index">{{item.txt}}：</span>
            <bk-switcher size="small" theme="primary" :value="value[item.key]" :key="item.key" @change="change(item.key, ...arguments)" class="variable-switcher"></bk-switcher>
        </template>
    </section>
</template>

<script>
    import mixins from './variable.mixin'

    export default {
        mixins: [mixins]
    }
</script>

<style lang="postcss" scoped>
    .variable-switcher {
        margin-right: 50px;
    }
    .variable-switchers {
        background: #fafbfd;
        font-size: 12px;
        line-height: 40px;
        padding: 0 30px;
    }
</style>
