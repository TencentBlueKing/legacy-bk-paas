<template>
    <div class="component-manage-page">
        <div class="g-page-tab">
            <div class="tab-item" :class="{ active: routeType === 'PC' }" @click="handleType('PC')">PC 页面</div>
            <div class="tab-item" :class="{ active: routeType === 'MOBILE' }" @click="handleType('MOBILE')">Mobile 页面</div>
        </div>
        <component
            :is="routeList"
            :type="routeType"
        />
    </div>
</template>
<script>
    import RouteList from './route-list'

    export default {
        components: {
            RouteList
        },
        data () {
            return {
                routeList: 'RouteList',
                routeType: 'PC'
            }
        },
        methods: {
            handleType (type) {
                this.routeType = type
            }
        }
    }
</script>
