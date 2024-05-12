export const getLocalToken = () => {
  const token = uni.getStorageSync("user_message").token;
  return token ? token : false;
};

