// 管理用户数据相关
import { ref } from 'vue';
import { defineStore } from 'pinia';
import { loginAPI, registerAPI } from '@/apis/login';
import { useRoute } from 'vue-router';

// 第一个参数为模块名，第二个参数为回调函数
export const useUserStore = defineStore('user', () => {
    // 定义管理用户数据的 state
    const userInfo = ref({})
    
    // 获取路由
    const router = useRoute()
    
    // 定义获取接口数据的 action 函数
    const getUserInfo = async(username, password) => {
        // 调用获取用户信息接口
 
    }

    // 退出时清除用户信息
    const clearUserInfo = () => {
        userInfo.value = {}
    }

    // 以对象的格式把 state 和 action return
    return {
        userInfo,
        getUserInfo,
        clearUserInfo,
    }
},{
    persist: true,
})