<template>
  <div>
    <router-link to="/home" class="exit-btn">退出</router-link>
  </div>
  <div class="mainArea">
    <div class="left-area">
      <div class="v-teacher">
        <VTeacher />
      </div>
      <div :ref="handleMicrophone" class="micro-recording-area">
        <img v-if="isRecording" src="@/assets/learnPage/talk.png" class="microphone">
        <img v-else src="@/assets/learnPage/stop.png" class="microphone">
        <div v-if="isRecording" class="audio-wave">
          <div class="item one"></div>
          <div class="item two"></div>
          <div class="item three"></div>
          <div class="item four"></div>
          <div class="item five"></div>
          <div class="item six"></div>
          <div class="item seven"></div>
        </div>
        <span :ref="handleCountdown" class="countdown"></span>
      </div>
    </div>
    <div class="feedback-box"
      v-if="ScenesInfoStore.clickedIndex != -1 && !ScenesInfoStore.sentencesDetail[ScenesInfoStore.clickedIndex].isTexing">
      <!-- 通过设置 key 属性来强制重新渲染组件 -->
      <!-- （解决已经打开反馈时再点击其他气泡后反馈框内容不会变化的bug） -->
      <LearningFeedback :key="clickedIndex"/>
    </div>
    <div class="chatbox">
      <ChatBox />
    </div>
  </div>
</template>

<script setup>
import VTeacher from "@/views/ScenesChat/Components/VTeacher.vue";
import ChatBox from "@/views/ScenesChat/Components/ChatBox.vue";
import LearningFeedback from "@/views/ScenesChat/Components/LearningFeedback.vue";
import { ref, watch, computed } from 'vue';
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import * as _ from "lodash";
import { useScenesInfoStore } from '@/stores/scenesChat';

const ScenesInfoStore = useScenesInfoStore();

// 作为key，用来重新渲染feedback组件
const clickedIndex = computed(() => ScenesInfoStore.clickedIndex + 1);

let mediaRecorder;
let audioChunks = [];
const audioUrl = ref('');

let recognization = "";  // 用于存储语音识别的结果，不能直接将textpush进content，会报错循环引用

function showPopover(text) {
  recognization = text;

  // 将输入框中的内容添加进聊天记录中
  ScenesInfoStore.userContent.push(recognization);

  // 每次事件触发时，向数组中添加一个新的 PopoverUser 组件
  ScenesInfoStore.user_popovers.push({});
  
  //学生的气泡数量+1,55改
  ScenesInfoStore.studentBubble += 1;
};

// 在vue3中，获取dom元素的是通过ref来获取的，而不是通过document.getElementById来获取的
const microphone = ref(null)
const countdown = ref(null)
let isRecording = ref(false);
// 赋值动态ref到变量
const handleMicrophone = el => {
  // el 就是所绑定的元素
  if (el) {
    microphone.value = el
    // 注意.value！！
    microphone.value.addEventListener('click', handleMicrophoneClick);
  }
}

const handleCountdown = el => {
  // el 就是所绑定的元素
  if (el) {
    countdown.value = el
  }
}

// 用于麦克风展示和倒计时的函数
let countdownSeconds = ref(30); // 设置倒计时秒数
let countdownText = ref('') // 设置倒计时文本
let countdownInterval;

function handleMicrophoneClick() {
  // 只有当老师完成讲话时，学生才能讲话，即老师讲话时禁用麦克风
  // if (lastTeacherCnt.value === teacherCnt.value) {
  //   return;
  // }

  // 如果学生完成了所有句子，禁用麦克风
  // if (studentCnt.value >= userContent.length) {
  //   return;
  // }

  // 否则，正常切换麦克风
  if (isRecording.value === false) {
    isRecording.value = true;
    startRecording();
  } else {
    isRecording.value = false;
    stopRecording();
  }
}
function startRecording() {
  // 开始评估
  startRecoAndAssess();
  startMicRecording();

  // 设置倒计时文本
  countdownText.value = countdownSeconds.value + 's';
  countdown.value.innerText = countdownText.value;

  // 开始倒计时
  countdownInterval = setInterval(() => {
    countdownSeconds.value--;
    countdownText.value = countdownSeconds.value + 's';
    // 倒计时可视化
    countdown.value.innerText = countdownText.value;


    // 倒计时结束，停止录音（停止录音有两种情况：倒计时结束和检测到静音）
    if (countdownSeconds.value === 0) {
      isRecording.value = false;
      stopRecording();
    }
  }, 1000);
}

