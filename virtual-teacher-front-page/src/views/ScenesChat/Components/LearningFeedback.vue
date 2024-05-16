<script setup>
import { ref, onMounted } from 'vue';
import { useScenesInfoStore } from '@/stores/scenesChat';

const ScenesInfoStore = useScenesInfoStore();

const props = defineProps({
    clickedIndex: {
        type: Number,
        default: -1,
    }
});

const clickedWord = ref(-1); // 已被点击的单词
const clickedPhoneme = ref(-1); // 单词中已被点击的音素
const wordRefs = ref([]);    // 所有单词按钮dom元素
const phonemeRefs = ref([]);    // 单词中所有因素按钮dom元素


// 初始化反馈界面所需要的分数等内容
const clickedIndex = ScenesInfoStore.clickedIndex;
const totalScore = ScenesInfoStore.sentencesDetail[clickedIndex]?.pronunciationScore;
const accuracyScore = ScenesInfoStore.sentencesDetail[clickedIndex]?.accuracyScore;
const fluencyScore = ScenesInfoStore.sentencesDetail[clickedIndex]?.fluencyScore;
const completenessScore = ScenesInfoStore.sentencesDetail[clickedIndex]?.completenessScore;
const words = ScenesInfoStore.sentencesDetail[clickedIndex]?.wordsArray.map((item) => item.word);
const wordsDetail = ScenesInfoStore.sentencesDetail[clickedIndex]?.wordsArray;

const handleClickWord = (index) => {
    // 如果已经有单词被点击了，那么将其样式恢复
    if (clickedWord.value !== -1) {
        wordRefs.value[clickedWord.value].style.border = "1px solid #ccc";
    }
    // 设置新的被点击的单词
    clickedWord.value = index;
    // 设置单词被点击后的样式
    wordRefs.value[index].style.border = "1px solid rgb(117, 82, 207)"
};

const handleClickPhoneme = (index) => {
    // 如果已经有音素被点击了，那么将其样式恢复
    if (clickedPhoneme.value !== -1) {
        phonemeRefs.value[clickedPhoneme.value].style.border = "1px solid #ccc";
    }
    // 设置新的被点击的音素
    clickedPhoneme.value = index;
    // 设置音素被点击后的样式
    phonemeRefs.value[index].style.border = "1px solid rgb(117, 82, 207)"
}

const closeFeedback = () => {
    // 设置clickedIndex 为-1，关闭学情反馈
    ScenesInfoStore.clickedIndex = -1;
}

// 播放用户单词音频
function playWordAudio() {
    const audioUrl = ScenesInfoStore.sentencesDetail[clickedIndex].sentenceAudioUrl;
    if (audioUrl) {
        const audio = new Audio(audioUrl);
        // 设置要切片的起始时间和持续时间（以秒为单位）
        let offset = wordsDetail[clickedWord.value].offset
        let duration = wordsDetail[clickedWord.value].duration

        // 设置音频的当前时间为起始时间
        audio.currentTime = offset;

        // 在起始时间播放音频
        audio.play();

        // 在持续时间后停止音频播放
        setTimeout(() => {
            audio.pause();
        }, duration * 1000);
    }
}

onMounted(() => {
    // 对每个单词的分数进行判断，低分单词呈现红色
    for (let i = 0; i < wordsDetail.length; i++) {
        if (wordsDetail[i].wordScore <= 90) {
            wordRefs.value[i].style.color = "rgb(227, 66, 66)";
        }
    }
})

</script>
<template>
    <div class="feedback-box">
        <div style="display: flex;">
            <img src="@/assets/learnPage/close.png"
                style="width: 30px; height: 30px; margin: 22px 400px 0 20px; cursor: pointer;" @click="closeFeedback()" />
            <h4 style="font-size: 20px">学情反馈</h4>
        </div>
        <div class="top-area">
            <div class="totalScoreBox">
                <p style="margin-bottom: 23px;margin-top: 18px;color: rgb(79, 78, 78);">整句总分</p>
                <hr />
                <p style="color: rgb(117,82,207); font-weight: bold; font-size: large;">{{ totalScore }}分</p>
            </div>
            <div class="all-kinds-scores">
                <div class="score-titles">
                    <p>准确度</p>
                    <p>流利度</p>
                    <p>完成度</p>
                </div>
                <div class="score-progesses">
                    <div style="margin-bottom: 20px;">
                        <el-progress :text-inside="true" :stroke-width="17" :percentage="accuracyScore"
                            color="rgb(117,82,207)">
                            <span>{{ accuracyScore }}</span>
                        </el-progress>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <el-progress :text-inside="true" :stroke-width="17" :percentage="fluencyScore"
                            color="rgb(117,82,207)">
                            <span>{{ fluencyScore }}</span>
                        </el-progress>
                    </div>
                    <div>
                        <el-progress :text-inside="true" :stroke-width="17" :percentage="completenessScore"
                            color="rgb(117,82,207)">
                            <span>{{ completenessScore }}</span>
                        </el-progress>
                    </div>
                </div>
            </div>
        </div>
        <p style="padding-left: 30px; text-align: left; color: rgb(79, 78, 78);">
            请点击下表中任意单词以查看该单词的正确发音（标红单词为本次发音有误单词）
        </p>
        <div class="sentence-area">
            <button v-for="(word, index) in words" :key="index" class="single-word" @click="handleClickWord(index)"
                ref="wordRefs">{{ word }}</button>
        </div>
        <div class="middle-area" v-if="clickedWord !== -1">
            <div class="wordScoreBox">
                <p style="color: rgb(79, 78, 78);">单词分数</p>
                <hr />
                <p style="color: rgb(117,82,207); font-weight: bold; font-size: large;">{{
                    wordsDetail[clickedWord].wordScore }}分</p>
            </div>
            <div class="audio-area">
                <span>您的发音</span>
                <img src="@/assets/learnPage/playAudio.png" @click="playWordAudio">
            </div>
            <div class="phonemes-area">
                <div class="phonemes-area-top"><span>选择音素</span><el-scrollbar>
                        <div class="scrollbar-flex-content"><button
                                v-for="(phoneme, index) in wordsDetail[clickedWord].phonemesArray" :key="index"
                                class="single-phoneme" @click="handleClickPhoneme(index)" ref="phonemeRefs">{{
                                    phoneme.phoneme }}</button></div>
                    </el-scrollbar></div>
                <hr />
                <div class="phonemes-area-buttom"><span>音素分数</span><span v-if="clickedPhoneme != -1"
                        style="color: rgb(117,82,207); font-weight: bold; font-size: 16px;"> {{
                            wordsDetail[clickedWord].phonemesArray[clickedPhoneme].phonemeScore }}分</span></div>
            </div>
        </div>
        <div class="bottom-area">
            <div class="show-pronunciation-area" v-if="clickedPhoneme !== -1">
                <div class="title-container">
                    <h1 class="show-pronunciation-title" style="font-size: 17px">发音动画展示</h1>
                </div>
                <img src="@/assets/feedback/bay1.svg" style="width: 350px;">
            </div>
        </div>
    </div>
