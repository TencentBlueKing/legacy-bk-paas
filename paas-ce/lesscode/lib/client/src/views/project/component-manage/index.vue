<template>
    <div class="component-manage-page">
        <div class="g-page-tab">
            <div class="tab-item" :class="{ active: page === 'all' }" @click="handlePage('all')">所有组件</div>
            <div class="tab-item" :class="{ active: page === 'useing' }" @click="handlePage('useing')">使用中的组件</div>
        </div>
        <component :is="pageCom" />
    </div>
</template>
<script>
    import AllComponent from './all'
    import UseingComponent from './useing'

    export default {
        name: '',
        components: {
            AllComponent,
            UseingComponent
        },
        data () {
            return {
                page: 'all'
            }
        },
        computed: {
            pageCom () {
                const comMap = {
                    all: AllComponent,
                    useing: UseingComponent
                }

                return comMap[this.page]
            }
        },
        methods: {
            handlePage (page) {
                this.page = page
            }
        }
    }
</script>
