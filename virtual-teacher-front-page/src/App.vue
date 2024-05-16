<script setup>
import { RouterLink, RouterView } from 'vue-router'

</script>

<template>
<!-- 一级路由出口 -->
<router-view></router-view>

</template>

<style>
/* 设置body高度100% */
html, body, #app{
    height: 100%;
}
</style>
