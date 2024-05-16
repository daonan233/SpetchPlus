// 封装用户个人主页信息相关的接口函数
import httpInstance from "@/utils/http";

// 用户登录接口
export const getMyInfoAPI = (userId) => {
    return httpInstance({
        url: `/users/${id}`,  
        method: 'GET',
    })
}