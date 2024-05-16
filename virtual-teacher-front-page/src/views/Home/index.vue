<template>
  <div class="main-container">
    <header class="nav">
      <nav>
        <div class="logo">
          <img src="/src/assets/logo.png" alt="Logo"/>
        </div>
        <div class="nav-links">
          <div class="left-links">
            <router-link to="/home" class="nav-link">首页&nbsp;</router-link>
            <router-link to="/user" class="nav-link">&nbsp;学习历史</router-link>
          </div>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
          <div class="right-links">
            <router-link to="/login">
              <button class="login-button">登录</button>
            </router-link>
          </div>
        </div>
      </nav>
    </header>
    <div class="image-container">
		<div class="start-button">
		  <p class="start-text">虚拟教师帮你如何提升口语: 
                   <br/>&nbsp;&nbsp;&nbsp;....身临其境 实时对话....</p>
		  <router-link to="/choose" class="start-link">Start to Study</router-link>
		</div>
      <img src="@/assets/homepage/teacher.png" alt="Teacher" class="centered-image"/>
    </div>
  </div>
  <div class="about-container">
     <div class="about-content">
       <h1 class="about-heading">ABOUT US</h1>
       <p class="about-text">BUILD UP AN ACCENT TEACHING COMMUNITY ON AI</p>
	   <p class="about-text">——————————</p>
     </div>
   </div>
   <div class = "detailimage">
	   <img src='/src/assets/homepage/home.jpg'/>
   </div>
</template>



<script>
	export default{
		data() {
		    return {
		      words: ['patient', 'happiness','Nero'], // 单词集
		      currentWords: ['', '','' ], // 当前显示的单词
		      currentIndex: 0, // 当前单词集索引
		    };
		  },
		  beforeRouteEnter(to, from, next) {
		      document.querySelector('body').setAttribute('style','margin:0;padding:0')
		      next()
		    },
		/* mounted() {
			    this.startWordAnimation(); // 在组件挂载后开始单词动画
			  }, */
		methods: {
			   /* startWordAnimation() {
			      setInterval(() => {
			        // 随机选择两个单词进行显示
			        const randomIndexes = this.getRandomIndexes(this.words.length);
			        this.currentWords = [this.words[randomIndexes[0]], this.words[randomIndexes[1]]];
			        // 淡入淡出效果
			        const bgElement = document.querySelector('.background-animation');
			        bgElement.style.opacity = '0';
			        setTimeout(() => {
			          bgElement.style.opacity = '1';
			        }, 1000); // 1秒后恢复不透明度
			      }, 3000); // 每3秒更新一次单词
			    },
			    getRandomIndexes(max) {
			      const indexes = [];
			      while (indexes.length < 3) {
			        const randomIndex = Math.floor(Math.random() * max);
			        if (!indexes.includes(randomIndex)) {
			          indexes.push(randomIndex);
			        }
			      }
			      return indexes;
			    }, */
			  },
	}
	
	

</script>

<style scoped>
html,body{
	      margin:0;
	      padding:0;
	   }
.main-container {
  font-family: Arial, sans-serif;
  margin: 0 auto;
  max-width: 100%;
  background-color:#eaeaea
}

nav {
  color: #555252;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}


.nav nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
   user-select: none;
}

.logo img {
  margin-left:5vw;	
  width: 30%;
  height: auto;
  border-radius: 10px;
   user-select: none;
}

.nav-links {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

/* 样式化导航链接 */
.nav-link {
  color: #8a5be2; /* 紫色 */
  text-decoration: none;
  transition: font-size 0.3s ease, color 0.3s ease;
}

.nav-link:hover {
  transition: color 0.3s ease;
  font-size: 1.2em; /* 放大字体 */
  color: #9932cc; /* 深紫色 */
}

.nav-link:hover {
  font-size: 1.2em; /* 放大字体 */
  transition: color 0.3s ease;
}

.left-links {
  display: flex;
  gap: 50px;
   user-select: none;
  margin-right: 10vw;
}

.left-links a {
  color: #494949;
  font-family: "Calibri";
  text-decoration: none;
  transition: color 0.3s ease;

}

.left-links a:hover {
  color: #7B50D6;
}


.right-links {
  display: flex;
  gap: 30px;
  justify-content: flex-start; /* 向左对齐 */
   user-select: none;
}


/* 样式化登录按钮 */
.login-button {
  background-color: #7B50D6;
  color: white; /* 文本颜色 */
  border: none; /* 去除边框 */
  padding: 10px 20px; /* 内边距 */
  font-size: 18px;
  margin-right: 5vw;
  cursor: pointer; /* 鼠标指针样式 */
  font-family: "Calibri";
  border-radius: 20px;
  width: 150px;
  letter-spacing:5px;
  transition: background-color 0.3s ease; /* 过渡效果 */
   user-select: none;
}

.login-button:hover {
  background-color: #6441af; /* 鼠标悬停时的背景颜色 */
}

/* 居中图片 */
.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.centered-image {
  max-width: 36%; /* 调整图片大小 */
  height: auto;
  border-radius: 10px;
}

/* 样式化开始按钮 */
.start-button {
  display: flex;
  flex-direction: column; /* 纵向排列 */
  justify-content: flex-start; /* 靠左对齐 */
  align-items: flex-start; /* 靠左对齐 */
  margin-bottom: 100px;
  margin-left: 5%; /* 靠左 5% */
}

/*字体*/
.start-text {
  margin-bottom: 10px; /* 文本下方间距 */
  font-size: 24px; /* 文本大小 */
  background: linear-gradient(45deg, #ffc7cb, #bc5dff); /* 渐变背景色 */
  -webkit-background-clip: text; /* 背景色裁剪为文本区域 */
  background-clip: text;
  color: transparent; /* 文本颜色透明 */
  animation: gradientAnimation 3s linear infinite alternate; /* 动画效果 */
  user-select: none;
}

@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}

.start-link {
  margin-left: 100px;	
  background-color: #8a5be2; /* 背景颜色 */
  color: white; /* 文本颜色 */
  border: none; /* 去除边框 */
  padding: 10px 20px; /* 内边距 */
  font-size: 20px;
  cursor: pointer; /* 鼠标指针样式 */
  font-family: "Calibri";
  border-radius: 20px;
  text-decoration: none; /* 去除下划线 */
  transition: background-color 0.3s ease; /* 过渡效果 */
   user-select: none;
}

.start-link:hover {
  background-color: #9932cc; /* 鼠标悬停时的背景颜色 */
}

/*单词淡入淡出效果*/
.background-animation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: linear-gradient(45deg, #FFB6C1, #FF69B4);
  animation: gradientAnimation 3s linear infinite alternate;
}

@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}

/*中间空白区域的 ABOUT US*/

.about-container {
  margin-top: 5vh;
  margin-bottom: 5vh;
  width: 100%;
  height: 15%;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  
}

.about-content {
  
  text-align: center;
}

.about-heading {
  font-size: 48px;
  color: purple;
  margin-bottom: 10px;
   user-select: none;
}

.about-text {
  font-size: 18px;
  color: purple;
   user-select: none;
}
.detailimage img{
	width:99vw;
	height:auto;
}


</style>
	