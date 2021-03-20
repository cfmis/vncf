/**
 * 銷售訂單錄入
 */

//最大單據編號
function getMaxOcID(area) {
    Ajax.call('GetMaxOcID', '&strArea=' + area, setMaxOcID, 'GET', 'JSON');
};
function setMaxOcID(result) {
    $("#OcID").textbox("setValue", result);
}


function getCustomerInfo(id) {
    Ajax.call('GetCustomer', '&strCustomerID=' + id, setCustomerInfo, 'GET', 'JSON');
}
function setCustomerInfo(result) {    
    $("#CustomerCdesc").textbox("setValue", result.Cdesc);
    $("#CustomerEdesc").textbox("setValue", result.Edesc);
    if (result.Cdesc == "") {
        $("#CustomerID").textbox("setValue", "");
    }
}

//貨幣匯率
function getCurrencyRate(id) {
    Ajax.call('GetCurrencyRate', '&strCurrencyID=' + id, setCurrencyRate, 'GET', 'JSON');
}
function setCurrencyRate(result) {
    $("#CurrencyRate").textbox('setValue', result);
}
//貨品名稱
function getProductID(id) {   
    Ajax.call('GetProductID', '&strProductID=' + id, setProductDesc, 'GET', 'JSON');
}
function setProductDesc(result) {
    $("#ProductCdesc").textbox("setValue", result.Cdesc);
    if(result.Cdesc=="")
    {
        $("#ProductID").textbox("setValue", "");
    }
}

//檢查狀態,是否可以生成頁數
function DisableGenMoAndOcID(isDisabled) {
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
}

//details undo change
function setUndo() {
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
}

//區域
function DisableArea(isDisabled) {
    if (isDisabled) {
        //區域下拉框不可用用,代表不可生成OCID
        $('#Area').combobox('readonly', true).combobox('textbox').prev().hide();
        //$('#Area').combobox({ readonly: true });
    } else {
        //可選擇下拉框
        $('#Area').combobox('readonly', false).combobox('textbox').prev().show();
        //$('#Area').combobox({ readonly: false });
    }
}

//單據狀態,頁數狀態只讀
function DisableSate() {
    $('#State').combobox('readonly', false).combobox('textbox').prev().show();//
    $('#State').combobox('readonly', true).combobox('textbox').prev().hide();
    $('#MoState').combobox('readonly', false).combobox('textbox').prev().show();//
    $('#MoState').combobox('readonly', true).combobox('textbox').prev().hide();
}

//產生mo流水號
function getMoSerialNo() {
    var mo_type = $("#MoType").combobox("getValue");  //当前combobox的值
    var mo_dept = $("#MoDept").combobox("getValue");
    var mo_group = $("#MoGroup").combobox("getValue");

    if (mo_type != "" && mo_dept != "" && mo_group != "") {       
        var postData = { strMoType: mo_type, strMoDept: mo_dept, strMoGroup: mo_group };
        $.ajax({
            url: "/SalesOrder/GetMoSerialNo",
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
            error: ErryFunction
        });
    }
};

//設置控件字體大小
function setFontSize() {
    var tb = $('.font_group');
    $.each(tb, function (n, value) {
        $(value).textbox('textbox').css("font-size", "9px");
    });
}

//設置控件屬性為只讀的背景色為灰色
function setReadonlyBackground() {
    var tb = $('.myReadonly');
    $.each(tb, function (n, value) {
        $(value).textbox('textbox').css('background', '#F0F0F0');
    });
}

function getDBDateTime() {
    Ajax.call('GetDBDate', '', setDBDateTime, 'GET', 'JSON');
}
function setDBDateTime(result) {
    $("#OrderDate").textbox("setValue", result.current_date);
    $("#CreateAt").textbox("setValue", result.current_datetime);
}

