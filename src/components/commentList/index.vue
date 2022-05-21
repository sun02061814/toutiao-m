<template>
  <div>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      @load="onLoad"
      :immediate-check="false"
    >
      <CommentItem
        v-for="(item, index) in list"
        :key="index"
        :commentItem="item"
        @onreply="$emit('onreply',$event)"
      />
    </van-list>
  </div>
</template>

<script>
import { getCommentList } from "@/api/comment";
import CommentItem from "../comment-item";
export default {
  name: "commentList",
  props: {
    art_id: {
      type: [String, Number],
      required: true,
    },
    list: {
      type: Array,
      default: () => [], //复杂数据类型在props中设置初始值，要用函数返回
    },
    type:{
      type:String,
      // 自定义Prop数据校验
      validator(value){
        return ['a','c'].includes(value)
      },
      default:'a'
    }
  },

  data() {
    return {
      loading: false,
      finished: false,
      error: false,
      offset: null,
      limit: 10,
    };
  },
  created() {
    this.loading = true
    this.onLoad();
  },
  methods: {
    async onLoad() {
      try {
        // 1.请求数据
        const { data } = await getCommentList({
          type: this.type, //评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.art_id, //源id，文章id或评论id
          offset: this.offset, //获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: this.limit, //获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
        });
        const { results } = data.data;
        this.list.push(...results);
        this.$emit("updataNum", data.data);
        // 2.关闭loading
        this.loading = false;
        // 3.判断是否还有数据
        if (results.length) {
          this.offset = data.data.last_id;
        } else {
          this.finished = true;
        }
      } catch (err) {
        console.log(err);
        this.loading = false;
        this.error = true;
      }
    },
  },
  components: {
    CommentItem,
  },
};
</script>
<style lang='less' scoped>
</style>