<template>
  <div class="bill-list">
    <scroll-view scroll-y class="scroll-Y">
      <u-swipe-action>
        <u-swipe-action-item
          v-for="item in billList"
          :options="options"
          :key="item.wid"
          :name="item.wid"
          @click="swipeItemClick"
          ref="uSwipeActionItem"
        >
          <div class="bill-item" @touchend="billItemClick(item.wid)">
            <div class="remark-date">
              <p>{{ item.remark }}</p>
            </div>
            <div
              class="money"
              :style="{ color: item.type === 1 ? '#42cac4' : '#ff6e81' }"
            >
              {{ item.amount }}
            </div>
          </div>
        </u-swipe-action-item>
      </u-swipe-action>
      <div class="bottom-ele bill-item"></div>
    </scroll-view>
  </div>
</template>

<script>
export default {
  props: {
    billList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      options: [{ text: "删除", style: { backgroundColor: "red" } }]
    };
  },
  methods: {
    /**
     * @description: 删除按钮触发
     * @param {*} options {index, name}
     */
    swipeItemClick(options) {
      const { name: id } = options;
      this.$emit("swipeItemClick", id);
    },

    /**
     * @description: 账单 item 触发
     * @param {*} wid 账单id
     */
    billItemClick(wid) {
      const statusList = this.$refs.uSwipeActionItem.map((item) => item.status);
      if (statusList.some((item) => item === "open")) {
        return;
      }
      this.$emit("billItemClick", wid);
    }
  },
  options: {
    styleIsolation: "shared"
  }
};
</script>

<style lang="scss" scoped>
.bill-list {
  // max-height: 400rpx;
  padding: 40rpx 0;
  box-sizing: border-box;
  overflow: hidden;
  .scroll-Y {
    height: 500rpx;
  }
  /deep/ .u-swipe-action-item {
    margin-bottom: 30rpx;
    border-radius: 20rpx;
    overflow: hidden;
    .u-swipe-action-item__right__button__wrapper__text {
      font-size: 28rpx !important;
    }
    .u-swipe-action-item__right {
      border-radius: 0px 26rpx 26rpx 0px;
      overflow: hidden;
    }
  }
  .bill-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30rpx;
    width: 100%;
    height: 100rpx;
    background-color: #efefef;
    box-sizing: border-box;
    // &:last-child {
    //   margin-bottom: 0;
    // }
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
    height: 60rpx;
    background-color: transparent;
  }
}
.income-color {
  color: #ff6e81;
}
.disbursement-color {
  color: #42cac4;
}
</style>
