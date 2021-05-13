// 生成VUE最终产物
// export default (director) => {
//     const
//     return `
//         <template>
//             ${director.html}
//         </template>
//         <script>
//             export default {
//                 data () {
//                     return ${JSON.stringify(director.data)}
//                 },

//                 ${JSON.stringify(director.lifeCycle)}

//                 methods: {
//                     ${director.methods.join()}
//                 }
//             }
//         </script>
//         <style scoped>
//             ${director.css}
//         </style>
//     `
// }
