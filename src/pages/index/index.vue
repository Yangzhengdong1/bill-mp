<template>
  <div class="content">
    <div class="top">
      <div class="mask"></div>
      <h2>
        <span>我的账本</span>
        <i :style="[{ backgroundImage: `url(${iconToBase64.user})` }]"></i>
      </h2>
      <span>坚持记账</span>
    </div>
    <div class="main">
      <div class="billboard">
        <div class="disbursement">
          <span>{{ totalMoney.amountMoth.outAmount || "-" }}</span>
          <span>本月支出(元)</span>
        </div>
        <div class="income">
          <span>{{ totalMoney.amountMoth.inAmount || "-" }}</span>
          <span>本月收入(元)</span>
        </div>
      </div>
      <div class="billboard-day">
        <div class="day-left">
          {{ billParams.dateValue | date("yyyy年mm月dd号") }}
        </div>
        <div class="day-right">
          <p class="day-income">
            <span>收</span
            ><span>{{ totalMoney.amountDay.inAmount || "-" }}</span>
          </p>
          <p class="day-disbursement">
            <span>支</span
            ><span>{{ totalMoney.amountDay.outAmount || "-" }}</span>
          </p>
          <p></p>
        </div>
      </div>

      <div class="bill-list">
        <scroll-view scroll-y class="scroll-Y">
          <div class="bill-item" v-for="item in billList" :key="item.billId">
            <div class="remark-date">
              <p>{{ item.remark }}</p>
              <!-- <p>08:00</p> -->
            </div>
            <div
              class="money"
              :style="{ color: item.type === 1 ? '#42cac4' : '#ff6e81' }"
            >
              {{ item.amount }}
            </div>
          </div>
          <div class="bottom-ele bill-item"></div>
        </scroll-view>
      </div>
    </div>

    <u-popup
      :show="submitPopupVisible"
      @close="submitPopupVisible = false"
      @open="open"
      mode="center"
      class="submit-popup"
    >
      <view class="bill-type-box submit-box">
        <span class="title">账单类型</span>
        <u-radio-group
          v-model="billParams.billType"
          placement="row"
          label="账单类型"
          @change="billGroupChange"
        >
          <u-radio
            :customStyle="{ marginBottom: '8px' }"
            v-for="(item, index) in billTypes"
            :key="index"
            :label="item.label"
            :name="item.value"
            labelSize="12"
          >
          </u-radio>
        </u-radio-group>
      </view>
      <view class="pay-type-box submit-box">
        <span class="title">{{
          billParams.billType === 0 ? "收入来源" : "支付方式"
        }}</span>
        <u-radio-group v-model="billParams.payType" placement="row">
          <u-radio
            :customStyle="{ marginBottom: '8px' }"
            v-for="(item, index) in list"
            :key="index"
            :label="item.label"
            :name="item.value"
            labelSize="12"
          >
          </u-radio>
        </u-radio-group>
      </view>
      <view class="amount-box submit-box">
        <span class="title">金额</span>
        <u--input
          placeholder="请输入金额"
          border="bottom"
          type="digit"
          clearable
          v-model="billParams.amount"
        ></u--input>
      </view>
      <view class="remark-box submit-box">
        <span class="title">备注</span>
        <u--input
          placeholder="请输入备注"
          border="bottom"
          clearable
          v-model="billParams.remark"
        ></u--input>
      </view>
      <u-button
        type="primary"
        text="保存"
        iconColor="#42cac4"
        :customStyle="btnStyle"
        @click="handleSubmit"
      ></u-button>
    </u-popup>
    <!-- 时间日期选择器 -->
    <u-datetime-picker
      :show="dateShow"
      v-model="billParams.dateValue"
      mode="date"
    ></u-datetime-picker>
    <loading :visible="loadingVisible" />
    <tabbar
      :tabbars="tabbars"
      @jump="handlePageJump"
      @edit="submitPopupVisible = true"
    />
  </div>
</template>

<script>
import iconToBase64 from "@/utils/iconToBase64";
import { addBill, getBillList } from "@/api/bill.service";
import { payTypes, billTypes, tabbars, sources } from "@/utils/constants";
const btnStyle = {
  border: 0,
  width: "200rpx",
  "border-radius": "20rpx",
  // background: "linear-gradient(45deg, #42cac4, #ff6e81)",
  background: "rgb(0,139,139)",
  "margin-top": "40rpx"
};

export default {
  name: "index",
  data() {
    return {
      payTypes,
      billTypes,
      dateShow: false,
      billParams: {
        payType: 1,
        billType: 1,
        amount: null,
        remark: "",
        dateValue: Number(new Date())
      },
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        date: ""
      },
      submitPopupVisible: false,
      btnStyle,
      iconToBase64,
      billList: [],
      loadingVisible: false,
      tabbars,
      totalMoney: {}
    };
  },
  created() {
    this.getBillList(this.queryParams);
  },
  computed: {
    list() {
      return this.billParams.billType === 0 ? sources : payTypes;
    },
    getDate() {
      return (
        `${+new Date().getFullYear()}-${(+new Date().getMonth() + 1 < 10 ? '0' + (+new Date().getMonth() + 1) : (+new Date().getMonth() + 1))}-${+new Date().getDate() < 10 ? '0' + +new Date().getDate() : +new Date().getDate() }`
      );
    }
  },
  methods: {
    getBillList(params) {
      params.date = this.getDate;
      getBillList(params).then((res) => {
        console.log(res);
        if (res && res.code === 0) {
          this.billList = res.data.records;
          this.totalMoney = res.data.amount;
        } else {
          this.$toast(res.message);
        }
      });
    },

    addBill(params) {
      this.loadingVisible = true;
      addBill(params).then((res) => {
        this.$toast(res.message);
        this.loadingVisible = false;
        this.submitPopupVisible = false;
        this.getBillList(this.queryParams);
      });
    },

    close() {},
    open() {},
    billGroupChange() {
      this.$nextTick(() => {
        this.billParams.payType = this.billParams.billType === 0 ? 4 : 1;
      });
    },
    handleSubmit() {
      if (!this.billParams.amount || !this.billParams.remark) {
        this.$toast("请输入金额或备注");
        return;
      }
      this.addBill(this.billParams);
    },
    handlePageJump(tabbar) {
      console.log(tabbar);
      uni.redirectTo({
        url: tabbar.path
      });
    }
  }
};
</script>

