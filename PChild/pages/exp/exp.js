// pages/exp/exp.js
Page({
  data: {
    index:-1,
    list: [
      { id: "ZTO", name: "中通快递", icon: "img/ZTO.png" },
      { id: "YTO", name: "圆通快递", icon: "img/YTO.png" },
      { id: "YD", name: "韵达快递", icon: "img/YD.png" },
      { id: "HTKY", name: "百世快递", icon: "img/HTKY.png" },
      { id: "STO", name: "申通快递", icon: "img/STO.png" },
      { id: "EMS", name: "EMS", icon: "img/EMS.png" },
      { id: "HHTT", name: "天天快递", icon: "img/HHTT.png" },
      { id: "JD", name: "京东物流", icon: "img/JD.png" },
      { id: "SF", name: "顺丰速运", icon: "img/SF.png" },
      { id: "UC", name: "优速快递", icon: "img/UC.png" },
      { id: "DBL", name: "德邦快递", icon: "img/DBL.png" },
      { id: "FAST", name: "快捷快递", icon: "img/FAST.png" },
      { id: "ZJS", name: "宅急送", icon: "img/ZJS.png" },
      { id: "TNT", name: "TNT快递", icon: "img/TNT.jpg" },
      { id: "UPS", name: "UPS", icon: "img/ups.png" },
      { id: "DHL", name: "DHL", icon: "img/DHL.png" },
      { id: "FEDEX", name: "FEDEX联邦(国内件)", icon: "img/FEDEX.png" },
      { id: "FEDEX_GJ", name: "FEDEX联邦(国际件)", icon: "img/FEDEX.png" }]
  },

  // 获取快递单号的快递轨迹信息
  getExpressInfo:function(arg){
    // 1.保存当前的页面对象
    var that=this;
    // 2.获得快递单号，做验证
    console.log(arg.detail.value.numcode);
    var mynum=arg.detail.value.numcode;
    // 验证数据有效性
    if(mynum.trim()==""){
      wx.showModal({
        title: '温馨提示',
        content: '请填写正确的快递单号',
      });
      return;
    }

    // 根据快递单号获得快递公司的编号
  wx.showLoading({
    title: '请稍等……',
  })

  var expressid = "";//存储快递公司的编号
  wx.request({
    url: 'https://www.itlaobing.com/api/express/distinguish',
    method: "post",
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },

    dataType: "json",
    data: { num: mynum },

    success:function(res){
      console.log(res);
      console.log(res.data.data.Shippers[0]);
      if (res.data.data.Shippers != undefined && res.data.data.Shippers.length != 0){
        //保存快递公司的编号
        expressid = res.data.data.Shippers[0].ShipperCode
        //获得快递轨迹信息
        that.getInfo(mynum, expressid);
        //根据快递公司的编号，显示对应的logo
        that.setLogo(expressid);
      }
      else{
        wx.showModal({
          title: '温馨提示',
          content: '请检查快递单号是否正确',
        })
      }
    },
      complete: function () {
        wx.hideLoading();
      }
    })
  },

/**
  * 获得快递轨迹信息
  * mynum:快递单号
  * mycom:快递公司的编号
*/
getInfo:function(mynum,mycom){
  var that=this;
  wx.request({
    url: 'https://www.itlaobing.com/express/api',
    dataType:"json",
    method:"post",
    header:{
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data:{
      nu:mynum,
      com:mycom
    },
    success:function(rec){
      //console.log(rec);
      if(rec.data.Traces==undefined||rec.data.Traces.length==0){
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
      else{
        that.setData(
          {
            mytraces:rec.data.Traces
          }
        );
      }
    },
    fail:function(rec){
      wx.showModal({
        title: '温馨提示',
        content: '请求服务失败',
      })
    },
    complete:function(rec){
      wx.hideLoading();
    }
  })
},

/**
  * 根据快递公司的编号，显示对应的logo
  * mycom:快递公司的编号
*/
setLogo:function(mycom){
  var mylist = this.data.list;
  var len = mylist.length;
  for (var i = 0; i < len; i++) {
    //找到快递公司编号信息
    if (mycom == mylist[i].id) {
      this.setData({ index: i });
    }
  }
},

/**
   * 扫描快递单号
   */
getScan:function(arg){
  var that = this;
  wx.scanCode({
    success: function (res) {
      //console.log(res.result);
      that.setData({
        num: res.result
      });
    }
  })
}

})