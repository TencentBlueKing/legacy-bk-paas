export default {
    inject: ['layoutOffset'],
    computed: {
        getComputedMunuOffset () {
            return {
                x: -parseInt(this.layoutOffset.left),
                y: -parseInt(this.layoutOffset.top)
            }
        }
    }
}
