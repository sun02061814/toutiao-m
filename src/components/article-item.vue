<template>
  <van-cell class="article-item" :to="Roupath">
    <!-- 标题 -->
    <div slot="title" class="title">{{ articleItem.title }}</div>
    <!-- 描述信息 -->
    <div slot="label">
      <div v-if="articleItem.cover.type == 3" class="cover-wrap">
        <div
          class="cover-item"
          v-for="(item, index) in articleItem.cover.images"
          :key="index"
        >
          <van-image class="cover-item-img" fit="cover" :src="item" />
        </div>
        
      </div>
      <div class="label-info-wrap">
          <span>{{ articleItem.aut_name }}</span>
          <span>{{ articleItem.comm_count }}评论</span>
          <span>{{ articleItem.pubdate | relativeTime }}</span>
        </div>
    </div>
    <!-- 右侧图片 -->
    <van-image
      class="right-cover"
      fit="cover"
      v-if="articleItem.cover.type == 1"
      :src="articleItem.cover.images[0]"
    />
  </van-cell>
</template>

<script>
export default {
  props: {
    articleItem: {
      type: Object,
      required: true,
    },
  },
  data(){
    return {
      Roupath:`/article/${this.articleItem.art_id}`
    }
  }
};
</script>


<style scoped lang="less">
.article-item {
  .title {
    font-size: 32px;
    color: #3a3a3a;
  }

  .van-cell__value {
    flex: unset;
    width: 232px;
    height: 146px;
    padding-left: 25px;
  }

  .right-cover {
    width: 232px;
    height: 146px;
  }

  .label-info-wrap span {
    flex: unset;
    font-size: 22px;
    color: #b4b4b4;
    margin-right: 25px;
  }
  .cover-wrap {
    display: flex;
    padding: 30px 0;
    //.cover-item:last-child : 选择.cover-wrap中的子元素cover-item的最后一个 (不理解的看下边的回顾,或者完整写法)
    //.cover-item:not(:last-child) : 选择非最后一个子元素
    .cover-item {
      flex: 1;
      height: 146px;
      &:not(:last-child) {
        //嵌套语法里&代表父元素.cover-item
        padding-right: 4px;
      }
      .cover-item-img {
        width: 100%;
        height: 146px;
      }
    }
  }
}
// 这里的完整写法 ， 选择cover-wrap中的cover-item子元素，排除最后一个cover-item
// .cover-wrap .cover-item:not(:last-child) {
//     padding-right: 4px;
// }
</style>