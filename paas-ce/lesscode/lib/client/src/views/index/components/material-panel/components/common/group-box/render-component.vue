<template>
    <div class="render-drag-item" :class="displayClass">
        <div class="component-icon">
            <i class="bk-drag-icon" :class="data.icon" />
        </div>
        <div class="component-name">{{ data.displayName }}</div>
    </div>
</template>
<script>
    export default {
        name: '',
        props: {
            data: Object
        },
        created () {
            this.displayClass = ''
            if (this.data.renderStyles && this.data.renderStyles.display) {
                this.displayClass = this.data.renderStyles.display
            }
        }
    }
</script>
