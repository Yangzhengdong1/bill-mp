<template>
  <div class="content">
    <div class="top">
      <div class="mask"></div>
      <h2>
        <span>我的账本</span>
        <i
          @click="handlePageJump({ path: '/pages/profile/profile' })"
          :style="[{ backgroundImage: `url(${iconToBase64.user})` }]"
        ></i>
      </h2>
      <span>坚持记账</span>
    </div>
    <div class="main">
      <div class="billboard">
        <div class="disbursement">
          <span>{{
            (totalMoney.amountMoth && totalMoney.amountMoth.outAmount) || "-"
          }}</span>
          <span>本月支出(元)</span>
        </div>
        <div class="income">
          <span>{{
            (totalMoney.amountMoth && totalMoney.amountMoth.inAmount) || "-"
          }}</span>
          <span>本月收入(元)</span>
        </div>
      </div>
      <div class="billboard-day">
        <div class="day-left">
          {{ Number(new Date()).dateValue | date("yyyy年mm月dd号") }}
        </div>
        <div class="day-right">
          <p class="day-income">
            <span>收</span>
            <span>{{
              (totalMoney.amountMoth && totalMoney.amountDay.inAmount) || "-"
            }}</span>
          </p>
          <p class="day-disbursement">
            <span>支</span>
            <span>
              {{
                (totalMoney.amountMoth && totalMoney.amountDay.outAmount) || "-"
              }}
            </span>
          </p>
          <p></p>
        </div>
      </div>
      <bill-list
        :billList="billList"
        @swipeItemClick="handleSwipeItemClick"
        @billItemClick="handleBillItemClick"
      />
    </div>
    <bill-popup
      :submitPopupVisible="submitPopupVisible"
      @submit="handleSubmit"
      @close="submitPopupVisible = false"
      ref="billPopupRef"
    />
    <!-- 时间日期选择器 -->
    <!-- <u-datetime-picker
      :show="dateShow"
      v-model="billParams.dateValue"
      mode="date"
    ></u-datetime-picker> -->
    <loading :visible="loadingVisible" />
    <tabbar
      :tabbars="tabbars"
      @jump="handlePageJump"
      @edit="handleTabbleEdit"
    />
  </div>
</template>

<script>
import iconToBase64 from "@/utils/iconToBase64";
import {
  addBill,
  getBillList,
  getBillDetail,
  deleteBill
} from "@/api/bill.service";
import { tabbars } from "@/utils/constants";
import { loading } from "@/utils/util.js";
import billPopup from "./bill-popup.vue";
import billList from "./bill-list.vue";
export default {
  name: "index",
  components: { billPopup, billList },
  data() {
    return {
      options: [{ text: "删除", style: { backgroundColor: "red" } }],
      dateShow: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        date: ""
      },
      submitPopupVisible: false,
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
  methods: {
    getBillList(params) {
      params.date = uni.$u.timeFormat(+new Date(), "yyyy-mm-dd");
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

    getBillDetail(id) {
      loading.show();
      getBillDetail(id).then((res) => {
        loading.hide();
        if (res && res.code === 0) {
          this.$refs.billPopupRef.initData();
          this.$refs.billPopupRef.billParams = res.data;
          this.submitPopupVisible = true;
        } else {
          this.$toast(res.message);
        }
      });
    },

    deleteBill(id) {
      // this.loadingVisible = true;
      loading.show("删除中");
      deleteBill(id).then((res) => {
        // this.loadingVisible = false;
        loading.hide();
        if (res && res.code === 0) {
          this.getBillList(this.queryParams);
        }
        this.$toast(res.message);
      });
    },

    /**
     * @description: 新增/更新弹窗按钮确认
     * @param {*} params
     */
    handleSubmit(params) {
      if (params.wid) {
        console.log("更新");
      } else {
        this.addBill(params);
      }
    },

    handlePageJump(tabbar) {
      uni.redirectTo({
        url: tabbar.path
      });
    },

    /**
     * @description: 查看账单详情
     * @param {*} id 账单id
     */
    handleBillItemClick(id) {
      this.getBillDetail(id);
    },

    /**
     * @description: 左滑删除账单
     * @param {*} id
     */
    handleSwipeItemClick(id) {
      this.deleteBill(id);
    },

    /**
     * @description: 新增账单弹窗
     */
    handleTabbleEdit() {
      this.$refs.billPopupRef.initData();
      this.submitPopupVisible = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  // display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 40rpx 50rpx;
  height: calc(100vh - 130rpx);
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
  }
}
.hidden {
  display: none;
}
</style>
