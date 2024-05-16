<script setup>
import { ref, onBeforeMount } from 'vue';
import { getMyInfoAPI } from '@/apis/selfpage.js';
import NaviBar from "@/components/NaviBar.vue";
// npm install ant-design-vue

const userInfo = ref({
  userId: 6,
  username: 'MyGO!!!!!',
  nickname: 'AveMujica',
  avatar: 'https://pic.imgdb.cn/item/64f9458d661c6c8e54375e9d.png',
  email: 'daonan233@gmail.com',
  is_admin: true,
  level: 0,
  back:'https://pic.imgdb.cn/item/64eee3c0661c6c8e54a4ed42.png',
});

const history = ref({
	total:0,
	record:
	[
		{
			id:"",
			timestamp:"2023-08-31 03:39:39",
		    sentences:19,
			totalWords:85,
			wrongWords:1,
			level:"A",
		},{
			id:"",
			timestamp:"2023-12-30 03:09:21",
		    sentences:10,
			totalWords:43,
			wrongWords:8,
			level:"C",
		},
		{
			id:"",
			timestamp:"2024-01-19 12:36:37",
		    sentences:11,
			totalWords:46,
			wrongWords:3,
			level:"B",
		},
	]
});

onBeforeMount(async () => {
  try {
    const userId = 6; // 替换为实际的用户 ID
    const res = await getMyInfoAPI(userId);
    if (res.code === 1000) {
      const result = res.data;
      userInfo.value.userId = result.userid;
      userInfo.value.username = result.username;
      userInfo.value.nickname = result.nickname;
      userInfo.value.avatar = result.avatar;
      userInfo.value.email = result.email;
      userInfo.value.is_admin = result.is_admin;
      userInfo.value.level = result.level;
    } else {
      console.log('请求成功了，但是有错');
    }
  } catch (error) {
    console.log('请求失败', error);
  }
});
</script>



<template>
	<NaviBar></NaviBar>
	    <div class = "InfoContainer"> 
		<img :src ="userInfo.avatar" class = "avatar"/>
		<div class="name">
			<div class = "nickname">{{userInfo.nickname}}</div>
			<div class = "username">{{userInfo.username}}</div>
		</div>
		<div class = "identification">
		<div class = "userID">ID:{{userInfo.userId}}</div>
		 <div v-if="userInfo.is_admin" class="admin-container" >管理员</div>
		 </div>
		<div class = "InfoContainer">
			<div class="list-container">
			    <div class="list-item">总学习:3</div>
			    <div class="list-item">总对话:124</div>
			    <div class="list-item">总单词:66</div>
				<div class="list-item">有误单词:81</div>
				<div class="list-item">学习时长:191</div>
			  </div>
			  </div>
	    <div class="purple-box"></div>
    </div>
	<div>
	<div class="leftBox" style="float: left;">
	<div class = "timePicker">
		
		<el-date-picker
		        v-model="value1"
		        type="date"
		        placeholder="选择查看历史时间"
		        :size="size"
		      />
	</div>
	<div class = left-block></div>
	</div>
	<div class ="rightBox" style="float: left;">
		<el-table :data="history.record" @row-click="handleRowClick" style="width: 100%">
		    <el-table-column prop="timestamp" label="Timestamp"></el-table-column>
		    <el-table-column prop="sentences" label="Sentences"></el-table-column>
		    <el-table-column prop="totalWords" label="Total Words"></el-table-column>
		    <el-table-column prop="wrongWords" label="Wrong Words"></el-table-column>
		    <el-table-column prop="level" label="Level"></el-table-column>
		   <!-- <el-table-column label="Action">
		      <template v-slot="{ row }">
		        <el-button @click="handleRowClick(row)" type="text" icon="el-icon-arrow-right"></el-button>
		      </template>
		    </el-table-column> -->
		  </el-table>
	</div>
	</div>
</template>

<style>
html,body{
		      margin:0;
		      padding:0;
			 
}
/*个人信息部分*/
.InfoContainer{
	position: relative;

}
.purple-box {
  width: 100%;
  height: 180px;
  background-color: #7B50D6;
  border-bottom-left-radius: 50px;
  border-bottom-right-radius: 50px;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.5);
}
.avatar{
	position: absolute;
	border-radius: 50%;
	width:6.6%;
	margin-top: 4vh;
	margin-left: 10vw;
}
.name{
	position: absolute;
	display: flex;
	justify-content: space-between;
	margin-left: 20vw;
	margin-top: 5.5vh;
}
.nickname{
	color:white;
	font-size: 25px;
	letter-spacing: 5px;
	font-family: Tahoma,"Microsoft Yahei";
}

.username{
	color:white;
	font-size: 20px;
	letter-spacing: 3px;
	font-family: Tahoma,"Microsoft Yahei";
	opacity: 70%;
	margin-top: 0.5vh;
	margin-left: 3vw;
}
.identification{
	position: absolute;
	display: flex;
	justify-content: space-between;
	margin-top: 12vh;
	margin-left: 20vw;
}
.userID{
	color:white;
	font-size: 15px;
	letter-spacing: 3px;
	font-family: Tahoma,"Microsoft Yahei";
}
/*管理员*/
.admin-container {
 color: white;
 border-radius: 5px;
 font-family: Tahoma,"Microsoft Yahei";
 margin-left: 5vw;
 margin-top: -0.5vh;
 padding: 1px;
 border: 2px solid #7B50D6; 
 animation: borderGradient 8s infinite; 
}

/* 定义渐变动画的关键帧 */
@keyframes borderGradient {
  0% {
    border-color: #39C5BB; /* 初始边框颜色1 */
  }
  25% {
    border-color: #3ac592; /* 初始边框颜色2 */
  }
  50% {
    border-color: #dddd51; /* 初始边框颜色3 */
  }
  75% {
    border-color: #3ac592; /* 初始边框颜色4 */
  }
  100% {
    border-color: #39C5BB; /* 最终边框颜色 */
  }
}

.list-container {
  position:absolute;	
  display: flex;
  justify-content: space-between;
  margin-top: 16vh;
  margin-left: 14vw;
}

.list-item {
  color: white;
  padding: 10px;
  width: 250px; 
  text-align: center;
  font-family: Tahoma,"Microsoft Yahei";
}

.timePicker{
	position: absolute;
	margin-top: 10vh;
	margin-left:5vw;
}
.leftBox{
	position: relative;
}
.left-block{
	background-color: #eaeaea;
	height:60vh;
	width:20vw;
	margin-left:1.5vw;
	margin-top: 5vh;
	border-radius:20px;
}
.rightBox{
	width:75vw;
	margin-left: 3vw;
	margin-top:5vh
}
</style>
