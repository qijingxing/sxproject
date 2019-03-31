Page({

  /**
   * 页面的初始数据
   */
  data: {
    postList: [],
    pic_array: [],
    hx_index: 0,
    id: '',
    groupId: 0,
    topNum: 0,
    query: '',
    smallId: 0
  },
  bindPickerChange_hx: function(e) {
    var that = this;
    var inputid = that.data.id;
    var groupId = this.data.pic_array[e.detail.value].smallId ;
    that.setData({
      groupId: groupId
    })
    this.getfiledata(inputid, groupId);
    this.setData({ //给变量赋值
      hx_index: e.detail.value, //每次选择了下拉列表的内容同时修改下标然后修改显示的内容，显示的内容和选择的内容一致
    })
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
        if (res.data.error_code == 0){
            var groupList = res.data.result;
            that.setData({
            pic_array: groupList
            })
        }
        else if (res.data.error_code == 2007) {
            wx.showModal({
                title: '提示',
                content: '登录超时，请重新登录'
            })
            wx.redirectTo({
                url: '../login/login',
            })
        }
        else{
            wx.showModal({
                title: '提示',
                content: res.data.message
            })
        }
      },
      fail:function(res){
          wx.showModal({
              title: '提示',
              content: '网络请求错误'
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
  // onDel: function(e) {
  //   let id = e.currentTarget.dataset.id
  //   const db = wx.cloud.database();
  //   db.collection("books").doc(id).remove({
  //     success: res => {
  //       wx.showToast({
  //         title: '删除成功',
  //       })
  //       this.onLoad() //删除成功重新加载
  //     },
  //     fail: err => {
  //       wx.showToast({
  //         title: '删除失败',
  //       })
  //     }
  //   })
  // },
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

        if (list.length !=0 ) {
            that.setData({
                postList: list
            })
        } else {
            that.setData({
                postList: list
            })
            wx.showToast({
                title: '暂无数据',
                duration: 2000
            })
        }
      }
    })

  },
  // 获取滚动条当前位置
  onPageScroll: function(e) {
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