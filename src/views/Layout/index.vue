<template>
  <div class="layout-container">
    <!-- 子路由的出口 -->
    <router-view></router-view>
    <van-tabbar class="layout-tabbar" route>
      <van-tabbar-item to="/" icon="home-o">
        <span class="text">首页</span>
        <template #icon>
          <i class="toutiao toutiao-shouye"></i>
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/qa" icon="search">
        <span class="text">问答</span>
        <template #icon>
          <i class="toutiao toutiao-wenda"></i>
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/video" icon="friends-o">
        <span class="text">视频</span>
        <template #icon>
          <i class="toutiao toutiao-shipin"></i>
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/my" icon="setting-o">
        <span class="text">{{user?'我的':'未登录'}}</span>
        <i slot="icon" class="toutiao toutiao-wode"></i>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  data() {
    return {};
  },
  computed:{
    ...mapState(['user'])
  }
};
</script>

<style scoped lang="less">
.layout-container {
  .layout-tabbar {
    i.toutiao {
      font-size: 40px;
    }
    span.text {
      font-size: 20px;
    }
  }
}
</style>