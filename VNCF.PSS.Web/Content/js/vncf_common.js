
//顯示窗口
function showMessageDialog(url, title, width, height, shadow) {
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
}
//關閉窗口
function closeWindow() {
    //window.opener = null;
    ////window.open(' ', '_self', ' ');
    //window.open('', '_self');
    //window.close();

    $('#msgwindow').dialog('close');
    //$('msgwindow').dialog('close');
}

//提取提示信息
function GetSystemMessage(ID){
    var msg = Ajax.call('/Base/BaseData/GetSystemMessage', '&ID=' + ID, "", 'GET', 'JSON', false);
    return msg;
}

//轉換日期格式：YYYY/MM/DD
function ChangeDateToChar(value) {
    if (value != null) {
        var date = new Date(value);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        var minute = date.getMinutes();
        minute = minute < 10 ? ('0' + minute) : minute;
        var second = date.getSeconds();
        second = second < 10 ? ('0' + second) : second;
        //alert(y + '-' + m + '-' + d + ' ' + h + ':' + minute + ":" + second);
        //var dd = y + '/' + m + '/' + d;
        return y + '/' + m + '/' + d;
    } else {
        return "";
    }
}