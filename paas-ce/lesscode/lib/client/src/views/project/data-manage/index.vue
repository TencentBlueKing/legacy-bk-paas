<template>
    <bk-button @click="test">233</bk-button>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator'

    @Component
    export default class DataSource extends Vue {
        mes: string = 'hello world'

        test (): void {
            console.log(this.mes)
        }
    }
</script>
