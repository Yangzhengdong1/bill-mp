<template>
  <div class="bill-popup">
    <u-popup
      :show="submitPopupVisible"
      @close="close"
      mode="center"
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
        :text="billParams.wid ? '更新' : '保存'"
        iconColor="#42cac4"
        :customStyle="btnStyle"
        @click="submit"
      ></u-button>
    </u-popup>
  </div>
</template>

<script>
import { payTypes, billTypes, sources } from "@/utils/constants";

const btnStyle = {
  border: 0,
  width: "200rpx",
  "border-radius": "20rpx",
  // background: "linear-gradient(45deg, #42cac4, #ff6e81)",
  background: "rgb(0,139,139)",
  "margin-top": "40rpx"
};
export default {
  props: {
    submitPopupVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      btnStyle,
      billTypes,
      billParams: {
        payType: 1,
        billType: 1,
        amount: null,
        remark: ""
      }
    };
  },
  computed: {
    list() {
      return this.billParams.billType === 0 ? sources : payTypes;
    }
  },
  methods: {
    initData() {
      this.billParams = {
        payType: 1,
        billType: 1,
        amount: null,
        remark: ""
      };
    },
    billGroupChange() {
      this.$nextTick(() => {
        this.billParams.payType = this.billParams.billType === 0 ? 4 : 1;
      });
    },
    submit() {
      if (!this.billParams.amount || !this.billParams.remark) {
        this.$toast("请输入金额或备注");
        return;
      }
      if (!this.billParams.wid) {
        delete this.billParams.wid;
      }
      this.$emit("submit", this.billParams);
    },
    close() {
      this.$emit("close");
    }
  },
  options: {
    styleIsolation: "shared"
  }
};
</script>

<style lang="scss" scoped>
.bill-popup {
  /deep/ .u-popup__content {
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
