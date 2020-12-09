<template>
  <div class="diy-loader center" v-show="show">
    <!-- 圆圈加载 -->
    <!-- <div class="diy-loader-circle"></div> -->
    <!-- 齿轮加载 -->
    <div class="center-box">
      <div class="loader_overlay"></div>
      <div class="loader_cogs">
        <div class="loader_cogs__top">
          <div class="top_part"></div>
          <div class="top_part"></div>
          <div class="top_part"></div>
          <div class="top_hole"></div>
        </div>
        <div class="loader_cogs__left">
          <div class="left_part"></div>
          <div class="left_part"></div>
          <div class="left_part"></div>
          <div class="left_hole"></div>
        </div>
        <div class="loader_cogs__bottom">
          <div class="bottom_part"></div>
          <div class="bottom_part"></div>
          <div class="bottom_part"></div>
          <div class="bottom_hole"></div>
        </div>
      </div>
      <p class="loading-text">
        页面加载中<span class="dot">...</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      footerShow: true,
      data: [
        '不管多么痛苦，都不要逃往轻松的一边', 
        '如果生活还没能改变你，那你已经失败了', 
        '每天看着励志的语录却过着颓废的人生'
      ],
    randomIndex: 0,
    i: 0,
    timer: 0,
    str: ""
    };
  },
  mounted() {
    // 初始化判断
    /* if (window.location.pathname == "/about/about.html") {
      this.footerShow = false;
    }
    this.$nextTick(() => {
      this.refreshFooter();
    }); */
    // 路由切换前
    this.$router.beforeEach((to, from, next) => {
      // about页面不显示footer
      if (to.path == "/about.html" || to.path == "/map.html" || to.path == "/issues.html" 
          || to.path == "/study.html" || to.path == "/project.html") {
        this.footerShow = false;
      } else {
        this.footerShow = true;
      }
      // 加载遮罩
      if (to.path !== from.path) {
        this.show = true;
        next();
      } else {
        next();
      }
    });
    // 路由切换后
    this.$router.afterEach((to, from) => {
      this.$nextTick(() => {
        // about页面不显示footer
        this.refreshFooter();
        // 关闭遮罩
        this.show = false;
        // 一言刷新
        this.start();
      });
    });
  },
  methods: {
    refreshFooter() {
      if (document.getElementsByTagName("footer").length > 0) {
        if (this.footerShow) {
          document.getElementsByTagName("footer")[0].style.display = "block";
        } else {
          document.getElementsByTagName("footer")[0].style.display = "none";
        }
      }
    },
    randomText() {
      if (!document.getElementById('hitokoto')) {
        return;
      }
      this.i = 0;
      this.str = this.data[randomIndex];
      let index = Math.floor(this.data.length * Math.random());
      while (this.randomIndex === this.index) {
        this.index = Math.floor(this.data.length * Math.random())
      }
      this.randomIndex = this.index;
    },
    typing() {
      if (!document.getElementById('hitokoto')) {
        return;
      }
      if (this.i <= this.str.length) {
        if (this.i === this.str.length) {
          document.getElementById('title').innerHTML = this.str.slice(0, this.i++);
        } else {
          document.getElementById('title').innerHTML = this.str.slice(0, this.i++) + '_';
        }
        this.timer = setTimeout(() => {
          this.typing()
        }, 150)
      } else {
        clearTimeout(this.timer);
        setTimeout(() => {
          this.clearTitle()
        }, 1500)
      }
    },
    clearTitle() {
      if (!document.getElementById('hitokoto')) {
        return;
      }
      if (this.i >= 0) {
        document.getElementById('title').innerHTML = this.str.slice(0, this.i--) + '_';
        this.timer = setTimeout(() => {
          this.clearTitle()
        }, 50)
      } else {
        clearTimeout(this.timer);
        this.start();
      }
    },
    start() {
      if (!document.getElementById('hitokoto')) {
        return;
      }
      try {
        var ajax = new XMLHttpRequest();
        if (window.XMLHttpRequest) {
          ajax = new XMLHttpRequest()
        } else {
          ajax = new ActiveXObject('Microsoft.XMLHTTP')
        }
        ajax.open('get', "https://v1.hitokoto.cn", true);
        ajax.send();
        ajax.onreadystatechange = () => {
          if (ajax.readyState == 4 && ajax.status == 200) {
            var text = JSON.parse(ajax.responseText);
            this.i = 0;
            this.str = text.hitokoto;
            window.document.getElementById('author').innerHTML = text.from;
            this.typing();
          }
        }
      } catch(err) {
        document.getElementById('author').innerHTML = '随心';
        this.randomIndex = Math.floor(this.data.length * Math.random());
        this.randomText();
        this.typing()
      }
    }
  }
};
</script>

<style scoped>
.center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.diy-loader {
  background: rgba(255, 255, 255, 0.5);
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 600;
}

/* 圆圈加载 */
.diy-loader-circle {
  z-index: 900;
  border: 3px solid#f6ffed;
  border-top: 3px solid #8a2be2;
  border-radius: 50%;
  transform: rotate(0deg);
  width: 3.5em;
  height: 3.5em;
  animation: circle-rotate 1s linear infinite;
}

@keyframes circle-rotate {
  to {
    transform: rotate(360deg);
  }
}

/* 齿轮加载 */
.center-box {
  left: 0;
  right: 0;
  top: 0;
  bottom: 150px;
  height: 250px;
  width: 100%;
  max-width: 600px;
  position: absolute;
  margin: auto;
  z-index: 600;
  text-align: left;
  box-sizing: border-box;
  padding: 10px;
}

