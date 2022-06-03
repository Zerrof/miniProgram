const baseurl = "http://console.gshnzhly.com/api";
const baseRequest = function (Parma) {
    return new Promise((resolve, reject) => {
        let token = uni.getStorageSync("access_token")
            ? "?access_token=" + uni.getStorageSync("access_token")
            : "";
        uni.request({
            url: baseurl + Parma.url + token,
            method: Parma.method || "GET",
            data: Parma.data || {},
            header: Parma.header || {},
            timeout: 150000,
            success: (res) => {
                if (res.statusCode === 401) {
                    uni.removeStorageSync("access_token");
                    uni.showToast({
                        title: "登录失效，请重新登录",
                        icon: "none",
                        mask: true,
                        duration: 2000,
                        success() {
                            setTimeout(() => {
                                uni.redirectTo({
                                    url: "../login/login",
                                    fail(err) {
                                        console.log(err);
                                    },
                                });
                            }, 1000);
                        },
                    });
                } else if(res.statusCode === 200) {
                    resolve(res.data);
                }else{
					
				}
            },
            fail: (err) => {
                uni.showToast({
                    title: err.errMsg.includes("timeout")
                        ? "请求超时"
                        : "请求失败",
                    icon: "none",
                    mask: true,
                    duration: 2000,
                });
                // TODO:错误处理
                reject(err);
            },
        });
    });
};
export default {
    name: "request",
    get: function (Parma) {
        return baseRequest({
            method: "GET",
            ...Parma,
        });
    },
    post: function (Parma) {
        return baseRequest({
            method: "POST",
            // header: {
            // 	'content-type': 'application/x-www-form-urlencoded',
            // },
            ...Parma,
        });
    },
    //最好使用post/gets,其他的支付宝小程序会不支持!!!
    put: function (Parma) {
        return baseRequest({
            method: "PUT",
            // header: {
            // 	'content-type': 'application/x-www-form-urlencoded',
            // },
            ...Parma,
        });
    },
    delete: function (Parma) {
        return baseRequest({
            method: "DELETE",
            // header: {
            // 	'content-type': 'application/x-www-form-urlencoded',
            // },
            ...Parma,
        });
    },
};
