<script setup>
// 子组件定义prop变量用来接收父组件传递的信息
const props = defineProps({
    content: {
        type: String,
        default: "fail to recognize, please try again!",
    },
    senScore: {
        type: Number,
        default: 100,
    },
});
</script>

<template>
    <div class="pop-and-warning">
        <!-- 句子分数小于90时，显示提示错误图标 -->
        <img v-if="senScore <= 90" class="tip-image" src="@/assets/learnPage/warning.png" />
        <div class="popover">
            <span class="me-prefix"> Me: </span>
            {{ content }}
        </div>
    </div>
</template>

<style scoped>

.pop-and-warning {
    position: relative;
}
.popover {
    background-color: rgb(235, 233, 248);
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

.me-prefix {
    margin-left: 5px;
    margin-right: 5px;
    color: rgb(117, 82, 207);
    font-weight: 600;
}

.tip-image {
    position: absolute;
    top: 0;
    right: 0;
    margin-top: 7px;
    margin-right: 20px;
    width: 30px;
}
</style>