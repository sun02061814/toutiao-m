<template>
  <div class="article-list">
    <div>
      <van-pull-refresh
        v-model="isLoading"
        :success-text="remoment"
        :success-duration="1500"
        @refresh="onRefresh"
      >
        <!-- :error.sync="error" 父(article-list)子(van-list)组件都要修改error的值，所以使用sync修饰符 -->
        <van-list
          v-model="loading"
          :finished="finished"
          :error.sync="error"
          error-text="请求失败，点击重新加载"
          finished-text="没有更多了"
          @load="onLoad"
        >
        <ArticleItem v-for="(item, index) in list"
        :key="index"
        :articleItem="item"
        >
        </ArticleItem>
          <!-- <van-cell
            v-for="(item, index) in list"
            :key="index"
            :title="item.title"
          /> -->
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import { getArticles } from "@/api/article";
import ArticleItem from '@/components/article-item'
export default {
  props: {
    channels: Object,
    required: true,
  },
  data() {
    return {
      list: [], //我的频道列表
      timestamp: null, //时间戳
      loading: false,  //是否展示加载效果
      finished: false, //是否全部展示完成
      error: false,    //是否展示错误信息
      isLoading:false,  //是否展示下拉刷新效果
      remoment:'刷新成功', //下拉结束后的提示信息
    };
  },
  created() {},
  methods: {
    // 加载更多
    async onLoad() {
      // 异步更新数据
      // ajax 请求
      try {
        const { data } = await getArticles({
          channel_id: this.channels.id,
          timestamp: this.timestamp || Date.now(),
        });
        // 模拟错误情况
        // if (Math.random() > 0.5) {
        //   JSON.parse('abc')
        // }
        // console.log(data);
        this.list.push(...data.data.results);
        // // 加载状态结束
        this.loading = false;
        if (data.data.results.length) {
          this.timestamp = data.data.pre_timestamp;
        } else {
          // 数据全部加载完成
          this.finished = true;
        }
      } catch (err) {
        console.log(err);
        this.loading = false; //关闭loading效果
        this.error = true; //展示错误信息
      }
    },
    // 下拉刷新
    async onRefresh(){
      try{
        const {data} = await getArticles({
          channel_id:this.channels.id,
          timestamp:Date.now()
        })
        // if(Math.random()>0.2){
        //   JSON.parse('plm')
        // }
        const {results} = data.data
        this.list.unshift(...results)
        this.remoment = `刷新成功,更新了${results.length}条数据`
        this.isLoading=false
      }catch(err){
        console.log(err);
        this.remoment='刷新失败,请稍后重试！'
        this.isLoading = false
      }
    }
  },
  components:{
    ArticleItem
  }
};
</script>

<style scoped lang="less">
.article-list {
  //css3中新增了一种视口单位vw和vh，何为视口，就是根据你浏览器窗口的大小的单位，不受父元素影响
  // 1vw=可视窗口宽度的百分之一，比如窗口宽度是750，则1vw=7.5px
  // 1vh=可是窗口高度的百分之一，比如窗口高度是667，则1vh=6.67px
  height: 80vh; 
  overflow-y: auto; //溢出滚动
}
</style>