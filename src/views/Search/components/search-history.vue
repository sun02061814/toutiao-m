<template>
  <div class="search-history">
    <van-cell title="历史记录">
      <div v-if="isShow">
        <span @click="$emit('remove')">全部删除</span>
        <!-- <span @click="searchHisList.splice(0)">全部删除</span> -->
        &nbsp;&nbsp;
        <span @click="isShow = false">完成</span>
      </div>
      <van-icon v-else name="delete" @click="isShow = true" />
    </van-cell>
    <van-cell
      :title="item"
      v-for="(item, index) in searchHisList"
      :key="index"
      @click="reCell(item,index)"
    >
      <van-icon name="close" v-show="isShow"></van-icon>
    </van-cell>
  </div>
</template>

<script>
export default {
  name: "searchHistory",
  props: {
    searchHisList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      isShow: false, //控制删除按钮的显示与隐藏
    };
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    reCell(item,index) {
      if(this.isShow){
        // 删除状态
        this.searchHisList.splice(index,1)
      }else{
        // 非删除状态
        this.$emit('search',item)
      }
      
    },
  },
};
</script>
<style lang='less' scoped>
</style>