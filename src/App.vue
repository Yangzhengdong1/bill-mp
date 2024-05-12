<script>
import { getLocalToken } from "@/utils/util";

export default {
  onLaunch: function () {
  },
  onShow: function () {
    if (!getLocalToken()) {
      // uni.navigateTo({
      //   url: "/pages/login/login"
      // });
    }
  },
  onHide: function () {
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
@import 'uview-ui/index.scss';
@import url('./static/styles/common.scss');
</style>
