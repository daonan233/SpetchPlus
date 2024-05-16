<template>
	<div class="main-container">
	  <header class="nav">
	    <nav>
	      <div class="logo">
			  <router-link to="/home">
	        <img src="@/assets/logo.png" alt="Logo"/>
			</router-link>
	      </div>
	      <div class="nav-links">
	        
	        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
	        <div class="right-links">
	          <router-link to="/login">
	            <button class="login-button">登录</button>
	          </router-link>
	        </div>
	      </div>
	    </nav>
	  </header>
	  </div>
</template>

<script>
</script>

<style scoped>
	.main-container {
	  font-family: Arial, sans-serif;
	  margin: 0 auto;
	  max-width: 100%;
	  background-color:#eaeaea;
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
	  width: 25%;
	  height: auto;
	  border-radius: 10px;
	   user-select: none;
	}
	
	.nav-links {
	  display: flex;
	  align-items: center;
	  justify-content: flex-start;
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
</style>