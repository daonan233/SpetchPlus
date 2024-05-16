<script setup>
import { ref, reactive, watch, nextTick, computed } from 'vue';
import PopoverTeacher from '@/views/Chat/Components/PopoverTeacher.vue';
import PopoverUser from '@/views/Chat/Components/PopoverUser.vue';
import { useStudyInfoStore } from '@/stores/studyInfo';

const StudyInfoStore = useStudyInfoStore();

let inputText = ref('');
let chatbox = ref(null);
let boxScroll = ref(null);

const sendText = () => {
    if (inputText.value == '') {
        return;
    }
    // 将句子的详细信息存储到sentencesDetail数组中
    StudyInfoStore.sentencesDetail.push({
        isTexing: true, // 是否是用户键盘输入文本
        sentence: inputText.value, // 句子
        wordsArray: [], // 句子中的单词数组
        pronunciationScore: 100,  // 句子发音分数
        accuracyScore: 100, // 句子准确度分数
        completenessScore: 100, // 句子完成度分数
        fluencyScore: 100, // 句子流利度分数
    })

    // 将输入框中的内容添加进聊天记录中
    StudyInfoStore.userChatContent.push(inputText.value)
    // 向数组中添加一个新的 PopoverUser 组件
    StudyInfoStore.user_popovers.push({});
    // 清空input框中的内容
    document.getElementById('input').value = ''
}

// 将页面滚动到底部
const scrollToBottom = () => {
    // chatbox.value.scrollHeight为视窗大小 610，所以要 *100 保证即使在顶部也能滚动到底部
    boxScroll.value.scrollTo({ top: chatbox.value.scrollHeight * 100, behavior: 'smooth' });
};

// 当将数组定义为响应式数据ref时，如果不加上deep:true，watch是监听不到值的变化的
watch(() => [StudyInfoStore.user_popovers, StudyInfoStore.teahcer_popovers], () => {
    // 监听popovers的变化，当出现新的popovers时，将页面滚动到底部
    nextTick(() => {
        scrollToBottom();
    });
}, { deep: true });

// 将 user_popovers 和 teacher_popovers 中的元素混合到一个数组中
const mixedPopovers = computed(() => {
    const mixedPopovers = reactive([]);
    // mixedPopovers的第一个元素是user
    for (let i = 0; i < Math.max(StudyInfoStore.user_popovers.length, StudyInfoStore.teacher_popovers.length); i++) {
        if (i < StudyInfoStore.user_popovers.length) {
            mixedPopovers.push({
                component: 'PopoverUser',
                content: StudyInfoStore.userChatContent[i],
            });
        }
        if (i < StudyInfoStore.teacher_popovers.length) {
            mixedPopovers.push({
                component: 'PopoverTeacher',
                content: StudyInfoStore.teacherChatContent[i],
            });
        }
    }
    return mixedPopovers;
});

