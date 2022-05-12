<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {};
  },
};
</script>
<style lang='less' scoped>
.box{
  width: 200px;
  height: 200px;
  background-color:blue ;
  color: aliceblue;
}
</style>