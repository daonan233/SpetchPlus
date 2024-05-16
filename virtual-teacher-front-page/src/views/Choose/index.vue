<template>
  <naviBar style="background-color: white;"></naviBar>
  <!--进度条-->
  <el-progress class="percentage" :percentage="progressPercentage()" :color="perColor"></el-progress>

  <!--第一页内容，选择大方向-->
  <div v-if="order === 1">
    <div class="home-page">
      <div class="block dialogue" @click="chooseBack(1)" :style="{ 'background-color': chooseFirst === 1 ? '#4e338b' : '#7B50D6' }">
        <el-icon class="icon" ><ChatLineSquare/></el-icon>
        <p class="text">情景对话</p>
        <el-icon class="iconSmall" ><DArrowRight /></el-icon>
      </div>

      <div class="block question" @click="chooseBack(2)" :style="{ 'background-color': chooseFirst === 2 ? '#4e338b' : '#7B50D6' }">
        <el-icon class="icon" > <UserFilled /></el-icon>
        <p class="text">情景问答</p>
        <el-icon class="iconSmall" ><DArrowRight /></el-icon>
      </div>

      <div class="block chat" @click="chooseBack(3)" :style="{ 'background-color': chooseFirst === 3 ? '#4e338b' : '#7B50D6' }">
        <el-icon class="icon"><Service /></el-icon>
        <p class="text">自由对话</p>
        <el-icon class="iconSmall" ><DArrowRight /></el-icon>
      </div>
    </div>
  </div>

  <!--第二页内容，选择细分的-->
  <div v-if="order === 2">
    <div v-if="chooseFirst === 2"  class ="around">
      <div class="blockQue">
        <el-icon class="icon" > <UserFilled /></el-icon>
        <p class="text">情景问答</p>
        <el-icon class="iconSmall" ><DArrowRight /></el-icon>
      </div>
      <!--下面是小图标-->
      <!--上半部分的图标-->
	  <div class = "upBlock">
      <div class="blockSmall" @click="changeScene(0)" :style="{ 'background-color': chooseScene ===0 ? '#4e338b' : '#7B50D6' }">
        <el-icon class="iconSmall2" > <Food /></el-icon>
        <p class="textSmall">餐厅场景</p>
      </div>
		  <div class="blockSmall" @click="changeScene(1)" :style="{ 'background-color': chooseScene ===1 ? '#4e338b' : '#7B50D6' }">
        <el-icon class="iconSmall2" > <Van/></el-icon>
        <p class="textSmall">机场场景</p>
      </div>
      <div class="blockSmall" @click="changeScene(2)" :style="{ 'background-color': chooseScene ===2 ? '#4e338b' : '#7B50D6' }">
        <el-icon class="iconSmall2" > <FirstAidKit /></el-icon>
        <p class="textSmall">诊所场景</p>
      </div>
      </div>
	  <div class = "downBlock">
		  <div class="blockSmall2" @click="changeScene(3)" :style="{ 'background-color': chooseScene ===3 ? '#4e338b' : '#7B50D6' }">
		    <el-icon class="iconSmall2" > <GoodsFilled /></el-icon>
		    <p class="textSmall">宠物商店</p>
		  </div>
		  <div class="blockSmall2" @click="changeScene(4)" :style="{ 'background-color': chooseScene === 4? '#4e338b' : '#7B50D6' }">
		    <el-icon class="iconSmall2" > <ChatDotRound /></el-icon>
		    <p class="textSmall">家庭聚会</p>
		  </div>
		 
	  </div>
      <!--下半部分的小图标-->
    </div>
  </div>

  <!--下面是选择上一把与下一步的按钮-->
  <div class="navigation-buttons">
    <el-button @click="goToPreviousPage" :disabled="order === 1" color="#7B50D6" class = "bigButton" round>上 一 步</el-button>
    <el-button @click="goToNextPage"  color="#7B50D6" class = "bigButton" round>下 一 步</el-button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ChatLineSquare, DArrowRight, UserFilled, Service, ChatDotRound, Food, Van,GoodsFilled,FirstAidKit } from '@element-plus/icons-vue';
