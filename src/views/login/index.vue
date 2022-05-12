<template>
  <div class="container">
    <!-- 标题 -->
    <van-nav-bar title="登录" class="page-nav-bar" />
    <!-- 表单 -->
    <van-form @submit="onSubmit" ref="userForm">
      <van-field
        name="手机号"
        placeholder="请输入手机号"
        v-model="user.mobile"
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11"
      >
        <!-- vant提供的一个重要机制：通过属性控制vant提供的默认效果(left-icon="smile-o"),通过同名插槽控制自定义效果(slot="left-icon") 
            例如：field左侧的图标
            1.想使用vant内部提供的icon图标，那么就使用属性left-icon
            left-icon="smile-o"
            2.想使用自定义icon图标，那么就使用具名插槽left-icon
            <i slot="left-icon"></i>
            PS:使用left-icon属性是不能设置自定义图标的：left-icon="toutiao toutiao-shouji"
        -->
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>
      <van-field
        name="验证码"
        placeholder="请输入验证码"
        v-model="user.code"
        :rules="userFormRules.code"
        type="number"
        maxlength="6"
      >
        <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
        <template #button>
          <van-count-down
            :time="1000 * 5"
            v-if="isShow"
            format="ss s"
            @finish="isShow = false"
          />
          <!-- native-type='button'阻止表单的提交行为 -->
          <van-button
            v-else
            native-type="button"
            class="send-sms-btn"
            size="small"
            round
            type="default"
            @click="onSendSms"
            >发送验证码</van-button
          >
        </template>
        <!-- 具名插槽的写法:-->
        <!-- 1.template嵌套标签 -->
        <!-- <template v-slot:left-icon> -->
        <!-- <template #left-icon> -->
        <!-- <template slot="left-icon">
          <i class="toutiao toutiao-yanzhengma"></i>
        </template> -->
        <!-- 2.直接使用标签 -->
        <!-- 使用老语法：slot="插槽的名字"
              slot可以在普通标签里使用，也可以在template标签中使用
              PS:v-slot只能在template标签里使用，不能在普通标签里使用
         -->
        <!-- <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i> -->
      </van-field>
      <div style="margin: 16px">
        <!-- vant的属性如果是值为true，那么就可以只写属性名 -->
        <!-- :block="true" 简写为block
          因为block要求数据的类型是boolean类型，所以需要属性绑定
          属性绑定的两层含义：
          1.一个就是与data中的数据进行绑定
          2.还原数据的真实类型: "true" -- boolean类型的true  "1" -- Number类型的1
          -->
        <!-- <van-button :block="true" type="info" native-type="submit">登录</van-button> -->
        <van-button block type="info" native-type="submit">登录</van-button>
        <!-- type:是button的类型，其实就是颜色不同
            native-type:原生的类型，native是原生的意思。顾名思义：相当于原来的button标签的type属性
         -->
      </div>
    </van-form>
  </div>
</template>

<script>
import { loginAPI, sendSms } from "@/api/login";
import { Toast } from "vant";
export default {
  data() {
    return {
      isShow: false, //控制倒计时组件的显示与隐藏
      user: {
        mobile: "",
        code: "",
      },
      userFormRules: {
        mobile: [
          {
            required: true,
            message: "请填写手机号",
            trigger: "onBlur", //本项规则的触发时机，默认'onBlur'
          },
          {
            pattern: /^1[3,5,7,8,9]\d{9}$/,
            message: "手机号格式错误！",
          },
        ],
        code: [
          {
            required: true,
            message: "请填写验证码",
          },
          {
            pattern: /^\d{6}$/,
            message: "验证码格式错误！",
          },
        ],
      },
    };
  },
  methods: {
    async onSubmit() {
      // 1.验证表单

      // 2.加载状态
      Toast.loading({
        message: "登录中...",
        forbidClick: true, //禁用背景点击
        duration: 0, //持续展示toast
      });
      // 3.发送请求
      try {
        // const res = await loginAPI(this.user);
        // console.log(res);
        const {data} = await loginAPI(this.user);
        this.$store.commit('setUser',data.data) //调用vuex里mutations的setUser方法，把token数据传递过去
        this.$toast.success("登录成功"); //在一个组件中，再次调用Toast，会清除上一个Toast
      } catch (err) {
        // console.log(err);
        if (err.response.status === 400) {
          // console.log("手机号或密码错误！", err);
          Toast.fail("手机号或密码错误！");
        } else {
          // console.log("登录失败，请稍后重试！", err);
          Toast.fail("登录失败，请稍后重试！");
        }
      }
    },
    async onSendSms() {
      //1.验证手机号
      try {
        const res = await this.$refs.userForm.validate("手机号"); //this.$refs.userForm返回一个promise对象
        // console.log('手机号验证成功',res);
        // console.log(this.$refs.userForm.validate('手机号'));
      } catch (err) {
        return console.log("手机号验证失败", err);
      }
      //  2.倒计时
      this.isShow = true;
      // 3.发送验证码
      try {
        await sendSms(this.user.mobile)
        Toast('短信发送成功')
      } catch (err) {
        this.isShow = false;
        if(err.response.status==429){
          return Toast(err.response.data.message)
        }else{
          return Toast(err.response.data.message)
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  .toutiao {
    font-size: 37px;
  }
  .send-sms-btn {
    width: 160px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 12px;
    color: #666;
    text-align: center;
  }
}
</style>>

