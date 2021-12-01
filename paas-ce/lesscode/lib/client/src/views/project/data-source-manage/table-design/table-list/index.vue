<template>
    <article>
        <header>
            <render-header>数据源管理</render-header>
            <div class="g-page-tab">
                <div
                    class="tab-item"
                    :class="{ active: activePage === 'data-source' }"
                    @click="togglePage('data-source')"
                >数据表管理</div>
            </div>
        </header>

        <component :is="activePage"></component>
    </article>
</template>

<script lang="ts">
    import { defineComponent, ref } from '@vue/composition-api'
    import renderHeader from '../../common/header'
    import dataSource from './list/index.vue'

    export default defineComponent({
        components: {
            renderHeader,
            dataSource
        },

        setup () {
            const activePage = ref<string>('data-source')

            const togglePage = (val: string): void => {
                activePage.value = val
            }

            return {
                activePage,
                togglePage
            }
        }
    })
</script>
