<template>
  <div class="comment-reply">
    <!-- 导航栏 -->
    <van-nav-bar
      :title="
        replyItem.reply_count > 0
          ? `${replyItem.reply_count}条回复`
          : '暂无回复'
      "
      fixed
    >
      <van-icon slot="left" name="cross" @click="$emit('close')" />
    </van-nav-bar>

    <div class="scroll-wrap">
      <!-- 当前评论项 -->
      <CommentItem :commentItem="replyItem" />

      <!-- 全部回复 -->
      <van-cell title="全部回复"></van-cell>

      <!-- 评论列表 -->
      <CommentList :art_id="replyItem.com_id" type="c" :list="portList"></CommentList>
    </div>

    <!-- 发布评论 -->
    <div class="post-wrap" :fixed="true">
      <van-button class="post-btn" size="small" round @click="isShowPingLun = true">写评论</van-button>
    </div>

    <!-- 发布弹出层 -->
    <van-popup v-model="isShowPingLun" position="bottom">
      <CommentPost :target="replyItem.com_id" :articleId="articleId" @updataPost="onPost"></CommentPost>
    </van-popup>
  </div>
</template>

<script>
import CommentList from "@/components/commentList";
import CommentItem from "@/components/comment-item";
import CommentPost from '@/components/commentPost'
export default {
  name: "CommentReply",
  props: {
    replyItem: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
        isShowPingLun:false,
        portList:[]
    };
  },
  inject:{
      articleId:{
          type:[String,Number],
          default:null
      }
  },
  components: {
    CommentItem,
    CommentList,
    CommentPost
  },

  methods: {
      onPost(data){
        this.isShowPingLun=false
        this.portList.unshift(data)
        this.replyItem.reply_count++
      }
  },
};
</script>
<style lang='less' scoped>
.post-wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-top: 1px solid #d8d8d8;
  .post-btn {
    width: 60%;
  }
}
.scroll-wrap {
  padding-top: 92px;
  padding-bottom: 90px;
}
</style>