.loader_overlay {
  width: 150px;
  height: 150px;
  background: transparent;
  box-shadow: 0px 0px 0px 1000px rgba(255, 255, 255, 0.67),
    0px 0px 19px 0px rgba(0, 0, 0, 0.16) inset;
  border-radius: 100%;
  z-index: -1;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}

.loader_cogs {
  z-index: -2;
  width: 100px;
  height: 100px;
  top: -120px !important;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}

.loader_cogs__top {
  position: relative;
  width: 100px;
  height: 100px;
  -webkit-transform-origin: 50px 50px;
  transform-origin: 50px 50px;
  -webkit-animation: rotate 6s infinite linear;
  animation: rotate 6s infinite linear;
}

.loader_cogs__top div:nth-of-type(1) {
  -webkit-transform: rotate(30deg);
  transform: rotate(30deg);
}

.loader_cogs__top div:nth-of-type(2) {
  -webkit-transform: rotate(60deg);
  transform: rotate(60deg);
}

.loader_cogs__top div:nth-of-type(3) {
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
}

.loader_cogs__top div.top_part {
  width: 100px;
  border-radius: 10px;
  position: absolute;
  height: 100px;
  background: #f98db9;
  /* background: #8a97e0; */
}

.loader_cogs__top div.top_hole {
  width: 50px;
  height: 50px;
  border-radius: 100%;
  background: white;
  position: absolute;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}

.loader_cogs__left {
  position: relative;
  width: 80px;
  -webkit-transform: rotate(16deg);
  transform: rotate(16deg);
  top: 28px;
  -webkit-transform-origin: 40px 40px;
  transform-origin: 40px 40px;
  -webkit-animation: rotate_left 3s 0.1s infinite reverse linear;
  animation: rotate_left 3s 0.1s infinite reverse linear;
  left: -24px;
  height: 80px;
}

.loader_cogs__left div:nth-of-type(1) {
  -webkit-transform: rotate(30deg);
  transform: rotate(30deg);
}

.loader_cogs__left div:nth-of-type(2) {
  -webkit-transform: rotate(60deg);
  transform: rotate(60deg);
}

.loader_cogs__left div:nth-of-type(3) {
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
}

.loader_cogs__left div.left_part {
  width: 80px;
  border-radius: 6px;
  position: absolute;
  height: 80px;
  background: #97ddff;
  /* background: #76cfe6; */
}

.loader_cogs__left div.left_hole {
  width: 40px;
  height: 40px;
  border-radius: 100%;
  background: white;
  position: absolute;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}

.loader_cogs__bottom {
  position: relative;
  width: 60px;
  top: -65px;
  -webkit-transform-origin: 30px 30px;
  transform-origin: 30px 30px;
  -webkit-animation: rotate_left 2s infinite linear;
  animation: rotate_left 2s infinite linear;
  -webkit-transform: rotate(4deg);
  transform: rotate(4deg);
  left: 79px;
  height: 60px;
}

.loader_cogs__bottom div:nth-of-type(1) {
  -webkit-transform: rotate(30deg);
  transform: rotate(30deg);
}

.loader_cogs__bottom div:nth-of-type(2) {
  -webkit-transform: rotate(60deg);
  transform: rotate(60deg);
}

.loader_cogs__bottom div:nth-of-type(3) {
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
}

.loader_cogs__bottom div.bottom_part {
  width: 60px;
  border-radius: 5px;
  position: absolute;
  height: 60px;
  background: #ffcd66;
  /* background: #221804; */
}

.loader_cogs__bottom div.bottom_hole {
  width: 30px;
  height: 30px;
  border-radius: 100%;
  background: white;
  position: absolute;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}

.loading-text {
  font-size: 20px;
  position: absolute;
  bottom: -70px;
  text-align: center;
  left: 0;
  right: 0;
  color: rgb(0, 172, 193);
}

.dot {
  display: inline-block;
  height: 1em;
  line-height: 1;
  text-align: left;
  vertical-align: -0.25em;
  overflow: hidden;
}

.dot::before {
  display: block;
  content: "...\A..\A.";
  white-space: pre-wrap;
  animation: dot 2s infinite step-start both;
}

@keyframes dot {
  33% {
    transform: translateY(-2em);
  }

  66% {
    transform: translateY(-1em);
  }
}

@-webkit-keyframes rotate {
  from {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  to {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes rotate {
  from {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  to {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@-webkit-keyframes rotate_left {
  from {
    -webkit-transform: rotate(16deg);
    transform: rotate(16deg);
  }

  to {
    -webkit-transform: rotate(376deg);
    transform: rotate(376deg);
  }
}

@keyframes rotate_left {
  from {
    -webkit-transform: rotate(16deg);
    transform: rotate(16deg);
  }

  to {
    -webkit-transform: rotate(376deg);
    transform: rotate(376deg);
  }
}

@-webkit-keyframes rotate_right {
  from {
    -webkit-transform: rotate(4deg);
    transform: rotate(4deg);
  }

  to {
    -webkit-transform: rotate(364deg);
    transform: rotate(364deg);
  }
}

@keyframes rotate_right {
  from {
    -webkit-transform: rotate(4deg);
    transform: rotate(4deg);
  }

  to {
    -webkit-transform: rotate(364deg);
    transform: rotate(364deg);
  }
}
</style>
