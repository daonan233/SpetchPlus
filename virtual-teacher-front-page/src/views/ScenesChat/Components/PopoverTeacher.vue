<script setup>
// 子组件定义prop变量用来接收父组件传递的信息
const props = defineProps({
    content: {
        type: String,
        default: "fail to recognize, please try again!",
    },
});
</script>

<template>
    <div class="popover">
        <span class="teacher-prefix"> Nofe: </span>
        {{ content }}
    </div>
</template>

<style scoped>
.popover {
    background-color: rgb(207, 210, 236);
    color: black;
    max-width: 450px;
    /* 宽度固定 */
    font-size: 14px;
    letter-spacing: 1px;
    /* 字间距 */
    line-height: 1.7;
    /* 行间距 */
    overflow-wrap: break-word;
    border-radius: 10px;
    padding: 10px;
    margin-top: 20px;
    margin-left: 15px;
    margin-bottom: 20px;
}

.teacher-prefix {
    margin-left: 5px;
    margin-right: 5px;
    color: rgb(117, 82, 207);
    font-weight: 600;
}
</style>