<template>
  <div class="box">
    <video class="video-default" ref="videoPlayer" :style="{ zIndex: video1ZIndex }" webkit-playsinline="true" loop
      :controls="false" muted autoplay>
      <source :src="defaultVideo" type="video/mp4" />
      您的浏览器不支持视频标签。
    </video>
    <video v-show="isVideo2Visible" class="video-default" ref="videoPlayer2" :style="{ zIndex: video2ZIndex }"
      @ended="onVideoEnded" :controls="false">
      <source :src="newVideoSrc" type="video/mp4" />
      您的浏览器不支持视频标签。
    </video>
	<div class="tips-show-area">
	    <TipsPopover />
	</div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, defineProps, watchEffect, watch, reactive, onBeforeMount, computed } from 'vue';
// import { useStudyInfoStore } from '@/stores/StudyInfo';
import { useScenesInfoStore } from '@/stores/scenesChat';
import TipsPopover from '@/views/ScenesChat/Components/TipsPopover.vue';

// const StudyInfoStore = useStudyInfoStore();
const ScenesInfoStore = useScenesInfoStore();

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


// 引入JSON
const scenes = {
  "scenes":[
  	//餐厅
      {
        "teacher": [
          "Good evening! Welcome to [Restaurant Name]. How many?",
          "Right this way. Please have a seat by the window for a lovely evening view. Here are the menus. Can I start you off with something to drink?",
          "Certainly. Would you prefer still or sparkling water?",
          "Coming right up. Our house coffee is a blend of Colombian and Ethiopian beans. Would you like it black or with milk?",
          "Excellent choice. Are you ready to order, or do you need a few minutes to look over the menu?",
          "Are you ready to order now, or can I answer any questions about the menu?",
          "Excellent choices! The steak comes with a side of roasted vegetables and potatoes. Would you like to add a sauce, perhaps peppercorn or mushroom?",
          "And for the vegetarian pasta, would you prefer it with tomato sauce or olive oil and garlic?",
          "Great. Would you like any starters or a salad before your main course?",
              /* "You're welcome. Your meals will be out shortly. In the meantime, enjoy the ambiance. If you need anything else, just let me know." */
        ],
        "student": [
          "Hi, table for two, please.",
          "Yes, I'll have a glass of water and a cup of the house coffee, please.",
          "Still water would be great, thank you.",
          "With milk, please.",
          "We'll need a couple of minutes, thanks.",
          "Yes, I think we're ready. I'll have the steak medium rare, and my friend will have the vegetarian pasta.",
          "Oh, the peppercorn sauce sounds lovely. Yes, please.",
          "Olive oil and garlic, please.",
          "No, that'll be all for now, thank you."
        ]
      },
      //机场
      {
        "teacher": [
  		"Welcome to the Xiamen AirPort，what can I do for you?",  
          "Sure, are you flying with Airline XYZ?",
          "You'll need to go to Terminal 1 for check-in. It's right down this hallway to your left. Look for the Airline XYZ check-in counters.",
          "It's best to be at your gate at least 30 minutes before your flight's departure time. However, considering security checks and potential lines, I'd recommend being there 45 to 60 minutes in advance.",
          "The wait times can vary, but as of now, it's approximately 15-20 minutes. I'd suggest allowing a bit of extra time, just in case.",
          "Yes, there is a fast track lane for business class passengers and those with certain types of frequent flyer status. If you qualify, you can use that lane.",
          "Yes, Airline XYZ has a lounge in Terminal 1 near Gate 5. If you have access through your ticket class or frequent flyer status, you can enjoy the facilities there.",
          "You're welcome! If you have any more questions or need further assistance, feel free to ask. Have a safe and pleasant flight to New York.",
          /* "You too, take care!" */
        ],
        "student": [
          "Hi, I'm flying to New York today. Could you tell me where to check in?",
          "Yes, that's right.",
          "Thank you. Also, how early do I need to be at the gate?",
          "Got it, I'll keep that in mind. And what about security? Is the wait time long today?",
          "That's helpful, thank you. Is there a fast track option for security?",
          "I see. I might not qualify for that, but it's good to know. Lastly, are there any lounges I can use while I wait?",
          "That sounds lovely. I'll check if I have access. Thanks for all your help!",
           "Thank you, I appreciate it. Have a great day!"
        ]
      },
       //诊所
      {
        "teacher": [
          "Hi, I have an appointment with Dr. Anderson at 10:30.",
          "Sure, here are my ID and insurance card. How long do you think the wait will be?",
          "Great, thank you. By the way, do I need to specify my pharmacy information on this form?",
          "Understood, I'll add that in. Also, is there Wi-Fi available here while I wait?",
          "Perfect, thanks. And are masks required in the waiting area?",
          "No problem, I have mine here. Lastly, if I have any questions about the treatment after seeing the doctor, whom should I contact?",
          "That's reassuring to know. I appreciate all the information.",
          "Will do, thank you so much for your assistance."
        ],
        "student": [
          "Let me check that for you. Yes, I see your appointment here. Could you please fill out this patient form and provide your ID and insurance card?",
          "Dr. Anderson is usually on schedule, so it shouldn't be more than a 15-minute wait once you've completed your paperwork. Please take a seat in the waiting area, and we'll call you shortly.",
          "Yes, please include your preferred pharmacy information. It's important for us to know where to send any prescriptions Dr. Anderson may provide.",
          "Absolutely, we do have Wi-Fi. The network name and password are posted on the wall in the waiting area for your convenience.",
          "Yes, we're still following health guidelines, so we ask that all patients wear masks while in the waiting area and during their consultation, unless instructed otherwise by the doctor.",
          "After your appointment, if you have any questions or need further clarification, you can either call our office or send a message through our patient portal. Dr. Anderson or one of our medical staff will get back to you.",
          "Of course, we're here to help. If there's anything else you need while you wait, please don't hesitate to ask.",
          "You're welcome! We hope your visit goes smoothly. Please make yourself comfortable in the waiting area."
        ]
      },
  
       //宠物商店
      {
        "teacher": [
          "Hi, I'm looking for a new bed for my medium-sized dog. Can you recommend something?",
          "That sounds perfect. Do you have different designs?",
          "Thank you, I'll take a look.",
          "Are these beds easy to clean? My dog tends to get dirty sometimes.",
          "That's great to hear. Is there a specific size you recommend for a medium-sized dog?",
          "My dog likes to chew on things. Are these beds durable?",
          "Thank you for the advice. Are there any warranties or guarantees on these beds?",
          "That's reassuring. Can you tell me more about the orthopedic benefits of these beds?",
          "That's exactly what I need for my aging dog. Do you offer any discounts or promotions on these beds?",
          "Excellent, I'll definitely go for that. Can you help me choose a color or pattern that would match my home decor?",
          "That would be fantastic. Thank you for your assistance. I appreciate it."
        ],
        "student": [
          "Of course, we have a variety of dog beds. For a medium-sized dog, I'd recommend our orthopedic memory foam beds. They provide great support and are very comfortable.",
          "Yes, we have several colors and patterns. They're right over here in aisle 3.",
          "Absolutely! These beds come with removable, machine-washable covers, making them easy to clean and maintain. You can keep your dog's bed fresh and clean.",
          "For a medium-sized dog, a bed in the range of 30 to 36 inches in length should be suitable. It gives your dog enough room to stretch out comfortably.",
          "These orthopedic memory foam beds are designed to be durable and resistant to normal wear and tear. However, if your dog is an aggressive chewer, it's always a good idea to provide them with some appropriate chew toys to prevent any damage to the bed.",
          "Yes, our orthopedic memory foam beds come with a one-year warranty against manufacturing defects. If you encounter any issues, please keep your receipt, and we'll be happy to assist you with a replacement or refund.",
          "Certainly! Orthopedic memory foam beds are designed to provide superior support to your dog's joints and muscles. They help relieve pressure points, making them ideal for older dogs or those with arthritis or joint issues.",
          "Currently, we have a promotion running where you can get 10% off the regular price of these orthopedic memory foam beds. It's a great deal to take advantage of.",
          "Of course, we have a variety of colors and patterns available. Let me show you some options, and you can pick the one that best suits your home.",
          "You're very welcome! If you have any more questions or need further assistance, please don't hesitate to ask. We're here to help."
        ]
      },
       //家庭聚餐
      {
        "teacher": [
          "It's so nice to have everyone together for dinner. How have you been?",
          "Pretty much the same here. Oh, have you tried the lasagna yet? I tried a new recipe this time.",
          "Yes, I did! I'll send you the recipe if you like.",
          "You're welcome! It's a family favorite, and I think you'll enjoy making it too.",
          "Not yet, but I've heard good things about it. We should plan a family outing to try it together.",
          "Definitely! It's important to have these family gatherings and try new things together.",
          "Absolutely. By the way, how are the kids doing in school?",
          "That's great to hear. It's important to support them in their education and interests.",
          "Time does fly, doesn't it? Let's make the most of our time together tonight and enjoy this delicious lasagna."
        ],
        "student": [
          "I've been doing well, thanks. Just busy with work and the kids' activities. How about you?",
          "Not yet, but it smells delicious! I'll definitely have some. Did you make it from scratch?",
          "That would be great, thanks! I'd love to try making it at home.",
          "Speaking of recipes, have you tried that new restaurant that opened downtown? I heard they have amazing Italian food.",
          "That's a fantastic idea! It would be a nice change from our usual dinner spots.",
          "I couldn't agree more. It's all about making memories and enjoying each other's company.",
          "They're doing well, thanks for asking. They're keeping up with their studies and have been involved in some extracurricular activities.",
          "I completely agree. They're growing up so fast, and I cherish these family moments together.",
          "Absolutely, let's dig in and savor this wonderful meal together."
        ]
  	  }
  	]
}

