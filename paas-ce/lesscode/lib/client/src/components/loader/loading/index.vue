<template>
    <content-loader
        :width="baseWidth"
        :height="1200"
        :speed="loadingConf.speed"
        :primary-color="loadingConf.primaryColor"
        :secondary-color="loadingConf.secondaryColor">
        <rect x="50" y="10" rx="0" ry="0" width="100" height="20" />
        <rect x="200" y="15" rx="0" ry="0" width="50" height="10" />
        <rect x="280" y="15" rx="0" ry="0" width="50" height="10" />
        <rect x="1080" y="15" rx="0" ry="0" width="40" height="10" />
        <rect x="1130" y="15" rx="0" ry="0" width="40" height="10" />
        <rect x="0" y="40" rx="2" ry="2" :width="baseWidth" height="330" />
        <rect x="530" y="420" rx="0" ry="0" width="120" height="30" />
        <rect x="150" y="490" rx="0" ry="0" width="210" height="180" />
        <rect x="370" y="490" rx="0" ry="0" width="210" height="180" />
        <rect x="600" y="490" rx="0" ry="0" width="210" height="180" />
        <rect x="830" y="490" rx="0" ry="0" width="210" height="180" />
        <!-- <rect x="340 " y="460" rx="0" ry="0" width="240" height="200" />
        <rect x="600 " y="460" rx="0" ry="0" width="240" height="200" />
        <rect x="860 " y="460" rx="0" ry="0" width="240" height="200" />
        <rect x="500" y="700" rx="0" ry="0" width="160" height="40" />
        <rect x="80 " y="780" rx="0" ry="0" width="1020" height="300" />
        <rect x="500" y="1120" rx="0" ry="0" width="160" height="40" />
        <rect x="80" y="1200" rx="0" ry="0" width="240" height="200" />
        <rect x="340 " y="1200" rx="0" ry="0" width="240" height="200" />
        <rect x="600 " y="1200" rx="0" ry="0" width="240" height="200" />
        <rect x="860 " y="1200" rx="0" ry="0" width="240" height="200" /> -->
    </content-loader>
</template>

<script>
    import { ContentLoader } from 'vue-content-loader'
    export default {
        components: {
            ContentLoader
        },
        props: {
            baseWidth: {
                type: Number,
                default: 1180
            },
            contentWidth: {
                type: Number,
                default: 1180
            }
        },
        computed: {
            loadingConf () {
                return this.$store.state.loadingConf
            }
        }
    }
</script>
