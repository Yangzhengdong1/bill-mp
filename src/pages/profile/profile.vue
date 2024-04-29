<template>
	<div id="profile" class="profile">
		<div class="user">
			<div class="avatar">
				<img src="" alt="avatar.jpg" />
			</div>
			<div class="nickname">
				<span>nickname</span>
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
			settings: [
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
			]
		};
	},
	methods: {
		bind(params) {
			bind(params).then(res => {
				console.log(res);
			});
		},
		handlePageJump(tabbar) {
			uni.redirectTo({
				url: tabbar.path
			});
		},
		handleSetting(item) {
			switch (item.title) {
				case "账户绑定":
					this.bindPopupVisible = true;
					break;
				default:
					break;
			}
		},
		handleSubmit() {
			const { username, password } = this.bindParams;
			if (!username || !password) {
				this.$u.toast("请输入用户名或密码");
				return;
			}
			this.bind(this.bindParams);
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
				width: 130rpx;
				height: 130rpx;
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
	/* } */
}
</style>
