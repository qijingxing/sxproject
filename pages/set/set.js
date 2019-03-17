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
            //id: setdata.id,
            //nameCn: setdata.nameCn,
            //cid: setdata.cid
            filedata: setdata
          });
        }
      }
    })
  },
  comfirm: function (e) {
    const db = wx.cloud.database()//打开数据库连接
    let book = e.detail.value
    if (book.id == "") {//id等于空是新增数据
      this.add(db, book)  //新增记录
    } else {
      this.update(db, book)  //修改记录
    }
  }, add: function (db, book) {
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

  }, update: function (db, book) {
    db.collection("books").doc(book.id).update({
      data: {
        name: book.name,
        author: book.author,
        price: parseFloat(book.price)
      }, success: res => {
        wx.showToast({
          title: '修改记录成功',
        })
        wx.navigateTo({
          url: '../index/index',
        })
      }, fail: err => {
        wx.showToast({
          title: '修改失败',
        })
      }
    })
  }

})
