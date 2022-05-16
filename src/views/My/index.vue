<template>
  <div class="my-container">
    <!-- 已登录头部 -->
    <div class="header user-info" v-if="user">
      <div class="base-info">
        <div class="left">
          <!-- round设置图片变圆 -->
          <van-image class="avatar" round fit="cover" :src="userObj.photo" />
          <span class="name">{{ userObj.name }}</span>
        </div>
        <div class="right">
          <van-button size="mini" round>编辑资料</van-button>
        </div>
      </div>
      <div class="data-stats">
        <div class="data-item">
          <span class="count">{{ userObj.art_count }}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userObj.follow_count }}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userObj.fans_count }}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userObj.like_count }}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>
    <!-- 未登录头部 -->
    <div class="header not-login" v-else>
      <div class="login-btn" @click="$router.push('/login')">
        <img src="@/assets/mobile.png" class="mobile-img" />
        <span class="text" @click="this.$router.push('/login')">点击登录</span>
      </div>
    </div>

    <!-- 收藏/历史 -->
    <!-- column自定义列数 clickable是否开启点击反馈 -->
    <van-grid class="grid-nav mb-9" :column-num="2" clickable>
      <van-grid-item class="grid-item">
        <template #icon>
          <i class="toutiao toutiao-shoucang"></i>
        </template>
        <template #text>
          <span class="text">收藏</span>
        </template>
      </van-grid-item>
      <van-grid-item class="grid-item">
        <template #icon>
          <i class="toutiao toutiao-lishi"></i>
        </template>
        <template #text>
          <span class="text">历史</span>
        </template>
      </van-grid-item>
    </van-grid>
    <!-- 消息通知/小智同学 -->
    <!-- <van-field label="消息通知" clickable is-link/>
    <van-field label="小智同学" />
    <van-field label="退出登录" /> -->
    <van-cell title="消息通知" clickable is-link />
    <van-cell class="mb-9" title="小智同学" clickable is-link />
    <van-cell
      class="logout-cell"
      title="退出登录"
      clickable
      v-if="user"
      @click="backFn"
    />
  </div>
</template>

<script>
// 映射user数据
import { mapState } from "vuex";
import { getUserInfo } from "@/api/user";
// mapState是一个函数
export default {
  data() {
    return {
      userObj: {},
    };
  },
  created() {
    // if(user){}
    // console.log(mapState(['user']));
    // mapState(['user']返回一个对象，相当于下面代码：
    // {user:function(){}}
    if(this.user){
      this.loadingFn()
    }
  },
  computed: {
    ...mapState(["user"]),
    // ...对象解构，相当于
    // user:function(){
    //   return this.$store.state.user
    // }
  },
  methods: {
    backFn() {
      this.$dialog
        .confirm({
          title: "确认退出吗？",
        })
        .then(() => {
          // 确认执行的回调函数
          this.$store.commit("setUser", null);
        })
        .catch(() => {
          // 取消执行的回调函数
        });
    },
    async loadingFn() {
      try {
        const { data } = await getUserInfo();
        this.userObj = data.data;
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style scoped lang="less">
.my-container {
  .header {
    height: 361px;
    background: url("~@/assets/banner.png"); //css中使用@需要添加~
    background-size: cover;
  }
  .not-login {
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .mobile-img {
        width: 132px;
        height: 132px;
        margin-bottom: 15px;
      }
      .text {
        font-size: 28px;
        color: #fff;
      }
    }
  }
  .user-info {
    .base-info {
      height: 231px;
      padding: 76px 32px 23px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        align-items: center;
        .avatar {
          width: 132px;
          height: 132px;
          border: 4px solid #fff;
          margin-right: 23px;
        }
        .name {
          font-size: 30px;
          color: #fff;
        }
      }
    }
  }
  .data-stats {
    display: flex;
    .data-item {
      height: 130px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #fff;
      .count {
        font-size: 36px;
      }
      .text {
        font-size: 23px;
      }
    }
  }
  .grid-nav {
    .grid-item {
      height: 141px;
      i.toutiao {
        font-size: 45px;
      }
      .toutiao-shoucang {
        color: #eb5253;
      }
      .toutiao-lishi {
        color: #ff9d1d;
      }
      span.text {
        font-size: 28px;
      }
    }
  }
  .logout-cell {
    text-align: center;
    color: #d86262;
  }
  .mb-9 {
    margin-bottom: 9px;
  }
}
</style>