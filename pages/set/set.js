Page({

  /**
   * 页面的初始数据
   */
  data: {
    id :undefined,
    nameCn:'',
    cid:'',
    filedata:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      id: options.id
    });
    if (options.id == undefined) {
      return;
    }
    wx.request({
      url: "http://localhost:8080/filedataSelectById",
      data: { "id": options.id },
      method: 'GET',
      success: function (res) {
        var setdata = res.data;
        if (setdata == undefined) {
          var toastText = '获取数据失败' + res.data.errMsg;
          wx.showToast({
            title: toastText,
            icon: '',
            duration: 2000
          });
        } else {
          that.setData({
            filedata: setdata
          });
        }
      }
    })
  },
  comfirm: function (e) {
    //const db = wx.cloud.database()//打开数据库连接
    let filedatainfo = e.detail.value
    
    if (filedatainfo.id == "") {//id等于空是新增数据
      this.add(filedatainfo)  //新增记录
    } else {
      this.update(filedatainfo)  //修改记录
    }
  }, add: function ( filedatainfo) {
    db.collection("books").add({
      data: {
        name: book.name,
        author: book.author,
        price: parseFloat(book.price)
      }, success: res => {
        wx.showToast({
          title: '新增记录成功',
        })
        wx.navigateTo({
          url: '../index/index',
        })
      }, fail: err => {
        wx.showToast({
          title: '新增失败',
        })
      }
    })

  }, update: function (filedatainfo) {
    //-------------------------------------------------
    var that = this;
    wx.request({
      url: "http://localhost:8080/updateFileDataSelectById",
      //data: { fileData: filedatainfo},
       data:  JSON.stringify(filedatainfo),
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        var result = res.data;
        var toastText = "操作成功！";
        if (result <= 0) {
          toastText = "操作失败" + res.data.errMsg;
        }
        wx.showToast({
          title: toastText,
          icon: '',
          duration: 2000
        });
        if (result > 0) {
          wx.redirectTo({
            url: '../data/data',
          })
        }
      }
    })
    //------------------------------------------------------
  }

})