function initBaseInfo(table_name, obj) {
    $.ajax({
        url: "/SalesOrder/GetBaseInfo?strTableName=" + table_name,
        type: "POST",
        async: true,
        contentType: 'application/json;charset=UTF-8',
        //data: JSON.stringify(param),
        dataType: "JSON",
        timeout: 20000,
        success: function (data) {
            $(obj).combobox({
                //editable: false, // 只读 如果只能從下拉中選取,需將此項設為
                limitToList: true,//只能从下拉中选择值
                reversed: true,//定义在失去焦点的时候是否恢复原始值。
                onHidePanel: check_input_unit(obj),
                //panelHeight: 'auto', // 高度自适应
                //required: true,
                data: data,
                valueField: 'id',
                textField: 'name',
                events: { keyup: fnKeyUp } //字母轉大寫                
            });         
        },
        error: ErryFunction
    });
}

function initBaseInfoByName(table_name, obj) {
    $.ajax({
        url: "/SalesOrder/GetBaseInfoByName?strTableName=" + table_name,
        type: "POST",
        async: true,
        contentType: 'application/json;charset=UTF-8',
        //data: JSON.stringify(param),
        dataType: "JSON",
        timeout: 20000,
        success: function (data) {
            $(obj).combobox({
                //editable: false, // 只读 如果只能從下拉中選取,需將此項設為
                limitToList: true,//只能从下拉中选择值
                reversed: true,//定义在失去焦点的时候是否恢复原始值。
                onHidePanel: check_input_unit(obj),
                //panelHeight: 'auto', // 高度自适应
                //required: true,
                data: data,
                valueField: 'id',
                textField: 'id',
                events: { keyup: fnKeyUp } //字母轉大寫
            });
        },
        error: ErryFunction
    });
}

//$.ajax({
//    url: "/SalesOrder/GetCustomerByID?strCustomerID=" + customerID,
//    type: "POST",
//    async: true,
//    contentType: 'application/json;charset=UTF-8',
//    dataType: "JSON",
//    timeout: 20000,
//    success: function (data) {
//        //填充内容
//        if (data.length > 0) {
//            $("#CustomerCdesc").textbox("setValue", data[0]["Cdesc"]);
//            $("#CustomerEdesc").textbox("setValue", data[0]["Cdesc"]);
//        } else {
//            $.messager.alert("系统提示！", customerID + "客戶編號不存在!");
//            $("#CustomerID").textbox("setValue", "");
//            $("#CustomerCdesc").textbox("setValue", "");
//            $("#CustomerEdesc").textbox("setValue", "");
//        }
//    },
//    error: ErryFunction
//});

//*****可以直接輸入下拉列表框中存在的值,輸入下拉列表框中不存在的值,回車自動清空
function check_input_unit(obj) {
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
}

//字母轉大寫
function fnKeyUp() {
    this.value = this.value.toUpperCase();
}

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