function stopRecording() {
  clearInterval(countdownInterval);
  countdownSeconds.value = 30;
  countdown.value.innerText = '';
  speechRecognizer.stopContinuousRecognitionAsync();

  if (mediaRecorder.state === 'recording') {
    mediaRecorder.stop();
  }
}

// 获取用户语音输入
const speechConfig = sdk.SpeechConfig.fromSubscription("531c818822f44991b7648f0f9f6fea64", "southeastasia");
const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();

speechConfig.speechRecognitionLanguage = 'en-US';
// 创建用于发音评估的PronunciationAssessmentConfig（配置）对象
let reference_text = "";
const pronunciationAssessmentConfig = new sdk.PronunciationAssessmentConfig(
  reference_text,
  sdk.PronunciationAssessmentGradingSystem.HundredMark,
  sdk.PronunciationAssessmentGranularity.Phoneme,
  false,
);

pronunciationAssessmentConfig.phonemeAlphabet = "IPA";

// 创建语音识别器
let speechRecognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
pronunciationAssessmentConfig.applyTo(speechRecognizer);  // 将之前配置的发音评估参数应用到语音识别器中，以确保在进行语音识别时进行发音评估


async function startRecoAndAssess() {
  // 如果学生已经完成了所有句子，禁用麦克风？？？？isCompeleted = true
  // if (studentCnt.value >= userContent.length) {
  //   pronunciationAssessmentConfig.referenceText = "";
  // }
  // 使用 recognizeOnceAsync 操作听录 30 秒以内的语音，或直到检测到静音
  speechRecognizer.recognizeOnceAsync(result => {
    // 识别结束
    if (result.reason) {
      // 如果成功识别语音，更新显示文本
      onRecognizedResult(result); // 调用输出语音评估结果的函数
    }
    // 一次识别结束后，停止录音
    stopRecording();
  });
}

// 用于输出语音评估的结果
async function onRecognizedResult(result) {
  var pronunciation_result = sdk.PronunciationAssessmentResult.fromResult(result);

  // 句子中的单词数组
  const wordsArray = pronunciation_result.detailResult.Words.map(wordObj => ({
    word: wordObj.Word,  // 单词
    wordScore: wordObj.PronunciationAssessment.AccuracyScore,  // 单词发音分数
    offset: wordObj.Offset / 10000000,  // 单词在句子音频中的偏移量（以秒为单位）
    duration: wordObj.Duration / 10000000,  // 单词的持续时间（以秒为单位）
    // 单词中的音素数组（Phonemes: phonemesArray）
    phonemesArray: wordObj.Phonemes.map(phonemeObj => ({
      phoneme: phonemeObj.Phoneme,  // 音素
      phonemeScore: phonemeObj.PronunciationAssessment.AccuracyScore,  // 音素发音分数
    })),
  }));

  // 将句子的详细信息存储到sentencesDetail数组中
  ScenesInfoStore.sentencesDetail.push({
    isTexing: false, // 是否是用户键盘输入文本
    sentence: result.text, // 句子
    sentenceAudioUrl: audioUrl.value ? audioUrl.value : '', // 句子音频的URL
    wordsArray: wordsArray, // 句子中的单词数组
    pronunciationScore: pronunciation_result.pronunciationScore,  // 句子发音分数
    accuracyScore: pronunciation_result.accuracyScore, // 句子准确度分数
    completenessScore: pronunciation_result.completenessScore, // 句子完成度分数
    fluencyScore: pronunciation_result.fluencyScore, // 句子流利度分数
  })

  showPopover(result.text); // 新渲染气泡
}

// 处理取消事件
speechRecognizer.canceled = function (s, e) {
  if (e.reason === sdk.CancellationReason.Error) {
    // 如果发生错误，输出错误信息
    var str = "(cancel) Reason: " + sdk.CancellationReason[e.reason] + ": " + e.errorDetails;
    console.log(str);
  }
  speechRecognizer.stopContinuousRecognitionAsync();
};

