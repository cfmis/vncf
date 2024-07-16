var COMM = {
    openWindos:function(id){
        var url = "/Base/PublicQuery?window_id=" + id;//對應Controller
        this.showMessageDialog(url, "查詢", 800, 600, true); //1024 600
    }, 
    /*查找貨品編號窗口*
    * Allen
    */
    openFindItem:function(id){
        var url = "/Base/PublicItemQuery" ;
        this.showMessageDialog(url, "查詢", 800, 600, true); //1024 600
    }, 
    /*密碼確認窗口*
    * Allen
    */
    openPassword: function(user_id){
        var url = "/Base/Common/PasswordConfirm?user_id=" + user_id;
        this.showMessageDialog(url, "密碼確認", 500, 300, true);
    }, 
    showMessageDialog: function(url, title, width, height, shadow){ 
        var content = '<iframe src="' + url + '" width="100%" height="99%" frameborder="0" scrolling="no"></iframe>';       
        //content += '<a href="javascript:void(0)" class="easyui-linkbutton" iconcls="icon-cancel" style="width:80px" onclick="javascript:$(' + '\'#msgwindow\'' + ').dialog(' + '\'close\'' + ')">' + '关闭' + '</a>';
        var boarddiv = '<div id="msgwindow" title="' + title + '"></div>'//style="overflow:hidden;"可以去掉滚动条       
        $(document.body).append(boarddiv);
        var win = $('#msgwindow').dialog({
            content: content,
            width: width,
            height: height,
            modal: shadow,
            title: title,
            onClose: function () {
                //$(this).dialog('destroy');//后面可以关闭后的事件
                //document.getElementById('btnSerach').click();
            }
        });
        win.dialog('open');
    },
    closeWindow:function(){
        $('#msgwindow').dialog('close');
    },

    /*檢查輸入日期是否正確*
    * Allen
    */
    checkDate:function(strDate){
        var r =/^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/;
        if(!r.exec(strDate)){
            alert("日期格式不正確或者輸入有誤!\n\r【日期格式：YYYY-MM-DD 例如：2010-08-08,注意閏年】\n\r");
            return false;
        }
        else {
            return true;
        }
    },
	
	
  /**日期格式化
  *fmt 格式化字符如 'yyyy-MM-dd hh:mm:ss'
  *v   可以是日期或字符串
  */
  datetimeFormat: function(v, fmt) {
    if ((typeof v).toLocaleLowerCase() == 'string') { v = new Date(v.replace(/-/g, '/')) }
    var o = {
      'M+': v.getMonth() + 1, // 月份
      'd+': v.getDate(), // 日
      'h+': v.getHours(), // 小时
      'm+': v.getMinutes(), // 分
      's+': v.getSeconds(), // 秒
      'q+': Math.floor((v.getMonth() + 3) / 3), // 季度
      'S': v.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (v.getFullYear() + '').substr(4 - RegExp.$1.length)) }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return fmt
  },
  /*获取日期的星期 v=日期字符串或日期对象 返回值 0-6对应 周日-周六*/
  getWeek: function(v) {
    if ((typeof v).toLocaleLowerCase() == 'string') { v = new Date(v.replace(/-/g, '/')) }
    var end = v.getDay()
    return end
  },
  /**字符串转日期 v必须为 -格式 如 2020-05*/
  toDateTime: function(v) {
    if ((typeof v).toLocaleLowerCase() == 'string') { v = new Date(v.replace(/-/g, '/')) }
    return v
  },
  /**用于将数组进行name匹配 这里用作export2excel.js插件的智能字段识别导出*/
  formatJson: function(filterVal, jsonData) {
    return jsonData.map(v => filterVal.map(j => v[j]))
  },
  /**获取当前时间*/
  getCurrentDate:function() {
      const date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      month = month < 10 ? "0" + month : month; //月小于10，加0
      day = day < 10 ? "0" + day : day; //day小于10，加0
      return `${year}-${month}-${day}`;
  },
  /**獲取當前日期時間*/
  getCurrentDateTime: function() {
        //获取当前时间并打印
        var _this = this;
		var dateTime="";
    　　let yy = new Date().getFullYear();
    　　let mm = new Date().getMonth()+1;
    　　let dd = new Date().getDate();
    　　let hh = new Date().getHours();
    　　let mf = new Date().getMinutes()<10 ? '0'+new Date().getMinutes() : new Date().getMinutes();
    　　let ss = new Date().getSeconds()<10 ? '0'+new Date().getSeconds() : new Date().getSeconds();
    　　dateTime = yy+'-'+mm+'-'+dd+' '+hh+':'+mf+':'+ss;
    　　return (dateTime)
  },

  /**返回字符格式日期(yyyy-MM-dd)
  *參數date:須是日期格式對象;
  *參數addDays:天數增加幾天
  *例子:addDays=0則返當前日期; addDays=2返回前日期再加上兩天
  */
  getDate: function(date,addDays){    
     var year = date.getFullYear();
     var month = date.getMonth() + 1;
     var day = (addDays==0)?date.getDate():date.getDate() + addDays;
     month = month<10?'0'+ month:month;
     day = day<10?'0'+ day:day;
     return (year +'-'+ month +'-'+ day).toString();
  },

  /**返回yyy-MM-dd日期格式的對像
  *參數:strDate 為yyy-MM-dd字符串
  */
  getDateString:function (strDate) {
    var st = strDate;
    var a = st.split(" ");
    var b = a[0].split("-");    
    var date = new Date(b[0], b[1], b[2]);
    return date;
  },

  //getDate:function (strDate){
  //  var date = eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/,
  //   function (a) { return parseInt(a, 10) - 1; }).match(/\d+/g) + ')');
  //  return date;
  //},
  
  /**2023-07-03 allen  
  *返回轉為日期時間對像
  *參數:strDate 為yyy-MM-dd hh:mm:ss:字符串日期格式,轉為日期時間對像
  */
  getDateTimeString:function (strDate) {
      var st = strDate;
      var a = st.split(" ");
      var b = a[0].split("-");
      var c = a[1].split(":");
      var date = new Date(b[0], b[1], b[2], c[0], c[1], c[2]);      
      return date;
  },

  /**2023-07-03 allen  
  *反回布尔值,true:表示輸入的日期或日期時間型字符串沒問題;false:輸入有誤
  *參數:type:'date'表時日期;'datetime'表示日期時間
  */
  CheckDateTime: function (type,str) {
      if(type=='date'){
          var reg = /^(\d+)-(\d{1,2})-(\d{1,2})/;
      }else{
          var reg = /^(\d+)-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
      }
      var r = str.match(reg); 
      if (r == null) return false;
      r[2] = r[2] - 1; 
      if(type=='date'){
          var d = new Date(r[1], r[2], r[3]);
      }else{
          var d = new Date(r[1], r[2], r[3], r[4], r[5], r[6]);
      }
      if (d.getFullYear() != r[1]) return false;
      if (d.getMonth() != r[2]) return false;
      if (d.getDate() != r[3]) return false;
      if(type=='date'){
          return true;
      }else{
          if (d.getHours() != r[4]) return false;
          if (d.getMinutes() != r[5]) return false;
          if (d.getSeconds() != r[6]) return false;
          return true;
      }     
  },  

  /**2023-07-03 allen
  *返回YYYY-MM-DD日期字符串
  *參數date為日期對象
  */
  dateFormatter: function (date) {      
     var y = date.getFullYear();
     var m = date.getMonth() ;//+1;
     var d = date.getDate();
     return y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d);
  },

  //start 2023/07/05 從SalesOrder移過來
  /**
   * 日期解析，字符串转日期
   * @param dateString 可以为2017-02-16，2017/02/16，2017.02.16
   * @returns {Date} 返回对应的日期对象
  */
  dateParse: function (dateString) {
      var SEPARATOR_BAR = "-";
      var SEPARATOR_SLASH = "/";
      var SEPARATOR_DOT = ".";
      var dateArray;
      if (dateString.indexOf(SEPARATOR_BAR) > -1) {
          dateArray = dateString.split(SEPARATOR_BAR);
      } else if (dateString.indexOf(SEPARATOR_SLASH) > -1) {
          dateArray = dateString.split(SEPARATOR_SLASH);
      } else {
          dateArray = dateString.split(SEPARATOR_DOT);
      }
      return new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
  },
  /**日期加减多少天
   * @param dateObj 日期对象
   * @param days 加减天数
   * @returns 
  */
  dateAdd:function (dateObj, days) {
      dateObj.setDate(dateObj.getDate() + days);
      var y = dateObj.getFullYear();
      var m = dateObj.getMonth() + 1;
      var d = dateObj.getDate();
      var strdate= y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d);
      return strdate;
  },
  /**返回當前客戶端日期*/
  iniDate: function () {
      var datetime = new Date();
      var year = datetime.getFullYear();
      var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
      var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
      //var hour = datetime.getHours()< 10 ? "0" + datetime.getHours() : datetime.getHours(); 
      //var minute = datetime.getMinutes()< 10 ? "0" + datetime.getMinutes() : datetime.getMinutes(); 
      //var second = datetime.getSeconds()< 10 ? "0" + datetime.getSeconds() : datetime.getSeconds(); 
      //return year + "-" + month + "-" + date+" "+hour+":"+minute+":"+second;
      return year + "-" + month + "-" + date
  },
  /**反回格式化yyyy-MM-dd之日期對象*/
  formatDate:function(val,row){
      var now = new Date(val);
      return now.format("yyyy-MM-dd");
  },
  /** 功能:实现VBScript的DateAdd功能. 
  *   参数:interval,字符串表达式，表示要添加的时间间隔. 
  *   参数:number,数值表达式，表示要添加的时间间隔的个数. 
  *   参数:date,时间对象. 
  *   返回:新的时间对象. 
  *   var now = new Date(); 
  *   var newDate = DateAdd("d",5,now); 
  *--------------- DateAdd(interval,number,date) ----------------- 
  */
  DateAdd: function (interval, number, date) {
        
      switch (interval) {
          case "y": {
              date.setFullYear(date.getFullYear() + number);
              return date;
              break;
          }
          case "q": {
              date.setMonth(date.getMonth() + number * 3);
              return date;
              break;
          }
          case "m": {
              date.setMonth(date.getMonth() + number);
              return date;
              break;
          }
          case "w": {
              date.setDate(date.getDate() + number * 7);
              return date;
              break;
          }
          case "d": {
              date.setDate(date.getDate() + number);
              return date;
              break;
          }
          case "h": {
              date.setHours(date.getHours() + number);
              return date;
              break;
          }
          case "mi": {
              date.setMinutes(date.getMinutes() + number);
              return date;
              break;
          }
          case "s": {
              date.setSeconds(date.getSeconds() + number);
              return date;
              break;
          }
          default: {
              date.setDate(d.getDate() + number);
              return date;
              break;
          }
      }
  },
  // end 2023/07/05 從SalesOrder移過來
  
  /**返回easy-ui table 當前焦點行索引號*/
  getCurrentRowIndex: function (obj) {
      var index = undefined;
      var rowdata = $(obj).datagrid('getSelected');
      if (rowdata) {
          index = $(obj).datagrid('getRowIndex', rowdata);
      }
      return index
  },
  /**字串轉大寫**
   * Allen 2022/05/20
  */
  stringToUppercase: function(str) {       
      var val="";
      if(str){
          val = str.toUpperCase();
      }else{
          val="";
      }
      return val;
  },

  /**獲取當前日期時間*/
  getWipID: async  function() {
	var result='aaa';
        await axios.get("GetWipID").then(
            (response) => {
				// return 'abc';
                // return(response.data);				
				result=response.data;
				var dd='111';
				return(result);
            },
            (response) => {
                alert(response.status);
            }
        ).catch(function (response) {
            alert(response);
        });
	    return result;
  },
    
  //檢查用戶是否有該按鈕的操作權限.  
  checkAuthority: async function(user_id,menu_id,func_name){
     let result = "0";
     await axios.get("/Base/Common/CheckAuthority?user_id=" + user_id + "&menu_id=" + menu_id+ "&func_name=" + func_name).then(            
          (res) => {
              result = res.data;
          })    
    return result;
  },



}



