<template>
  <div id="profile" class="profile">
    <div class="user">
      <div class="avatar">
        <img src="https://cdn.uviewui.com/uview/album/1.jpg" alt="avatar.jpg" />
      </div>
      <div class="nickname">
        <span>{{ getUserMessage.username || '默认昵称' }}</span>
      </div>
    </div>
    <div class="settings">
      <ul>
        <li
          v-for="item in settings"
          :key="item.title"
          @click="handleSetting(item)"
        >
          <span>{{ item.title }}</span>
          <u-icon
            size="24rpx"
            :name="item.iconName"
            v-if="!!item.iconName"
          ></u-icon>
        </li>
      </ul>
    </div>
    <div class="logout">
      <span class="logout-bntn" @click="handleLogout">退出</span>
    </div>
    <u-popup
      :show="bindPopupVisible"
      @close="bindPopupVisible = false"
      mode="center"
      class="bind-popup"
    >
      <view class="amount-box bind-box">
        <span class="title">用户名</span>
        <u--input
          placeholder="请输入用户名称"
          border="bottom"
          clearable
          v-model="bindParams.username"
        ></u--input>
      </view>
      <view class="remark-box bind-box">
        <span class="title">密码</span>
        <u--input
          placeholder="请输入密码"
          border="bottom"
          type="password"
          clearable
          v-model="bindParams.password"
        ></u--input>
      </view>
      <u-button
        type="primary"
        text="确认绑定"
        iconColor="#42cac4"
        :customStyle="btnStyle"
        @click="handleSubmit"
      ></u-button>
    </u-popup>
    <loading :visible="loadingVisible" />
    <tabbar @jump="handlePageJump" :editVisible="false" />
  </div>
</template>

<script>
import { bind } from "@/api/login.service";
const btnStyle = {
  border: 0,
  width: "200rpx",
  "border-radius": "20rpx",
  // background: "linear-gradient(45deg, #42cac4, #ff6e81)",
  background: "rgb(0,139,139)",
  "margin-top": "40rpx"
};
const settings = [
  //#ifdef MP-WEIXIN
  {
    title: "账户绑定",
    iconName: "edit-pen-fill"
  },
  //#endif
  {
    title: "账号设置",
    iconName: "",
    path: ""
  }
];
export default {
  name: "profile",
  data() {
    return {
      btnStyle,
      bindPopupVisible: false,
      bindParams: {
        username: "",
        password: ""
      },
      settings,
      loadingVisible: false,
      userInfo: {}
    };
  },
  created() {
    // this.userInfo = this.getUserMessage;
  },
  computed: {
    getUserMessage() {
      return uni.getStorageSync("user_message");
    }
  },
  methods: {
    /**
     * @description: 账号绑定网络请求
     * @param {*} params {username/password}
     */
    bind(params) {
      this.loadingVisible = true;
      bind(params).then((res) => {
        this.loadingVisible = false;
        this.bindPopupVisible = false;
        this.$toast(res.message);
        // if (res && res === 0) {

        // } else {
        //   this.$toast(res.message);
        // }
        console.log(res);
      })["catch"](err => {
        this.loadingVisible = false;
        this.bindPopupVisible = false;
        this.$toast("接口报错了");
      });
    },

    /**
     * @description: 处理底部tabbar点击事件
     * @param {*} tabbar
     */
    handlePageJump(tabbar) {
      uni.redirectTo({
        url: tabbar.path
      });
    },

    /**
     * @description: 处理设置项点击
     * @param {*} item
     */
    handleSetting(item) {
      switch (item.title) {
        case "账户绑定":
          this.bindPopupVisible = true;
          break;
        default:
          break;
      }
    },

    /**
     * @description: 提交绑定表单
     */
    handleSubmit() {
      const { username, password } = this.bindParams;
      if (!username || !password) {
        this.$toast("请输入用户名或密码");
        return;
      }
      this.bind(this.bindParams);
    },

    handleLogout() {
      uni.clearStorageSync("user_message");
      uni.redirectTo({ url: "/pages/login/login" });
    }
  }
};
</script>

<style lang="scss" scoped>
#profile,
.profile {
  padding: 40rpx;
  font-size: 28rpx;
  .user {
    display: flex;
    .avatar {
      margin-right: 20rpx;
      img {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
      }
    }
    .nickname {
      flex: 1;
      padding-top: 20rpx;
      font-weight: 600;
    }
  }
  .settings {
    margin-top: 30rpx;
    font-size: 24rpx;
    ul {
      li {
        background: #efefef;
        height: 80rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        list-style-type: none;
        padding: 0 30rpx 0 20rpx;
        border-radius: 16rpx;
        margin-bottom: 30rpx;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
  /* .bind-popup { */
  /deep/.u-popup__content {
    min-width: 640rpx;
    box-sizing: border-box;
    padding: 40rpx 30rpx;
    border-radius: 20rpx;
    font-size: 12px;
    .bind-box {
      display: flex;
      align-items: center;
      height: 60rpx;
      .u-input {
        padding: 0 !important;
        height: 100%;
      }
    }
    .input-placeholder {
      font-size: 24rpx;
    }
    .amount-box {
      margin-bottom: 20rpx;
    }
    .title {
      width: 120rpx;
    }
  }
  .logout {
    display: flex;
    justify-content: center;
    margin-top: 60rpx;
    .logout-bntn {
      display: inline-block;
      background-color: #4CAF50;
      color: white;
      border: none;
      padding: 24rpx 48rpx;
      font-size: 24rpx;
      border-radius: 10rpx;
      box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
      transition: background-color 0.3s ease;
    }
  }

  /* } */
}
</style>
