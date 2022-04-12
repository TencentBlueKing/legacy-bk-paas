<template>
    <bk-select search-with-pinyin
        class="member-selector"
        multiple
        :value="users"
        @selected="chooseUser"
        @clear="clear"
        searchable
        enable-virtual-scroll
        :list="userList"
        :loading="isLoading"
    >
    </bk-select>
</template>

<script>
    export default {
        model: {
            prop: 'users',
            event: 'choose'
        },

        props: {
            users: Array,
            userList: Array
        },

        data () {
            return {
                isLoading: false
            }
        },

        created () {
            if (this.userList.length <= 0) this.getAllUsers()
        },

        methods: {
            getAllUsers () {
                this.isLoading = true
                this.$store.dispatch('member/getAllUser').then((res) => {
                    this.$emit('update:userList', res)
                }).catch((err) => {
                    this.$bkMessage({
                        message: err.message || err,
                        theme: 'error'
                    })
                }).finally(() => {
                    this.isLoading = false
                })
            },

            chooseUser (users) {
                this.$emit('choose', users)
            },

            clear () {
                this.$emit('clear')
            }
        }
    }
</script>

<style lang="postcss" scoped>
    .member-selector {
        width: 684px;
    }
</style>
