import { mapGetters } from 'vuex'

export default {
    computed: {
        ...mapGetters('page', ['platform']),
        defaultUnit () {
            return this.platform === 'pc' ? 'px' : 'rpx'
        }
    }
}