import { useScenesInfoStore } from '@/stores/scenesChat';

const router = useRouter();
const ScenesChat = useScenesInfoStore();

const order = ref(1);
const chooseFirst = ref(99);
const chooseSecond = ref(99);
const perColor = ref('#7B50D6');
const chooseScene = ref(-1);


const chooseBack = (num) => {
  chooseFirst.value = num;
};

const progressPercentage = () => {
  return order.value === 1 ? 50 : (order.value === 2 ? 100 : 0);
};

const goToPreviousPage = () => {
  if (order.value > 1) {
    order.value--;
  }
};

const goToNextPage = () => {
  if (order.value < 2) {
    order.value++;
  }
  if (chooseFirst.value===3) {
    router.push("/chat")
  }
  if (chooseFirst.value===2&&chooseScene.value !=-1) {
    router.push("/test")
  }
};

const changeScene = (sceneNumber) => {
  chooseScene.value = sceneNumber;
  ScenesChat.scenesIndex = chooseScene.value;
  console.log("choose:选择页面的", ScenesChat.scenesIndex);
 /* router.push({ path: "/test" }); */
};
</script>


<style scoped>
html,body{
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}
.home-page {
  display: flex;
  justify-content:space-evenly;
  margin-top: 55px;
}
.percentage{
	margin-top: 20px;
	margin-left: 15vw;;
	width:70vw;
}

.block {
  background-color:#7B50D6;	
  cursor: pointer;
  width:15vw;
  height:50vh;
  padding: 20px;
  text-align: center;
  border-radius: 20px;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.block:hover {
  background-color: #4e338b; /* 变色效果 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 阴影效果 */
}

.icon {
  font-size: 150px;
  margin-top:60px;
  margin-bottom: 20px;
  color:white;
}
.iconSmall{
	font-size: 50px;
	margin-top:10px;
	color:white;
}

.text {
  color:white;
  font-family: "Microsoft YaHei";
  letter-spacing: 2px;
  margin-top: 10px;
  font-size: 30px;
}

.navigation-buttons {
  margin-top: 50px;
  display: flex;
  justify-content: space-around;
}
.blockQue{
	background-color:#7B50D6;
	cursor: pointer;
	width:15vw;
	height:50vh;
	padding: 20px;
	text-align: center;
	border-radius: 20px;
	transition: background-color 0.3s, box-shadow 0.3s;
}
.around{
	margin-left: 20vw;
	display: flex;
	margin-top:55px;
	background-color: #CED2ED;
	border-radius: 20px;
	width:60vw;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
}
.blockSmall{
	background-color:#7B50D6;
	cursor: pointer;
	width:7vw;
	height:14vh;
	margin-left: 20vw;
	padding: 20px;
	margin: 3vw;
	text-align: center;
	border-radius: 20px;
	transition: background-color 0.3s, box-shadow 0.3s;
}
.iconSmall2{
	font-size: 70px;
	margin-top:10px;
	color:white;
}

.textSmall{
	color:white;
	font-family: "Microsoft YaHei";
	letter-spacing: 2px;
	margin-top: 2px;
	font-size: 20px;
}

.bigButton{
	margin-top: 2vh;
	width:12vw;
	height:6vh;
	font-size: 25px;
}
.upBlock{
	position: absolute;
	display:flex;
	margin-left: 16vw;
}
.blockSmall2{
	background-color:#7B50D6;
	cursor: pointer;
	width:7vw;
	height:14vh;
	padding: 20px;
	margin: 3vw;
	margin-top: 10vh;
	text-align: center;
	border-radius: 20px;
	transition: background-color 0.3s, box-shadow 0.3s;
}
.downBlock{

	display:flex;
	position:absolute;
	margin-top: 20vh;
	margin-left:16vw;
}


</style>
