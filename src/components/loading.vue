<template>
  <div id="loading" :class="visible ? 'show' : 'hidden'">
    <span></span>
    <span class="span2"></span>
    <span class="span3"></span>
  </div>
</template>

<script>
export default {
  name: 'loading',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped lang="scss">
#loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(#000000, .5);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all .5s;
}
.hidden {
  opacity: 0;
  width: 0!important;
  height: 0!important;
}
.show {
  opacity: 1;
}
span {
  display: inline-block;
  width: 30rpx;
  height: 30rpx;
  border-radius: 50%;
  margin-right: 10rpx;
  background-color: #fff;
  animation: 1.5s linear 0s infinite normal both running
    react-spinners-BeatLoader-beat;
  /* 动画执行时间 动画运行完后的状态 动画一个周期用的时长 动画重复次数  */
}
.span2 {
  animation: 1.5s linear 0.35s infinite normal both running
    react-spinners-BeatLoader-beat;
}
.span3 {
  animation: 1.5s linear 0.7s infinite normal both running
    react-spinners-BeatLoader-beat;
}

@keyframes react-spinners-BeatLoader-beat {
  50% {
    transform: scale(0.75);
    opacity: 0.2;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}


</style>
