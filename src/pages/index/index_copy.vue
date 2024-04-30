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
          <span>{{ '-' || 1000 }}</span>
          <span>本月支出(元)</span>
        </div>
        <div class="income">
          <span>{{ '-' || 12 }}</span>
          <span>本月收入(元)</span>
        </div>
      </div>
      <div class="billboard-day">
        <div class="day-left">
          {{ params.dateValue | date('yyyy年mm月dd号') }}
        </div>
        <div class="day-right">
          <p class="day-income">
            <span>收</span><span>{{ '-' || '' }}</span>
          </p>
          <p class="day-disbursement">
            <span>支</span><span>{{ '-' }}</span>
          </p>
          <p></p>
        </div>
      </div>
      <div class="record">
        <div class="record-box">
          <div
            class="record-item"
            v-for="(item, value) in recordList"
            :key="value"
            v-show="!(item.bindValue === 'payType' && params.billType === 0)"
          >
            <span class="title">{{ item.title }}</span>
            <div class="record-ele">
              <div class="input-box" v-if="item.type === 'input'">
                <u--input
                  :placeholder="placeholderComput(item.bindValue)"
                  border="none"
                  v-model="params[item.bindValue]"
                  :type="item.bindValue === 'amount' ? 'digit' : ''"
                  :customStyle="{ width: '200rpx' }"
                  maxlength="15"
                  @change="change(item.bindValue)"
                ></u--input>
              </div>
              <div v-else class="select-box">
                <span
                  @click="
                    item.bindValue === 'billType'
                      ? (billShow = true)
                      : (payShow = true)
                  "
                  >{{
                    item.bindValue === 'payType'
                      ? selectLabelPay
                      : selectLabelBill
                  }}</span
                >
                <i></i>
              </div>
            </div>
          </div>
          <u-button
            type="primary"
            text="保存"
            iconColor="#42cac4"
            :customStyle="btnStyle"
            @click="handleAddBill"
          ></u-button>
        </div>
      </div>
    <button @click="handleTest">点击我</button>

      <div class="bill-list">
        <scroll-view scroll-y class="scroll-Y">
          <div class="bill-item" v-for="item in billList" :key="item.billId">
            <div class="remark-date">
              <p>{{ item.remark }}</p>
              <!-- <p>08:00</p> -->
            </div>
            <div class="money">{{ item.amount }}</div>
          </div>
          <div class="bottom-ele bill-item"></div>
        </scroll-view>
      </div>
    </div>
    <!-- 时间日期选择器 -->
    <u-datetime-picker
      :show="dateShow"
      v-model="params.dateValue"
      mode="date"
    ></u-datetime-picker>
    <!-- 账单类型选择器 -->
    <u-picker
      :show="billShow"
      :columns="billTypes"
      title="账单类型"
      :closeOnClickOverlay="true"
      @confirm="confirm($event, 'bill')"
      @cancel="billShow = false"
      keyName="label"
    ></u-picker>
    <!-- 支付方式选择器 -->
    <u-picker
      :show="payShow"
      :columns="payTypes"
      title="支付方式"
      :closeOnClickOverlay="true"
      @confirm="confirm($event, 'pay')"
      @cancel="payShow = false"
      keyName="label"
    ></u-picker>
    <loading :visible="loadingVisible"/>
    <tabbar/>
  </div>
</template>

<script>
import iconToBase64 from '../../utils/iconToBase64';
import { addBill, getBillList, test } from '../../api/bill.service';
import {
  payTypes,
  billTypes,
  recordList
} from '../../utils/constants';
const btnStyle = {
  border: 0,
  width: '200rpx',
  'border-radius': '20rpx',
  background: 'linear-gradient(45deg, #42cac4, #ff6e81)',
  'margin-top': '40rpx'
};

