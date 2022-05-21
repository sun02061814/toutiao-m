<template>
   <van-button
    :icon="value ? 'star' : 'star-o'"
    :class="{
      collected: value  //根据收藏状态，应用.collected样式
    }"
    @click="onCollectArticle"
    :loading="isloading"
  />
</template>

<script>
import {collextAPI,recollextAPI} from '@/api/article'
export default {
  name: "collectArticle",
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    art_id:{
        type:[String,Number],
        required:true
    }
  },
  data() {
    return {
        isloading:false
    };
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
      async onCollectArticle(){
          this.isloading = true
          try{
              if(this.value){
                // 已收藏，取消收藏
                await recollextAPI(this.art_id)
              }else{
                  // 已收藏，取消收藏
                  await collextAPI(this.art_id)
              }
              this.$emit('input',!this.value)
            // 自定义事件修改数据也不是立即的，所以这里也是!value
              this.$toast.success(!this.value ? '点赞成功':'取消成功')
          }catch(err){
              console.log(err);
              this.$toast.fail('操作失败，请重试')
          }
          this.isloading = false
      }
  },
};
</script>
<style lang='less' scoped>
.collected {
  .van-icon {
    color: #ffa500;
  }
}
</style>