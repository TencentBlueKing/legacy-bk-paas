<template>
    <router-view :key="$route.path" class="lsc-operation"></router-view>
</template>

<style lang="postcss">
    .lsc-operation {
        .member-list {
            display: flex;
            flex-direction: column;
            height: 100%;

            .filter {
                display: flex;
                margin-bottom: 16px;

                .filter-item {
                    margin-right: 16px;
                }

                .search-input {
                    width: 200px;
                }
            }

            .data-list {
                flex: 1;
            }
        }

        .operation-chart {
            display: flex;
            flex-direction: column;
            height: 100%;

            .filter {
                display: flex;
                margin-bottom: 16px;

                .filter-item {
                    margin-right: 16px;

                    &.bk-form-control {
                        width: auto;
                    }
                }

                .search-input {
                    width: 200px;
                }
            }

            .chart-list {
                padding-right: 60px;

                .chart-item {
                    width: 100%;
                    height: 420px;
                    display: flex;
                    flex-direction: column;
                    margin: 16px 0;
                }
                .chart-title {
                    font-size: 18px;
                    font-weight: 700;
                    text-align: center;
                    margin-bottom: 20px;
                }
                .chart-container {
                    flex: 1;

                    .chart-empty {
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        left: 0;
                        top: 0;
                        justify-content: center;
                        z-index: 1;
                        border-left: 1px solid #ccc;
                        border-bottom: 1px solid #ccc;
                    }
                }
            }

            .total-list {
                margin: 16px 0;
                .append-tips {
                    margin: 12px 0;
                }
            }
        }

        .bk-tab {
            display: flex;
            flex-direction: column;
            height: 100%;

            .bk-tab-section {
                flex: 1;

                .bk-tab-content {
                    height: 100%;
                }
            }
        }
    }
</style>
