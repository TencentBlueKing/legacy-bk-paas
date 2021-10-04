<template>
  <div>
    <img src="../assets/logo.png" alt="">
    <HelloWorld :msg="`Welcome to Vue@${version}`"/>
    <div class='msg-title'>{{microDataStr}}</div>
    <br />
    <button class="bk-button">tesddt</button>
    <router-link to="/page2">
      <el-button type="primary" plain>show element-plus</el-button>
    </router-link>
    <el-button type="primary" plain @click="handleClick">show globalStr</el-button>
    <el-button type="primary" plain @click="send">向 parent 发数据</el-button>
  </div>
</template>

<script>
import HelloWorld from '../components/HelloWorld.vue'
import { ref, onBeforeUnmount, version } from 'vue';

export default {
  name: 'Page1',
  components: {
    HelloWorld
  },
  setup() {
    const centerDialogVisible = ref(false)
    const microDataStr = ref('')

    const handleDataChange = data => {
      console.log('vue3 来自基座应用的数据', data)
      centerDialogVisible.value = true
      microDataStr.value = JSON.stringify(data)
    }

    const handleGlobalDataChange = data => {
      console.log('vue3 来自基座派发全局事件的数据', data)
      centerDialogVisible.value = true
      microDataStr.value = JSON.stringify(data)
    }

    const handleClick = () => {
      console.error(window.globalStr)
    }

    const send = () => {
        window.microApp && window.microApp.dispatch({type: '子应用发送的数据'})
    }

    // window.microApp && window.microApp.addDataListener(handleDataChange)
    // window.microApp && window.microApp.addGlobalDataListener(handleGlobalDataChange)

    onBeforeUnmount(() => {
        // window.microApp && window.microApp.removeDataListener(handleDataChange)
        // window.microApp && window.microApp.removeDataListener(handleGlobalDataChange)
    });

    return {
      version,
      centerDialogVisible,
      microDataStr,
      handleClick,
      send
    };
  },
};

</script>

<style>
  .bk-button {
    background: red!important;
  }
</style>
