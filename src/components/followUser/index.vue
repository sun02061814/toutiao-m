<template>
  <van-button
    round
    size="small"
    v-if="isFollod"
    @click="onFollowed"
    :loading="isLoading"
    >已关注</van-button
  >
  <van-button
    v-else
    type="info"
    color="#3296fa"
    round
    size="small"
    icon="plus"
    @click="onFollowed"
    :loading="isLoading"
    >关注</van-button
  >
</template>

<script>
import { followingAPI, refollowingAPI } from "@/api/user";
export default {
    model:{
        prop:'isFollod',
        event:'updataFollewd'
    },
  props: {
    autId: {
      type: [Number, String],
      required: true,
    },
    isFollod: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      isLoading: false, //是否显示关注的加载状态
    };
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    async onFollowed() {
      this.isLoading = true;
      try {
        if (this.isFollod) {
          // 已关注，点击取消关注
          await refollowingAPI(this.autId);
          this.$toast("取消关注");
        } else {
          // 未关注，点击关注
          await followingAPI(this.autId);
          this.$toast("关注成功");
        }
        this.$emit('updataFollewd',!this.isFollod)
      } catch (err) {
        console.log(err);
        let message = "操作失败，请重试！";
        if (err.response && err.response.status == 400) {
          message = "自己不能关注自己！";
        }
        this.$toast(message);
      }
      this.isLoading = false;
    },
  },
};
</script>
<style lang='less' scoped>
</style>