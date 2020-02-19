// pages/Ex/Ex.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "快递查询",
    index: 0,
    list: [
      { id: 0, name: "请选择快递公司" },
      { id: "ZT", name: "中通" },
      { id: "YT", name: "圆通" },
      { id: "ST", name: "申通" },
      { id: "YD", name: "韵达" },
      { id: "BS", name: "百世" },
      { id: "YZ", name: "邮政" },
      { id: "SF", name: "顺丰" },
      { id: "YS", name: "优速快递" },
      { id: "TT", name: "天天快递" },
      { id: "EMS", name: "EMS" },
      { id: "ZJS", name: "宅急送" },
      { id: "JD", name: "京东物流" },
      { id: "FEDEX", name: "FEDEX联邦(国内件)" },
      { id: "FEDEX_GJ", name: "FEDEX联邦(国际件)" },
      { id: "DB", name: "德邦快递" },
      { id: "TNT", name: "TNT快递" },
      { id: "UPS", name: "UPS" },
      { id: "DHL", name: "DHL" },
      { id: "FAST", name: "快捷快递" }
    ],
    express:0,
    num:"",
    mytraces:""
  },
  setSelect: function (e) {
    //1.先获得选中的下标值
    console.log(e);
    var selectExp = e.detail.value;
    console.log(selectExp);
    //2.把选中的下标值赋值给data里的index
    this.setData({
      index: selectExp,
      express: this.data.list[selectExp].id
    });
  },
  getScan:function(arg){
    var that=this;
    wx.scanCode({
      success:function(res){
        that.setData({
          num: res.result
        })
      }
    })
  },
  /**
     * 获取快递单号的快递轨迹信息
     */
  getExpressInfo: function (arg) {
    /**
     * 实现思路
     * 1.保存当前页面的对象this
     * 2.先获得快递单号及快递公司
     * 3.数据有效性的效验，不成功提示用户
     * 4.效验成功，提交数据
     * 5.提交数据的结果，不成功提示用户
     * 6.处理成功的数据，绑定页面上
     */
    //1.保存当前页面的对象this-----------------------
    var that = this;
    //2.先获得快递单号及快递公司----------------------
    //快递单号
    var mynum = arg.detail.value.numcode;
    console.log(mynum);
    //快递公司
    var myexpressid = this.data.express;

    //3.数据有效性的效验，不成功提示用户----------------
    //3.1判断快递单号是否为空
    if (mynum.trim() == "") {
      //提示用户
      wx.showModal({
        title: '温馨提示',
        content: '请输入快递单号',
      });
      return;
    }
    //3.2判断快递公司是否为空
    if (myexpressid == 0) {
      //提示用户
      wx.showModal({
        title: '温馨提示',
        content: '请选择快递公司',
      })
      return;
    }
    // 4.效验成功，提交数据
    // 4.1显示请稍等
    wx.showLoading({
      title: '请稍等......',
    })
    //4.2提交数据(关键)  ajax异步请求 
    wx.request({
      url: 'https://www.itlaobing.com/express/api',
      dataType: "json",
      data: {
        nu: mynum,
        com: myexpressid
      },
      //---处理返回的数据
      success: function (rec) {
        console.log(rec);
        //6.处理成功的数据，绑定页面上----
        //处理异常情况
        if (rec.data.Traces == undefined || rec.data.Traces.length == 0) {
          wx.showModal({
            title: '温馨提示',
            content: '没有查到快递轨迹信息',
          })
          that.setData(
            {
              mytraces: ""
            }
          );
        }
        else {
          that.setData(
            {
              mytraces: rec.data.Traces
            }
          );
        }
      },
      fail: function (rec) {
        wx.showModal({
          title: '温馨提示',
          content: '请求服务失败',
        })
      },
      complete: function (rec) {
        wx.hideLoading();
      }
    })
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})