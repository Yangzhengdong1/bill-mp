<template>
	<div class="login">
		<div class="login-top" style="text-align: end">
			<img
				src="@/static/logo.png"
				alt=""
				style="width: 156rpx; height: 156rpx"
			/>
		</div>
		<div class="login-main">
			<div class="welcome">
				<div class="welcome-icon">
					<i :style="[{ 'background-image': `url(${iconToBase64.pig})` }]"></i>
					<span>Welcome</span>
				</div>
				<h2>欢迎登录</h2>
				<i></i>
				<div class="login-form">
					<div
						class="login-for-code"
						:class="wxLogin ? 'magnify' : 'scale'"
						@click="handleLogin"
					>
						<i :style="[{ backgroundImage: `url(${iconToBase64.wx})` }]"></i>
						<div class="tip-text">
							<span>微信账号一键登录</span>
							<span>登录即代表同意用户协议</span>
						</div>
					</div>
					<div class="login-for-phone" :class="!wxLogin ? 'magnify' : 'scale'">
						<u--input
							placeholder="请输入账号"
							border="none"
							:customStyle="inputCustomStyle"
							:placeholderStyle="placeholderStyle"
							clearable
							v-model="loginParams.username"
							@confirm="pwdFocus = true"
						></u--input>
						<u--input
							placeholder="请输入密码"
							border="none"
							:customStyle="inputCustomStyle"
							:placeholderStyle="placeholderStyle"
							clearable
							:focus="pwdFocus"
							type="password"
							v-model="loginParams.password"
							@blur="pwdFocus = false"
							@confirm="handleLogin"
						></u--input>
						<u-checkbox-group
							v-model="visitorValue"
							placement="column"
							activeColor="#49ccc5"
						>
							<u-checkbox
								labelSize="12"
								v-for="(item, index) in [{ label: '游客登录', value: 'visitor' }]"
								:key="index"
								:label="item.label"
								:name="item.value"
							>
							</u-checkbox>
							<span class="visitor-tip" :style="{opacity: isVisitorValue ? 1 : 0}">(仅初次登录需勾选)</span>
						</u-checkbox-group>
							<span class="visitor-tip tip">游客账号无法绑定微信小程序，如需绑定小程序请前往小程序注册后绑定</span>
					</div>
				</div>
			</div>
		</div>
		<!-- #ifdef MP-WEIXIN-->
		<div class="login-footer">
			<p>
				<i :style="[{ backgroundImage: `url(${loginTypeIcon})` }]"></i>
				<span @click="wxLogin = !wxLogin">{{ loginTypeText }}</span>
			</p>
		</div>
		<!-- #endif -->
		<loading :visible="loadingVisible" />
	</div>
</template>

<script>
import iconToBase64 from "@/utils/iconToBase64";
import { login, visitorLogin } from "@/api/login.service";
const inputCustomStyle = {
	height: "90rpx",
	backgroundColor: "#f3f3f3",
	padding: "0 30rpx",
	marginBottom: "50rpx",
	borderRadius: "30rpx"
};
const placeholderStyle = "fontSize: 24rpx; color: rgb(192, 196, 204)";
export default {
	name: "login",
	data() {
		return {
			pwdFocus: false,
			loginParams: { password: "", username: "" },
			inputCustomStyle,
			placeholderStyle,
			// #ifdef MP-WEIXIN
			wxLogin: true,
			loginCode: "",
			// #endif
			// #ifdef H5
			wxLogin: false,
			// #endif
			iconToBase64,
			userMessage: {},
			loadingVisible: false,
      visitorValue: []
		};
	},
	onLoad() {
		this.initData();
	},
	computed: {
		loginTypeIcon() {
			return this.wxLogin ? iconToBase64.lock : iconToBase64.miniWX;
		},
		loginTypeText() {
			return this.wxLogin ? "账号密码登录" : "微信一键登录";
		},
    isVisitorValue() {
      return this.visitorValue[0] === "visitor";
    }
	},
	methods: {
		/**
		 * @description: 登录网络请求
		 * @param {*} params {code/iv/encryptedData || password/username}
		 * @return {*} null
		 */
		async login(params) {
			this.loadingVisible = true;
			try {
				const data = this.isVisitorValue ? await visitorLogin(params) : await login(params);
				this.loadingVisible = false;
				if (data && data.code === 0) {
					// console.log('登录成功');
					this.userMessage = data.data;
					uni.setStorageSync("user_message", data.data);
					setTimeout(() => {
						uni.redirectTo({
							url: "/pages/index/index"
						});
					}, 500);
				} else {
					this.$toast(data.message);
					console.error("登录失败");
				}
			} catch (error) {
				this.loadingVisible = false;
				console.log(error.response, "请求错误");
			}
		},

		/**
		 * @description: 初始化一些需要用到的数据
		 */
		initData() {
			const userMessage = uni.getStorageSync("user_message");
			if (userMessage) {
				uni.redirectTo({ url: "/pages/index/index" });
				this.userMessage = userMessage;
			}
			// #ifdef MP-WEIXIN
			this.initLoginCode();
			// #endif
		},

		/**
		 * @description: 初始化登录code
		 */
		initLoginCode() {
			const code = uni.getStorageSync("login_code");
			if (code) {
				this.loginCode = code;
			} else {
				uni.login({
					provider: "weixin",
					success: res => {
						if (res.errMsg === "login:ok") {
							uni.setStorageSync("login_code", res.code);
							this.loginCode = res.code;
						} else {
							console.log("获取登录code失败");
						}
					}
				});
			}
		},

		/**
		 * @description: 处理登录逻辑
		 */
		handleLogin() {
			let params;
			// #ifdef MP-WEIXIN
			if (!this.wxLogin) {
				this.login(this.loginParams);
				return;
			}
			uni.getUserProfile({
				desc: "用户登录",
				success: async res => {
					if (res && res.errMsg === "getUserProfile:ok") {
						const { iv, encryptedData } = res;
						params = { code: this.loginCode, iv, encryptedData };
						await this.login(params);
						uni.setStorageSync("login_code", "");
						this.loginCode = "";
						this.initLoginCode();
					} else {
						console.log("获取用户授权失败");
					}
				},
				fail: err => {
					this.$toast("授权失败");
					console.log(err, "用户拒绝授权");
				}
			});
			// #endif
			// #ifdef H5
			if (!this.loginParams.password || !this.loginParams.username) {
				this.$toast("用户名或密码不能为空");
				return;
			}
      this.login(this.loginParams);
			// #endif
		},

		handleChangeLoginType() {
			if (this.wxLogin) {
				this.$toast("账号登录功能正在开发中，敬请期待");
				return;
			}
			this.wxLogin = !this.wxLogin;
		}
	},
	options: {
		styleIsolation: "shared"
	}
};
</script>

