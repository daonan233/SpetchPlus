<script setup>
import { ref, watch, computed } from 'vue';
import { useStudyInfoStore } from '@/stores/studyInfo';

const studyInfoStore = useStudyInfoStore();
// 设置2秒后studyInfoStore.clickedIndex变为9
setTimeout(() => {
    studyInfoStore.clickedIndex = 9;
}, 2000);
const clickedIndex = computed(() => studyInfoStore.clickedIndex);

watch(clickedIndex, (newVal, oldVal) => {
    console.log('count changed from', oldVal, 'to', newVal);
});
</script>
<template>

</template>
<style></style>