<template>
    <div class="preview-thumb">
        <img ref="img" loading="lazy" v-bind="$attrs" v-if="!isEmpty">
        <slot v-else><div class="empty-preview-img">页面为空</div></slot>
    </div>
</template>

<script>
    import preivewErrImg from '@/images/preview-error.png'

    export default {
        props: {
            projectId: Number,
            pageId: Number
        },
        data () {
            return {
                isEmpty: false
            }
        },
        computed: {
            src () {
                if (this.projectId) {
                    return `${AJAX_URL_PREFIX}/project/previewimg?id=${this.projectId}`
                }
                return `${AJAX_URL_PREFIX}/page/previewimg?id=${this.pageId}`
            }
        },
        mounted () {
            const self = this
            const img = this.$refs.img
            img.onload = function () {
                self.isEmpty = this.complete && this.width === 1 && this.height === 1
            }
            img.onerror = function () {
                this.src = preivewErrImg
                this.onerror = null
            }
            img.src = this.src
        }
    }
</script>

<style lang="postcss" scoped>
    .preview-thumb {
        height: 100%;
        img {
            max-width: 100%;
        }
    }
    .empty-preview-img {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: 700;
        color: #C4C6CC;
        height: 100%;
        background: #f0f1f5;
        border-radius: 4px 4px 0px 0px;
    }
</style>
