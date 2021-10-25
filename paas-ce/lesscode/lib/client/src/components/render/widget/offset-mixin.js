export default {
    // inject: ['layoutOffset'],
    computed: {
        getComputedMunuOffset () {
            return {
                x: 0,
                y: 0
            }
            // return {
            //     x: -parseInt(this.layoutOffset.left),
            //     y: -parseInt(this.layoutOffset.top)
            // }
        }
    }
}
