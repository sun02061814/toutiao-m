<template>
  <div class="comment-post">
    <van-field
      class="post-field"
      v-model.trim="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="请输入留言"
      show-word-limit
    />
    <van-button class="post-btn" @click="addPost" :disabled="!message.length">发布</van-button>
  </div>
</template>

<script>
import {postCommentAPI} from '@/api/article'
export default {
  name: "commentPost",
  props:{
      target:{
          type:[String,Number],
          required:true
      },
      articleId:{
         type: [Number, String, Object],
         default: null
      }
  },
  data() {
    return {
      message: "",
    };
  },

  methods: {
    async addPost() {
      try {
          const {data} = await postCommentAPI({
              target:this.target, //评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
              content:this.message, //评论内容
              art_id:this.articleId,  //文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
          })
          this.$emit('updataPost',data.data.new_obj)
          this.message = ''
          this.$toast.success('发布成功')
      } catch (err) {
          console.log(err);
          this.$toast.fail('发布失败，请稍后再试！')
      }
    },
  },
};
</script>
<style lang='less' scoped>
.comment-post {
  display: flex;
  align-items: center;
  padding: 32px 0 32px 32px;
  .post-field {
    background-color: #f5f7f9;
  }
  .post-btn {
    width: 150px;
    border: none;
    padding: 0;
    color: #6ba3d8;
    background: #fff;
    &::before {
      display: none;
    }
  }
}
</style>