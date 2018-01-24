<template>
  <div id="app">
    <el-container>
      <left-menu />
      <el-container class="is-vertical">
        <my-header />
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import  leftMenu from './components/leftMenu.vue'
import  myHeader from './components/myHeader.vue'


export default {
  components: {
    leftMenu, myHeader
  }
}
</script>