// 处理会话停止事件，它在会话结束时被调用，并停止连续识别
speechRecognizer.sessionStopped = (s, e) => {
  // 一次发音评估后，会输出评估结果，然后会再输出 NOMATCH: Speech could not be recognized. 然后好像会自动调用 sessionStopped
  speechRecognizer.stopContinuousRecognitionAsync();
  // 关闭语音识别器，释放资源
  // speechRecognizer.close();
};

async function startMicRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  mediaRecorder = new MediaRecorder(stream);
  mediaRecorder.ondataavailable = event => {
    if (event.data.size > 0) {
      audioChunks.push(event.data);
    }
  };

  mediaRecorder.onstop = () => {
    // 该onstop函数会比onRecognizedResult先执行，所以可以先拿到audioURL，再一同push
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    audioUrl.value = URL.createObjectURL(audioBlob);
  };

  audioChunks = [];
  mediaRecorder.start();
}

</script>

<style scoped>
.mainArea {
  display: flex;
}

.v-teacher {
  margin-top: 20vh;
  flex: 1;
}

.chatbox {
  margin-top: 3vh;
  margin-left: -2.7vw;
  z-index: 99;
  /* 让聊天框在视频之上呈现 */
}

.microphone {
  width: 32%;
}

.exit-btn {
  position: fixed;
  margin-top: 20px;
  margin-left: 50px;
  padding: 8px 0px 8px 4px;
  width: 100px;
  background-color: transparent;
  font-size: 17px;
  color: rgba(0, 0, 0, 0.784);
  text-align: center;
  line-height: 1.5;
  /* 控制文本垂直居中的行高 */
  letter-spacing: 5px;
  cursor: pointer;
  /* 鼠标指针样式 */
  border: 2px solid;
  border-radius: 50px;
  box-shadow: 1px 5px 9px rgba(0, 0, 0, 0.2);
  border-color: rgb(117, 82, 207);
  text-decoration: none;
  /* 去除下划线 */
  transition: background-color 0.3s ease;
  /* 过渡效果 */
  user-select: none;
}

.exit-btn:hover {
  color: rgb(117, 82, 207);
}


/* 音频录制时的声波动态效果 */
.item {
  position: absolute;
  width: 8px;
  border-radius: 6px;
  background-color: rgb(117, 82, 207);
}

.audio-wave {
  padding: 8px 30px 10px 60px;
}

.audio-wave .one {
  height: 18px;
  transform: translateX(-60px);
  animation: radius-animation .3s ease;
}

.audio-wave .two {
  height: 53px;
  transform: translateX(-40px);
  animation: radius-animation .6s ease;
}

.audio-wave .three {
  height: 36px;
  transform: translateX(-20px);
  animation: radius-animation .57s ease;
}

.audio-wave .four {
  height: 70px;
  transform: translateX(0);
  animation: radius-animation .52s ease;
}

.audio-wave .five {
  height: 30px;
  transform: translateX(20px);
  animation: radius-animation .4s ease;
}

.audio-wave .six {
  height: 40px;
  transform: translateX(40px);
  animation: radius-animation .3s ease;
}

.audio-wave .seven {
  height: 50px;
  transform: translateX(60px);
  animation: radius-animation .7s ease;
}

@keyframes radius-animation {
  100% {
    height: 10px;
    border-radius: 50%;
    filter: contrast(2);
  }
}

.audio-wave .item {
  animation-iteration-count: infinite;
  -webkit-animation-iteration-count: infinite;
  animation-direction: alternate;
  -webkit-animation-direction: alternate;
}

.micro-recording-area {
  display: flex;
  align-items: center;
  /* 垂直居中对齐 */
  justify-content: space-between;
  width: 16vw;
  /* 三块水平间距相等 */
  z-index: 2;
  /* 让麦克风在视频之上呈现 */
  margin-bottom: -40px;
  margin-left: 1.2vw;
}

.countdown {
  padding-top: 20px;
  padding-left: 60px;
  color: rgb(117, 82, 207);
  font-size: 18px;
  /* 设置为粗体 */
  font-weight: bold;
}

.left-area {
  display: flex;
  flex-direction: column;
  /* 列布局，垂直方向排列子元素 */
}
</style>
