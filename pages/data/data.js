Page({

  /**
   * 页面的初始数据
   */
  data: {
    postList: [{
        id: 1,
        nameCn: '1区',
        teleNo: '123',
        cid: '123'
      },
      {
        id: 2,
        nameCn: '2区',
        teleNo: '123',
        cid: '123'
      },
      {
        id: 3,
        nameCn: '3区',
        teleNo: '123',
        cid: '123'
      },
      {
        id: 4,
        nameCn: '4区',
        teleNo: '123',
        cid: '123'
      },
      {
        id: 5,
        nameCn: '6区',
        teleNo: '123',
        cid: '123'
      },
      {
        id: 6,
        nameCn: '5区',
        teleNo: '123',
        cid: '123'
      },
    ],
    pic_array: [{
        id: 13,
        name: '一区'
      },
      {
        id: 14,
        name: '二区'
      },
      {
        id: 15,
        name: '三区'
      },
      {
        id: 16,
        name: '四区'
      },
      {
        id: 17,
        name: '五区'
      },
      {
        id: 18,
        name: '六区'
      },
      {
        id: 19,
        name: '七区'
      },
      {
        id: 20,
        name: '八区'
      },
    ],
    hx_index: 0,
    id: '',
    groupId: 0,
    topNum: 0,
    query: '',
    smallId: 0
  },
  bindPickerChange_hx: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    var that = this;
    var inputid = that.data.id;
    var groupId = this.data.pic_array[e.detail.value].smallId ;
    console.log('groupId为', groupId);
    console.log('inputcid为', that.data.id);
    that.setData({
      groupId: groupId
    })
    this.getfiledata(inputid, groupId);
    this.setData({ //给变量赋值
      hx_index: e.detail.value, //每次选择了下拉列表的内容同时修改下标然后修改显示的内容，显示的内容和选择的内容一致
    })
    console.log('自定义值:', this.data.hx_select);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var id = 1
    this.getfiledata("", 0);
    wx.request({
      method: "GET",
      url: 'https://www.gdfwxt.com/api/gdfwxt/small_class/list', //仅为示例，并非真实的接口地址
      data: {
        user_id: wx.getStorageSync('user_id'),
        access_token: wx.getStorageSync('access_token')
      },
      header: {
        "Content-Type": "no-cache",
        "ClientId": "wechat_small_code"
      },
      success: function(res) {
        var groupList = res.data.result;
        that.setData({
          pic_array: groupList
        })
      }

    })

  },
  onShow: function() {
   
  },
  goSet: function() {
    wx.navigateTo({
      url: '../set/set',
    })

  },
  onDel: function(e) {
    let id = e.currentTarget.dataset.id
    const db = wx.cloud.database();
    db.collection("books").doc(id).remove({
      success: res => {
        wx.showToast({
          title: '删除成功',
        })
        this.onLoad() //删除成功重新加载
      },
      fail: err => {
        wx.showToast({
          title: '删除失败',
        })
      }
    })
    console.log(id)
  },
  onUpdate: function(e) {
    let cid = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../set/set?cid=' + cid,
    })
  },
  onBindBlur: function(event) {
    var that = this;
    var id = event.detail.value;
    that.setData({
      id: id
    })
    var groupId = that.data.groupId == undefined ? 0 : that.data.groupId;
    console.log("groupId------------------------------", groupId);
    this.getfiledata(id, groupId);
  },
  getfiledata: function(id, groupId) {
    id == undefined ? '' : id;
    groupId == undefined ? '' : groupId;
    var that = this;
    wx.request({
      method: "GET",
      url: 'https://www.gdfwxt.com/api/gdfwxt/small_class/get', //仅为示例，并非真实的接口地址
      data: {
        query: id,
        smallId: groupId,
        user_id: wx.getStorageSync('user_id'),
        access_token: wx.getStorageSync('access_token')
      },
      header: {
        "Content-Type": "no-cache",
        "ClientId": "wechat_small_code"
      },
      success: function(res) {
        var list = res.data.result.userList;
        if (list == null) {
          wx.showToast({
            title: 'meiyoushiju',
            duration: 2000
          })
        } else {
          that.setData({
            postList: list
          })
        }
      }

    })

  },
  // 获取滚动条当前位置
  onPageScroll: function(e) {
    console.log(e)
    if (e.scrollTop > 100) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },

  //回到顶部
  goTop: function(e) { // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  }

})