const sentenceRefs = ref([]);    // 所有句子（老师+学生）dom元素
const handleClick = (index) => {
    // 只有点击用户句子才有效
    if (mixedPopovers.value[index].component === 'PopoverUser') {
        // mixedPopovers的第一个元素是user，注意index的对应情况：0 2 4 6 8 ...
        StudyInfoStore.clickedIndex = index / 2;
        console.log("clickedIndex:", StudyInfoStore.clickedIndex);

        // 点击的气泡框变色
        sentenceRefs.value.forEach((item, i) => {
            // 先设置之前点击过的框变回原来的颜色
            const popoverElement = item.querySelector('.popover'); // 获取深层的气泡框元素
            const mePrefixElement = item.querySelector('.me-prefix'); // 获取气泡框中的前缀元素
            if (i % 2 === 0) {
                popoverElement.style.backgroundColor = 'rgb(235, 233, 248)';
                popoverElement.style.color = 'black';
                mePrefixElement.style.color = 'rgb(117, 82, 207)';
                popoverElement.style.transition = 'background-color 0.5s';
            }

            // 点击的气泡框变色
            if (i === index) {
                const popoverElement = item.querySelector('.popover'); // 获取深层的气泡框元素
                const mePrefixElement = item.querySelector('.me-prefix'); // 获取气泡框中的前缀元素

                // 点击的气泡框变色
                popoverElement.style.backgroundColor = 'rgba(117, 82, 207, 0.9)';
                popoverElement.style.color = 'white';
                mePrefixElement.style.color = 'rgb(124,153,258)';
                popoverElement.style.transition = 'background-color 0.5s';
            }
        });

    }
};
</script>
<template>
    <div ref="chatbox" class="chatbox">
        <h4 class="box-title">请选择要查看学情的句子</h4>
        <div class="all-pops-area">
            <el-scrollbar ref="boxScroll" max-height="560px">
                <div>
                    <PopoverTeacher content="Hello! I'm Nofe. Just feel free and talk to me~" />
                </div>
                <!-- 永远不要把 v-if 和 v-for 同时用在同一个元素上，带来性能方面的浪费（每次渲染都会先循环再进行条件判断）
为了避免出现这种情况，在外层嵌套template（页面渲染不生成dom节点），在这一层进行v-if判断，然后在内部进行v-for循环 -->
                <template v-if="StudyInfoStore.user_popovers.length">
                    <!-- 使用 v-for 结合 <component :is> 来动态渲染不同的组件 -->
                    <div v-for="(popover, index) in mixedPopovers" :key="index" @click="handleClick(index)"
                        ref="sentenceRefs">
                        <component v-if="popover.component === 'PopoverUser'" :is="PopoverUser" :content="popover.content"
                            :senScore="StudyInfoStore.sentencesDetail[index / 2].pronunciationScore" />

                        <component v-else-if="popover.component === 'PopoverTeacher'" :is="PopoverTeacher"
                            :content="popover.content" />
                    </div>
                </template>
            </el-scrollbar>
        </div>
        <!-- 输入文本框 -->
        <div class="input-area">
            <input class="input-box" type="text" id="input" placeholder="Type a message" v-model="inputText" />
            <el-button class="input-button" @click="sendText" round> Send </el-button>
        </div>
    </div>
</template>

<style scoped>
.chatbox {
    display: flex;
    flex-direction: column;
    width: 510px;
    /* height: 670px; */
    height: 692px;
    overflow: hidden;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 20px;
    box-shadow: 1px 1px 8px #ccc;
    background-color: #fff;
    padding: 0;
}

.box-title {
    margin: 10px;
    padding: 0;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 1px;
    text-align: center;
    color: #333;
    margin-bottom: 10px;
}

.all-pops-area {
    /* height: 560px; */
    height: 570px;
    /* max-height: 560px; */
    max-height: 570px;
    border-bottom: 1px solid #ccc;
    /* 上下两块之间的横线分割线 */
    overflow-y: auto;
}

.input-area {
    flex: 1;
    /* 使输入框部分占据剩余空间 */
    background-color: rgb(239, 239, 239);
    margin: 0;
    padding: 0;
    border-radius: 0px 0px 20px 20px;
}

.input-box {
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: 20px;
    width: 310px;
    height: 50px;
    font-size: 16px;
    padding-left: 20px;
    border-radius: 20px;
    border: #ccc;
    box-shadow: 1px 1px 10px #ccc;
}

.input-button {
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: 40px;
    width: 80px;
    height: 50px;
    font-size: 16px;
    border-radius: 20px;
    border: #ccc;
    box-shadow: 1px 1px 10px #ccc;
    color: #fff;
    background-color: rgba(117, 82, 207, 0.9);
}

/* 修改滚动条颜色样式 */
.el-scrollbar {
    --el-scrollbar-bg-color: rgba(117, 82, 207, 0.6);
    --el-scrollbar-hover-bg-color: rgb(117, 82, 207);
}
</style>