//設置主檔工具欄按鈕狀態
function setEditMasterButtonSatus(isDisable) {
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
function setEditDetailButtonSatus(isDisable) {
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


//設置SalesBOM工具欄按鈕狀態
function setSalesBomButtonSatus(isDisable) {
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
}

//禁用/恢復SalesBOM工具欄按鈕(OC明細操作時)
function disableSalesBomToolbar(isDisable) {
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
function disableOCToolbar(isDisable) {
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

function DisableMaster(isDisable) {
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
}

function DisableDetails(isDisable) {
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
}

//更改主表信息,保存前檢查
function EditMaster(title) {
    setActivePage(title);
    if ($('#ActionType_H').val() == "NEW") {
        //主表資料為新增狀態,不可進行此操作！"
        $.messager.alert(window['msg_system_prompt'], window['msg_master_data_is_added_status']);
        return;
        //
        //and the current operation is invalid
    }
    if ($('#OcID').val() == "") {
        //當前主表資料為空,不可進行此操作！"
        $.messager.alert(window['msg_system_prompt'], window['msg_master_data_is_empty']);
        return;
    }
    disableTabs("#tabPages", 2, true);//非活動Tab禁用
    $('#ActionType_H').val("EDIT");//設置狀態
    setEditMasterButtonSatus(true)
    DisableMaster(false);//對象可修改
    DisableArea(true);//區域不可點擊
    DisableSate();//設置狀態只讀
}

function setActivePage(PageTitle)
{
    $("#tabPages").tabs("select", PageTitle);//設置活動的page
}

function UndoEditMaster() {
    setEditMasterButtonSatus(false)
    DisableMaster(true);//對象不可修改
    disableTabs("#tabPages", 3, false);//非活動Tab解除禁用
    $('#ActionType_H').val("");    
}
 
function disableTabs(tableID, arrLenth,isEnableOtherTab) {
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
}


function clearDetailHead()
{
    //查出曾落單繼續新增明細,注意點擊表grid表格時需將ActionType_D設置為空
    $("#addFormDetails").form("clear");//清空明細表頁面表頭  
    $("#ProductMoVer").textbox("setValue", "0");//普通控件賦值
    $('#MoState').combobox('setValue', '0');//下拉列表框賦值
    $('#IsPrint').attr("checked",true);

    $("#ActionType_D").val("NEW");
    $("#Seq").val("");
    DisableDetails(false); //明細可編號
    DisableGenMoAndOcID(false); //可生成頁數
    DisableSate();//設置狀態只讀
}


/**
 * 日期解析，字符串转日期
 * @param dateString 可以为2017-02-16，2017/02/16，2017.02.16
 * @returns {Date} 返回对应的日期对象
 */
function dateParse(dateString) {
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
};

/**
 * 日期加减多少天
 * @param dateObj 日期对象
 * @param days 加减天数
 * @returns 
 */
function dateAdd(dateObj, days) {
    dateObj.setDate(dateObj.getDate() + days);
    var y = dateObj.getFullYear();
    var m = dateObj.getMonth() + 1;
    var d = dateObj.getDate();
    var strdate= y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d);
    return strdate;
};

//返回當前客戶端日期
function iniDate() {
    var datetime = new Date();
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
    var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
    //var hour = datetime.getHours()< 10 ? "0" + datetime.getHours() : datetime.getHours(); 
    //var minute = datetime.getMinutes()< 10 ? "0" + datetime.getMinutes() : datetime.getMinutes(); 
    //var second = datetime.getSeconds()< 10 ? "0" + datetime.getSeconds() : datetime.getSeconds(); 
    //return year + "-" + month + "-" + date+" "+hour+":"+minute+":"+second;
    return year + "-" + month + "-" + date
}

/**
 *計算貨品金額
*/
function countItemAmount() {    
    var edit_satus=$("#ActionType_D").val();
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
                order_unit_rate = getQuantityUnitRate(OrderUnit);
            }
            OrderQty = OrderQty * order_unit_rate;//PCS
            var price_unit_rate = getQuantityUnitRate(PriceUnit);
            AmountProduct = (OrderQty / price_unit_rate) * Price;
        }
    } else {
        AmountProduct = 0;
    }

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
    Product_Amount = getTotalAmount($("#OcID").val(), $("#Ver").val(), $("#Seq").val());  
    //加上當前行時需考慮是否免費
    if ($("#IsFree").is(":checked") == false) {
        //即不打勾為收費       
        Product_Amount = Product_Amount + AmountProduct;//再加上當前值       
    } 
    
    if (Disc_Rate > 0) {
        Disc_Amount = Product_Amount * (Disc_Rate / 100).toFixed(2);
        Product_Amount = Product_Amount - Disc_Amount;      
    } else {
        Disc_Amount = 0;
    }
    $("#DiscountAmount").textbox("setValue", Disc_Amount);
    $("#ProductAmount").textbox("setValue", Product_Amount.toFixed(2));
}

//單位單位匯率
function getQuantityUnitRate(id) {   
    var rate = 0;
    $.ajax({
        url: "/SalesOrder/GetQuantityUnitRate?strID=" + id,
            //data: postData,
            type: "POST",
            async: false,
            //contentType: 'application/json;charset=UTF-8',
            dataType: "JSON",
            timeout: 20000,
            success: function (data) {
                rate = data;
            },
            error: ErryFunction
   });
    return rate;
};

