<template>
    <content-loader
        :width="baseWidth"
        :height="1300"
        :speed="loadingConf.speed"
        :primary-color="loadingConf.primaryColor"
        :secondary-color="loadingConf.secondaryColor">
        <rect x="70" y="20" rx="0" ry="0" width="120" height="20" />
        <rect :x="correctionWidth + 300" y="25" rx="0" ry="0" width="80" height="10" />
        <rect :x="correctionWidth + 420" y="25" rx="0" ry="0" width="80" height="10" />
        <rect :x="correctionWidth + 1630" y="25" rx="0" ry="0" width="40" height="10" />
        <rect x="0" y="65" rx="2" ry="2" :width="baseWidth" height="480" />
        <rect :x="(baseWidth - 120) / 2" y="640" rx="0" ry="0" width="120" height="30" />
        <rect :x="correctionWidth + 280" y="740" rx="0" ry="0" width="280" height="280" />
        <rect :x="correctionWidth + 580" y="740" rx="0" ry="0" width="280" height="280" />
        <rect :x="correctionWidth + 880" y="740" rx="0" ry="0" width="280" height="280" />
        <rect :x="correctionWidth + 1180" y="740" rx="0" ry="0" width="280" height="280" />
        <rect :x="(baseWidth - 180) / 2" y="1120" rx="0" ry="0" width="180" height="40" />
        <rect x="690 " y="1200" rx="0" ry="0" width="1180" height="200" />
        <!--<rect x="860 " y="460" rx="0" ry="0" width="240" height="200" />
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
            },
            correctionWidth: {
                type: Number,
                default: 0
            }
        },
        computed: {
            loadingConf () {
                return this.$store.state.loadingConf
            }
        }
    }
</script>
