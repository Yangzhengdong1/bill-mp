<template>
  <div class="tabbar">
    <div
      class="tabbar-item"
      v-for="item in tabbars"
      :key="item.path"
      @click="currentPath = item.path"
    >
      <i
        :style="[
          {
            backgroundImage: `url(${
              item.path === currentPath ? item.activeIcon : item.defaultIcon
            })`
          }
        ]"
      ></i>
      <span
        class="fz-small-9"
        :style="[
          item.path === currentPath ? { fontWeight: 600, color: '#000' } : ''
        ]"
        >{{ item.title }}</span
      >
    </div>
    <div class="edit-btn" v-if="editVisible" @click="handleEditBtn">
      <i></i>
      <i></i>
    </div>
  </div>
</template>

<script>
import icons from '@/utils/iconToBase64';
export default {
  name: 'tabbar',
  props: {
    tabbars: {
      type: Array,
      default: () => {
        return [
          {
            title: '明细',
            defaultIcon: icons.detail,
            activeIcon: icons.detailActive,
            path: 'pages/index/index'
          },
          {
            title: '我的',
            defaultIcon: icons.mine,
            activeIcon: icons.mineActive,
            path: 'pages/mine/mine'
          }
        ];
      }
    },
    editVisible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      currentPath: ''
    };
  },
  created() {
    this.currentPath = getCurrentPages().at(-1).route;
    console.log('路由路由', getCurrentPages().at(-1).route);
  },
  methods: {
    handleEditBtn() {
      this.$emit("edit");
    }
  }
};
</script>

<style lang="scss" scope>
.tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: 130rpx;
  background-color: #ffff;
  background-color: #ffff;
  border-top-right-radius: 56rpx;
  border-top-left-radius: 56rpx;
  box-shadow: #ccc 0 0 20rpx;
  .tabbar-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 20rpx;
    color: #ccc;
    > i {
      width: 32rpx;
      height: 32rpx;
      background-size: 100%;
      background-position: 0 0;
      background-repeat: no-repeat;
      margin-bottom: 10rpx;
    }
  }
  .edit-btn {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 110rpx;
    height: 110rpx;
    background: #49ccc5;
    border-radius: 42rpx;
    box-shadow: #ccc 0 0 20rpx;
    > i {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 50rpx;
      height: 10rpx;
      background-color: #fff;
      border-radius: 4rpx;
      box-shadow: #ccc 0 0 8rpx;
      &:last-child {
        height: 50rpx;
        width: 10rpx;
        box-shadow: #ccc 0 0 0;
      }
    }
  }
}
</style>
>
