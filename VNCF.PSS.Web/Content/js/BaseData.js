/*
*后臺返回兩列(ID,Name)給下拉列表框
*參數:
*table_name---表名
*obj---下拉列表框對象
*/
function initBaseInfo(table_name, obj) {
    $.ajax({
        url: "/BaseData/GetBaseInfo?strTableName=" + table_name,
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
                onHidePanel: check_input(obj),
                //panelHeight: 'auto', // 高度自适应
                //required: true,
                data: data,
                valueField: 'ID',
                textField: 'Name',
                events: { keyup: fnKeyUpper } //字母轉大寫                
            });
        },
        error: fnError
    });
}

/*
*后臺返回一列(ID)給下拉列表框
*參數:
*table_name---表名
*obj---下拉列表框對象
*/
function initBaseInfoByName(table_name, obj) {
    $.ajax({
        url: "/BaseData/GetBaseInfoByName?strTableName=" + table_name,
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
                onHidePanel: check_input(obj),
                //panelHeight: 'auto', // 高度自适应
                //required: true,
                data: data,
                valueField: 'ID',
                textField: 'ID',
                events: { keyup: fnKeyUpper } //字母轉大寫
            });
        },
        error: fnError
    });
}

/**
*出錯信息彈窗
*/
function fnError(data) {
    $.messager.alert("System Info", "Error getting backend data!");
}

//字母轉大寫
function fnKeyUpper() {
    this.value = this.value.toUpperCase();
}

//獲取服務器時間
function getDBDateTime() {
    Ajax.call('/BaseData/GetDBDate', '', setDBDateTime, 'GET', 'JSON');
}
function setDBDateTime(result) {
    $("#OrderDate").textbox("setValue", result.current_date);
    $("#ReceivedDate").textbox("setValue", result.current_date);
    $("#CreateAt").textbox("setValue", result.current_datetime);
}

//*****可以直接輸入下拉列表框中存在的值,輸入下拉列表框中不存在的值,回車自動清空
function check_input(obj) {
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