<style lang="scss" scope>
.login {
	display: flex;
	flex-direction: column;
	height: calc(100vh - 80rpx);
	padding: 40rpx;
	.login-top {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		flex: 3;
	}
	.login-main {
		flex: 6;
		.welcome {
			.welcome-icon {
				display: flex;
				align-items: center;
				margin-bottom: 16rpx;
				> i {
					width: 34rpx;
					height: 34rpx;
					// background-image: url("../../static/pig.svg");
					margin-right: 2rpx;
				}
				span {
					font-weight: 600;
				}
			}
			> i {
				display: inline-block;
				width: 50rpx;
				height: 8rpx;
				margin: 60rpx 0;
				background-color: #464646;
				border-radius: 4rpx;
			}
			h2 {
				font-weight: 600;
				font-size: 48rpx;
			}
		}
		.login-form {
			position: relative;
			top: 0;
			left: 0;
			.login-for-code {
				position: absolute;
				top: 0;
				left: 0;
				display: flex;
				justify-content: center;
				align-items: center;
				width: 400rpx;
				height: 86rpx;
				background-color: #42cac4;
				border-radius: 30rpx;
				> i {
					display: inline-block;
					width: 66rpx;
					height: 66rpx;
					margin-right: 16rpx;
					// background-image: url("../../static/wx.svg");
				}
				.tip-text {
					// animation: text-hidde 1.5s linear;
					span {
						display: block;
						color: #fff;
						&:first-child {
							font-weight: 600;
							font-size: 28rpx;
						}
						&:last-child {
							font-size: 20rpx;
							// transform: scale(0.83);
							transform: translate(-36rpx, 0) scale(0.73);
						}
					}
				}
			}
		}
	}
	.login-footer {
		flex: 2;
		display: flex;
		align-items: flex-start;
		p {
			display: flex;
			align-items: center;
			> i {
				display: inline-block;
				width: 30rpx;
				height: 30rpx;
				// background-image: url("../../static/lock.svg");
				margin-right: 6rpx;
				vertical-align: middle;
			}
			> span {
				font-size: 24rpx;
				transform: scale(0.9);
				color: #ccc;
			}
		}
	}
	i {
		background-repeat: no-repeat;
		background-size: 100%;
		background-position: center;
	}
}

// 左移右移动画
.enter-x-left {
	z-index: 9;
	opacity: 0;
	animation: enter-x-left 0.4s ease-in-out 0.3s;
	animation-fill-mode: forwards;
	transform: translateX(-50px);
}
.enter-x-right {
	z-index: 9;
	opacity: 0;
	animation: enter-x-right 0.4s ease-in-out 0.3s;
	animation-fill-mode: forwards;
	transform: translateX(50px);
}
@keyframes enter-x-right {
	to {
		opacity: 1;
		transform: translateX(0);
	}
}
@keyframes enter-x-left {
	to {
		opacity: 1;
		transform: translateX(0);
	}
}

// 缩放效果
.scale {
	transition: scale 1s;
	scale: 0;
}
.magnify {
	transition: scale 1s;
	scale: 1;
}

/deep/ .uni-input-wrapper {
	.uni-input-input:-webkit-autofill {
		transition: background-color 5000s ease-in-out 0s;
	}
}
/deep/ .u-checkbox-group--column {
	flex-direction: row;
	.u-checkbox {
		.u-checkbox__icon-wrap {
			width: 28rpx !important;
			height: 28rpx !important;
      transition: background-color 0.5s ease;
		}
	}
}
.visitor-tip {
  color:  #ff6e81;
  font-size: 24rpx;
  font-weight: 600;
  opacity: 0;
  transition: opacity 0.5s ease;
  margin-left: 10rpx;
}
.tip {
  opacity: 1;
  font-size: 22rpx;
  font-weight: normal;
  transform: scale(0.83);
}
</style>
