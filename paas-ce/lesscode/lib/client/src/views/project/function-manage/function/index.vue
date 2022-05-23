<template>
    <layout class="function-manage">
        <function-group
            slot="left"
            ref="functionGroup"
            @groupChange="handleGroupChange"
        />
        <function-list
            :group-id="groupId"
            :group-name="groupName"
            @freshList="handleFresh"
        />
    </layout>
</template>

<script>
    import Layout from '@/components/ui/layout'
    import FunctionGroup from './children/group.vue'
    import FunctionList from './children/list.vue'

    export default {
        components: {
            Layout,
            FunctionGroup,
            FunctionList
        },
        data () {
            return {
                groupId: '',
                groupName: ''
            }
        },
        methods: {
            handleGroupChange ({ id, groupName }) {
                this.groupId = id
                this.groupName = groupName
            },

            handleFresh () {
                this.$refs.functionGroup.initData()
            }
        }
    }
</script>

<style lang="postcss" scoped>
    .function-manage {
        height: calc(100% - 44px);
    }
</style>
