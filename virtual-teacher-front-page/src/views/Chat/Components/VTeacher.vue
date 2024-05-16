<template>
  <div class="box">
    <video class="video-default"
      ref="videoPlayer"
      :style="{ zIndex: video1ZIndex }"
      webkit-playsinline="true"
      loop
      :controls="false"
      muted
      autoplay>
      <source :src="defaultVideo" type="video/mp4" />
      您的浏览器不支持视频标签。
    </video>
    <video v-show="isVideo2Visible"
      class="video-default"
      ref="videoPlayer2"
      :style="{ zIndex: video2ZIndex }"
      @ended="onVideoEnded"
      :controls="false">
      <source :src="newVideoSrc" 
	  type="video/mp4" />
      您的浏览器不支持视频标签。
    </video>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, defineProps, watchEffect } from 'vue';
import { useStudyInfoStore } from '@/stores/StudyInfo';

const StudyInfoStore = useStudyInfoStore();

const videoPlayer2 = ref();
const videoPlayer = ref();
const inputText = ref('');
const defaultVideo = '/src/assets/waiting.mp4';
const postText = ref('');
const newVideoSrc = ref('');
const isLoadingNewVideo = ref(false);
const zIndex = ref(10);
const video1ZIndex = ref(2);
const video2ZIndex = ref(1);
const isVideo2Visible = ref(true);


const playVideo = (videoSrc) => {
  videoPlayer.value.src = videoSrc;
  videoPlayer.value.load();
  videoPlayer.value.play();
};

const addNewVideo = () => {
  console.log("new:",newVideoSrc.value)
  videoPlayer2.value.src = newVideoSrc.value;
  console.log("v2:",videoPlayer2.value.src);
  console.log("new:",newVideoSrc.value)
  videoPlayer2.value.preload = 'auto';

  videoPlayer2.value.oncanplaythrough = () => {
  videoPlayer2.value.play();
  videoPlayer.value.muted = true;
    video2ZIndex.value = zIndex.value + 1;
    isVideo2Visible.value = true;
  };
};

const onVideoEnded = () => {
  newVideoSrc.value = '';
  isVideo2Visible.value = false;
  console.log('视频播放结束');
  console.log(newVideoSrc.value);
};

const fetchAIAnswer = async (iText) => {
  try {
    const response = await axios.post(
      'https://ibyteai.com/api/v2/chat/conversation', {
        message: iText,
        conversation_id: 'b76c1f4f-93bd-4e90-8cff-400efb07fb3e',
        knowledge_candidates: 10,
        preset: 'AI_BOT',
      },
    );
    postText.value = response.data.replace('AI的回复:', '');
    await synthesizeAvatar();
    return postText.value;
  } catch (error) {
    console.log('获取AI回复错误:', error);
    return null;
  }
};

const synthesizeAvatar = async () => {
  try {
    const response = await axios.post(
      "http://api.ibyteai.com:16082/avatar/v1/synthesis", {
        requests: [
          {
            config: {
              azureBlob: {
                baseFilename: "0001",
              },
            },
          },
          {
            payload: {
              ssml: postText.value,
            },
          },
        ],
      }
    );
    newVideoSrc.value = response.data.blobUrl;
    addNewVideo();
  } catch (error) {
    console.error("Error synthesizing avatar:", error);
  }
};

watchEffect(() => {
  const latestUserChat = StudyInfoStore.userChatContent.slice(-1)[0];
  fetchAIAnswer(latestUserChat).then(res=>{
	  try{
		  console.log("Ai回答了：",res);
		  const vReply = res.replace("AI的回复",'');
		  StudyInfoStore.teacherChatContent.push(vReply);
		  StudyInfoStore.teacher_popovers.push({});
	  }catch(e){
		  console.log(e);
	  }
  });
  
  
});
</script>
<style>
.box {
  /* width: 65vw; */
  width: 70vw;
  height: auto;
  position: relative;
}

.video-default {
  /* width: 65vw; */
  width: 70vw;
  height: auto;
  position: absolute;
  left: 0;
  top: 0;
}

/* 输入部分样式未修改，保留原样式 */
.input-container {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 500px; /* Adjust the width as needed */
  margin-right: 20px;
}

.input-card {
  width: 100%;
  padding: 20px;
}

.avatar-video {
  width: 64.8vw;
  height: auto;
  margin-top: 13vh;
}
</style>