<style lang="scss" scope>
.content {
  // display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 40rpx 50rpx;
  height: calc(100vh - 80rpx);
  .top {
    margin: 20rpx 0;
    color: #fff;
    .mask {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 300rpx;
      background-color: #42cac4;
      border-radius: 0 0 60rpx 60rpx;
    }
    > h2,
    > span {
      position: relative;
      z-index: 2;
    }
    h2 {
      display: flex;
      justify-content: space-between;
      font-size: 44rpx;
      font-weight: 500;
      > i {
        width: 50rpx;
        height: 50rpx;
        background-repeat: no-repeat;
        background-size: 100%;
        background-position: center;
      }
    }
    > span {
      margin: 20rpx 0;
      font-size: 20rpx;
      transform: scale(0.83);
    }
  }
  .main {
    // display: flex;
    // flex-direction: column;
    // justify-content: center;
    width: 100%;
    .billboard {
      position: relative;
      top: 0;
      z-index: 2;
      display: flex;
      height: 200rpx;
      width: 100%;
      border-radius: 48rpx;
      background-color: #fff;
      padding: 8rpx;
      min-width: 650rpx;
      box-shadow: 0 0 60rpx 0 rgba(95, 109, 130, 0.4);
      .disbursement,
      .income {
        display: flex;
        flex-direction: column;
        justify-content: center;
        // height: 100%;
        > span {
          &:last-child {
            font-size: 24rpx;
          }
          &:first-child {
            display: inline-block;
            height: 64rpx;
            line-height: 64rpx;
          }
        }
      }
      .disbursement {
        width: 70%;
        border-radius: 40rpx 0 0 40rpx;
        border: 4rpx solid #42cac4;
        border-right-width: 0;
        padding-left: 60rpx;
        > span {
          &:first-child {
            font-weight: 600;
            font-size: 40rpx;
          }
        }
      }
      .income {
        width: 30%;
        border-radius: 0 40rpx 40rpx 0;
        border: 4rpx solid #ff6e81;
        border-left-width: 0;
        padding-right: 60rpx;
        > span {
          &:first-child {
            text-align: center;
          }
        }
      }
    }
    .billboard-day {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 40rpx 0;
      .day-right {
        display: flex;
        font-size: 28rpx;
        font-weight: 600;
        .day-income,
        .day-disbursement {
          span {
            &:first-child {
              margin-right: 20rpx;
            }
          }
        }
        .day-income {
          span {
            &:first-child {
              color: #ff6e81;
            }
          }
          margin-right: 30rpx;
        }
        .day-disbursement {
          span {
            &:first-child {
              color: #42cac4;
            }
          }
        }
      }
    }
    .bill-list {
      // max-height: 400rpx;
      padding: 40rpx 0;
      box-sizing: border-box;
      overflow: hidden;
      .scroll-Y {
        height: 500rpx;
      }
      .bill-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 30rpx;
        width: 100%;
        height: 100rpx;
        border-radius: 30rpx;
        background-color: #efefef;
        box-sizing: border-box;
        margin-bottom: 30rpx;
        &:last-child {
          margin-bottom: 0;
        }
        .remark-date {
          p {
            &:first-child {
              font-weight: 600;
            }
            &:last-child {
              font-size: 24rpx;
            }
          }
        }
        .money {
          font-weight: 600;
        }
      }
      .bottom-ele {
        background-color: transparent;
      }
    }
    .income-color {
      color: #ff6e81;
    }
    .disbursement-color {
      color: #42cac4;
    }
  }
}
/* .submit-popup { */
/deep/.u-popup__content {
  min-width: 716rpx;
  box-sizing: border-box;
  padding: 40rpx 30rpx;
  border-radius: 20rpx;
  font-size: 12px;
  .submit-box {
    display: flex;
    align-items: center;
    height: 60rpx;
    .u-radio {
      margin-right: 24rpx;
      margin-bottom: 0px !important;
      // width: 160rpx;
      &:last-child {
        margin: 0;
      }
    }
    .u-input {
      padding: 0 !important;
      height: 100%;
    }
    .u-radio__icon-wrap {
      width: 28rpx !important;
      height: 28rpx !important;
      .u-icon__icon {
        width: 12rpx;
        height: 12rpx;
        background-color: #fff;
        text-indent: -9999px;
        border-radius: 50%;
      }
    }
    .input-placeholder {
      font-size: 24rpx;
    }
  }
  .amount-box {
    margin-bottom: 20rpx;
  }
  .title {
    width: 120rpx;
  }
}
/* } */
.hidden {
  display: none;
}
/deep/.u-input__content {
  input {
    // text-align: right !important;
    font-size: 28rpx;
  }
}
/deep/ .u-toolbar__title {
  justify-content: center;
}
/deep/ .u-line-1 {
  display: flex !important;
}
</style>
