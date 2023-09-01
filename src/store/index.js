import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //用户名
     userName:localStorage.getItem('userName') || '',
    //声明一个菜单数组,开始从本地存储中读取，使用JSON.parse是因为存的时候转成JSON，如果没有给你个空数组
  },
  mutations: {
    //用于用户名的值，顺便持久化存储
    updateusername(state,userName){
      state.userName = userName
      localStorage.setItem('userName',userName)
    },
    
  },
  actions: {

    },
  
  getters: {
  },
  modules: {
  }
})