//取總金額
function getTotalAmount(id, ver, current_seq) {
    //后端統計不包括當前行
    if (ver == "")
    {
        ver = 0;
    }
    var postData = { strOcID: id,Ver:ver, strSeq: current_seq };
    var total_amount = 0;
    $.ajax({
        url: "/SalesOrder/GetTotalAmount",
        data: postData,
        type: "POST",
        async: false,
        //contentType: 'application/json;charset=UTF-8',
        dataType: "JSON",
        timeout: 20000,
        success: function (data) {
            total_amount = data;
        },
        error: ErryFunction
    });
    return total_amount;//.toFixed(2);
};

function ErryFunction(data) {
    $.messager.alert("System Info", "Error getting backend data!");
}


function format(n){
    n = parseFloat(n.replace(/[^\d|.]/g, '')).toFixed(2);
    return n;
}

//function format(num, fixed) {
//    return num.toFixed(fixed).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
//}


/***
*主表,明細表同時保存
*/
function Save() {
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
        url: "/SalesOrder/AddList?OcID=" + $("#OcID").val(),
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
                $.messager.alert(window['msg_system_prompt'], window['msg_add_details_failed']);
            }
        }
    })
    
    //保存成功后設置明細項目新增可用的初始狀態
    $("#ActionType_H").val("");
    $("#ActionType_D").val("NEW");
    $("#addFormDetails").form("clear");//清空明細表頁面表頭
    $("#ProductMoVer").textbox("setValue", "0");//普通控件賦值
    $('#MoState').combobox('setValue', '0');//下拉列表框賦值
    $("#IsPrint").attr("checked", true)//默認PI需列印

    DisableMaster(true); //主檔頁數不可編號
    DisableDetails(false); //明細可編號
    DisableGenMoAndOcID(false); //GenMO可用,可生成頁數
    DisableSate();//設置狀態只讀
}

/*
*保存主表
*/
function SaveMaster() {
    var postData = $("#addFormHead").serializeArray();
    var OcID = "";
    //Ajax异步实现加载
    $.ajax({
        //url: "/SalesOrder/AddHead?r=" + Math.random(),
        url: "/SalesOrder/AddHead",
        data: postData,
        async: false,//改为同步方式
        type: "post",
        success: function (data) {
            if (data == "OK") {
                OcID = data;
            }
            else {
                //主檔資料添加失败                
                $.messager.alert(window['msg_system_prompt'], window['msg_add_master_failed']);
            }
        }
    })
    return OcID;
}

/**
*保存修改的主表信息
*/
function SaveEditMaster() {
    var valid = $("#addFormHead").form('validate');
    if (valid == false) {
        //請檢查主檔資料的完整性
        $.messager.alert(window['msg_system_prompt'], window['msg_master_data_no_valid']);
        return;
    }
    var result = "";
    result = SaveMaster();
    if (result == "OK") {
        //主表資料保存成功
        $.messager.alert(window['msg_system_prompt'], window['msg_saved_master_success']);
        setEditMasterButtonSatus(false)
        DisableMaster(true);//對象不可修改
        disableTabs("#tabPages", 2, false);//非活動Tab解禁
        $('#ActionType_H').val("");
    }
}

/*
*主表明細表單輸入有效性檢查
*/
function ValidForm() {
    var valid = $("#addFormHead").form('validate');
    if (valid == false) {
        //請檢查主檔資料的完整性
        $.messager.alert(window['msg_system_prompt'], window['msg_master_data_no_valid']);
        return false;
    }
    valid = $("#addFormDetails").form('validate');
    if (valid == false) {
        //請檢查明細資料的完整性
        $.messager.alert(window['msg_system_prompt'], window["msg_detail_data_no_valid"]);
        return false;
    }
    return true;
}

/**
*查詢主檔
*/
function SearchOcHead() {
    //Ajax异步实现加载
    $.ajax({
        url: "/SalesOrder/GetOcHead?OcID=" + $("#OcID").val(),
        success: FillOcHead,
        error: ErryFunction //错误执行方法        
    })
}


function saveSalesBom(postData)
{
    var save_flag = "";
    $.ajax({
        url: "/SalesOrder/AddSalesBom",
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
                $.messager.alert(window['msg_system_prompt'], window['msg_add_failed']);
            }
        }
    });
    return save_flag;
}

