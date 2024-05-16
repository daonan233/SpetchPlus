// 封装所有和用户登录注册相关的接口函数
import httpInstance from "@/utils/http";

// 用户登录接口
export const loginAPI = (username, password) => {
    return httpInstance({
        url: '/login',  
        method: 'POST',
        data: {
            username,
            password
        }
    })
}

// 用户注册接口
export const registerAPI = (username, password, email, code, nickname, avatar="") => {
    return httpInstance({
        url: '/users',  
        method: 'POST',
        data: {
            username,
            password,
            email,
            code,
            nickname,
            avatar,  // 有默认的 avator，可以不传
        }
    })
}