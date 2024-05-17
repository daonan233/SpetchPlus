<template>
    <div class="sidebar">
        <a href="#"><el-avatar class="myAvatar" :size="150" src="https://pic.imgdb.cn/item/64f9458d661c6c8e54375e9d.png" /></a>
        <div class="user-info">
            <h2> {{ userInfo.username }}</h2>
            <p>ID:&nbsp;{{ userInfo.uid }}</p>
        </div>        
    </div>
</template>
<script lang="ts" setup>
defineProps({
    userInfo: {
        type: Object,
        // 给它个默认值
        default: () => { }
    },
})
</script>

<style scoped>
/* 头像样式 */
.myAvatar {
    position: relative;
    display: flex;
    margin: auto;
    margin-top: 100px;
}

/* 侧边栏显示样式 */
.sidebar {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    width: 270px;
    /* 侧边栏宽度 */
    height: 100vh;
    background-color: rgb(176, 173, 173);
    text-align: center;
    color:#fff;
}

.user-info {
    color:aliceblue;
    font-size: 16px;
}
</style>

  