function FillOcHead(data) {
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
}

/**
*出錯信息彈窗
*/
function ErryFunction(data) {
    $.messager.alert("System Info", "Error getting backend data!");
}

//salesbom productid 失去焦點調用的函數
function setProductIDblur(index) {
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
                    $.messager.alert(window['msg_system_prompt'],window["msg_invalid_product_id"]);
                    edProductid.target.val('');
                    edProductDesc.target.val('');
                }
            }
        });
    }
}

function checkProductID(id) {
    var result = "{Cdesc:'',Edesc:''}";   
    $.ajax({
        url: "/SalesOrder/GetProductID?strProductID=" + id,
        //data: postData,
        async: false,//需設為同步執行
        //contentType: 'application/json;charset=UTF-8',
        type: "post",
        success: function (data) {
            result = data;
        },
        error: ErryFunction //错误执行方法
    })
    return result;
}

//點擊表格行填充明細表頭
function FillOcDetails() {
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
        DisableDetails(true);
        DisableGenMoAndOcID(true);
        disableSalesBomToolbar(false);//恢復SalesBom按鈕的可用狀態
        DisableSate();
    }
    else {
        //每次只能修改一条，你已经选择了<font color='red'  size='6'>
        //$.messager.alert('提示信息', "每次只能修改一条，你已经选择了<font color='red'  size='6'>" + RowFindByID.length + "</font>条");
        $.messager.alert(window['msg_system_prompt'], window['msg_only_select_one'] + RowFindByID.length + "</font>条");
    }
}

//查詢貨品基本代碼
function findItem(index) {
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
            openWin('/Sales/SalesOrder/FindItem', 'FindItem', 850, 560, index);
            return;
        }
        var temp_index = $("#CurrentRowIndex").val();       
        if (index == temp_index) {
            //BOM調用
            openWin('/Sales/SalesOrder/FindItem', 'FindItem', 850, 560, index);
        }
    }
}

//彈出模式窗口返回值至父窗口
function openWin(url, title, width, height,rowIndex, shadow) {   
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
            if (title == "Build OC") {                
                var OcID = document.getElementById("BuildOcID").val();
                var OcVer = document.getElementById("BuildOcVer").val();
                alert('OcID:' + OcID + ';Ver:' + OcVer);
                if (OcID != "") {
                    var objOcID = document.getElementById("OcID");
                    var objVer = document.getElementById("Ver");
                    objOcID.value = OcID;
                    objVer.value = OcVer;
                    alert('objOcID.value:' + objOcID.value + ';objVer.value:' + objVer.value);
                    window.parent.SearchOcHead();
                    window.parent.SearchOcDetails();
                    //window.parent.closeWindow();
                }
                return;
            }

            //查詢貨品編碼
            var strItem = document.getElementById('goods_id').value;
            if (strItem.length > 0) {
                if (rowIndex == null) {
                    //OC明細的主檔查貨品編號的按鈕
                    $("#ProductID").val(strItem);//賦值
                    $('#ProductID').next('span').find('input').focus();
                    $('#CustProductName').next('span').find('input').focus();
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
}

function getCurrentRowIndex(obj) {
    var index = undefined;
    var rowdata = $(obj).datagrid('getSelected');
    if (rowdata) {
        index = $(obj).datagrid('getRowIndex', rowdata);
    }
    return index
}

function checkPlan(id,ver,seq) {
    var result = false;
    var postData = {OcID:OcID,Ver:ver,Seq:seq};
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
}

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


/**
 * 當前頁面設置公共變量
 * 设置值
 * @param name
 * @param value
 */
var setValue = function (name, value) {
    var self = this;
    console.info('self:', self);
    console.info('self==window:', self == window);
    if (arguments.length == 2) {
        self[name] = value;
        return;
    }
    if (arguments.length == 1 && Object.prototype.toString.call(arguments[0]) == "[object Object]") {
        for (var key in arguments[0]) {
            setValue(key, arguments[0][key]);
            //self[key]=arguments[0][key];
        }
    }
}
