// pages/login/login.js
var app = getApp()
var util = require('../../utils/util.js');
Page({
  data: {
    motto: 'Hello World',
    username: "",
    password: ""
  },
  onLoad(options) {
    // 初始化提示框
    
  },
  /** 监听帐号输入 */
  listenerUsernameInput: function (e) {
    this.data.username = e.detail.value;
  },
  /** 监听密码输入 */
  listenerPasswordInput: function (e) {
    this.data.password = e.detail.value;
  },
  // 登录按钮点击事件
  loginAction: function () {

    var userName = this.data.username;
    var passwords = this.data.password;
    var that = this;

    if (userName === "") {
      wx.showToast({
        duration: 1000,
        title: "用户名不能为空！",
        icon:'loading',
        success: () => console.log('用户名不能为空！')
      })
      return;
    } if (passwords === "") {
      wx.showToast({
       
        duration: 1000,
        title: "密码不能为空！",
        icon: 'loading',
        success: () => console.log('密码不能为空！')
      })
      return;
    }

    //加载提示框
    wx.showToast({
      duration: 1000,
      icon: 'loading',
      title: '登录中'
    });

    //var urlStr = app.globalData.BaseURL + '/api/adminUser/login';
    var urlStr ='http://localhost:8080/loginVerify';
    wx.request({
      method: "GET",
      url: urlStr, //仅为示例，并非真实的接口地址
      data: {
        username: userName,
        password: passwords
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        wx.hideToast();
        console.log(res.data);
        var code = res.data.code;
        if (code === 200) {

          // 后台传递过来的值
         // var adminUserViewId = res.data.data.adminUserViewId;
          //var token = res.data.data.token;
          // 设置全局变量的值
          //app.globalData.adminUserViewId = res.data.data.adminUserViewId;
          //app.globalData.token = res.data.data.token;
           //将token存储到本地
         // wx.setStorageSync('adminUserViewId', adminUserViewId);
          
          //wx.setStorageSync('token', token);
          //console.log("登录成功的adminUserViewId：" + adminUserViewId);
          //console.log("登录成功的token：" + token);
          // 切换到首页
          wx.redirectTo({
            url: '../data/data',
          });
        } else {
          wx.showToast({
            duration: 1000,
            title: res.data.msg,
            icon: 'loading',
            success: () => console.log('登录失败，请稍后重试。' + res.data.msg)
          })
        }
      },
      fail: function () {
        wx.hideToast();
        console.log("登录失败");
        wx.showToast({
          duration: 1000,
          icon: 'loading',
          title: '服务器君好累😫，请稍后重试',
          success: () => console.log('登录失败，请稍后重试。')
        })
      }
    })
  }
})