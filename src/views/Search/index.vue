<template>
  <div class="search-container">
    <!-- 在van-search外层包裹form标签，且action不为空，即可在ios输入法中显示搜索按钮 -->
    <form action="/" class="search-from">
      <!-- v-model:双向数据绑定 -->
      <!-- show-action:显示取消按钮 -->
      <!-- @search:搜索框回车事件 -->
      <!-- @cancel:取消按钮点击事件 -->
      <van-search
        v-model="value"
        show-action
        placeholder="请输入搜索关键词"
        background="#3296fa"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isresults = false"
      />
    </form>
    <!-- 搜索结果 -->
    <SearchResults v-if="isresults" :val="value"></SearchResults>
    <!-- 联想建议 -->
    <SearchSuggestion
      v-else-if="value.length"
      :searchText="value"
      @Search="onSearch"
    ></SearchSuggestion>
    <!-- 历史记录 -->
    <SearchHistory
      v-else
      :searchHisList="searchHistories"
      @search="onSearch"
      @remove="searchHistories=[]"
    ></SearchHistory>
  </div>
</template>

<script>
import SearchHistory from "./components/search-history.vue";
import SearchSuggestion from "./components/search-suggestion.vue";
import SearchResults from "./components/search-results.vue";
import {setItem,getItem} from '@/utils/storage'
export default {
  name: "SearchIndex",
  data() {
    return {
      value: "", //搜索框输入内容
      isresults: false, //控制搜索结果的显示与隐藏
      searchHistories: getItem('SEARCH-HISTORY') || [], //搜索历史记录
    };
  },

  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResults,
  },

  computed: {},

  mounted() {},

  methods: {
    onSearch(val) {
      // 搜索框展示搜索文本
      this.value = val;
      // 将历史记录添加到数组中存储并去重
      const index = this.searchHistories.indexOf(val);
      if (index !== -1) {
        this.searchHistories.splice(index, 1);
      }
      this.searchHistories.unshift(val);
      // 展示搜索结果
      this.isresults = true;
    },
    onCancel() {
      this.$toast("取消");
    },
    recallFn(index) {
      this.searchHistories.splice(index, 1);
    },
  },
  watch:{
    searchHistories(newVal){
      setItem('SEARCH-HISTORY',newVal)
    }
  }
};
</script>
<style lang='less' scoped>
.search-container {
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
  .search-from {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>