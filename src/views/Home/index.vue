<template>
  <div class="home-container">
    <!-- 顶部导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <template #title>
        <van-button
          icon="search"
          round
          type="info"
          size="small"
          class="search-btn"
          to="/search"
          >搜索</van-button
        >
      </template>
    </van-nav-bar>
    <!-- 频道切换 -->
    <!-- animated开启切换频道的转场动画 -->
    <!-- swipeable开启手势滑动切换 -->
    <van-tabs class="channel-tabs" v-model="active" animated swipeable>
      <van-tab :title="item.name" v-for="item in pindaoList" :key="item.id">
        <ArticleList :channels="item"></ArticleList>
      </van-tab>
      <!-- 汉堡按钮 -->
      <div slot="nav-right" class="placeholder"></div>
      <div slot="nav-right" class="hamburger-btn" @click="show = true">
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>
    <!-- 频道弹出层 -->
    <van-popup
      v-model="show"
      position="bottom"
      :style="{ height: '100%' }"
      closeable
      close-icon-position="top-left"
    >
      <ChannelEdit
        :channels="pindaoList"
        :channelIndex="active"
        @active-update="goback"
      ></ChannelEdit>
    </van-popup>
  </div>
</template>

<script>
import ArticleList from "./components/article-list.vue";
import { getPinDao } from "@/api/user";
import ChannelEdit from "./components/channel-edit.vue";
import { mapState } from "vuex";
import {getItem} from '@/utils/storage'
export default {
  data() {
    return {
      active: 0, //控制频道切换项
      pindaoList: [], //频道列表
      show: false, //控制弹出层的显示与隐藏
    };
  },
  created() {
    this.loadgetPinDao();
  },
  methods: {
    async loadgetPinDao() {
      try {
        if (this.user) {
          const { data } = await getPinDao();
          // console.log(data);
          this.pindaoList = data.data.channels;
        }else{
          if(getItem('CHANNELS')){
            this.pindaoList = getItem('CHANNELS')
          }else{
            const { data } = await getPinDao();
            this.pindaoList = data.data.channels;
          } 
        }
      } catch (err) {
        console.log(err);
        this.$toast('我的频道获取失败！')
      }
    },
    goback(index, show = true) {
      // 更新激活的频道项
      this.active = index;
      // 是否关闭弹层
      this.show = show;
    },
  },
  components: {
    ArticleList,
    ChannelEdit,
  },
  computed: {
    ...mapState(["user"]),
  },
};
</script>

<style scoped lang="less">
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;
  .van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    bottom: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }
  /deep/ .channel-tabs {
    .tabs__wrap {
      height: 82px;
    }
    .van-tab {
      border-right: 1px solid #edeff3;
      min-width: 200px;
      font-size: 30px;
      color: #777777;
    }
    .van-tab--active {
      color: #333333;
    }
    .van-tabs__nav {
      padding-bottom: 0;
    }
    .van-tabs__line {
      bottom: 8px;
      width: 31px !important;
      height: 6px;
      background-color: #3296fa;
    }
  }
  .placeholder {
    flex-shrink: 0; //此元素不参与flex的平分
    width: 66px;
    height: 82px;
  }
  .hamburger-btn {
    position: fixed;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 66px;
    height: 82px;
    background-color: #fff;
    opacity: 0.92;
    i.toutiao {
      font-size: 33px;
    }
    &:before {
      //这里是scss的写法，对应的css写法是.hamburger-btn:before
      content: "";
      position: absolute;
      left: 0;
      width: 2px;
      height: 100%;
      background-image: url(~@/assets/gradient-gray-line.png);
      background-size: contain;
    }
  }
  /deep/ .van-tabs__wrap {
    position: fixed;
    top: 92px;
    z-index: 1;
    left: 0;
    right: 0;
    height: 82px;
  }
}
</style>