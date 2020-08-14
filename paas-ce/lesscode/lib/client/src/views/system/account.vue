<template>
    <main class="account page-content">
        <div class="user-info-wrapper">
            <bk-form :label-width="100" :model="userData">
                <bk-form-item label="用户名：">
                    {{userData.username}}
                </bk-form-item>
                <bk-form-item label="中文名：">
                    {{userData.chname}}
                </bk-form-item>
                <bk-form-item label="联系电话：">
                    {{userData.phone}}
                </bk-form-item>
                <bk-form-item label="常用邮箱：">
                    {{userData.email}}
                </bk-form-item>
            </bk-form>
        </div>
    </main>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        data () {
            return {
                userData: {
                    username: '',
                    chname: '',
                    phone: '',
                    email: ''
                }
            }
        },
        computed: {
            ...mapGetters(['user'])
        },
        watch: {
        },
        created () {
            this.userData = Object.assign({}, {
                username: this.user.bk_username || '--',
                chname: this.user.chname || '--',
                phone: this.user.phone || '--',
                email: this.user.email || '--'
            })
        },
        methods: {
        }
    }
</script>

<style lang="postcss" scoped>
    .user-info-wrapper {
        padding: 20px;
        background: #fff;
        box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.1);
        /deep/ .bk-label {
            .bk-label-text {
                font-weight: 700;
            }
        }
    }
</style>
