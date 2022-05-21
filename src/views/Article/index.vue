<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="黑马头条"
      left-arrow
      @click-left="onClickLeft"
    />
    <!-- 主体部分 -->
    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="isShow">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- 加载完成 -->
      <div class="article-detail markdown-body" v-else-if="article.title">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">
            {{ article.pubdate | relativeTime }}
          </div>
          <!-- @updataFollewd="article.is_followed=$event" -->
          <!-- 模板中的$event是事件参数：
              这个$event可以接收this.$emit('updataFollewd',!this.isFollod)传递的!this.isFollod
           -->
          <!-- 当我们传递给子组件的数据既要使用还要修改，可以使用v-model绑定该数据 -->
          <!-- v-model的使用原理
                :value="article.is_followed"
                @input="article.is_followed = $event"
            -->

          <FollowUser
            class="follow-btn"
            :autId="article.aut_id"
            v-model="article.is_followed"
          ></FollowUser>
          <!-- <van-button
            class="follow-btn"
            round
            size="small"
            v-if="article.is_followed"
            @click="onFollowed"
            :loading="isLoading"
            >已关注</van-button
          >
          <van-button
            v-else
            type="info"
            class="follow-btn"
            color="#3296fa"
            round
            size="small"
            icon="plus"
            @click="onFollowed"
            :loading="isLoading"
            >关注</van-button
          > -->
        </van-cell>
        <!-- 文章内容 -->
        <div
          class="article-content"
          v-html="article.content"
          ref="articleContent"
        ></div>
        <van-divider>正文结束</van-divider>
        <!-- 评论列表 -->
        <CommentList
          :list="postList"
          :art_id="article.art_id"
          @updataNum="num = $event.total_count"
          @onreply="onReplyClick"
        ></CommentList>

        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="isShowPingLun = true"
            >写评论</van-button
          >
          <van-icon name="comment-o" :info="num" color="#777"></van-icon>
          <!-- vue中数据更新dom是异步任务，此时article还没有数据，所以要把评论放到加载完成中 -->
          <CollectArticle
            class="btn-item"
            v-model="article.is_collected"
            :art_id="article.art_id"
          ></CollectArticle>
          <van-icon name="good-job-o" color="#777"></van-icon>
          <van-icon name="share" color="#777777"></van-icon>
        </div>

        <!-- 文章评论弹出层 -->
        <van-popup v-model="isShowPingLun" position="bottom">
          <CommentPost
            :target="article.art_id"
            @updataPost="onPost"
          ></CommentPost>
        </van-popup>
      </div>

      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else-if="errStatus == 404">
        <van-icon name="failure"></van-icon>
        <p class="text">该资源不存在或已删除！</p>
      </div>

      <!-- 加载失败：其他未知错误(例如网络原因或服务端异常) -->
      <div class="error-wrap" v-else>
        <van-icon name="failure"></van-icon>
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadAricle">点击重试</van-button>
      </div>
    </div>

    <!-- 评论回复弹出层 -->
    <van-popup v-model="isReplyShow" position="bottom" style="height: 100%">
      <CommentReply :replyItem="currentComment" @close="isReplyShow = false" v-if="isReplyShow"></CommentReply>
    </van-popup>
  </div>
</template>

<script>
import { getArticlesAPI } from "@/api/article";
import { ImagePreview } from "vant";
import FollowUser from "@/components/followUser";
import CollectArticle from "@/components/collectArticle";
import CommentList from "@/components/commentList";
import CommentPost from "@/components/commentPost";
import CommentReply from "@/components/commentReply";
export default {
  name: "aritcleIndex",
  props: {
    articleId: {
      type: String,
      required: true,
    },
  },
  provide:function(){
    return {
      articleId:this.articleId
    }
  },
  data() {
    return {
      article: {}, //文章详情对象
      isShow: true, //文章加载状态
      errStatus: 0, //请求异常状态
      num: 0, //评论数量
      isShowPingLun: false, //文章评论弹出层
      postList: [], //评论列表
      isReplyShow: false, //评论回复弹出层
      currentComment:{} //当前点击回复的评论项
    };
  },

  created() {
    this.loadAricle();
  },

  methods: {
    onClickLeft() {
      this.$router.back();
    },
    async loadAricle() {
      try {
        // 模拟失败
        // if(Math.random()>0.5){
        //   return JSON.parse('abc')
        // }
        this.isShow = true;
        const { data } = await getArticlesAPI(this.articleId);
        this.article = data.data;
        // 数据更新后并不会同步更新页面，所以想要获取数据更新后的页面元素，需要延时处理
        // 为什么setTimeout可以放在这个位置，而nextTick不行？
        // setTimeout是宏任务，而nextTick是微任务。setTimeout的执行时机比nextTick更晚。
        setTimeout(() => {
          this.onImage();
        }, 0);
      } catch (err) {
        if (err.response && err.response.status == 404) {
          this.errStatus = 404;
        }
        this.$toast("文章详情获取失败！");
      }
      // 加载完成
      this.isShow = false;

      // 为什么要把nextTick放到最后面，因为dom加载需要两个条件。
      // 1.isShow=false
      // 2.article有数据
      // this.$nextTick(this.onImage)
    },
    onImage() {
      const content = this.$refs.articleContent;
      const imgs = content.querySelectorAll("img");
      const images = [];
      imgs.forEach((item, index) => {
        images.push(item.src);
        item.onclick = function () {
          ImagePreview({
            images,
            startPosition: index,
          });
        };
      });
    },
    onPost(data) {
      this.isShowPingLun = false;
      this.postList.unshift(data);
    },
    onReplyClick(comment) {
      this.currentComment = comment
      this.isReplyShow = true;
    },
  },
  components: {
    FollowUser,
    CollectArticle,
    CommentList,
    CommentPost,
    CommentReply,
  },
};
</script>
<style lang='less' scoped>
@import "./githup-makedown-css.css";
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    /deep/ .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
    .btn-item {
      border: none;
      padding: 0;
      height: 40px;
      line-height: 40px;
      color: #777777;
    }
  }
}
</style>