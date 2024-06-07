export const getLocalToken = () => {
  const token = uni.getStorageSync("user_message").token;
  return token ? token : false;
};

class Loading {
  constructor() {
  }
  show(title) {
    uni.showLoading({
      title: title || "加载中",
      mask: true
    });
  }

  hide() {
    uni.hideLoading();
  }
}
export const loading = new Loading();
