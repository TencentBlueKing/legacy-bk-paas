import zIndexManager from '../utils/z-index-manager.js'

export default {
    props: {
        zIndex: {
            type: [Number, String],
            default: 'default'
        }
    },
    methods: {
        getLocalZIndex () {
            return zIndexManager.nextZIndex()
        }
    }
}
