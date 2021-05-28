export default {
    inject: ['layoutOffset'],
    computed: {
        getComputedMunuOffset () {
            if (this.layoutOffset) return { x: -parseInt(this.layoutOffset.left), y: -parseInt(this.layoutOffset.top) }
            return this.contextOffset
        }
    }
}
