<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<script>
    export default {
        name: 'app'
    }
</script>
<style>
    * {
        box-sizing: border-box;
    }
    html,body {
        margin: 0;
        padding: 0;
    }
    ul,li {
        margin: 0;
        padding: 0;
        list-style: none;
    }
    dl,dt,dd,p {
        margin: 0;
        padding: 0;
    }
    a {
        text-decoration: none;
    }
    button {
        outline: none;
    }
    table {
        border-collapse: collapse;
        border-spacing: 0;
    }
    td,th {
        padding: 0;
    }
    .navigation-bar {
        width: 100%;
        height: 100%;
    }
    .navigation-bar-container {
        width: 100%;
        max-width: 100%;
    }
    .bk-navigation {
        min-width: 1360px;
    }
    .bk-navigation-wrapper .navigation-container {
        max-width: 100% !important;
    }
    .navigation-header .tippy-popper .tippy-tooltip.navigation-message-theme {
        padding: 0;
        border-radius: 0;
        -webkit-box-shadow: none;
        box-shadow: none;
    }
</style>
