<template>
    <div
        class="render-drag-item"
        :class="{
            favorite: data.meta && data.meta.favorite
        }"
        v-bk-tooltips="{
            content: data.displayName,
            disabled: !(data.displayName && data.displayName.length > 8)
        }"
        :ref="`component-item_${data.name}_${groupIndex}`">
        <div class="component-icon">
            <i class="bk-drag-icon" :class="data.icon || 'bk-drag-custom-comp-default'"></i>
        </div>
        <div class="component-name" v-if="data.displayName">{{data.displayName}}</div>
        <div
            v-if="group === ExtraGroup.Public"
            class="component-introduction"
            @mouseenter="handleShowIntroduction(data, $event)"
            @mouseleave="handleHideIntroduction">
            <i class="bk-icon icon-info-circle" />
        </div>
        <div
            v-if="Object.values(ExtraGroup).includes(group)"
            class="favorite-btn"
            v-bk-tooltips="{
                content: (data.meta && data.meta.favorite) ? '取消收藏' : '添加收藏',
                onShow () {
                    const inst = $refs[`component-item_${data.name}_${groupIndex}`][0].tippyInstance
                    inst && inst.hide()
                }
            }"
            @click.stop="handleClickFavorite(data)">
            <i :class="['bk-drag-icon', `bk-drag-favorite${(data.meta.favorite) ? '' : '-o' }`]"></i>
        </div>
    </div>
</template>
<script>
    import Tippy from 'bk-magic-vue/lib/utils/tippy'

    export default {
        name: '',
        props: {
            data: Object
        },
        
        methods: {
            async handleShowIntroduction (component, event) {
                const componentId = component.meta.id
                const componentVersionId = component.meta.versionId
                this.popperInstance = Tippy(event.target, {
                    placement: 'top-start',
                    trigger: 'manual',
                    theme: 'light custom-component-introduction',
                    hideOnClick: false,
                    animateFill: false,
                    animation: 'slide-toggle',
                    lazy: false,
                    ignoreAttributes: true,
                    boundary: 'window',
                    distance: 20,
                    arrow: true,
                    zIndex: window.__bk_zIndex_manager.nextZIndex()
                })
                this.componentIntroduction = {}
                this.isDiscriptionLoading = true
                this.popperInstance.setContent(this.$refs.introduction)
                this.popperInstance.popperInstance.update()
                this.popperInstance.show()
                try {
                    const [componentData, componentVersionData] = await Promise.all([
                        this.$store.dispatch('components/detail', {
                            id: componentId
                        }),
                        this.$store.dispatch('components/versionDetail', {
                            versionId: componentVersionId
                        })
                    ])
                    if (!this.popperInstance) {
                        return
                    }
                    this.componentIntroduction = Object.freeze({
                        ...componentVersionData,
                        lastVersion: componentData.version
                    })
                    setTimeout(() => {
                        this.popperInstance.popperInstance.update()
                    })
                } finally {
                    this.isDiscriptionLoading = false
                }
            },
            handleHideIntroduction () {
                if (this.popperInstance) {
                    this.popperInstance.hide()
                    this.popperInstance.destroy()
                    this.popperInstance = null
                }
            },
            async handleClickFavorite (component) {
                try {
                    const data = {
                        compId: component.meta.id,
                        projectId: this.projectId
                    }
                    if (component.meta.favorite) {
                        await this.$store.dispatch('components/favoriteDelete', { data })
                        this.messageSuccess('取消成功')
                    } else {
                        await this.$store.dispatch('components/favoriteAdd', { data })
                        this.messageSuccess('收藏成功')
                    }

                    // // 更新数据状态
                    // this.fetchFavoriteList(true)
                } catch (e) {
                    console.error(e)
                }
            },
            handleCreate (newTab) {
                const route = this.$router.resolve({
                    name: 'componentManage',
                    params: {
                        projectId: this.projectId
                    }
                })
                if (newTab) {
                    window.open(route.href, '_blank')
                } else {
                    this.$router.push(route.location)
                }
            }
        }
    }
</script>
<style lang="postcss">
    
</style>
