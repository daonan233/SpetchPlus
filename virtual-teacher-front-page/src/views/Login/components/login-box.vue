<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginAPI } from '@/apis/login';

// 表单校验（账号名 + 密码）
// 1、准备表单对象
const form = ref({
    username: '',
    password: '',
    isAgreed: true  // 是否同意协议
})

// 2、准备规则对象
const rules = {
    // 规则对象中的属性名要和表单对象中的属性名一一对应
    username: [
        { required: true, message: '用户名不能为空', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '密码不能为空', trigger: 'blur' },
        { min: 6, max: 14, message: '密码长度为6-14个字符', trigger: 'blur' }
    ],
    isAgreed: [
        {
            validator: (rule, value, callback) => {
                // 自定义校验逻辑
                // 勾选才能成功登陆
                // 通过校验则直接 callback，没通过校验则需要 new error
                if (value) {
                    callback()
                } else {
                    callback(new Error('请勾选协议'))
                }
            }
        }
    ]
}

// 3、获取 form 组件实例做同一校验
const formRef = ref(null)
const router = useRouter()

// 登录按钮的响应函数
const doLogin = () => {
    const { username, password } = form.value
    // 调用实例方法
    formRef.value.validate(async (valid) => {
        // valid: 所有表单都通过校验，才为 true
        // 以valid作为判断条件，如果通过校验才执行登录逻辑
        if (valid) {
            // 调用登录接口
            await loginAPI(username, password)
            // 在拦截器里做了登录错误提示
            
            // 登录成功提示
            ElMessage({ type: 'success', message: '登录成功' })

            // 从 query 参数中获取原本要进入的url
            const redirect = router.currentRoute.value.query.redirect || '/home';
            // 跳转到原本要进入的url
            router.replace(redirect);
        }
    })
}
</script>

<template>
    <div class="account-box">
                <h1 class="right-logo">
                    spetch
                </h1>
                <div class="form">
                    <!-- 给表单组件model绑定form，rules绑定表单校验rules -->
                    <el-form ref="formRef" :model="form" :rules="rules" label-position="right" label-width="60px"
                        status-icon>
                        <!-- 来到表单里的item组件，通过prop属性置顶表单校验的字段名 -->
                        <el-form-item prop="username" label="账号">
                            <!-- 在input里使用v-model进行双向绑定 -->
                            <el-input v-model="form.username" placeholder="username"/>
                        </el-form-item>
                        <el-form-item prop="password" label="密码">
                            <el-input v-model="form.password" placeholder="password"/>
                        </el-form-item>
                        <el-form-item prop="isAgreed" label-width="22px">
                            <el-checkbox v-model="form.isAgreed" size="large">
                                我已同意隐私条款和服务条款
                            </el-checkbox>
                        </el-form-item>
                            <el-button size="large" class="subBtn" @click="doLogin">立即登录</el-button>
                    </el-form>
                </div>
            </div>
</template>

<style scoped>
.account-box {
    position: absolute;
    left: 60%;
    /* 调整 "account-box" 到竖线右边 */
    top: 0px;

    .right-logo {
        position: relative;
        left: 35%;
        /* 和竖线的距离 */
        top: 50px;
        /* 和顶部的距离 */
        padding-bottom: 110px;
        /* logo和输入框的距离 */
        width: 120px;
        text-indent: -9999px;
        background: url("@/assets/logo.png") no-repeat center 18px / contain;
    }
}

.subBtn {
    background: white;

    margin-left: 30px;
    letter-spacing: 2px;
    /* 字间距 */
    border-radius: 20px;
    /* 圆角 */
    /* 左右留白 */
    padding-left: 40px;
    padding-right: 40px;
}

.subBtn:hover {
    border-color: rgba(223, 93, 49, 0.785);
    color: #555555;
}

/* 鼠标点击后移开，恢复原来样式 */
.subBtn:focus:not(.subBtn:hover) {
    border-color: #888888;
    color: #555555;
}

</style>