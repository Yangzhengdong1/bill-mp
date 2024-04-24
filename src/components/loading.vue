<template>
  <!-- <div id="loading" :class="visible ? 'show' : 'hidden'">
    <span></span>
    <span class="span2"></span>
    <span class="span3"></span>
  </div> -->
  <!-- 转圈 -->
  <div id="loading" v-show="visible">
    <div class="lds-ellipsis">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
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
  background-color: rgba(#000000, 0.1);
  z-index: 99999;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.5s;
}
.hidden {
  opacity: 0;
  width: 0 !important;
  height: 0 !important;
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

// 第二类loading
.lds-ellipsis {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ellipsis div {
  position: absolute;
  top: 33px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #43c7bf;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1) {
  left: 8px;
  animation: lds-ellipsis1 0.6s infinite;
}
.lds-ellipsis div:nth-child(2) {
  left: 8px;
  /* background-color: #fa9483; */
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(3) {
  left: 32px;
  /* background-color: #fa9483; */
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(4) {
  left: 56px;
  animation: lds-ellipsis3 0.6s infinite;
}
@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
}
</style>
