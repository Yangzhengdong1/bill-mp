<script>
import { getLocalToken } from "@/utils/util";

export default {
  created() {
    // #ifdef H5
    this.iOSTouchMoveDisabled();
    // #endif
  },
  onLaunch: function () {},
  onShow: function () {
    if (!getLocalToken()) {
      // uni.navigateTo({
      //   url: "/pages/login/login"
      // });
    }
  },
  onHide: function () {},
  methods: {
    /**
     * @description: 解决 ios 浏览器中上拉下拉出现空白的问题
     */
    iOSTouchMoveDisabled() {
      document.body.addEventListener(
        "touchmove",
        (e) => {
          if (e._isScroller) {
            return;
          }
          e.preventDefault();
        },
        {
          passive: false
        }
      );
    }
  }
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  // box-sizing: border-box;
}
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import "uview-ui/index.scss";
@import url("./static/styles/common.scss");
</style>
