<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'
// import { useUserStore } from '@/stores/user'
import { registerAPI } from '@/apis/login';

// const userStore = useUserStore()
const imageUrl = ref('')

// 上传头像后的回调函数
const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile
) => {
    // 若用户没有上传头像，则给予一个默认头像......(TODO)
    // userStore.userInfo.avatar = URL.createObjectURL(uploadFile.raw!)

    imageUrl.value = URL.createObjectURL(uploadFile.raw!)
}

// 上传头像前的回调函数（添加接口文档要求的数据）
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    // 上传头像前进行校验
    if (rawFile.type !== 'image/jpeg' && rawFile.type !== "image/png") {
        ElMessage({
            showClose: true,
            message: '头像只能是JPG或PNG格式!',
            type: 'warning'
        });
        return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage({
            showClose: true,
            message: '图片大小不能超过2MB!',
            type: 'warning'
        });
        return false
    }
    return true
}

// 表单校验
// 1、准备表单对象
const form = ref({
    username: '',
    password: '',
    email: '',
    code: '',
    nickname: '',
    avatar: '',
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
    email: [
        { required: true, message: '邮箱不能为空', trigger: 'blur' },
        { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
    ],
    code: [
        { required: true, message: '验证码不能为空', trigger: 'blur' },
        { min: 6, max: 6, message: '验证码长度为6个字符', trigger: 'blur' }
    ],
    nickname: [
        { required: true, message: '昵称不能为空', trigger: 'blur' },
        { min: 2, max: 14, message: '昵称长度为2-14个字符', trigger: 'blur' }
    ],

}

// 3、获取 form 组件实例做同一校验
const formRef = ref(null)

const emit = defineEmits(["gotoLogin"])  // gotoLogin为父组件传来的方法

// 注册按钮的响应函数
const doRegister = () => {
    const { username, password, email, code, nickname, avatar } = form.value

    // 调用实例方法
    formRef.value.validate(async (valid) => {
        // valid: 所有表单都通过校验，才为 true
        // 以valid作为判断条件，如果通过校验才执行登录逻辑
        if (valid) {
            // 调用注册接口
            await registerAPI(username, password, email, code, nickname, avatar)

            // 在拦截器里做了注册错误提示

            // 注册成功提示
            ElMessage({ type: 'success', message: '注册成功' })

            // 返回登录页面
            emit("gotoLogin")
        }
    })
}


onMounted(() => {

})
</script>

<template>
    <div class="account-box">
        <div class="avatar-area">
            <!-- 用户上传头像组件 -->
            <el-tooltip content="点击上传头像" placement="top" effect="light">
                <el-upload class="avatar-uploader" action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                    :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-tooltip>
        </div>
        <div class="form">
            <!-- 给表单组件model绑定form，rules绑定表单校验rules -->
            <el-form ref="formRef" :model="form" :rules="rules" label-position="right" label-width="70px" status-icon>
                <!-- 来到表单里的item组件，通过prop属性置顶表单校验的字段名 -->
                <el-form-item prop="username" label="账号">
                    <!-- 在input里使用v-model进行双向绑定 -->
                    <el-input v-model="form.username" placeholder="username" />
                </el-form-item>
                <el-form-item prop="password" label="密码">
                    <el-input v-model="form.password" placeholder="password" />
                </el-form-item>
                <el-form-item prop="email" label="邮箱">
                    <el-input v-model="form.email" placeholder="email" />
                </el-form-item>
                <el-form-item prop="code" label="验证码">
                    <el-input v-model="form.code" placeholder="code" />
                </el-form-item>
                <el-form-item prop="nickname" label="昵称">
                    <el-input v-model="form.nickname" placeholder="nickname" />
                </el-form-item>
                <el-button size="large" class="subBtn" @click="doRegister">立即注册</el-button>
            </el-form>
        </div>
    </div>
</template>

<style scoped>
/* 头像区域 */
.avatar-area {
    position: relative;
    top: 30px;
    /* 调整头像上传区域到上方的距离 */
    left: 10%;
}

/* 表单区域 */
.form {
    position: relative;
    margin-top: 50px;
}

/* 头像上传组件 */
.avatar-uploader .avatar {
    position: relative;
    width: 140px;
    height: 120px;
    display: block;
}

.account-box {
    position: absolute;
    left: 60%;
    /* 调整 "account-box" 到竖线右边 */
    top: 0px;
}

.subBtn {
    background: white;
    margin-left: 30px;
    letter-spacing: 2px;
    border-radius: 20px;
    padding-left: 40px;
    padding-right: 40px;
}

.subBtn:hover {
    border-color: rgba(223, 93, 49, 0.785);
    color: #000;
}

/* 设置按钮点击后又不再聚焦时样式恢复原样 */
.subBtn:focus:not(.subBtn:hover) {
    border-color: #888888;
    color: #555555;
}
</style>

<style>
/* 上传头像 */
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 140px;
    height: 120px;
    text-align: center;
}
</style>