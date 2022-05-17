<template>
  <div class="search-results">
    <van-list
      v-model="loading"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell v-for="item in list" :key="item.art_id" :title="item.title" />
    </van-list>
  </div>
</template>

<script>
import { getSearchResults } from "@/api/search";
export default {
  name: "searchResult",
  props: {
    val: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      list: [], //搜索结果数组
      loading: false, //是否展示加载状态
      finished: false, //是否结束加载
      error: false, //错误提示
      page: 1, //默认请求页数
      num: 20, //每页请求几条数据
    };
  },

  components: {},

  computed: {},

  created() {},

  methods: {
    async onLoad() {
      try {
        // 1.发送请求
        const { data } = await getSearchResults({
          q: this.val,
          page: this.page,
          per_page: this.num,
        });
        // if(Math.random()>0.5){
        //   JSON.parse('abc')
        // }
        const { results } = data.data;
        this.list.push(...results);
        this.loading = false;
        if (results.length) {
          // 有数据
          this.page++;
        } else {
          // 没有数据
          this.finished = true;
        }
      } catch (err) {
        console.log(err);
        this.error = true;
        this.loading=false
      }
    },
  },
};
</script>
<style lang='less' scoped>
</style>