</template>
<style scoped>
.feedback-box {
    display: flex;
    position: relative;
    flex-direction: column;
    width: 900px;
    /* height: 670px; */
    height: 692px;
    margin-top: 6vh;
    margin-left: -940px;
    border: 1px solid #ccc;
    border-radius: 20px;
    box-shadow: 1px 1px 8px #ccc;
    background-color: #fff;
    letter-spacing: 3px;
    text-align: center;
    z-index: 98;
}

.top-area {
    display: flex;
    flex-direction: row;
    margin-top: -17px; 
}


.totalScoreBox {
    width: 16%;
    height: 95%;
    margin-left: 80px;
    border: #ccc solid 1px;
    border-radius: 10px;
    background-color: rgb(249, 249, 249);
}

.all-kinds-scores {
    display: flex;
    width: 50%;
    height: 95%;
    margin-left: 80px;
    border: #ccc solid 1px;
    border-radius: 10px;
    background-color: rgb(249, 249, 249);
}

.score-titles {
    color: rgb(79, 78, 78);
    width: 26%;
}

.score-progesses {
    flex: 1;
    padding: 20px 15px 10px 0;
}

.sentence-area {
    border: #ccc solid 1px;
    border-radius: 10px;
    background-color: rgb(249, 249, 249);
    margin-left: 80px;
    margin-right: 80px;
    padding-top: 5px;
    padding-bottom: 5px;
    overflow-wrap: break-word;
}

.sentence-area .single-word {
    margin: 10px 10px;
    padding: 5px 10px;
    border: #ccc solid 1px;
    border-radius: 5px;
    background-color: white;
    color: rgb(102, 101, 101);
    cursor: pointer;
    font-size: 16px;
    transition: 0.9s;
}

.sentence-area .single-word:hover {
    border: rgb(117, 82, 207) solid 1px;
}

.middle-area {
    display: flex;
    flex-direction: row;
    margin-top: 20px;
}

.wordScoreBox {
    width: 12%;
    height: 95%;
    margin-left: 60px;
    border: #ccc solid 1px;
    border-radius: 10px;
    background-color: rgb(249, 249, 249);
}

.audio-area {
    display: flex;
    align-items: center;
    width: 17%;
    height: 95%;
    margin-left: 60px;
    border: #ccc solid 1px;
    border-radius: 10px;
    background-color: rgb(249, 249, 249);
}

.audio-area span {
    margin-left: 20px;
    margin-right: 13px;
    color: rgb(79, 78, 78);
}

.audio-area img {
    width: 12%;
    height: 20%;
    margin-left: 10px;
    cursor: pointer;
}

.phonemes-area {
    width: 45%;
    height: 95%;
    margin-left: 60px;
    border: #ccc solid 1px;
    border-radius: 10px;
    background-color: rgb(249, 249, 249);
}

.scrollbar-flex-content {
    display: flex;
    max-width: 250px;
}

.phonemes-area-top {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.phonemes-area .single-phoneme {
    margin: 10px 6px;
    padding: 5px 10px;
    border: #ccc solid 1px;
    border-radius: 5px;
    background-color: white;
    color: rgb(102, 101, 101);
    cursor: pointer;
    font-size: 16px;
    transition: 0.9s;
}

.phonemes-area-top span {
    margin-left: 30px;
    margin-right: 20px;
    color: rgb(79, 78, 78);
}


.phonemes-area-buttom {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.phonemes-area-buttom span {
    margin: 7px 100px 0px 30px;
    color: rgb(79, 78, 78);
}

.title-container {
    text-align: center;
    position: relative;
    margin-top: 10px;
}

.show-pronunciation-title {
    text-align: center;
    position: relative;
    margin: 0 10px; /* 可根据需要调整文字和横线之间的间距 */
    overflow: hidden;
}
.show-pronunciation-title::before,.show-pronunciation-title::after{
    content: '';
    display: inline-block;
    width: 100%;
    height: 1px;
    position: absolute;
    background: #ccc;
    top: 50%;
}
.show-pronunciation-title::before{
    margin-left: -10px;
    transform: translateX(-100%);
}
.title::after{
    margin-left: 10px;
}

.bottom-area {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.show-pronunciation-area {
    position: relative;
    width: 100%;
    left: 50%;
    transform: translateX(-50%);
    color: rgb(79, 78, 78);
}
</style>