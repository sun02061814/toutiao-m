<template>
  <div class="channel-edit">
    <!-- 我的频道 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        class="edit-btn"
        slot="default"
        round
        type="danger"
        size="mini"
        plain
        @click="channelEdit = !channelEdit"
        >{{ channelEdit ? "完成" : "编辑" }}</van-button
      >
    </van-cell>
    <van-grid :gutter="10" class="my-grid">
      <van-grid-item
        class="grid-item"
        v-for="(item, index) in channels"
        :key="item.id"
        @click="mychannelBtn(index, item)"
      >
        <!-- class动态绑定类名的两种写法 -->
        <!-- 1：:class="{类名1:boolean,类名2:boolean}" -->
        <!-- 2: :class=[类名1,类名2] -->
        <!-- <span slot="text" :class="{ active: index == channelIndex,text:true }">{{
          item.name
        }}</span> -->
        <van-icon
          slot="icon"
          name="clear"
          v-if="channelEdit && fixedchannes[0] !== item.id"
        />
        <span
          slot="text"
          :class="['text', index == channelIndex ? 'active' : '']"
          >{{ item.name }}</span
        >
      </van-grid-item>
    </van-grid>
    <!-- 推荐频道 -->
    <van-cell :border="false">
      <div slot="title">频道推荐</div>
    </van-cell>
    <van-grid :gutter="10" class="recommend-grid">
      <van-grid-item
        v-for="item in remomend"
        :key="item.id"
        class="grid-item"
        icon="plus"
        :text="item.name"
        @click="removeChannels(item)"
      />
    </van-grid>
  </div>
</template>

<script>
import { getChannelAll, putChannels, delChannels } from "@/api/channel";
import { mapState } from "vuex";
import { setItem } from "@/utils/storage";
export default {
  props: {
    channels: {
      type: Array,
      required: true,
    },
    channelIndex: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      channelsAll: [], //所有频道列表
      channelEdit: false, //控制完成/编辑按钮的切换
      fixedchannes: [0], //固定频道，不删除
    };
  },
  computed: {
    // 推荐列表的数据是由所有频道列表数据和我的频道列表数据计算而来，所以推荐频道列表数据定义为计算属性
    // 计算属性会观测内部依赖数据的变化
    // 如果依赖的数据发送变化，则计算属性会重新执行
    remomend() {
      return this.channelsAll.filter((item) => {
        return !this.channels.some((val) => {
          return val.id === item.id;
        });
      });
    },
    ...mapState(["user"]),
  },
  created() {
    this.loadChannelAll();
  },

  methods: {
    async loadChannelAll() {
      try {
        const { data } = await getChannelAll();
        this.channelsAll = data.data.channels;
      } catch (err) {
        console.log(err);
      }
    },
    async removeChannels(item) {
      // 由于推荐频道列表的数据是计算属性，所以当我的频道列表数据发生改变，计算属性也随之改变。
      // 因此推荐频道列表数据不需要执行删除操作
      try {
        this.channels.push(item);
        if (this.user) {
          // 已登录
          await putChannels({
            channels: [
              {
                id: item.id,
                seq: this.channels.length,
              },
            ],
          });
        } else {
          // 未登录
          setItem("CHANNELS", this.channels);
        }
      } catch (err) {
        console.log(err);
        this.$toast("添加失败！");
      }
    },
    mychannelBtn(index, item) {
        if (this.channelEdit) {
            // 未登录状态
            // 判断是否为推荐频道
            if (this.fixedchannes.includes(item.id)) {
              return;
            }
            // 解决删除active之前的元素，高亮频道发送改变的问题
            if (index <= this.channelIndex) {
              this.$emit("active-update", this.channelIndex - 1, true);
            }
            // 单项数据流不能修改父元素传递过来的数据，为什么这里可以删除？
            // 如果父元素传递过来的值是数组或者对象，那么父元素的数据是可以修改的，但是不能重新赋值
            this.channels.splice(index, 1);
            // 数据持久化
            this.deleteChannel(item.id)
        } else {
          // 点击返回home页
          this.$emit("active-update", index, false);
        }
    },
    async deleteChannel(id){
      try{
         if (this.user) {
            // 登录状态
            await delChannels(id)
          } else {
            setItem("CHANNELS", this.channels);
          }
      }catch(err){
        console.log(err);
        this.$toast('删除失败！')
      }
    }
  },
};
</script>
<style lang='less' scoped>
.channel-edit {
  padding-top: 85px;
  .title-text {
    font-size: 32px;
    color: #333333;
  }
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin-right: 0;
      }
      .active {
        color: red;
      }
    }
  }
  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
        .van-grid-item__text {
          margin-top: 0;
        }
      }
    }
  }
  /deep/ .my-grid {
    .van-grid-item__icon-wrapper {
      position: unset;
    }
    .van-icon-clear {
      position: absolute;
      right: -10px;
      top: -10px;
      font-size: 30px;
      color: #cacaca;
      z-index: 2;
    }
  }
}
</style>