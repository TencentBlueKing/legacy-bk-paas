<template>
    <div>
        <layout>
            <template slot="left">
                <class-list />
            </template>
            <render-list />
        </layout>
    </div>
</template>
<script>
    import Layout from './components/layout'
    import ClassList from './components/class-list'
    import RenderList from './components/render-list'

    export default {
        name: '',
        components: {
            Layout,
            ClassList,
            RenderList
        },
        data () {
            return {}
        },

        methods: {}
    }
</script>
<style lang='postcss'>

</style>
