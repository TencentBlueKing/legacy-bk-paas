/**
 * Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 * Copyright (C) 2017-2019 THL A29 Limited, a Tencent company. All rights reserved.
 * Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://opensource.org/licenses/MIT
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

import { computed, ref, watchEffect } from '@vue/composition-api'
import { useStore } from '@/store'

export default (props) => {
    const store = useStore()

    const keyword = ref('')
    const loading = ref(false)

    const list = ref([])
    const displayList = ref([])

    const paramsData = computed(() => ({ projectId: props.projectId }))

    const isSearch = computed(() => keyword.value?.length > 0)

    watchEffect(async () => {
        loading.value = true
        try {
            const data = await store.dispatch('file/getList', paramsData.value)
            list.value = displayList.value = data?.list
        } catch (e) {
            console.error(e)
        } finally {
            loading.value = false
        }
    })

    const handleSearch = () => {
        if (!keyword.value?.length) {
            keyword.value = ''
            displayList.value = list.value
        } else {
            displayList.value = list.value.filter(item => new RegExp(keyword.value, 'i').test(item.name))
        }
    }

    return {
        keyword,
        isSearch,
        displayList,
        loading,
        handleSearch
    }
}
