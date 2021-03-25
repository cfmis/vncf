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
                onHidePanel: check_input_unit(obj),
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
                onHidePanel: check_input_unit(obj),
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