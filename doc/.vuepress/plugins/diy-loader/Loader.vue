<template>
  <div class="diy-loader center" v-show="show">
    <div class="diy-loader-circle"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      footerShow: true
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
      if (to.path == "/about/about.html") {
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
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 600;
}

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
</style>
