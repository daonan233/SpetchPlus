<script setup>
import { ref } from 'vue';
import LoginBox from '@/views/Login/components/login-box.vue';
import RegisterBox from '@/views/Login/components/register-box.vue';

// 首先呈现登录页
const currentPage = ref('login')  // 标识当前处于 登录 or 注册页

// 转换到登录页
function gotoLogin() {
    currentPage.value = 'login'
}

// 转换到注册页
function gotoRegister() {
    currentPage.value = 'register'
}

</script>

<template>
    <div class="login-page">
        <header class="login-header">
            <a href="/home">
            <h1 class="top-logo">
                spetch
            </h1>
        </a>
        </header>
        <section class="login-section">
            <h1 class="left-logo">
                spetch
            </h1>
            <!-- 条件渲染，登录状态下渲染登录组件，注册状态下渲染注册组件 -->
                <RegisterBox v-if="currentPage == 'register'" @gotoLogin="gotoLogin"/>
                <LoginBox v-else/>
        </section>
        <div class="buttoms-area">
            <el-button size="large" class="subBtn" :class="{ 'activeBtn': currentPage == 'login' }"
                @click="gotoLogin">登录</el-button>
            <el-button size="large" class="subBtn" :class="{ 'activeBtn': currentPage == 'register' }"
                @click="gotoRegister">注册</el-button>
        </div>
    </div>
</template>

<style scoped>
.login-page {
    height: 100%;
    /* background: url("@/assets/images/login-bg.jpg") no-repeat center center / cover; */
    background-color: rgb(238, 237, 237);
}

.top-logo {
    display: block;
    /* height: 132px; */
    height: 76px;
	margin-top:0px;
    /* 通过设置高度隐藏了logo下面的文字*/
    width: 200px;
    text-indent: -9999px;
    /* 将文本移出可见区域，然后使用其他元素（例如图片）来代替文本。*/
    background: url("@/assets/logo.png") no-repeat center 18px / contain;
}

.login-section {
    background-color: #f7f7f7;
    position: relative;
    /* 设置相对定位，以容纳伪元素(竖线) */
    margin: 0 auto;
    /* 水平居中 */
    text-align: center;
    /* 内容水平居中 */
    border: 2px solid #000;
    /* 边框 */
    border-radius: 20px;
    /* 圆角 */
    box-shadow: 10px 10px 5px #888888;
    /* 阴影 */
    width: 60%;
    height: 488px;
    /* 垂直居中，使用 flexbox 布局 */
    display: flex;
    justify-content: center;
    align-items: center;
    transition: box-shadow 0.3s;
    /* 添加过渡效果，使阴影变化更平滑 */
}

.login-section:hover {
    box-shadow: 15px 15px 10px #888888;
    /* 鼠标悬停时的阴影变化效果 */
}

/* 在框中间划一条竖线 */
.login-section::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    /* 将伪元素定位到容器中间 */
    width: 1px;
    /* 竖线的宽度 */
    background: #888888;
    /* 竖线的颜色 */
}

/* 鼠标悬停时的效果，例如更改竖线颜色 */
.login-section:hover::before {
    background: #cec3c3;
}

.left-logo {
    position: relative;
    width: 200px;
    height: 130px;
    right: 25%;
    /* 确保 "account-box" 在竖线的左边 */
    text-indent: -9999px;
    background: url("@/assets/logo.png") no-repeat center 18px / contain;
}

/* 按钮样式 */
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

/* 最下方的两个按钮区域样式 */
.buttoms-area {
    padding-right: 50px;
    margin-top: 50px;
    text-align: center;
    /* 居中摆放 */
}

/* 按钮在鼠标悬浮时样式 */
.subBtn:hover {
    border-color: rgba(223, 93, 49, 0.785);
    color: #000;
}

/* 鼠标点击后移开，恢复原来样式 */
.subBtn:focus:not(.subBtn:hover) {
    border-color: #888888;
    color: #555555;
}

/* 按钮激活样式 */
/* 在登录页面下，下边的登录按钮会是激活样式；在注册页面下，下边的注册按钮会是激活样式。 */
.activeBtn {
    background: rgba(223, 93, 49, 0.785);
    color: #ffffff;
}

/* 更改勾选框勾选后颜色 */
:deep .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #df5d31;
    border-color: #df5d31;

}

/* 更改勾选框字体颜色 */
:deep .el-checkbox__input.is-checked+.el-checkbox__label {
    color: #df5d31;
}
</style>