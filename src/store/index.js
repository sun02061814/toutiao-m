import Vue from 'vue'
import Vuex from 'vuex'
import {setItem,getItem} from '@/utils/storage'
Vue.use(Vuex)
// token的key
const TOKEN_KEY = 'TOUTIAO_USER'
export default new Vuex.Store({
  state:{
    // user:JSON.parse(localStorage.getItem(TOKEN_KEY))
    user:getItem(TOKEN_KEY)
  },
  mutations:{
    setUser(state,user){
      state.user = user
      // 数据持久化，防止数据刷新丢失，把数据存到本地存储
      // localStorage.setItem(TOKEN_KEY,JSON.stringify(state.user))
      setItem(TOKEN_KEY,state.user)
    }
  }
})