import { login, logout, getInfo } from '@/api/user'
import { resetRouter,allAsyncRouter,constantRoutes,anyRouter,default as router } from '@/router'

const getDefaultState = () => {
  return {
    token: localStorage.getItem('token_key'),
    name: '',
    avatar: '',
    routes:[],
  }
}

function filterAsyncRouter(allAsyncRouter,routers){
  let filter = allAsyncRouter.filter(item => {
    if(routers.indexOf(item.name) !== -1 ){
      if(item.children && item.children.length){
        item.children = filterAsyncRouter(item.children,routers)
      }
      return true
    }
  });
  return filter
}



const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROUTER(state,filterAllAsyncRouter){
    state.routes = constantRoutes.concat(filterAllAsyncRouter,anyRouter);
    router.addRoutes([...filterAllAsyncRouter,anyRouter])
  }
}

const actions = {
  
  //获取token
  async login({ commit }, userInfo){
    const { username, password } = userInfo
    const re = await login({ username: username.trim(), password: password });
    if(re.code === 20000 || re.code === 200){
      console.log(re.data.token)
      commit('SET_TOKEN', re.data.token);
      localStorage.setItem('token_key',re.data.token);
      return 'ok'
    }else{
      return Promise.reject(new Error('failed'))
    }
  },

  // 获取用户名头像
  
  async getInfo({ commit, state }){
    const re = await getInfo(state.token);
    if(re.code === 20000 || re.code === 200){
      console.log(re)
      commit('SET_NAME', re.data.name)
      commit('SET_AVATAR', re.data.avatar)
      commit('SET_ROUTER',filterAsyncRouter(allAsyncRouter,re.data.routes))
      
      return 'ok'
    }else{
      return Promise.reject(new Error('failed'))
    }
  },
  
  // user logout
  async logout({ commit, state }){
    const re = await logout(state.token);
    if(re.code === 20000 || re.code === 200){
      localStorage.removeItem('token_key');
      resetRouter()
      commit('RESET_STATE')
      return 'ok'
    }else{
      return Promise.reject(new Error('failed'))
    }
  },

  // remove token
  resetToken({ commit }){
    localStorage.removeItem('token_key');
    commit('RESET_STATE')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

