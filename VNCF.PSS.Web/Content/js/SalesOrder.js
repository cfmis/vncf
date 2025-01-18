/**
 * 銷售訂單錄入
 */
var SO = {
    //最大單據編號
    getMaxOcID: function (area) {
        Ajax.call('GetMaxOcID', '&strArea=' + area, setMaxOcID, 'GET', 'JSON');
    },

    setMaxOcID: function (result) {
        $("#OcID").textbox("setValue", result);
    },
    //提取客戶名稱
    getCustomerInfo: function () {
        var id = $("#CustomerID").val();    
        if (id) {
            id = id.toLocaleUpperCase();
            $("#CustomerID").textbox("setValue", id);//賦值
            Ajax.call('/SalesOrder/GetCustomer', '&strCustomerID=' + id, this.setCustomerInfo, 'GET', 'JSON');      
        }    
    },
    setCustomerInfo: function (result) {    
        $("#CustomerCdesc").textbox("setValue", result.Cdesc);
        $("#CustomerEdesc").textbox("setValue", result.Edesc);
        if (result.Cdesc == "") {
            $("#CustomerID").textbox("setValue", "");
        }
    },
    //貨幣匯率
    getCurrencyRate: function ()  {
        var id = $("#CurrencyID").combobox("getValue");
        if (id) {
            Ajax.call('GetCurrencyRate', '&strCurrencyID=' + id, SO.setCurrencyRate, 'GET', 'JSON');
        }    
    },
    setCurrencyRate: function (result) {
        $("#CurrencyRate").textbox('setValue', result);
    },
    //貨品名稱
    getProductID: function () {
        var id = $("#ProductID").val();
        if (id) {
            id = id.toUpperCase();
            $("#ProductID").textbox('setValue', id);//賦值
            Ajax.call('/SalesOrder/GetProductID', '&strProductID=' + id, SO.setProductDesc, 'GET', 'JSON');       
        }    
    },
    setProductDesc: function (result) {
        $("#ProductCdesc").textbox("setValue", result.Cdesc);
        if(result.Cdesc=="")
        {
            $("#ProductID").textbox("setValue", "");
        }
    },
    //檢查狀態,是否可以生成頁數
    disableGenMoAndOcID: function (isDisabled) {
        if (isDisabled) {
            //不可選擇下拉框        
            $('#MoType').combobox('readonly', true).combobox('textbox').prev().hide();
            $('#MoDept').combobox('readonly', true).combobox('textbox').prev().hide();
            $('#MoGroup').combobox('readonly', true).combobox('textbox').prev().hide();
        } else {
            //可選擇下拉框      
            $('#MoType').combobox('readonly', false).combobox('textbox').prev().show();
            $('#MoDept').combobox('readonly', false).combobox('textbox').prev().show();
            $('#MoGroup').combobox('readonly', false).combobox('textbox').prev().show();
        }
    },
    //details undo change
    setUndo: function () {
        var RowFindByID = $('#tbDetails').datagrid('getSelections');
        if (RowFindByID.length == 1) {        
            var rows = RowFindByID[0];       
            if(rows.ProductID != $("#ProductID").val())
            {
                $("#ProductID").textbox('setValue', rows.ProductID);//賦值
                $('#ProductID').next('span').find('input').focus();
                $('#CustProductName').next('span').find('input').focus();
                $('#ProductID').next('span').find('input').focus();
            }
        }
    },
    //區域
    disableArea: function (isDisabled) {
        if (isDisabled) {
            //區域下拉框不可用用,代表不可生成OCID
            $('#Area').combobox('readonly', true).combobox('textbox').prev().hide();
            //$('#Area').combobox({ readonly: true });
        } else {
            //可選擇下拉框
            $('#Area').combobox('readonly', false).combobox('textbox').prev().show();
            //$('#Area').combobox({ readonly: false });
        }
    },
    //單據狀態,頁數狀態只讀
    //disableSate: function () {
    //    $('#State').combobox('readonly', false).combobox('textbox').prev().show();//
    //    $('#State').combobox('readonly', true).combobox('textbox').prev().hide();
    //    $('#MoState').combobox('readonly', false).combobox('textbox').prev().show();//
    //    $('#MoState').combobox('readonly', true).combobox('textbox').prev().hide();
    //},

    //產生mo流水號
    getMoSerialNo: function () {
        var mo_type = $("#MoType").combobox("getValue");  //当前combobox的值
        var mo_dept = $("#MoDept").combobox("getValue");
        var mo_group = $("#MoGroup").combobox("getValue");

        if (mo_type != "" && mo_dept != "" && mo_group != "") {       
            var postData = { strMoType: mo_type, strMoDept: mo_dept, strMoGroup: mo_group };
            $.ajax({
                //url: "/SalesOrder/GetMoSerialNo",
                url: "GetMoSerialNo",
                data: postData,
                type: "POST",
                async: true,
                //contentType: 'application/json;charset=UTF-8',
                dataType: "JSON",
                timeout: 20000,
                success: function (data) {
                    $("#ProductMo").textbox("setValue", data);//生成的頁數
                    $("#ProductMoVer").textbox("setValue", '0');
                },
                error: this.ErryFunction
            });
        }
    },
    /**設置控件字體大小*/
    setFontSize: function () {
        var tb = $('.font_group');
        $.each(tb, function (n, value) {
            $(value).textbox('textbox').css("font-size", "9px");
        });
    },
    /**設置控件屬性為只讀的背景色為灰色*/
    setReadonlyBackground:function () {
        var tb = $('.myReadonly');
        $.each(tb, function (n, value) {
            $(value).textbox('textbox').css('background', '#F0F0F0');
        });
    },
    
    /**可以直接輸入下拉列表框中存在的值,輸入下拉列表框中不存在的值,回車自動清空*/
    check_input_unit: function (obj) {
        var valueField = $(obj).combobox("options").valueField;
        var val = $(obj).combobox("getValue");  //当前combobox的值
        var allData = $(obj).combobox("getData");   //获取combobox所有数据
        var result = true;   //为true说明输入的值在下拉框数据中不存在
        for (var i = 0; i < allData.length; i++) {
            if (val == allData[i][valueField]) {
                result = false;
                break;
            }
        }
        if (result) {
            $(obj).combobox("clear");
        }
    },
    //字母轉大寫
    fnKeyUp: function () {
        this.value = this.value.toUpperCase();
    },
    //function showAddOrEditDialog(url, title, width, height,row, shadow) {
    //    var objContent = '<iframe src="' + url + '" width="100%" height="99%" frameborder="0" scrolling="no"></iframe>';
    //    var objDiv = '<div id="winAddOrEdit" title="' + title + '"></div>'//style="overflow:hidden;"可以去掉滚动条
    //    $(document.body).append(objDiv);
    //    var win = $('#winAddOrEdit').dialog({
    //        content: objContent,
    //        width: width,
    //        height: height,
    //        modal: shadow,
    //        title: title,
    //        onClose: function () {
    //            //$(this).dialog('destroy');//后面可以关闭后的事件
    //            //document.getElementById('btnSerach').click();
    //        }
    //    });
    //    win.dialog('open');   
    //    if (row) {        
    //        $("#EditDetails").form("load", row);        
    //    };
    //}
    /**設置主檔工具欄按鈕狀態*/
    setEditMasterButtonSatus: function (isDisable) {
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
    },
    /**設置OC明細工具欄按鈕狀態*/
    setEditDetailButtonSatus: function (isDisable) {
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
    },
    //設置SalesBOM工具欄按鈕狀態
    setSalesBomButtonSatus: function (isDisable) {
        $('#btnEditItemBom').linkbutton('disable');
        $('#btnSaveItemBom').linkbutton('disable');
        $('#btnUndoItemBom').linkbutton('disable');
        $('#btnAddItemBom').linkbutton('disable');
        $('#btnDeleteItemBom').linkbutton('disable');
        $('#btnReloadItemBom').linkbutton('disable');
        /*以下于2021-03-12取消 不用做新增Salesbom,改為自動帶出
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
        */
    },
    //禁用/恢復SalesBOM工具欄按鈕(OC明細操作時)
    disableSalesBomToolbar: function (isDisable) {
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
    },
    //禁用/恢復OC明細工具欄按鈕(SalesBOM明細操作時)
    disableOCToolbar: function (isDisable) {
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
    },
    disableMaster: function (isDisable) {
        //上面这句代码的意思是将form表单里面除了样式为.btn btn-primary,.back的元素都置为只读
        if (isDisable) {
            //只讀
            $('#addFormHead').find('input,textarea,select').attr('readonly', true);
            //$('#addFormHead .easyui-combobox').combobox({ readonly: true });//20201231 cancel        
            $('#addFormHead .easyui-combobox').combobox('readonly', true).combobox('textbox').prev().hide();//new               
            $("#OrderDate").datebox("readonly", true);//OK
            $("#ReceivedDate").datebox("readonly", true);//OK
        } else {
            //可修改
            $('#addFormHead').find('input,textarea,select').attr('readonly', false);        
            $('#addFormHead .easyui-combobox').combobox('readonly', false).combobox('textbox').prev().show();        
            $("#OrderDate").datebox("readonly", false); 
            $("#ReceivedDate").datebox("readonly", false);
            //篩選出某類對象設置屬性,因前面設置全部對象可寫,以下代碼對原本只讀的對象重設為只讀
            var tb = $('#addFormHead .myReadonly');
            $.each(tb, function (n, value) {
                $(value).textbox('textbox').attr('readonly', true);
            });        
        }
    },
    disableDetails: function (isDisable) {
        //查某對象類名className = $("#MoType").attr("class");//var className = $("#GetColorSample").attr("class");
        //此代码意思是将form表单里面除了样式为.not('.btn btn-primary,.back').btn btn-primary,.back的元素都置为只读
        if (isDisable) {
            //只讀
            //$('#details_master').find('input,textarea,select,easyui-checkbox').not('.btn btn-primary,.back').attr('readonly', true);
            //$('#details_master .easyui-combobox').not('#MoType,#MoDept,#MoGroup,#MoState').combobox({ readonly: true });//20201231 cancel
            $('#details_master').find('input,textarea,select,easyui-checkbox').attr('readonly', true);
            $('#details_master .easyui-combobox').not('#MoType,#MoDept,#MoGroup,#MoState').combobox('readonly', true).combobox('textbox').prev().hide();//20201231       
            document.getElementById("IsFree").disabled = true;
            document.getElementById("IsPrint").disabled = true;
            $("#PlanCompleteDate").datebox("readonly", true);       
            $("#ArriveDate").datebox("readonly", true);
            $("#FactoryShipOutDate").datebox("readonly", true);        
        } else {
            //可修改
            $('#details_master').find('input,textarea,select,easyui-checkbox').attr('readonly', false);        
            $('#details_master .easyui-combobox').not('#MoType,#MoDept,#MoGroup,#MoState').combobox('readonly', false).combobox('textbox').prev().show();//20201231
            document.getElementById("IsFree").disabled = false;
            document.getElementById("IsPrint").disabled = false;
            $("#PlanCompleteDate").datebox("readonly", false);
            $("#ArriveDate").datebox("readonly", false);
            $("#FactoryShipOutDate").datebox("readonly", false);
        
            //篩選出某類對象設置屬性,因前面設置全部對象可寫,以下代碼對對原本只讀的對象重設為只讀
            var tb = $('#details_master .myReadonly');
            $.each(tb, function (n, value) {
                $(value).textbox('textbox').attr('readonly', true);
            });
            //checkbox 默認選中并不可點擊<input type="checkbox" name="ckb" checked disabled="disabled"/>
        }    
    },
    //更改主表信息,保存前檢查
    EditMaster: function (title) {
        this.setActivePage(title);
        if ($('#ActionType_H').val() == "NEW") {
            //主表資料為新增狀態,不可進行此操作！"       
            $.messager.alert(window['msg_system_prompt'], GetSystemMessage('OC00001'));
            return;        
        }
        if ($('#OcID').val() == "") {
            //當前主表資料為空,不可進行此操作！"
            //$.messager.alert(window['msg_system_prompt'], window['msg_master_data_is_empty']);
            $.messager.alert(window['msg_system_prompt'], GetSystemMessage('CN00001'));
            return;
        }
        this.disableTabs("#tabPages", 2, true);//非活動Tab禁用
        $('#ActionType_H').val("EDIT");//設置狀態
        this.setEditMasterButtonSatus(true)
        this.disableMaster(false);//對象可修改
        this.disableArea(true);//區域不可點擊
        this.disableSate();//設置狀態只讀
    },
    setActivePage: function (PageTitle)
    {
        $("#tabPages").tabs("select", PageTitle);//設置活動的page
    },
    UndoEditMaster: function () {
        this.setEditMasterButtonSatus(false)
        this.disableMaster(true);//對象不可修改
        this.disableTabs("#tabPages", 2, false);//非活動Tab解除禁用
        $('#ActionType_H').val("");    
    }, 
    disableTabs: function (tableID, arrLenth,isEnableOtherTab) {
        var arr = [];
        for (i = 0; i < arrLenth; i++) {
            arr[i] = i;
        }    
        var tab = $(tableID).tabs('getSelected');//當前激活的頁
        var index = $(tableID).tabs('getTabIndex', tab);//當前激活的頁索引
        //var tab = $(tableID).tabs('getSelected');
        //var index = $(tableID).tabs('getTabIndex', tab);
        arr.splice($.inArray(index, arr), 1);//需要禁用的选项卡
        var strDisable='';
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
    },
    clearDetailHead: function ()
    {
        //查出曾落單繼續新增明細,注意點擊表grid表格時需將ActionType_D設置為空
        $("#addFormDetails").form("clear");//清空明細表頁面表頭  
        $("#ProductMoVer").textbox("setValue", "0");//普通控件賦值
        $('#MoState').combobox('setValue', '0');//下拉列表框賦值
        $('#IsPrint').attr("checked",true);

        $("#ActionType_D").val("NEW");
        $("#Seq").val("");
        this.disableDetails(false); //明細可編號
        this.disableGenMoAndOcID(false); //可生成頁數
        this.disableSate();//設置狀態只讀
    },
    //單據狀態,頁數狀態只讀
    disableSate: function () {
        $('#State').combobox('readonly', false).combobox('textbox').prev().show();//
        $('#State').combobox('readonly', true).combobox('textbox').prev().hide();
        $('#MoState').combobox('readonly', false).combobox('textbox').prev().show();//
        $('#MoState').combobox('readonly', true).combobox('textbox').prev().hide();
    },    
    
    /**
     *計算貨品金額
    */
    countItemAmount: function () {    
        var edit_satus = $("#ActionType_D").val();
        if (edit_satus == "") {
            return;
        }
        var AmountProduct = 0;
        var AmountDiscount = 0;
        //"#OrderQty", "#OrderUnit", "#Price", "#PriceUnit", "#RateDiscount";
        var OrderQty = parseInt($("#OrderQty").val());
        OrderQty = (OrderQty == "" || OrderQty == 0) ? 0 : OrderQty;
        var OrderUnit = $("#OrderUnit").combobox("getValue");  //數量單位
        var Price = parseFloat($("#Price").val()); 
        Price = (Price == "" || Price == 0) ? 0.00 : Price;
        var PriceUnit = $("#PriceUnit").combobox("getValue");  //單價單位
        var RateDiscount = $("#RateDiscount").val();//折扣率   
        RateDiscount = (RateDiscount == "" || RateDiscount == 0) ? 0 : RateDiscount;
        RateDiscount = parseFloat(RateDiscount);
        if(OrderUnit !="" && PriceUnit !="")
        {
            if(OrderUnit == PriceUnit )
            {
                //訂單單位與單價單位相同
                AmountProduct = OrderQty * Price;
            } else {
                //將數量單位轉成與單價相同的單位.
                var order_unit_rate=1;
                if (OrderUnit != 'PCS' && OrderUnit != 'SET')
                {               
                    order_unit_rate = this.getQuantityUnitRate(OrderUnit);
                }
                OrderQty = OrderQty * order_unit_rate;//PCS
                var price_unit_rate = this.getQuantityUnitRate(PriceUnit);
                AmountProduct = (OrderQty / price_unit_rate) * Price;
            }
        } else {
            AmountProduct = 0;
        };
        //當前行金額
        AmountProduct = parseFloat(AmountProduct.toFixed(2));
        if (RateDiscount > 0) {
            AmountDiscount = AmountProduct * (RateDiscount / 100).toFixed(2);
            AmountProduct = AmountProduct - AmountDiscount ;     
        } else {
            AmountDiscount = 0;
        }
        $("#AmountDiscount").textbox("setValue", AmountDiscount);
        $("#AmountProduct").textbox("setValue", AmountProduct);

        //主表總金額,折扣額
        var Product_Amount = 0;
        var Disc_Amount = 0;
        var Disc_Rate =  parseFloat($("#DiscountRate").val());//主表折扣率 
    
        //加總金額但排除當前行(seq) 
        Product_Amount = this.getTotalAmount($("#OcID").val(), $("#Ver").val(), $("#Seq").val());  
        //加上當前行時需考慮是否免費
        if ($("#IsFree").is(":checked") == false) {
            //即不打勾為收費       
            Product_Amount = Number(Product_Amount) +Number(AmountProduct);//再加上當前值       
        } 
    
        if (Disc_Rate > 0) {
            Disc_Amount = Product_Amount * (Disc_Rate / 100).toFixed(2);
            Product_Amount = Product_Amount - Disc_Amount;      
        } else {
            Disc_Amount = 0;
        }
        $("#DiscountAmount").textbox("setValue", Disc_Amount);
        $("#ProductAmount").textbox("setValue", Product_Amount.toFixed(2));
    },
    //單位匯率
    getQuantityUnitRate: function (id) {   
        var rate = 0;
        $.ajax({            
            url: "GetQuantityUnitRate?strID=" + id,
            //data: postData,
            type: "POST",
            async: false,
            //contentType: 'application/json;charset=UTF-8',
            dataType: "JSON",
            timeout: 20000,
            success: function (data) {
                rate = data;
            },
            error: this.ErryFunction
       });
        return rate;
    },
    //取總金額
    getTotalAmountEdit: function (id, ver, current_seq) {
        //后端統計不包括當前行
        var total_amount = 0.00;
        if (ver == ""){
            ver = 0;
        }
        var postData = { strOcID: id,Ver:ver, strSeq: current_seq };
        $.ajax({
            url: "GetTotalAmount",
            data: postData,
            type: "POST",
            async: false,
            //contentType: 'application/json;charset=UTF-8',
            dataType: "JSON",
            timeout: 20000,
            success: function (data) {
                total_amount = data;
            },
            error: this.ErryFunction
        });
        return total_amount;
    },
    ErryFunction: function (data) {
        //提取后臺數據出錯
        $.messager.alert(window['msg_system_prompt'], GetSystemMessage('CN00003'));
    },
    format: function (n){
        n = parseFloat(n.replace(/[^\d|.]/g, '')).toFixed(2);
        return n;
    },
    //function format(num, fixed) {
    //    return num.toFixed(fixed).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
    //}

    /***
    *主表,明細表同時保存
    */
    Save: function () {
        //檢查主表、明細表資料的完整性
        if (!ValidForm()) {
            return;
        }
        //保存主表
        if ($("#OcID").val() != "") {
            var OcID = SaveMaster();
            if (OcID != "OK") {
                return;
            }
            //$("#OcID").textbox('setValue', OcID);
        }
        //保存明細表
        var postData = $("#addFormDetails").serializeArray();
        //Ajax异步实现加载
        $.ajax({
            //url: "/SalesOrder/AddList?OcID=" + $("#OcID").val(),
            url: "AddList?OcID=" + $("#OcID").val(),
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
                    SearchOcDetails();
                    //數據保存成功!
                    $.messager.alert(window['msg_system_prompt'], window['msg_saved_success']);
                }
                else {
                    //添加明細資料失败
                    $.messager.alert(window['msg_system_prompt'], GetSystemMessage('CN00004'));
                }
            }
        });    
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
    },

    /*
    *保存主表
    */
    SaveMaster: function () {
        var postData = $("#addFormHead").serializeArray();
        var OcID = "";
        //Ajax异步实现加载
        $.ajax({       
            url: "AddHead",
            data: postData,
            async: false,//改为同步方式
            type: "post",
            success: function (data) {
                if (data == "OK") {
                    OcID = data;
                }
                else {
                    //主檔資料添加失败                
                    $.messager.alert(window['msg_system_prompt'], GetSystemMessage('CN00005'));
                }
            }
        })
        return OcID;
    },

    /**
    *保存修改的主表信息
    */
    SaveEditMaster: function () {
        var valid = $("#addFormHead").form('validate');
        if (valid == false) {
            //請檢查主檔資料的完整性
            $.messager.alert(window['msg_system_prompt'], GetSystemMessage('CN00001'));
            return;
        }
        var result = "";
        result = this.SaveMaster();
        if (result == "OK") {
            //主表資料保存成功
            $.messager.alert(window['msg_system_prompt'], window['msg_saved_master_success']);
            this.setEditMasterButtonSatus(false)
            this.disableMaster(true);//對象不可修改
            this.disableTabs("#tabPages", 2, false);//非活動Tab解禁
            $('#ActionType_H').val("");
        }
    },
    /*
    *主表明細表單輸入有效性檢查
    */
    //function ValidForm() {
    //    var valid = true;
    //    if ($("#OcID").val() == "" || $("#OcID").val() == null) {
    //        $.messager.alert(window['msg_system_prompt'], "編號不可為空!");       
    //        valid = false;
    //    }
    //        // $('#ProductID').next('span').find('input').focus();//获取焦点
    //    return valid;
    //    //var valid = $("#addFormHead").form('validate');
    //    //if (valid == false) {
    //    //    //請檢查主檔資料的完整性
    //    //    $.messager.alert(window['msg_system_prompt'], GetSystemMessage('CN00001'));
    //    //    return false;
    //    //}
    //    //valid = $("#addFormDetails").form('validate');
    //    //if (valid == false) {
    //    //    //請檢查明細資料的完整性
    //    //    $.messager.alert(window['msg_system_prompt'], GetSystemMessage('CN00002'));
    //    //    return false;
    //    //}
    //    //return true;
    //}

    /**
    *查詢主檔
    */
    SearchOcHead: function (val) {
        //Ajax异步实现加载
        $.ajax({
            //url: "/SalesOrder/GetOcHead?OcID=" + $("#OcID").val(),
            //url: "GetOcHead?OcID=" + $("#OcID").val(),
            url: "GetOcHead?OcID=" + val,
            success: this.FillOcHead,
            error: this.ErryFunction //错误执行方法        
        })
    },

    saveSalesBom: function (postData)
    {
        var save_flag = "";
        $.ajax({           
            url: "AddSalesBom",
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
    },
    FillOcHead: function (data) {
        for (var item in data) {
            var rows = data[item];//key所对应的value
            //var val = jValue[0]["ProductMo"];
            //如果返回的data是列表的形式：List<>的就要用如下格式獲取值
            //如果返回的是model格式的，就按如下格式獲取值：
            $("#OcID").textbox('setValue', rows["OcID"]);
            $("#Ver").textbox('setValue', rows["Ver"]);
            $("#OrderType").textbox('setValue', rows["OrderType"]);
            $("#OrderDate").textbox('setValue', rows["OrderDate"]);
            $("#ReceivedDate").textbox('setValue', rows["ReceivedDate"]);
            $("#CustomerID").textbox('setValue', rows["CustomerID"]);
            $("#CustomerCdesc").textbox('setValue', rows["CustomerCdesc"]);
            $("#Area").textbox('setValue', rows["Area"]);
            $("#SallerID").textbox('setValue', rows["SallerID"]);
            $("#Season").textbox('setValue', rows["Season"]);
            $("#ForeignFirm").textbox('setValue', rows["ForeignFirm"]);
            $("#Merchandisers").textbox('setValue', rows["Merchandisers"]);
            $("#Contacts").textbox('setValue', rows["Contacts"]);
            $("#ContactsTel").textbox('setValue', rows["ContactsTel"]);
            $("#ContactsFax").textbox('setValue', rows["ContactsFax"]);
            $("#ContactsEmail").textbox('setValue', rows["ContactsEmail"]);
            $("#MerchandisersTel").textbox('setValue', rows["MerchandisersTel"]);
            $("#MerchandisersEmail").textbox('setValue', rows["MerchandisersEmail"]);
            $("#CurrencyID").textbox('setValue', rows["CurrencyID"]);
            $("#CurrencyRate").textbox('setValue', rows["CurrencyRate"]);
            $("#DeliveredPort").textbox('setValue', rows["DeliveredPort"]);
            $("#DestinationPort").textbox('setValue', rows["DestinationPort"]);
            $("#PoNo").textbox('setValue', rows["PoNo"]);
            $("#PaymentType").textbox('setValue', rows["PaymentType"]);
            $("#PriceType").textbox('setValue', rows["PriceType"]);
            $("#Transport").textbox('setValue', rows["Transport"]);
            $("#DiscountRate").textbox('setValue', rows["DiscountRate"]);
            $("#Discount").textbox('setValue', rows["Discount"]);
            $("#TaxNo").textbox('setValue', rows["TaxNo"]);
            $("#Tax").textbox('setValue', rows["Tax"]);
            $("#ProductAmount").textbox('setValue', rows["ProductAmount"]);
            $("#TotalAmount").textbox('setValue', rows["TotalAmount"]);
            $("#BankAccount").textbox('setValue', rows["BankAccount"]);
            $("#State").textbox('setValue', rows["State"]);
            $("#Remark").textbox('setValue', rows["Remark"]);
            $("#CreateBy").textbox('setValue', rows["CreateBy"]);
            $("#CreateAt").textbox('setValue', rows["CreateAt"]);
            $("#UpdateBy").textbox('setValue', rows["UpdateBy"]);
            $("#UpdateAt").textbox('setValue', rows["UpdateAt"]);
        }
    },
    /**
    *出錯信息彈窗
    */
    ErryFunction: function (data) {
        //提取后臺數據出錯
        $.messager.alert("System Info", GetSystemMessage('CN00003'));
    },
    //salesbom productid 失去焦點調用的函數
    setProductIDblur: function (index) {
        var t = $("#tbSalesBom");
        t.datagrid('selectRow', index);
        t.datagrid('beginEdit', index);
        //$("#tbSalesBom").datagrid('selectRow', index);
        //$('#tbSalesBom').datagrid('beginEdit', index);
        //---產品編號列綁定失去焦點事件   
        var editors = t.datagrid('getEditors', index); //獲得當前行的可編輯列對象,忽略非編輯列
        if (editors.length > 0) {
            var edProductid = editors[1];//editor[1]表示第一列這個控件,即產品編號列
            var edProductDesc = editors[2];
            edProductid.target.bind('blur', function () {
                var item = edProductid.target.val(); //取值
                if (item.length > 0) {
                    item = item.toUpperCase();
                    var tmp = checkProductID(item);
                    if (tmp.Cdesc != "") {
                        edProductid.target.val(item);
                        edProductDesc.target.val(tmp.Cdesc);
                    } else {
                        //無效的產品編號
                        $.messager.alert(window['msg_system_prompt'], GetSystemMessage('CN00007'));
                        edProductid.target.val('');
                        edProductDesc.target.val('');
                    }
                }
            });
        }
    },
    checkProductID: function (id) {
        var result = "{Cdesc:'',Edesc:''}";
        $.ajax({ 
            url: "GetProductID?strProductID=" + id,
            //data: postData,
            async: false,//需設為同步執行
            //contentType: 'application/json;charset=UTF-8',
            type: "post",
            success: function (data) {
                result = data;
            },
            error: this.ErryFunction //错误执行方法
        })
        return result;
    },
    //點擊表格行填充明細表頭
    FillOcDetails: function () {
        var RowFindByID = $('#tbDetails').datagrid('getSelections');
        if (RowFindByID.length == 1) {
            //实现绑定数据显示
            $("#addFormDetails").form("clear");//清空明細表頁面表頭
            $('#ActionType_D').val("");//清空狀態
            var rows = RowFindByID[0];
            $("#Seq").val(rows.Seq);//非Easyui控件注意賦值形式是不相同
            $("#MoType").textbox('setValue', rows.MoType);
            $("#MoDept").textbox('setValue', rows.MoDept);
            $("#MoGroup").textbox('setValue', rows.MoGroup);
            $("#ProductMo").textbox('setValue', rows.ProductMo);
            $("#ProductMoVer").textbox('setValue', rows.ProductMoVer);
            $("#MoState").textbox('setValue', rows.MoState);
            $("#ProductID").textbox('setValue', rows.ProductID);
            $("#ProductCdesc").textbox('setValue', rows.ProductCdesc);
            $("#StyleNo").textbox('setValue', rows.StyleNo);
            $("#ContractID").textbox('setValue', rows.ContractID);
            $("#BrandID").textbox('setValue', rows.BrandID);
            $("#CustProductID").textbox('setValue', rows.CustProductID);
            $("#CustProductName").textbox('setValue', rows.CustProductName);
            $("#CustColorID").textbox('setValue', rows.CustColorID);
            $("#CustColorName").textbox('setValue', rows.CustColorName);
            $("#CustSize").textbox('setValue', rows.CustSize);
            $("#OrderQty").textbox('setValue', rows.OrderQty);
            $("#OrderUnit").textbox('setValue', rows.OrderUnit);
            $("#Price").textbox('setValue', rows.Price);
            $("#PriceUnit").textbox('setValue', rows.PriceUnit);
            $("#RateDiscount").textbox('setValue', rows.RateDiscount);
            $("#AmountDiscount").textbox('setValue', rows.AmountDiscount);
            $("#AmountProduct").textbox('setValue', rows.AmountProduct);
            $("#GetColorSample").textbox('setValue', rows.GetColorSample);
            if (rows.IsFree == '1') {
                $("#IsFree").attr("checked", true)//是否免費选中
            } else {
                $("#IsFree").attr("checked", false);
            }
            if (rows.IsPrint == '1') {
                $("#IsPrint").attr("checked", true)//是否列印
            } else {
                $("#IsPrint").attr("checked", false);
            }
            $("#PlanCompleteDate").textbox('setValue', rows.PlanCompleteDate);
            $("#ArriveDate").textbox('setValue', rows.ArriveDate);
            $("#FactoryShipOutDate").textbox('setValue', rows.FactoryShipOutDate);
            $("#Remarks").textbox('setValue', rows.Remarks);
            $("#OcRemark").textbox('setValue', rows.OcRemark);
            $("#InvoiceRemark").textbox('setValue', rows.InvoiceRemark);
            $("#PlateRemark").textbox('setValue', rows.PlateRemark);
            $("#ProductRemark").textbox('setValue', rows.ProductRemark);

            $("#picture_name").attr("src", rows.ArtImage);//設置圖樣
            //頁面變為不可繼續新增,需按清空方可新增
            this.disableDetails(true);
            this.disableGenMoAndOcID(true);
            this.disableSalesBomToolbar(false);//恢復SalesBom按鈕的可用狀態
            this.disableSate();
        }
        else {
            //每次只能修改一条，你已经选择了<font color='red'  size='6'>
            //$.messager.alert('提示信息', "每次只能修改一条，你已经选择了<font color='red'  size='6'>" + RowFindByID.length + "</font>条");
            $.messager.alert(window['msg_system_prompt'], window['msg_only_select_one'] + RowFindByID.length + "</font>条");
        }
    },
    //查詢貨品基本代碼
    findItem: function (index) {
        var edit_status=''; 
        if (index == null) {
            edit_status = $("#ActionType_D").val();
        } else {
            edit_status = $("#ActionType_Bom").val();
        }    
        if (edit_status != "") {
            //編輯狀態方可彈窗
            if (index == null) {
                //OC明細表頭調用 
                openWin('FindItem', 'FindItem', 850, 530, index);
                //openWin('//../Sales/Views/SalesOrder/FindItem', 'FindItem', 850, 530, index);
            
                return;
            }
            var temp_index = $("#CurrentRowIndex").val();
            if (index == temp_index) {
                //BOM調用
                openWin('FindItem', 'FindItem', 850, 530, index);
            }
        }
    },
    //彈出模式窗口返回值至父窗口
    openWin: function (url, title, width, height,rowIndex, shadow) {   
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
                //$(this).dialog('destroy');//后面可以关闭后的事件
                //document.getElementById('btnSerach').click();
                //判斷后臺是否生成OC數據

                //查詢貨品編碼
                //var strItem = document.getElementById('goods_id').value;//2023/06/28 CANCEL
                //debugger;
                var strItem = "";//document.getElementById('ProductID').value; //2023/06/28 ADD
                if (strItem.length > 0) {
                    if (rowIndex == null) {
                        //OC明細的主檔查貨品編號的按鈕
                        $("#ProductID").val(strItem);//賦值
                        $('#ProductID').next('span').find('input').focus();//获取焦点
                        $('#ProductCdesc').next('span').find('input').focus();//获取焦点觸發事件使描述刷新
                        $('#ProductID').next('span').find('input').focus();
                    } else {
                        //BOM表格的查詢
                        var editors = $('#tbSalesBom').datagrid('getEditors', rowIndex); //獲得當前行的可編輯列對象,忽略非編輯列
                        if (editors.length > 0) {
                            var edProductID = editors[1];//editor[1]表示第一列對象,即產品編號列
                            //var item = edProductID.target.val();
                            edProductID.target.val(strItem);//單元格賦值
                            $(edProductID.target).focus();//單元格获取焦点
                        }
                    }
                }
            }
        });
        win.dialog('open');
    },    
    checkPlan:function (id,ver,seq) {
        var result = false;
        var postData = {OcID:id,Ver:ver,Seq:seq};
        //$.ajax({
        //    url: "/SalesOrder/CheckCreatePlan" + id,
        //    data: postData,
        //    async: false,//需設為同步執行
        //    //contentType: 'application/json;charset=UTF-8',
        //    type: "post",
        //    success: function (data) {
        //        result = data;
        //    },
        //    error: ErryFunction //错误执行方法
        //})    
        return result;
    },
    checkEmpty: function (objValue, objLable,activePage) {    
        if (objValue == "" || objValue == null) {        
            this.setActivePage(activePage);//切換至當前相對應的頁面    
            $.messager.alert(window['msg_system_prompt'], objLable);
            return true;
        }
        return false;
    },
    getRate: function (unit) {
        switch (unit) {
            case "PCS":
                rate = 1;
                break;
            case "SET":
                rate = 1;
                break;
            case "GRS":
                rate = 144;
                break;
            case "DZ":
                rate = 12;
                break;
            case "K":
                rate = 1000;
                break;
            case "H":
                rate = 100;
                break;
            case "LITRE":
                rate = 1;
                break;
            case "YDS":
                rate = 1;
                break;
            case "METER":
                rate = 1;
                break;
            default:
                break
        }
        return rate;
    },
    //function AddList() {
    //    $("#btnAddList").click(function () {
    //        //在前台对用户输入的信息做判断，不符合要求时“添加用户”就不能提交给后台
    //        var valid = $("#addForm").form('validate');
    //        if (valid == false) {
    //            return false;
    //        }
    //        var postData = $("#addForm").serializeArray();
    //        //Ajax异步实现加载
    //        $.ajax({
    //            url: "/SalesOrder/AddList?OcID=" + $("#OcID").val(),
    //            data: postData,
    //            type: "post",
    //            success: function (data) {
    //                if (data == "OK") {
    //                    $.messager.alert("系统提示！", "添加成功");
    //                    //$('#AddDialog').dialog('close');
    //                    //$("#tbDetails").datagrid("reload");
    //                    $("#addForm").form("clear")
    //                    SearchOcDetails();
    //                }
    //                else {
    //                    $.messager.alert("系统提示！", "添加失败");
    //                }
    //            }
    //        })
    //    });
    //};

    ///**
    // * 當前頁面設置公共變量
    // * 设置值
    // * @param name
    // * @param value
    // */
    // var setValue = function (name, value) {
    //    var self = this;
    //    console.info('self:', self);
    //    console.info('self==window:', self == window);
    //    if (arguments.length == 2) {
    //        self[name] = value;
    //        return;
    //    }
    //    if (arguments.length == 1 && Object.prototype.toString.call(arguments[0]) == "[object Object]") {
    //        for (var key in arguments[0]) {
    //            setValue(key, arguments[0][key]);
    //            //self[key]=arguments[0][key];
    //        }
    //    }
    //},



}






