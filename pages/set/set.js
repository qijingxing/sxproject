Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    nameCn: '',
    cid: '',
    filedata: {},
    pic_array: [{
        id: 1,
        name: '是'
      },
      {
        id: 2,
        name: '否'
      }
    ],
    pay_array: ['微信', '支付宝', '电e宝', '现金', '其他'],
    accid:''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      id: options.cid
    });
    if (options.cid == '') {
      return;
    }
    wx.request({
      url: "https://www.gdfwxt.com/api/gdfwxt/small_class/get",
      data: {
        query: options.cid,
        smallId: 0,
        user_id: wx.getStorageSync('user_id'),
        access_token: wx.getStorageSync('access_token')
      },
      header: {
        "Content-Type": "no-cache",
        "ClientId": "wechat_small_code"
      },
      method: 'GET',
      success: function(res) {
        var setdata = res.data.result.userList[0];
        that.accid = setdata.accid;
        if (setdata == undefined) {
          var toastText = '获取数据失败' + res.data.errMsg;
          wx.showToast({
            title: toastText,
            icon: '',
            duration: 2000
          });
        } else {
          var payindex = 0;
          if (setdata.payment == '微信') {
            payindex = 0;
          } else if (setdata.payment == '支付宝') {
            payindex = 1;
          } else if (setdata.payment == '电e宝') {
            payindex = 2;
          } else if (setdata.payment == '现金') {
            payindex = 3;
          } else if (setdata.payment == '其他') {
            payindex = 4;
          }
          that.setData({
            filedata: setdata,
            isjoinhx_index: setdata.isJoin == '是' ? 0 : 1,
            teleConnhx_index: setdata.teleConn == '是' ? 0 : 1,
            teleTruehx_index: setdata.teleTrue == '是' ? 0 : 1,
            joinWechathx_index: setdata.joinWechat == '是' ? 0 : 1,
            paymentth_index: payindex

          });
        }
      }
    })
  },
  comfirm: function(e) {
    //const db = wx.cloud.database()//打开数据库连接
    let filedatainfo = e.detail.value

    if (filedatainfo.id == "") { //id等于空是新增数据
      this.add(filedatainfo) //新增记录
    } else {
      this.update(filedatainfo) //修改记录
    }
  },
  // add: function(filedatainfo) {
  //   db.collection("books").add({
  //     data: {
  //       name: book.name,
  //       author: book.author,
  //       price: parseFloat(book.price)
  //     },
  //     success: res => {
  //       wx.showToast({
  //         title: '新增记录成功',
  //       })
  //       wx.navigateTo({
  //         url: '../index/index',
  //       })
  //     },
  //     fail: err => {
  //       wx.showToast({
  //         title: '新增失败',
  //       })
  //     }
  //   })

  // },
  update: function(filedatainfo) {
    //-------------------------------------------------
    var that = this;
    wx.request({
      url: "https://www.gdfwxt.com/api/gdfwxt/user_data/post",
      data: {
        comment: filedatainfo.comment,
        accid: this.accid,
        completeStatus: 1,
        fourTeleKnow: filedatainfo.fourTeleKnow,
        id: filedatainfo.id,
        isJoin: filedatainfo.isJoin,
        isJoinCause: filedatainfo.isJoinCause,
        joinWechat: filedatainfo.joinWechat,
        nameCn: filedatainfo.nameCn,
        payment: filedatainfo.payment,
        teleConn: filedatainfo.teleConn,
        teleNo: filedatainfo.teleNo,
        teleTrue: filedatainfo.teleTrue,
        access_token: wx.getStorageSync('access_token'),
        user_id: wx.getStorageSync('user_id'),
      },
      //data: JSON.stringify(filedatainfo),
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'ClientId': 'wechat_small_code'
      },
      success: function(res) {
        var result = res.data.error_code;
        var toastText = "操作成功！";
        if (result != 0) {
          toastText = "操作失败" + res.data.errMsg;
        }
        wx.showToast({
          title: toastText,
          icon: '',
          duration: 2000
        });
        if (result == 0) {
          wx.navigateBack({
            url: '../data/data',
          })
        }
      }
    })
    //------------------------------------------------------
  },
  bindPickerChange_hx: function(e) {
    var that = this;
    var inputid = that.data.id;
    var groupId = this.data.pic_array[e.detail.value].id;
    that.setData({
      groupId: groupId
    })
    this.setData({ //给变量赋值
      hx_index: e.detail.value, //每次选择了下拉列表的内容同时修改下标然后修改显示的内容，显示的内容和选择的内容一致
    })
  },
  bindPickerChange_isJoin: function(e) {
    var that = this;
    this.setData({ //给变量赋值
      isjoinhx_index: e.detail.value, //每次选择了下拉列表的内容同时修改下标然后修改显示的内容，显示的内容和选择的内容一致
    })
  },
  bindPickerChange_teleConn: function(e) {
    var that = this;
    this.setData({ //给变量赋值
      teleConnhx_index: e.detail.value, //每次选择了下拉列表的内容同时修改下标然后修改显示的内容，显示的内容和选择的内容一致
    })
  },
  bindPickerChange_teleTrue: function(e) {
    var that = this;
    this.setData({ //给变量赋值
      teleTruehx_index: e.detail.value, //每次选择了下拉列表的内容同时修改下标然后修改显示的内容，显示的内容和选择的内容一致
    })
  },
  bindPickerChange_joinWechat: function(e) {
    var that = this;
    this.setData({ //给变量赋值
      joinWechathx_index: e.detail.value, //每次选择了下拉列表的内容同时修改下标然后修改显示的内容，显示的内容和选择的内容一致
    })
  },
  bindPickerChange_payment(e) {
    this.setData({
      paymentth_index: e.detail.value
    })
  }

})