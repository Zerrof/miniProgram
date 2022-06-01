/*
 * @Description: 获取小程序设备信息、版本并更新
 * @use: 
 * 	// import system from '@tool/system'
	// onLaunch: function () {
	// 	system.systemInfo((info) => {
	// 		console.log('设备信息：', info)
	// 	  })
	// }
 * @Author: z
 * @Date: 2022-06-01 14:02:34
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-06-01 15:30:39
 */

const system = {
    // 获取小程序设备信息
    systemInfo: function(success, fail = undefined) {
        // 设备信息
        const info = {
            // 系统设备信息原对象
            info: {},
            // 是否为iOS
            isIOS: false,
            // 是否为iphoneX XR XS...等iOS系统全面屏手机
            isIphoneX: false,
            // 是否为安卓
            isAndroid: false,
            // 是否为Mac
            isMac: false,
            // 是否为Windows
            isWindows: false,
            // 设备像素比 (px 与 rpx 的转换比例, 公式：px * pixelRatio = rpx)
            pixelRatio: 1,
            // 屏幕宽度
            screenWidth: 0,
            screenWidthRPX: 0,
            // 屏幕高度
            screenHeight: 0,
            screenHeightRPX: 0,
            // 状态栏高度
            statusBarHeight: 0,
            statusBarHeightRPX: 0,
            // 导航栏高度(不包括状态栏，单纯的导航栏高度)
            navigationBarHeight: 0,
            navigationBarHeightRPX: 0,
            // 导航栏高度(包括状态栏，整个导航栏高度)
            navigationHeight: 0,
            navigationHeightRPX: 0,
            // 底部TabBar菜单栏高度
            tabBarHeight: 0,
            tabBarHeightRPX: 0,
        };

        // 加载系统信息进行更换
        wx.getSystemInfo({
            // 获取成功
            success: (res) => {
                // 右上角菜单胶囊范围
                let menuButtonRect = wx.getMenuButtonBoundingClientRect();

                // 状态栏默认高度
                const statusBarHeight = 20;
                // 导航栏默认高度
                const navigationBarHeight = 44;
                // TabBar默认高度
                const tabBarHeight = 48;

                // 记录原始数据
                info.info = res;

                // 是否为iOS
                info.isIOS = res.system.indexOf("iOS") !== -1;
                // 是否为iOS系统全面屏手机
                if (info.isIOS) {
                    // 如果为 iOS 且安全区域上面超过 默认状态栏高度 则为 X 系列
                    info.isIphoneX = res.safeArea.top > statusBarHeight;
                }

                // 是否为安卓
                info.isAndroid = res.system.indexOf("Android") !== -1;

                // 是否为Mac
                info.isMac = res.system.indexOf("macOS") !== -1;

                // 是否为Windows
                info.isWindows = res.system.indexOf("Windows") !== -1;

                // 设备像素比(750 / 屏幕宽度)
                // 系统给成的 res.pixelRatio 值不对，所以使用自己换算出来的比例
                info.pixelRatio = 750 / res.windowWidth;

                // 屏幕宽度
                info.screenWidth = res.screenWidth;
                // 屏幕宽度 - RPX
                info.screenWidthRPX = info.screenWidth * info.pixelRatio;

                // 屏幕高度
                info.screenHeight = res.screenHeight;
                // 屏幕高度 - RPX
                info.screenHeightRPX = info.screenHeight * info.pixelRatio;

                // 状态栏高度
                info.statusBarHeight = Math.max(
                    res.statusBarHeight,
                    statusBarHeight
                );
                // 状态栏高度 - RPX
                info.statusBarHeightRPX =
                    info.statusBarHeight * info.pixelRatio;

                // 导航栏高度
                const menuBarHeight =
                    (menuButtonRect.top - info.statusBarHeight) * 2 +
                    menuButtonRect.height;
                info.navigationBarHeight = Math.max(
                    menuBarHeight,
                    navigationBarHeight
                );
                // 导航栏高度 - 如果为奇数则转成偶数
                if (info.navigationBarHeight % 2) {
                    info.navigationBarHeight += 1;
                }
                // 导航栏高度 - RPX
                info.navigationBarHeightRPX =
                    info.navigationBarHeight * info.pixelRatio;

                // 导航栏高度
                info.navigationHeight =
                    info.statusBarHeight + info.navigationBarHeight;
                // 导航栏高度 - RPX
                info.navigationHeightRPX =
                    info.navigationHeight * info.pixelRatio;

                // 底部TabBar菜单栏高度
                info.tabBarHeight = Math.max(
                    info.screenHeight -
                        info.navigationHeight -
                        res.windowHeight,
                    tabBarHeight
                );
                // 底部TabBar菜单栏高度 - 如果为奇数则转成偶数
                if (info.tabBarHeight % 2) {
                    info.tabBarHeight += 1;
                }
                // 底部TabBar菜单栏高度 - RPX
                info.tabBarHeightRPX = info.tabBarHeight * info.pixelRatio;
                // 返回
                if (success) {
                    success(info);
                }
            },
            // 获取失败
            fail: (err) => {
                if (fail) {
                    fail(err);
                }
            },
        });
    },
    // 检查小程序版本并更新
    updateManager: function(success = undefined, fail = undefined) {
        // 检查是否支持版本更新
        if (wx.canIUse("getUpdateManager")) {
            // 获取版本更新对象
            var updateManager = wx.getUpdateManager();
            // 检测是否有新版本
            updateManager.onCheckForUpdate((res) => {
                // 有新版本
                if (res.hasUpdate) {
                    // 更新成功回调
                    updateManager.onUpdateReady((res) => {
                        // 有回调实现
                        if (success) {
                            // 自己写提示，返回版本更新对象，方便外部使用
                            success(updateManager, res);
                        } else {
                            // 使用内部更新提示
                            wx.showModal({
                                title: "更新提示",
                                content: "新版本已经准备好，是否重启应用？",
                                success: (res) => {
                                    // 确定重启，在 onUpdateReady 回调中使用 applyUpdate 强制小程序重启使用新版本。
                                    if (res.confirm) {
                                        updateManager.applyUpdate();
                                    }
                                },
                            });
                        }
                    });
                    // 更新失败回调
                    updateManager.onUpdateFailed((err) => {
                        // 有回调实现
                        if (fail) {
                            // 自己写提示
                            fail(err);
                        } else {
                            // 使用内部更新提示
                            wx.showModal({
                                title: "更新提示",
                                content: "新版本下载失败，请检查网络！",
                                showCancel: false,
                            });
                        }
                    });
                } else {
                    // 无新版本
                }
            });
        }
    },
};
// 导出使用 
export default system;
