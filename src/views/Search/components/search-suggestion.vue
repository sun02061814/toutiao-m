<template>
  <div class="search-suggestion">
    <van-cell
      icon="search"
      v-for="(item, index) in suggestList"
      :key="index"
      @click="$emit('Search',item)"
    >
      <div slot="title" v-html="replaceStr(item)"></div>
    </van-cell>
  </div>
</template>

<script>
import { suggestAPI } from "@/api/search";
import { debounce } from "lodash";
export default {
  name: "searchSuggest",
  props: {
    searchText: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      suggestList: [], //搜索建议列表
      // timer: null,
    };
  },

  components: {},

  computed: {},
  created(){},

  mounted() {},

  methods: {
    // 传统的防抖优化
    loadSuggest(value) {
      try {
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(async () => {
          const { data } = await suggestAPI({ q: value });
          // console.log(this);
          this.suggestList = data.data.options;
          if (data.data.options[0] == null) {
            this.suggestList = [];
          }
        }, 500);
      } catch (err) {
        console.log(err);
        this.$toast("获取搜索建议失败！");
      }
    },

    // 使用lodash插件，做防抖优化
    // async loadSuggest(val) {
    //   try {
    //     const { data } = await suggestAPI({ q: val });
    //     this.suggestList = data.data.options;
    //     if (data.data.options[0] == null) {
    //       this.suggestList = [];
    //     }
    //   } catch (err) {
    //     console.log(err);
    //     this.$toast("获取搜索建议失败！");
    //   }
    // },
    replaceStr(item){
      // RegExp 正则表达式构造函数
      // 参数1：匹配模式字符串，它会根据这个字符串创建正则对象
      // 参数2：匹配模式，要写到字符串中
      let reg = new RegExp(this.searchText,'gi')
      // console.log(reg);
      const htmlStr = `<span class="blue">${this.searchText}</span>`
      // console.log(htmlStr);
      // if(item==null) return item = ''
      return item.replace(reg,htmlStr)
      // item.replace(/匹配的内容/gi,替换成的内容)
    }
  },
  watch: {
    searchText: {
      // 当search发送改变的时候就会调用handler函数
      // handler(){
      //  this.loadSuggest(value)
      // }
      // 上述代码同下
      handler:debounce(function(value){
        this.loadSuggest(value)
      },500),
      immediate: true, //立即监听
      // 理解：
      // 默认的监听函数handler，会在当前vue组件渲染完毕之后，数据再发送改变才能监听到
      // 所以在搜索框输入'1'的时候，才开始渲染当前vue组件，并且把'1'传递过来给searchText
      // 此时的searchText变为1是监听不到的。
      // 解决：监听对象添加immediate属性，immediate:true。当前vue组件渲染时，立马调用一次
    },
  },
};
</script>
<style lang='less' scoped>
.search-suggestion {
  /deep/ .blue {
    color: #3296fa;
  }
}
</style>