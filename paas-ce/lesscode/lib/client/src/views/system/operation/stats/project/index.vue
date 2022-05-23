<template>
    <main class="page-content">
        <bk-tab :active.sync="active" @tab-change="handleTabChange" type="unborder-card">
            <bk-tab-panel
                v-for="(panel, index) in panels"
                v-bind="panel"
                :key="index"
                render-directive="if">
                <component :is="`dim-${panel.name}`" />
            </bk-tab-panel>
        </bk-tab>
    </main>
</template>

<script>
    import DimProject from './dim-project.vue'
    import DimTime from './dim-time.vue'

    export default {
        components: {
            DimProject,
            DimTime
        },
        data () {
            return {
                panels: [
                    { name: 'project', label: '按应用' },
                    { name: 'time', label: '按时间' }
                ],
                active: ''
            }
        },
        watch: {
            '$route.query.tab': {
                immediate: true,
                handler: function (tab) {
                    this.active = tab || 'project'
                }
            }
        },
        methods: {
            handleTabChange (name) {
                if (name === this.$route.query.tab) {
                    return
                }
                this.$router.push({
                    query: { ...this.$route.query, tab: name }
                })
            }
        }
    }
</script>
