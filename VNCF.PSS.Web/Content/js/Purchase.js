/**
 * 採購單
*/

var Purchase = window.NameSpace || {};

Purchase.Pur = new function () {
    var self = this;
    //var name = 'Allen';
    //self.sayHello = function (_name) {
    //    return 'Hello ' + (_name || name);
    //};

    /**
    * 當前頁面設置公共變量
    * 设置值 
    * @@param name
    * @@param value
    */
    //self.setValue =function(name, value) {
    //    var self = this;
    //    console.info('self:', self);
    //    console.info('self==window:', self == window);
    //    if (arguments.length == 2) {
    //        self[name] = value;
    //        return;
    //    }
    //    if (arguments.length == 1 && Object.prototype.toString.call(arguments[0]) == "[object Object]") {
    //        for (var key in arguments[0]) {
    //            self.setValue(key, arguments[0][key]);
    //            //self[key]=arguments[0][key];
    //        }
    //    }
    //}

    //單據狀態
    self.disableSate = function () {
        $('#State').combobox('readonly', false).combobox('textbox').prev().show();
        $('#State').combobox('readonly', true).combobox('textbox').prev().hide();
    }

    //提取採購員名稱
    self.getBuyerName = function () {
        var id = $("#BuyerID").val();
        if (id) {
            id = id.toLocaleUpperCase();
            $("#BuyerID").textbox("setValue", id);//賦值
            Ajax.call('GetBuyerName', '&strBuyerID=' + id, this.setBuyerName, 'GET', 'JSON');
        }
    }
    this.setBuyerName = function (result) {
        $("#BuyerID").textbox("setValue", result.BuyerID);
        $("#BuyerName").textbox("setValue", result.BuyerName);
        if (result.BuyerName == "") {
            $("#BuyerID").textbox("setValue", "");
            $("#BuyerName").textbox("setValue", "");
        }
    }

    //設置主檔編輯狀態
    self.disableMaster = function (isDisable) {
        //上面这句代码的意思是将form表单里面除了样式为.btn btn-primary,.back的元素都置为只读
        if (isDisable) {
            //只讀
            $('#addFormHead').find('input,textarea,select').attr('readonly', true);
            //$('#addFormHead .easyui-combobox').combobox({ readonly: true });//20201231 cancel        
            $('#addFormHead .easyui-combobox').combobox('readonly', true).combobox('textbox').prev().hide();//new               
            $("#OrderDate").datebox("readonly", true);//OK            
        } else {
            //可修改
            $('#addFormHead').find('input,textarea,select').attr('readonly', false);
            $('#addFormHead .easyui-combobox').combobox('readonly', false).combobox('textbox').prev().show();
            $("#OrderDate").datebox("readonly", false);            
            //篩選出某類對象設置屬性,因前面設置全部對象可寫,以下代碼對原本只讀的對象重設為只讀
            var tb = $('#addFormHead .myReadonly');
            $.each(tb, function (n, value) {
                $(value).textbox('textbox').attr('readonly', true);
            });
        }
    }
   
    //設置明細的編輯狀態
    self.disableDetails = function (isDisable) {
        //查某對象類名className = $("#MoType").attr("class");//var className = $("#GetColorSample").attr("class");
        //此代码意思是将form表单里面除了样式为.not('.btn btn-primary,.back').btn btn-primary,.back的元素都置为只读        
        if (isDisable) {
            //只讀
            //$('#details_master').find('input,textarea,select,easyui-checkbox').not('.btn btn-primary,.back').attr('readonly', true);
            //$('#details_master .easyui-combobox').not('#MoType,#MoDept,#MoGroup,#MoState').combobox({ readonly: true });//20201231 cancel
            $('#details_master').find('input,textarea,select,easyui-checkbox').attr('readonly', true);
            $('#details_master .easyui-combobox').not('#MoType,#MoDept,#MoGroup,#MoState').combobox('readonly', true).combobox('textbox').prev().hide();//20201231
            $("#ArriveDate").datebox("readonly", true);            
        } else {
            //可修改
            $('#details_master').find('input,textarea,select,easyui-checkbox').attr('readonly', false);
            $('#details_master .easyui-combobox').not('#MoType,#MoDept,#MoGroup,#MoState').combobox('readonly', false).combobox('textbox').prev().show();//20201231            
            $("#ArriveDate").datebox("readonly", false);           
            //篩選出某類對象設置屬性,因前面設置全部對象可寫,以下代碼對對原本只讀的對象重設為只讀
            var tb = $('#details_master .myReadonly');
            $.each(tb, function (n, value) {
                $(value).textbox('textbox').attr('readonly', true);
            });
            //checkbox 默認選中并不可點擊<input type="checkbox" name="ckb" checked disabled="disabled"/>
        }
    }

    //最大單據編號
    self.getMaxID = function () {
        //Ajax.call('GetMaxID', setMaxID, 'GET', 'JSON');       
        var postData = {};
        $.ajax({
            url: "GetMaxID",
            data: postData,
            type: "POST",
            async: true,
            //contentType: 'application/json;charset=UTF-8',
            dataType: "JSON",
            timeout: 20000,
            success: function (data) {
                $("#ID").textbox("setValue", data);//生成的頁數
                $("#Ver").textbox("setValue", '0');
            },
            error: this.ErrorFunction //错误执行方法
        });
    }
    

    //切換至指定的頁面(page)
    self.setActivePage = function (PageTitle) {       
        $("#tabPages").tabs("select", PageTitle);//設置活動的page
    }

    //非活動員禁用
    self.disableTabs = function (tableID, arrLenth, isEnableOtherTab) {
        var arr = [];
        for (i = 0; i < arrLenth; i++) {
            arr[i] = i;
        }
        var tab = $(tableID).tabs('getSelected');//當前激活的頁
        var index = $(tableID).tabs('getTabIndex', tab);//當前激活的頁索引
        //var tab = $(tableID).tabs('getSelected');
        //var index = $(tableID).tabs('getTabIndex', tab);
        arr.splice($.inArray(index, arr), 1);//需要禁用的选项卡
        var strDisable = '';
        if (isEnableOtherTab) {
            //當前活動的Tab外,其它非活動的tab全部禁用
            strDisable = 'disableTab';
        } else {
            //其它非活動的tab解除禁用
            strDisable = 'enableTab';
        }
        $.each(arr, function (n, value) {
            $(tableID).tabs(strDisable, value);
        });
        $(tableID).tabs('enableTab', index); //指定當前激活Tab   
    }

    //設置供應商信息
    self.getVendorInfo = function() {
        var id = $("#VendorID").combobox("getValue");
        if (id) {
            Ajax.call('GetVendorData', '&strVendorID=' + id, this.setVendorInfo, 'GET', 'JSON');
        }
    }

    self.setVendorInfo = function (result) {
        $("#VendorAddress").textbox("setValue", result.VendorAddress);
        $("#Contacts").textbox("setValue", result.Contacts);
        $("#ContactsTel").textbox("setValue", result.ContactsTel);
        $("#ContactsFax").textbox("setValue", result.ContactsFax);
        $("#Vendor").val(result.Vendor);
        $("#CurrencyID").combobox("setValue", result.CurrencyID);
        $("#CurrencyRate").textbox("setValue", result.CurrencyRate);
    }

    /**
    *計算貨品金額
    */
    self.setItemAmount = function (operation, seq) {        
        var Products_Amount = 0, Others_Amount = 0;
        var current_row_amt = 0, AmountDiscount = 0;
        var TotalProductAmt = 0, TotalAmount = 0;
        var id = $("#ID").val(), ver = $("#Ver").val();
        //計算總金額           
        var postData = { strID: id, Ver: ver, strSeq: seq };
        $.ajax({
            url: "GetTotalAmt",
            data: postData,
            type: "POST",
            async: false,
            dataType: "JSON",
            timeout: 20000,
            success: function (data) {
                Products_Amount = data.TotalSum;
                Others_Amount = data.Price;//其它費用
            },
            error: this.ErrorFunction //错误执行方法
        });

        //加上當前正在編輯的金額
        if (operation == 'NEW' || operation == 'EDIT') {
            var OrderQty = $("#OrderQty").val();
            var Weight = $("#Weight").textbox("getValue");
            var Price = $("#Price").textbox("getValue");
            var DiscountRate = $("#DiscountRate").val();//折扣率 
            OrderQty = parseInt((OrderQty == "" || OrderQty == 0) ? 0 : OrderQty);
            Weight = parseFloat((Weight == "" || Weight == 0) ? 0.00 : Weight);
            Price = parseFloat((Price == "" || Price == 0) ? 0.00 : Price);
            DiscountRate = parseFloat((DiscountRate == "" || DiscountRate == 0) ? 0 : DiscountRate);

            var OrderUnit = $("#OrderUnit").val();  //數量單位
            var WeightUnit = $("#WeightUnit").val();  //重量單位
            var PriceUnit = $("#PriceUnit").combobox("getValue");  //單價單位

            if (OrderUnit == PriceUnit) {
                //訂單單位與單價單位相同
                current_row_amt = OrderQty * Price;
            } else {
                //將數量單位轉成與單價相同的單位.           
                current_row_amt = Weight * Price;
            }
            //當前行金額
            current_row_amt = parseFloat(current_row_amt.toFixed(2));
            if (DiscountRate > 0) {
                AmountDiscount = current_row_amt * (DiscountRate / 100).toFixed(2);
                current_row_amt = current_row_amt - AmountDiscount;
            } else {
                AmountDiscount = 0;
            }
            $("#DiscountAmt").textbox("setValue", AmountDiscount.toFixed(2));
            $("#TotalSum").textbox("setValue", current_row_amt.toFixed(2));

            TotalProductAmt = Products_Amount + current_row_amt;//總貨品金額
            TotalAmount = Products_Amount + Others_Amount + current_row_amt;//總金額
        } else {
            //DEL 
            TotalProductAmt = Products_Amount;
            TotalAmount = Products_Amount + Others_Amount;
        }
        //設置表頭的總金額
        $("#OtherAmt").textbox("setValue", Others_Amount.toFixed(2));
        $("#PaymentAmt").textbox("setValue", TotalProductAmt.toFixed(2));
        $("#TotalAmt").textbox("setValue", TotalAmount.toFixed(2));
    }

    //self.getTotalAmt = function (id, ver, seq){
    //    var Products_Amount = 0;
    //    var Others_Amount = 0;
    //    var postData = { strID: id, Ver: ver, strSeq: seq };
    //    $.ajax({
    //        url: "GetTotalAmt",
    //        data: postData,
    //        type: "POST",
    //        async: false,
    //        dataType: "JSON",
    //        timeout: 20000,
    //        success: function (data) {
    //            Products_Amount = data.TotalSum;
    //            Others_Amount = data.Price;//其它費用
    //        },
    //        error: this.ErrorFunction //错误执行方法
    //    });
    //}


    //取附加費用總金額
    self.setTotalAmtOtherFare = function (id, ver, fare_id, operation,curent_row_amount) {        
        //后端統計不包括當前行            
        var postData = { strID: id, Ver: ver, strFareID: fare_id };
        var OtherAmount = 0.00;
        var PaymentAmt = 0.00;
        $.ajax({
            url: "GetTotalAmtOther",
            data: postData,
            type: "POST",
            async: false,
            dataType: "JSON",
            timeout: 20000,
            success: function (data) {
                OtherAmount = parseFloat(data.Price).toFixed(2);//其它費用         
                PaymentAmt = data.TotalSum; //貨品總金額                   
                PaymentAmt = parseFloat((PaymentAmt == "" || PaymentAmt == 0) ? 0 : PaymentAmt).toFixed(2);
                if (operation = 'NEW' || operation == 'EDIT') {
                    OtherAmount = parseFloat(OtherAmount) + parseFloat(curent_row_amount);//后臺總其它費用金額 + 當前行其它費用金額                    
                }
                $("#OtherAmt").textbox("setValue", OtherAmount); //附加費用金額
                $("#PaymentAmt").textbox("setValue", PaymentAmt);//總貨品金額
                $("#TotalAmt").textbox("setValue", parseFloat(PaymentAmt) + parseFloat(OtherAmount)); //總貨金額
            },
            error: this.ErrorFunction //错误执行方法
        });
    };


    self.clearDetailHead = function(){
        //查出曾落單繼續新增明細,注意點擊表grid表格時需將ActionType_D設置為空
        $("#addFormDetails").form("clear");//清空明細表頁面表頭  
        $("#OrderQty").textbox("setValue", "0");//普通控件賦值
        $("#Weight").textbox("setValue", "0");
        $("#Price").textbox("setValue", "0");        
        
        $("#OrderUnit").textbox("setValue", "PCS");
        $("#WeightUnit").textbox("setValue", "KG");
        $("#PriceUnit").combobox("setValue", "PCS");       

        $("#ActionType_D").val("NEW");
        $("#Seq").val("");
        this.disableDetails(false); //明細可編輯        
        this.disableSate();//設置狀態只讀
    }

    ////設置供應商信息
    //self.test = function () {
    //    Ajax.call('test', '', '', 'GET', 'JSON');
        
    //}

   self.SearchBuyHead = function () {
        //Ajax异步实现加载
        $.ajax({
            //url: "/SalesOrder/GetOcHead?OcID=" + $("#OcID").val(),
            url: "GetBuyHead?ID=" + $("#ID").val(),
            success: this.FillBuyHead,
            error: this.ErrorFunction //错误执行方法
        })
   }
   
   self.FillBuyHead = function (data) {
       for (var item in data) {
           var rows = data[item];//key所对应的value
           //var val = jValue[0]["ProductMo"];
           //如果返回的data是列表的形式：List<>的就要用如下格式獲取值
           //如果返回的是model格式的，就按如下格式獲取值：
           $("#ID").textbox('setValue', rows["ID"]);
           $("#Ver").textbox('setValue', rows["Ver"]);           
           $("#OrderDate").textbox('setValue', rows["OrderDate"]);
           $("#VendorID").textbox('setValue', rows["VendorID"]);
           $("#Vendor").val("Vendor");
           $("#VendorAddress").textbox('setValue', rows["VendorAddress"]);
           $("#Contacts").textbox('setValue', rows["Contacts"]);
           $("#ContactsTel").textbox('setValue', rows["ContactsTel"]);
           $("#ContactsFax").textbox('setValue', rows["ContactsFax"]);
           $("#BuyerID").textbox('setValue', rows["BuyerID"]);
           $("#BuyerName").textbox('setValue', rows["BuyerName"]);
           $("#CurrencyID").textbox('setValue', rows["CurrencyID"]);
           $("#CurrencyRate").textbox('setValue', rows["CurrencyRate"]);
           $("#DepartMentID").textbox('setValue', rows["DepartMentID"]);
           $("#CustomerID").textbox('setValue', rows["CustomerID"]);
           $("#CustomerCdesc").textbox('setValue', rows["CustomerCdesc"]);
           $("#OtherAmt").textbox('setValue', rows["OtherAmt"]);
           $("#PaymentAmt").textbox('setValue', rows["PaymentAmt"]);
           $("#TotalAmt").textbox('setValue', rows["TotalAmt"]);
           $("#Packing").textbox('setValue', rows["Packing"]);
           $("#Remark").textbox('setValue', rows["Remark"]);
           $("#State").textbox('setValue', rows["State"]);          

           $("#CreateBy").textbox('setValue', rows["CreateBy"]);
           $("#CreateAt").textbox('setValue', rows["CreateAt"]);
           $("#UpdateBy").textbox('setValue', rows["UpdateBy"]);
           $("#UpdateAt").textbox('setValue', rows["UpdateAt"]);
       }
   }

   //點擊表格行填充明細表頭
   self.FillBuyDetails = function () {
       var RowFindByID = $('#tbDetails').datagrid('getSelections');
       if (RowFindByID.length == 1) {
           //实现绑定数据显示
           $("#addFormDetails").form("clear");//清空明細表頁面表頭
           $('#ActionType_D').val("");//清空狀態
           var rows = RowFindByID[0];          
           $("#Seq").textbox('setValue',rows.Seq);//非Easyui控件注意賦值形式是不相同
           $("#ProductMo").textbox('setValue', rows.ProductMo);
           $("#ProductID").textbox('setValue', rows.ProductID);
           $("#ProductCdesc").textbox('setValue', rows.ProductCdesc);
           $("#ArriveDate").datebox('setValue', rows.ArriveDate);//??
           $("#OrderQty").textbox('setValue', rows.OrderQty);
           $("#OrderUnit").textbox('setValue', rows.OrderUnit);          
           $("#Price").textbox('setValue', rows.Price);
           $("#PriceUnit").combobox('setValue', rows.PriceUnit);           
           $("#DiscountRate").textbox('setValue', rows.DiscountRate);
           $("#DiscountAmt").textbox('setValue', rows.DiscountAmt);
           $("#TotalSum").textbox('setValue', rows.TotalSum);
           $("#Spec").textbox('setValue', rows.Spec);
           $("#Color").textbox('setValue', rows.Color);
           $("#Weight").textbox('setValue', rows.Weight);
           $("#WeightUnit").textbox('setValue', rows.WeightUnit);
           $("#Remarks").textbox('setValue', rows.Remarks);      
           this.disableDetails(true);
           this.disableOtherFareToolbar(false);//恢復其他費用按鈕的可用狀態
           this.disableSate(); 
       }
       else {
           //每次只能修改一条，你已经选择了<font color='red'  size='6'>
           //$.messager.alert('提示信息', "每次只能修改一条，你已经选择了<font color='red'  size='6'>" + RowFindByID.length + "</font>条");
           $.messager.alert(window['msg_system_prompt'], window['msg_only_select_one'] + RowFindByID.length + "</font>条");
       }
   }


   /***
   *主表,明細表同時保存
   */
   self.Save = function () {
       //檢查主表、明細表資料的完整性
       if (!ValidForm()) {
           return;
       }
       //保存主表
       if ($("#ID").val() != "") {
           var ID = this.SaveMaster();
           if (ID != "OK") {
               return;
           }
       }

       //保存明細表
       var postData = $("#addFormDetails").serializeArray();
       //Ajax异步实现加载
       $.ajax({           
           //url: "/SalesOrder/AddList?OcID=" + $("#OcID").val(),
           url: "AddList?ID=" + $("#ID").val() + '&Ver=' + $("#Ver").val(),//注意:提交多個參數到后臺的寫法
           data: postData,
           //cache: false,
           async: false,//改为同步方式
           type: "post",
           success: function (data) {
               if (data == "OK") {
                   //$.messager.alert("系统提示！", "添加明細表記錄成功!");
                   //$('#AddDialog').dialog('close');
                   //$("#tbDetails").datagrid("reload");
                   //$("#addForm").form("clear")
                   //主表明細重新查詢出數據
                   SearchBuyDetails();
                   //數據保存成功!
                   $.messager.alert(window['msg_system_prompt'], window['msg_saved_success']);
               }
               else {
                   //添加明細資料失败
                   $.messager.alert(window['msg_system_prompt'], GetSystemMessage('CN00004'));
               }
           },
           error: this.ErrorFunction //错误执行方法 
       })

       //保存成功后設置明細項目新增可用的初始狀態
       $("#ActionType_H").val("");
       this.clearDetailHead();
       this.disableMaster(true); //主檔頁數不可編號  

       //$("#addFormDetails").form("clear");//清空明細表頁面表頭
       //$("#ProductMoVer").textbox("setValue", "0");//普通控件賦值
       //$('#MoState').combobox('setValue', '0');//下拉列表框賦值
       //$("#IsPrint").attr("checked", true)//默認PI需列印

       //$("#ActionType_D").val("NEW");
       //$("#Seq").val("");
       //disableMaster(true); //主檔頁數不可編號   
       //disableDetails(false); //明細可編號
       //disableGenMoAndOcID(false); //可生成頁數
       //disableSate();//設置狀態只讀
   }

   /*
   *保存主表
   */
   self.SaveMaster = function () {
       var postData = $("#addFormHead").serializeArray();
       var ID = "";
       //Ajax异步实现加载
       $.ajax({
           //url: "/SalesOrder/AddHead",
           url: "AddHead",
           data: postData,
           async: false,//改为同步方式
           type: "post",
           success: function (data) {
               if (data == "OK") {
                   ID = data;
               }
               else {
                   //主檔資料添加失败                
                   $.messager.alert(window['msg_system_prompt'], GetSystemMessage('CN00005'));
               }
           },
           error: this.ErrorFunction //错误执行方法
       })
       return ID;
   }

   //保存附加費用
   self.saveOtherFare = function (postData) {
       var save_flag = "";
       $.ajax({
           //url: "/SalesOrder/AddSalesBom",
           url: "AddOtherFare",
           data: postData,
           //cache: false,
           async: false,//同步更新
           type: "post",
           success: function (data) {
               if (data == "OK") {
                   save_flag = "OK";
                   //數據保存成功
                   $.messager.alert(window['msg_system_prompt'], window['msg_saved_success']);
               }
               else {
                   //當前項目添加失敗
                   $.messager.alert(window['msg_system_prompt'], GetSystemMessage('CN00006'));
               }
           }
       });
       return save_flag;
   }


  self.ErrorFunction = function (data) {
       //提取后臺數據出錯
       $.messager.alert(window['msg_system_prompt'], GetSystemMessage('CN00003'));
  }

  //details undo change
  self.setUndo = function () {
      //當更改貨品編號,按取消按鈕時恢復到原來的值
      var RowFindByID = $('#tbDetails').datagrid('getSelections');
      if (RowFindByID.length == 1) {
          var rows = RowFindByID[0];
          if (rows.ProductID != $("#ProductID").val()) {
              $("#ProductID").textbox('setValue', rows.ProductID);//賦值
              $('#ProductID').next('span').find('input').focus();
              $('#CustProductName').next('span').find('input').focus();
              $('#ProductID').next('span').find('input').focus();
          }
      }
  }

    //更改主表信息,保存前檢查
  self.EditMaster = function (title) {
      this.setActivePage(title);
      if ($('#ActionType_H').val() == "NEW") {
          //主表資料為新增狀態,不可進行此操作！"       
          $.messager.alert(window['msg_system_prompt'], GetSystemMessage('OC00001'));
          return;
      }
      if ($('#ID').val() == "") {
          //當前主表資料為空,不可進行此操作！"
          //$.messager.alert(window['msg_system_prompt'], window['msg_master_data_is_empty']);
          $.messager.alert(window['msg_system_prompt'], GetSystemMessage('CN00001'));
          return;
      }
      this.disableTabs("#tabPages", 2, true);//非活動Tab禁用
      $('#ActionType_H').val("EDIT");//設置狀態
      this.setEditMasterButtonSatus(true)
      this.disableMaster(false);//對象可修改      
      this.disableSate();//設置狀態只讀
  }


  //設置主檔工具欄按鈕狀態
  self.setEditMasterButtonSatus = function (isDisable) {
      if (isDisable) {
          $('#btnNew').linkbutton('disable');
          $('#btnEdit').linkbutton('disable');
          $('#btnSave').linkbutton('enable');
          $('#btnUndo').linkbutton('enable');
          $('#btnSerach').linkbutton('disable');
          $('#btnPrint').linkbutton('disable');
          $('#btnImport').linkbutton('disable');
      } else {
          $('#btnNew').linkbutton('enable');
          $('#btnEdit').linkbutton('enable');
          $('#btnSave').linkbutton('disable');
          $('#btnUndo').linkbutton('disable');
          $('#btnSerach').linkbutton('enable');
          $('#btnPrint').linkbutton('enable');
          $('#btnImport').linkbutton('enable');
      }
  }

  //設置OC明細工具欄按鈕狀態
  self.setEditDetailButtonSatus = function (isDisable) {
      if (isDisable) {
          $('#btnEditItem').linkbutton('disable');
          $('#btnSaveItem').linkbutton('enable');
          $('#btnUndoItem').linkbutton('enable');
          $('#btnAddItem').linkbutton('disable');
          $('#btnDelete').linkbutton('disable');
          $('#btnBlank').linkbutton('disable');
          $('#btnReload').linkbutton('disable');

          $('#btnEdit').linkbutton('disable');
          $('#btnSerach').linkbutton('disable');
          $('#btnPrint').linkbutton('disable');
      } else {
          $('#btnEditItem').linkbutton('enable');
          $('#btnSaveItem').linkbutton('disable');
          $('#btnUndoItem').linkbutton('disable');
          $('#btnAddItem').linkbutton('enable');
          $('#btnDelete').linkbutton('enable');
          $('#btnBlank').linkbutton('enable');
          $('#btnReload').linkbutton('enable');

          $('#btnEdit').linkbutton('enable');
          $('#btnSerach').linkbutton('enable');
          $('#btnPrint').linkbutton('enable');
      }
  }

  //設置其他費用工具欄按鈕狀態
  self.setOtherFareButtonSatus = function (isDisable) {
      if (isDisable) {
          $('#btnEditItemBom').linkbutton('disable');
          $('#btnSaveItemBom').linkbutton('enable');
          $('#btnUndoItemBom').linkbutton('enable');
          $('#btnAddItemBom').linkbutton('disable');
          $('#btnDeleteItemBom').linkbutton('disable');       
          $('#btnReloadItemBom').linkbutton('disable');
  
          $('#btnEdit').linkbutton('disable');
          $('#btnSerach').linkbutton('disable');
          $('#btnPrint').linkbutton('disable');
      } else {
          $('#btnEditItemBom').linkbutton('enable');
          $('#btnSaveItemBom').linkbutton('disable');
          $('#btnUndoItemBom').linkbutton('disable');
          $('#btnAddItemBom').linkbutton('enable');
          $('#btnDeleteItemBom').linkbutton('enable');
          $('#btnReloadItemBom').linkbutton('enable');
  
          $('#btnEdit').linkbutton('enable');
          $('#btnSerach').linkbutton('enable');
          $('#btnPrint').linkbutton('enable');
      }     
  }


    //禁用/恢復其他費用工具欄按鈕(OC明細操作時)
  self.disableOtherFareToolbar = function (isDisable) {
      if (isDisable) {
          //禁用
          $('#btnAddItemBom').linkbutton('disable');
          $('#btnEditItemBom').linkbutton('disable');
          $('#btnSaveItemBom').linkbutton('disable');
          $('#btnUndoItemBom').linkbutton('disable');
          $('#btnDeleteItemBom').linkbutton('disable');
          $('#btnReloadItemBom').linkbutton('disable');
      } else {
          //恢復
          $('#btnAddItemBom').linkbutton('enable');
          $('#btnEditItemBom').linkbutton('enable');
          $('#btnSaveItemBom').linkbutton('disable');
          $('#btnUndoItemBom').linkbutton('disable');
          $('#btnDeleteItemBom').linkbutton('enable');
          $('#btnReloadItemBom').linkbutton('enable');
      }
  }

    //禁用/恢復OC明細工具欄按鈕(SalesBOM明細操作時)
  self.disableOCToolbar = function (isDisable) {
      if (isDisable) {
          //禁用
          $('#btnAddItem').linkbutton('disable');
          $('#btnEditItem').linkbutton('disable');
          $('#btnSaveItem').linkbutton('disable');
          $('#btnUndoItem').linkbutton('disable');
          $('#btnDelete').linkbutton('disable');
          $('#btnBlank').linkbutton('disable');
          $('#btnReload').linkbutton('disable');
      } else {
          //恢復
          $('#btnAddItem').linkbutton('enable');
          $('#btnEditItem').linkbutton('enable');
          $('#btnSaveItem').linkbutton('disable');
          $('#btnUndoItem').linkbutton('disable');
          $('#btnDelete').linkbutton('enable');
          $('#btnBlank').linkbutton('enable');
          $('#btnReload').linkbutton('enable');
      }
  }

  //附加費編號 FareID 失去焦點調用的函數
  self.setFareIDblur = function (index) {
      var t = $("#tbOtherFare");
      t.datagrid('selectRow', index);
      t.datagrid('beginEdit', index);             
      var editors = t.datagrid('getEditors', index); //獲得當前行的可編輯列對象,忽略非編輯列
      if (editors.length > 0) {
          var edFareID = editors[0];//editor[0]表示第一列這個控件,即附加費號列
          var edName = editors[1];
          //附加費編號列綁定失去焦點事件 
          edFareID.target.bind('blur', function () {
              var item = edFareID.target.val(); //取值
              if (item.length > 0) {
                  item = item.toUpperCase();
                  var tmp = this.checkFareID(item);
                  if (tmp.Cdesc != "") {
                      edFareID.target.val(item);
                      edName.target.val(tmp.Cdesc);
                  } else {
                      //無效的產品編號
                      $.messager.alert(window['msg_system_prompt'], GetSystemMessage('CN00007'));
                      edFareID.target.val('');
                      edName.target.val('');
                  }
              }
          });
      }
  }

  self.checkFareID = function (id) {
      var result = "{Cdesc:'',Edesc:''}";
      $.ajax({
          //url: "/SalesOrder/GetProductID?strProductID=" + id,
          url: "GetFareID?strFareID=" + id,
          //data: postData,
          async: false,//需設為同步執行
          //contentType: 'application/json;charset=UTF-8',
          type: "post",
          success: function (data) {
              result = data;
          },
          error: this.ErrorFunction //错误执行方法
      })
      return result;
  }

  //彈出模式窗口返回值至父窗口
  self.openWin = function (url, title, width, height, rowIndex, shadow) {
      var content = '<iframe src="' + url + '" width="100%" height="99%" frameborder="0" scrolling="no"></iframe>';
      var boarddiv = '<div id="msgwindow" title="' + title + '"></div>'//style="overflow:hidden;"可以去掉滚动条
      $(document.body).append(boarddiv);
      var win = $('#msgwindow').dialog({
          content: content,
          width: width,
          height: height,
          modal: shadow,
          title: title,
          onClose: function () { 
              //查詢貨品編碼
              var strItem = document.getElementById('goods_id').value;
              if (strItem.length > 0) {
                  if (rowIndex == null) {
                      //OC明細的主檔查貨品編號的按鈕
                      $("#ProductID").val(strItem);//賦值
                      $('#ProductID').next('span').find('input').focus();//获取焦点
                      $('#ProductCdesc').next('span').find('input').focus();//获取焦点觸發事件使描述刷新
                      $('#ProductID').next('span').find('input').focus();
                  } else {
                      //$("#FareID").val(strItem);//賦值 
                      //$('#FareID').next('span').find('input').focus();//获取焦点
                      //$('#Name').next('span').find('input').focus();
                      //$('#FareID').next('span').find('input').focus();

                      //附加費表格的查詢
                      var editors = $('#tbOtherFare').datagrid('getEditors', rowIndex); //獲得當前行的可編輯列對象,忽略非編輯列
                      if (editors.length > 0) {
                          var edProductID = editors[0];//editor[1]表示第一列對象,即產品編號列
                          //var item = edProductID.target.val();
                          edProductID.target.val(strItem);//單元格賦值
                          $(edProductID.target).focus();//單元格获取焦点
                      }
                  }
              }
          }
      });
      win.dialog('open');
  }


};