//引入全局choose和json
const chooseNum = ScenesInfoStore.scenesIndex;


const playVideo = (videoSrc) => {
  videoPlayer.value.src = videoSrc;
  videoPlayer.value.load();
  videoPlayer.value.play();
};

const addNewVideo = () => {
  console.log("new:", newVideoSrc.value)
  videoPlayer2.value.src = newVideoSrc.value;
  console.log("v2:", videoPlayer2.value.src);
  console.log("new:", newVideoSrc.value)
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

/* const fetchAIAnswer = async (iText) => {
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
}; */
//监听学生是否发了新的（学生气泡+1)
const studentChange = computed(() => ScenesInfoStore.studentBubble);
watch(studentChange, async (newVal, oldVal) => {
  console.log("posttext旧的!", postText.value)//旧的句子
  ScenesInfoStore.teacherBubble += 1; //老师变化了，计数+1
  console.log("新的teacherBuuble", ScenesInfoStore.teacherBubble)
  const currentScene = scenes.scenes[chooseNum].teacher[ScenesInfoStore.teacherBubble]
  console.log("新的teacher说的", currentScene)
  postText.value = currentScene;//旧的句子更新成新的

  // 黄黄改
  ScenesInfoStore.teacherContent.push(currentScene);
  // StudyInfoStore.teacherChatContent.push(currentScene);
  ScenesInfoStore.teacher_popovers.push({});
  await synthesizeAvatar();  // 把postText拿去生成视频
  return postText.value;
})

const fetchData = async () => {
  console.log("选择的场景index：", chooseNum)
  console.log("scenes的第一句话：", scenes.scenes[chooseNum].teacher[0])
  postText.value = scenes.scenes[chooseNum].teacher[0];
  console.log("教师气泡", ScenesInfoStore.teacherBubble)
  
  // StudyInfoStore.teacherChatContent.push(postText.value);
  ScenesInfoStore.teacherContent.push(postText.value);
  ScenesInfoStore.teacher_popovers.push({});
  await synthesizeAvatar();
  console.log("哈哈哈哈哈");
};

onBeforeMount(() => {
  fetchData();
  console.log("开始了！")
});



const synthesizeAvatar = async () => {
  try {
    console.log("拿到视频了！")
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

/* watchEffect(() => {
  
  fetchAIAnswer(latestUserChat).then(res=>{
    try{
      console.log("Ai回答了：",res);
      const vReply = res.replace("AI的回复",'');
      
    }catch(e){
      console.log(e);
    }
  });
  
  
}); */
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
  width: 500px;
  /* Adjust the width as needed */
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
.tips-show-area {
    position: absolute;
	margin-top: 10vh;
    margin-left:41vw;
    /* 如果需要，可以调整左右位置 */
    width: 22vw;
    /* 让 tips-show-area 宽度与 .all-pops-area 宽度相同 */
	z-index:9999;
}
</style>