export default {
  name: 'index',
  data() {
    return {
      payShow: false,
      billShow: false,
      payTypes,
      billTypes,
      dateShow: false,
      params: {
        payType: 0,
        billType: 1,
        amount: null,
        remark: '',
        dateValue: Number(new Date())
      },
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        date: '2023-08'
      },
      recordList,
      btnStyle,
      iconToBase64,
      selectLabelPay: '支付宝',
      selectLabelBill: '支出',
      billList: [],
      loadingVisible: false
    };
  },
  computed: {
    format() {
      let currentDate;
      const time = new Date();
      // 年
      const Y = time.getFullYear();
      // 月
      const M = time.getMonth() + 1;
      // 日
      const D = time.getDate();
      currentDate = `${Y} 年 ${M > 10 ? M : '0' + M} 月 ${
        D > 10 ? D : '0' + D
      } 号`;
      return currentDate;
    }
  },
  created() {
    this.getBillList({
        pageNum: 1,
        pageSize: 10,
        date: '2023-09'
      });
  },
  methods: {
    async handleTest() {
      const res = await test();
      console.log(res);
    },
    /**
     * @description: 新增账单请求
     * @return {*} 无返回值
     */
    async addBill() {
      try {
        const { data } = await addBill(this.params);
        if (data && data.code === 0) {
          this.$toast('新增账单成功');
          this.params.remark = '';
          this.params.amount = null;
          this.getBillList(this.queryParams);
        } else {
          this.$toast(data.message);
        }
      } catch (error) {
        console.log(error.response, '请求错误');
      }
    },
    async getBillList(params) {
      // params.date = uni.$u.timeFormat(this.timestamp, 'yyyy-mm-dd');
      try {
        const { data } = await getBillList(params);
        if (data && data.code === 0) {
          this.billList = data.data;
        } else {
          this.$toast(data.message);
        }
      } catch (error) {
        console.log(error.response, '请求错误');
      }
    },
    change(type) {
      console.log(type);
    },
    placeholderComput(type) {
      return type === 'remark' ? '写点备注' : '金额';
    },
    confirm(e, type) {
      console.log(e, type);
      switch (type) {
        case 'pay':
          this.params.payType = e.value[0].value;
          this.selectLabelPay = e.value[0].label;
          this.payShow = false;
          break;
        case 'bill':
          this.params.billType = e.value[0].value;
          this.selectLabelBill = e.value[0].label;
          this.billShow = false;
          break;
        default:
          break;
      }
    },
    typeComputed(type) {
      let label;
      switch (type) {
        case 'payType':
          label = this.payTypes[0].filter(
            (item) => item.value === this.params[type]
          )[0].label;
          break;
        case 'billType':
          label = this.billTypes[0].filter(
            (item) => item.value === this.params[type]
          )[0].label;
          break;
        default:
          break;
      }
      this.selectLabel = label;
      // return label;
    },

    /**
     * @description: 新增账单
     */
    handleAddBill() {
      // this.loadingVisible = true;
      // setTimeout(() => {
      //   this.loadingVisible = false;
      // }, 10000);
      // return;
      const { remark, payType, billType, amount } = this.params;
      const params = [remark, payType, billType, amount];
      if (params.includes('')) {
        this.$toast('金额或备注信息不能为空');
        return;
      }
      this.params.payType = billType === 0 ? 4 : payType;
      this.addBill();
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
            font-size: 48rpx;
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
    .record {
      border-radius: 20rpx;
      // background-color: #dadadac3;
      // height: 300px;
      font-size: 28rpx;
      padding: 8rpx;
      // padding-bottom: 20rpx;
      box-shadow: 0 0 30px 0 rgba(95, 109, 130, 0.4);
      .record-box {
        border: 4rpx solid;
        border-radius: 20rpx;
        padding-bottom: 20rpx;
      }
      .record-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 60rpx;
        padding: 0 40rpx;
        .record-ele {
          .select-box {
            display: flex;
            align-items: center;
            > i {
              display: inline-block;
              border: 4rpx solid #000;
              width: 14rpx;
              height: 14rpx;
              border-bottom: 0;
              border-left: 0;
              transform: rotate(45deg);
              margin-left: 20rpx;
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
.hidden {
  display: none;
}
/deep/.u-input__content {
  input {
    text-align: right !important;
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
