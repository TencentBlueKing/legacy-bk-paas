<template>
    <div class="mobile-preview-switcher">
        <span>预览</span>
        <bk-switcher v-model="preview" size="small" theme="primary"></bk-switcher>
    </div>
</template>
<script>
    import { ref, watch } from '@vue/composition-api'
    import store from '@/store'
    export default {
        setup () {
            const preview = ref(true)
            
            watch(preview, newVal => store.commit('page/setMobilePreview', newVal))

            return { preview }
        }
    }
</script>
<style lang="postcss" scoped>
.mobile-preview-switcher {
    display: flex;
    align-items: center;
    justify-self: flex-start;
    margin-left: 20px;
    span {
        margin-right: 8px;
    }
}
</style>
