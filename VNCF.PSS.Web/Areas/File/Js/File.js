var uploader;

//页面入口函数
$(function () {   
    //adminShare();//是否具备管理公共文件夹权限    

    initData('public');
    loadTree();

    //uoloadSetting();//下载控件设置   
    //$("#dlg").height("100px");    
});


var currentPath; //当前路径
var canAdminShare = false;

//权限判断  
function canAdmin() {
    return true;
}
//权限
function adminShare() {
    $.ajax({
        url: '/File/File/AdminShare',
        cache: false,
        type: "POST",
        success: function (data) {
            data = JSON.parse(data);
            if (data.result == "true") 
                canAdminShare = true;
            else
                canAdminShare = false;
        },
        error: function (e) {
            //表单提交时发生错误的操作
            httpError(e.responseText);
        },
        beforeSend: function (XMLHttpRequest) {
            $.messager.progress();	//开启等待进度条
        },
        complete: function (XMLHttpRequest, textStatus) {
            $.messager.progress('close');	//关闭等待进度条
        }
    });
}

//数据初始化
function initData(param) {    
    currentPath = param;
    $('#dg').datagrid({
        url: '/File/File/GetFiles',        
        iconCls: 'sys_table',
        //idField: 'path',
        singleSelect: true,
        checkbox: true,
        rownumbers: true,
        selectOnCheck: false,
        checkOnSelect: false,
        queryParams: { path: param },
        toolbar: '#toolbar',
        fit: true,
        columns: [[
            { field: 'ck', checkbox: true },
            {
                title: '名称', field: 'filename', formatter: function (value, row) {
                    return "<img src=\"" + row.typeIcon + "\" style='border:0px;vertical-align:middle;margin:0px 5px 0px 2px'><lable>" + value + "</lable>";
                }, width: 220
            },
            { title: '类型/大小', field: 'size', align: 'right', width: 80 },
            { title: '创建时间', field: 'createtime', width: 120 },
            { title: '更新时间', field: 'updatetime', width: 120 },
            { title: '文件類型', field: 'file_type', width: 100, hidden: 'true' },
            {
                title: '文件用途', field: 'file_desc', width: 120,
                //設定編輯格式,需配合某行'beginEdit'開啟功能,方可實現編輯功能
                //實例代碼:$('#dg').datagrid('selectRow',index).datagrid('beginEdit',index)
                editor: { type: 'validatebox' } 
                //options: { required: true }//設定編輯規則屬性
            },
            { title: '文件用途(VN)', field: 'file_desc_vn', width: 120, editor: { type: 'validatebox' } },
            { title: 'ID', field: 'key_id', width: 120, hidden: 'true' }
    
        ]],
        onLoadError: function (e) { //当用户登录超时，绑定数据发生
            httpError(e.responseText);
        },
        onRowContextMenu: function (e, index, row) {
            e.preventDefault();
            $('#contextMenu').menu('show', {
                left: e.pageX,
                top: e.pageY
            });
        },
        onDblClickRow: function (index, row) {
            if (row.size == '文件夹')
                initData(row.path); //更新列表信息
        },
        onCheck: function (index, row) {
            var rows = $('#dg').datagrid('getChecked');
            ctrlBtn(rows);

            //開啟當前行中某列的編輯狀態
            $('#dg').datagrid('selectRow', index).datagrid('beginEdit', index);            
        },
        onUncheck: function (index, row) {
            var rows = $('#dg').datagrid('getChecked');
            ctrlBtn(rows);

            //added in 2023/28/22
            //關閉當前行中某列的編輯狀態
            $('#dg').datagrid('endEdit', index);

            //選擇編輯對象
            //var module = $('#dg').datagrid('getEditor', { index: index, field: 'file_desc' }).target;
            ////關閉對象編輯功能
            //module.textbox({ disabled: true })
            //end 2023/28/22
        },
        //onCheckAll: ctrlBtn,
        onCheckAll: function(rows){
            ctrlBtn(rows);

            //added 2023/08/22
            for (var i = 0; i < rows.length; i++) {
                //開啟行中某列的編輯狀態
                $('#dg').datagrid('selectRow', i).datagrid('beginEdit', i);
            }
            
        },
        onUncheckAll: function (rows) {
            ctrlBtn(null);
            
            //2023/08/22
            var rows = $("#dg").datagrid("getRows");//獲取據有行數據
            for (var i = 0; i < rows.length; i++) {
                //關閉行中某列的編輯狀態
                $('#dg').datagrid('endEdit', i);//清除行的編輯狀態
                //var value = rows[i].column_name;
                //var value = rows[i].key_id;
                //console.log(value);
                //alert(value);
            }            
        },
        onLoadSuccess: function (data) {
            $('#dg').datagrid('clearChecked'); //清空选择
            ctrlBtn(null);
        },
        
    });
}

//控制控件是否有效
function ctrlBtn(rows) {
    if (canAdmin()) {
        $('#btnCreateFolder').linkbutton('enable');
        $('#btnUploadTool').linkbutton('enable');
    }
    else {
        $('#btnCreateFolder').linkbutton('disable');
        $('#btnUploadTool').linkbutton('disable');
    }
    if (rows && rows.length > 0) {
        if (rows.length == 1 && canAdmin()) {
            $('#btnRe').linkbutton('enable');
            $('#contextMenu').menu('enableItem', $('#menuRe')[0]);
        }
        else {
            $('#btnRe').linkbutton('disable');
            $('#contextMenu').menu('disableItem', $('#menuRe')[0]);
        }
        if (canAdmin()) {
            $('#btnDel').linkbutton('enable');
            $('#contextMenu').menu('enableItem', $('#menuDel')[0]);
            $('#btnCut').linkbutton('enable');
            $('#contextMenu').menu('enableItem', $('#menuCut')[0]);
            $('#btnZip').linkbutton('enable');
            $('#contextMenu').menu('enableItem', $('#menuZip')[0]);

            $('#btnSave').linkbutton('enable');
        }
        else {
            $('#btnDel').linkbutton('disable');
            $('#contextMenu').menu('disableItem', $('#menuDel')[0]);
            $('#btnCut').linkbutton('disable');
            $('#contextMenu').menu('disableItem', $('#menuCut')[0]);
            $('#btnZip').linkbutton('disable');
            $('#contextMenu').menu('disableItem', $('#menuZip')[0]);

            $('#btnSave').linkbutton('disable');
        }
        $('#btnCopy').linkbutton('enable');
        $('#btnDown').linkbutton('enable');
        $('#btnSave').linkbutton('enable');
        $('#contextMenu').menu('enableItem', $('#menuCopy')[0]);
        $('#contextMenu').menu('enableItem', $('#menuDown')[0]);
    }
    else {
        $('#btnRe').linkbutton('disable');
        $('#btnDel').linkbutton('disable');
        $('#btnCut').linkbutton('disable');
        $('#btnCopy').linkbutton('disable');
        $('#btnZip').linkbutton('disable');
        $('#btnDown').linkbutton('disable');
        $('#btnSave').linkbutton('disable');

        $('#contextMenu').menu('disableItem', $('#menuRe')[0]);
        $('#contextMenu').menu('disableItem', $('#menuDel')[0]);
        $('#contextMenu').menu('disableItem', $('#menuCut')[0]);
        $('#contextMenu').menu('disableItem', $('#menuCopy')[0]);
        $('#contextMenu').menu('disableItem', $('#menuZip')[0]);
        $('#contextMenu').menu('disableItem', $('#menuDown')[0]);
    }
    if (currentPath == "\\")
        $('#btnUp').linkbutton('disable');
    else
        $('#btnUp').linkbutton('enable');
}

//树图
function loadTree() {   
    $('#ftree').tree({
        url: '/File/File/GetDirectory',
        onLoadError: function (e) { //当用户登录超时，绑定数据发生
            httpError(e.responseText);
        },
        onClick: function (node) {
            initData(node.id); //更新列表信息
        }
    });
}

//创建文件夹
async function createFolder() {
    var power = await checkPermission("20069","btnCreateFolder");
    if (power === "0") {
        return;
    }   

    $.messager.prompt('创建新文件夹', '请输入新文件夹名称', function (r) {
        if (r) {
            $.ajax({
                url: '/File/File/CreateFolder',
                data: { path: currentPath + '\\' + r },
                cache: false,
                type: "POST",
                success: function (data) {
                    data = JSON.parse(data);
                    if (data.result == "ok") {
                        $('#dg').datagrid('reload', { path: currentPath }); //更新列表信息
                        var node = $('#ftree').tree('find', currentPath);
                        if (node)
                            $('#ftree').tree('reload', node.target);//更新目录结构树信息
                        $.messager.alert('提示信息', '创建成功！', 'info');
                    }
                    else {
                        $.messager.alert('提示信息', data.message, 'warning');
                    }
                },
                error: function (e) {
                    //表单提交时发生错误的操作
                    httpError(e.responseText);
                },
                beforeSend: function (XMLHttpRequest) {
                    $.messager.progress();	//开启等待进度条
                },
                complete: function (XMLHttpRequest, textStatus) {
                    $.messager.progress('close');	//关闭等待进度条
                }
            });
        }
    });
}

//刷新当前列表信息
function refersh() {
    initData(currentPath); //更新列表信息
}

//向上
function up() {
    if (currentPath == "\\") {
        $.messager.alert('提示信息', "您已经到根目录了！", 'warning');
    }
    else {
        var parent;
        if (currentPath.lastIndexOf("\\") > 0) {
            parent = currentPath.substring(0, currentPath.lastIndexOf("\\"));
        }
        else {
            parent = "\\";
        }
        initData(parent); //更新列表信息
    }
}

//保存2023/08/22
async function save() {
    var power= await checkPermission("20069", "btnSave");
    if (power === "0") {
        return;
    }
    
    var rows = $('#dg').datagrid('getChecked');
    if (rows && rows.length > 0) {       
        $.messager.confirm('提示', '您确认要保存当前选择的项目吗？', function (r) {
            if (r) {
                var selected = "";                
                var file_desc = "",file_desc_vn = "",file_desc_old = "", file_desc_vn_old = "";                
                var tb = $("#dg");               
                for (var i = 0; i < rows.length; i++) {
                    //var value =rows[i].key_id;  //例子:取某字段值,但取到的是未更改前的值
                    var index = tb.datagrid('getRowIndex', rows[i]);//獲取選中行的索引                
                    //editors:獲得全部的處于可編輯狀態的列數組對象(忽略不可編輯的列)
                    var editors = tb.datagrid('getEditors', index); 
                    file_desc = editors[0].target.val();
                    file_desc_old = editors[0].oldHtml;
                    file_desc_vn = editors[1].target.val();
                    file_desc_vn_old = editors[1].oldHtml;
                    if (file_desc != file_desc_old || file_desc_vn != file_desc_vn_old) {
                        selected += rows[i].key_id.toString() + "*" + file_desc + "*" + file_desc_vn + "|";
                    }
                }
                if (selected.length > 0) {
                    selected = selected.substr(0, selected.length - 1);
                }
                if (selected.length === 0) {
                    $.messager.alert('提示信息', "沒有要更新的數據!", 'warning');
                    return;
                }
                
                $.ajax({
                    url: '/File/File/Save',
                    data: { file: selected },
                    cache: false,
                    type: "POST",
                    success: function (data) {
                        data = JSON.parse(data);
                        if (data.result == "ok") {
                            //$('#dg').datagrid('reload', { path: currentPath }); //更新列表信息
                            //var node = $('#ftree').tree('find', currentPath);
                            //if (node)
                            //$('#ftree').tree('reload', node.target);//更新目录结构树信息
                            $('#dg').datagrid('clearChecked'); //清空选择
                            //$.messager.alert('提示信息', '保存成功！', 'info');
                            
                            //無需等待提示框   
                            showMessage('保存成功！')
                            //$.messager.show({
                            //    title:'提示信息',
                            //    msg:'保存成功！',
                            //    timeout:1500,
                            //    showType:'show',
                            //    style:{
                            //        right:'',
                            //        top:document.body.scrollTop + document.documentElement.scrollTop,
                            //        bottom:''
                            //    }
                            //});
                        }
                        else {
                            $.messager.alert('提示信息', data.message, 'warning');
                        }
                    },
                    error: function (e) {
                        //表单提交时发生错误的操作
                        httpError(e.responseText);
                    },
                    beforeSend: function (XMLHttpRequest) {
                        $.messager.progress();	//开启等待进度条
                    },
                    complete: function (XMLHttpRequest, textStatus) {
                        $.messager.progress('close');	//关闭等待进度条
                    }
                });
            }
        });
    }
    else {
        $.messager.alert('提示信息', "请先选择需要删除的项目！", 'warning');
    }
}

//删除
async function del() {   
    var power= await checkPermission("20069", "btnDel");
    if (power === "0") {
        return;
    }
    var rows = $('#dg').datagrid('getChecked');
    if (rows && rows.length > 0) {
        $.messager.confirm('提示', '您确认要删除当前选择的项目吗？', function (r) {
            if (r) {
                var selected = "";
                $.each(rows, function () {
                    selected += this.path + "*" + (this.size == "文件夹" ? "0" : "1") + "|"; //将文件路径和类型也传递过去
                });
                selected = selected.substr(0, selected.length - 1);
                $.ajax({
                    url: '/File/File/Delete',
                    data: { file: selected },
                    cache: false,
                    type: "POST",
                    success: function (data) {
                        data = JSON.parse(data);
                        if (data.result == "ok") {
                            $('#dg').datagrid('reload', { path: currentPath }); //更新列表信息
                            $('#dg').datagrid('clearChecked'); //清空选择
                            var node = $('#ftree').tree('find', currentPath);
                            if (node){
                                $('#ftree').tree('reload', node.target);//更新目录结构树信息
                            }
                            //$.messager.alert('提示信息', '删除成功！', 'info');
                            //無需等待提示框
                            showMessage('删除成功！');                            
                        }
                        else {
                            $.messager.alert('提示信息', data.message, 'warning');
                        }
                    },
                    error: function (e) {
                        //表单提交时发生错误的操作
                        httpError(e.responseText);
                    },
                    beforeSend: function (XMLHttpRequest) {
                        $.messager.progress();	//开启等待进度条
                    },
                    complete: function (XMLHttpRequest, textStatus) {
                        $.messager.progress('close');	//关闭等待进度条
                    }
                });
            }
        });
    }
    else {
        $.messager.alert('提示信息', "请先选择需要删除的项目！", 'warning');
    }
}

//剪切和复制
async function doAciton(type) {
    var aciton_name = "";
    if (type = "copy") {
        aciton_name = "btnCopy";
    }
    if (type = "cut") {
        aciton_name = "btnCut";
    }   
    var power= await checkPermission("20069",aciton_name);
    if (power === "0") {
        return;
    }

    var rows = $('#dg').datagrid('getChecked');
    if (rows && rows.length > 0) {
        var selected = "";
        $.each(rows, function () {
            selected += this.path + "*" + (this.size == "文件夹" ? "0" : "1") + "|"; //将文件路径和类型也传递过去
        });
        selected = selected.substr(0, selected.length - 1);
        $('#dlg').dialog({ title: '目标路径选择', modal: true, buttons: '#dlg-buttons' }).dialog('open');
        $('#dtree').tree({
            url: '/File/File/GetDirectory',
            queryParams: { file: selected },
            onLoadError: function (e) { //当用户登录超时，绑定数据发生
                httpError(e.responseText);
            }
        });
        if (type == 'cut') {//剪切操作
            $('#btnSubmit').unbind(); //解除绑定后重新绑定
            $('#btnSubmit').bind("click", function () {
                var node = $('#dtree').tree('getSelected');
                if (node) {
                    $.ajax({
                        url: '/File/File/Move',
                        data: { path: node.id, file: selected },
                        cache: false,
                        type: "POST",
                        success: function (data) {
                            data = JSON.parse(data);
                            if (data.result == "ok") {
                                $('#dg').datagrid('reload', { path: currentPath }); //更新列表信息
                                var node1 = $('#ftree').tree('find', currentPath);
                                if (node1)
                                    $('#ftree').tree('reload', node1.target);//更新目录结构树信息
                                var node2 = $('#ftree').tree('find', node.id);
                                if (node2)
                                    $('#ftree').tree('reload', node2.target);//更新目录结构树信息
                                $('#dlg').dialog('close');
                                //$.messager.alert('提示信息', '剪切成功！', 'info');
                                showMessage('剪切成功！');
                            }
                            else {
                                $.messager.alert('提示信息', data.message, 'warning');
                            }
                        },
                        error: function (e) {
                            //表单提交时发生错误的操作
                            httpError(e.responseText);
                        },
                        beforeSend: function (XMLHttpRequest) {
                            $.messager.progress();	//开启等待进度条
                        },
                        complete: function (XMLHttpRequest, textStatus) {
                            $.messager.progress('close');	//关闭等待进度条
                        }
                    });
                }
                else {
                    $.messager.alert('提示信息', "请选择目标文件夹！", 'warning');
                }
            });
        }
        else {
            $('#btnSubmit').unbind(); //解除绑定后重新绑定
            $('#btnSubmit').bind("click", function () {
                var node = $('#dtree').tree('getSelected');
                if (node) {
                    $.ajax({
                        url: '/File/File/Copy',
                        data: { path: node.id, file: selected },
                        cache: false,
                        type: "POST",
                        success: function (data) {
                            data = JSON.parse(data);
                            if (data.result == "ok") {
                                var node2 = $('#ftree').tree('find', node.id);
                                if (node2)
                                    $('#ftree').tree('reload', node2.target);//更新目录结构树信息
                                $('#dlg').dialog('close');
                                //$.messager.alert('提示信息', '复制成功！', 'info');
                                showMessage('复制成功！');                               
                            }
                            else {
                                $.messager.alert('提示信息', data.message, 'warning');
                            }
                        },
                        error: function (e) {
                            //表单提交时发生错误的操作
                            httpError(e.responseText);
                        },
                        beforeSend: function (XMLHttpRequest) {
                            $.messager.progress();	//开启等待进度条
                        },
                        complete: function (XMLHttpRequest, textStatus) {
                            $.messager.progress('close');	//关闭等待进度条
                        }
                    });
                }
                else {
                    $.messager.alert('提示信息', "请选择目标文件夹！", 'warning');
                }
            });
        }
    }
    else {
        $.messager.alert('提示信息', "请先选择需要操作的项目！", 'warning');
    }
}

//重命名
async function rename() {
    var power= await checkPermission("20069","btnRename");
    if (power === "0") {
        return;
    }

    var rows = $('#dg').datagrid('getChecked');
    if (rows && rows.length > 0) {
        var str1 = '重命名文件';
        var str2 = '请输入新文件名称';
        var type = 1;       
        if (rows[0].size == '文件夹') {
            str1 = '重命名文件夹';
            str2 = '请输入新文件夹名称';
            type = 0;
        }
        $.messager.prompt(str1, str2, function (r) {
            if (r) {
                //console.log(rows);
                //console.log(r);// 更名的文件名
                //console.log(rows[0].extension);//擴展名               
                $.ajax({
                    url: '/File/File/Rename',
                    data: { path: currentPath, oldFileName: rows[0].filename, newFileName: r, type: type, fileExt: rows[0].extension },
                    cache: false,
                    type: "POST",
                    success: function (data) {
                        data = JSON.parse(data);
                        if (data.result == "ok") {
                            $('#dg').datagrid('reload', { path: currentPath }); //更新列表信息
                            var node = $('#ftree').tree('find', currentPath);
                            if (node) {
                                $('#ftree').tree('reload', node.target);//更新目录结构树信息
                            }
                            //$.messager.alert('提示信息', '重命名成功！', 'info');
                            showMessage("复制成功!");     
                        }
                        else {
                            $.messager.alert('提示信息', data.message, 'warning');
                        }
                    },
                    error: function (e) {
                        //表单提交时发生错误的操作
                        httpError(e.responseText);
                    },
                    beforeSend: function (XMLHttpRequest) {
                        $.messager.progress();	//开启等待进度条
                    },
                    complete: function (XMLHttpRequest, textStatus) {
                        $.messager.progress('close');	//关闭等待进度条
                    }
                });
            }
        });
    }
    else {
        $.messager.alert('提示信息', "请先选择需要重命名的项目！", 'warning');
    }
}

//压缩文件
async function zip() {
    var power= await checkPermission("20069","btnZip");
    if (power === "0") {
        return;
    }
    
    var rows = $('#dg').datagrid('getChecked');
    if (rows && rows.length > 0) {
        $.messager.prompt('压缩文件', '请输入压缩文件名称', function (r) {
            if (r) {
                var selected = "";
                $.each(rows, function () {
                    selected += this.path + "*" + (this.size == "文件夹" ? "0" : "1") + "|"; //将文件路径和类型也传递过去
                });
                selected = selected.substr(0, selected.length - 1);
                $.ajax({
                    url: '/File/File/Zip',
                    data: { path: currentPath, zipName: r, file: selected },
                    cache: false,
                    type: "POST",
                    success: function (data) {
                        data = JSON.parse(data);
                        if (data.result == "ok") {
                            $('#dg').datagrid('insertRow', { index: 0, row: data.data });

                            //$.messager.alert('提示信息', '压缩完成！', 'info');
                            showMessage("压缩完成!");
                           
                        }
                        else {
                            $.messager.alert('提示信息', data.message, 'warning');
                        }
                    },
                    error: function (e) {
                        //表单提交时发生错误的操作
                        httpError(e.responseText);
                    },
                    beforeSend: function (XMLHttpRequest) {
                        $.messager.progress();	//开启等待进度条
                    },
                    complete: function (XMLHttpRequest, textStatus) {
                        $.messager.progress('close');	//关闭等待进度条
                    }
                });
            }
        });
    }
    else {
        $.messager.alert('提示信息', "请先选择需要压缩的项目！", 'warning');
    }
}

//下载
async function down() {
    var power = await checkPermission("20069","btnDown");
    if (power === "0") {
        return;
    }
    
    var rows = $('#dg').datagrid('getChecked');
    if (rows && rows.length > 0) {
        //--start 2023/08/09
        //一次只可以下載一個文件,且不可以是文件夾,保證傳到服器端是一個有效的文.
        if (rows.length > 1) {
            $.messager.alert('提示信息', "一次只可以選擇下載一個文件(注意不可以是文件夾)！", 'warning');
            return;
        }
        //jquery each循环,要实现break和continue的功能：break----用return false;continue --用return ture;
        var isFolder = false;
        $.each(rows, function () {
            if (this.size == "文件夹") {
                isFolder = true;
                return false;
            }
        });
        if (isFolder) {
            $.messager.alert('提示信息', "注意:文件夾不可以下載！", 'warning');
            return;
        }
        //--end 2023/08/09

        var selected = "";
        $.each(rows, function () {
            selected += this.filename + "*" + (this.size == "文件夹" ? "0" : "1") + "|"; //将文件路径和类型也传递过去
        });
        selected = selected.substr(0, selected.length - 1);

        //使用表单提交方式提交请求
        var form = $("<form>");   //定义一个form表单
        form.attr('style', 'display:none');   //在form表单中添加查询参数
        form.attr('target', '');
        form.attr('method', 'post');
        form.attr('action', "/File/File/Download");
        var intput1 = $('<input>');
        intput1.attr('type', 'hidden');
        intput1.attr('name', 'file');
        intput1.attr('value', selected);
        var intput2 = $('<input>');
        intput2.attr('type', 'hidden');
        intput2.attr('name', 'path');
        intput2.attr('value', currentPath);
        $('body').append(form); //将表单放置在web中 
        form.append(intput1);   //将查询参数控件提交到表单上
        form.append(intput2);   //将查询参数控件提交到表单上
        form.submit();
    }
    else {
        $.messager.alert('提示信息', "请先选择需要下载的项目！", 'warning');
    }
}

//上傳对话框
async function openDialog() {

    //窗口 
    //<div id="uploader" class="wu-example">
    //    <!--用来存放文件信息-->
    //    <div id="thelist" class="uploader-list"></div>
    //    <div class="btns">
    //        <div id="picker" >选择文件</div>
    //        <button id="ctlBtn" class="btn btn-default">开始上传</button>
    //    </div>
    //</div>>
    var power = await checkPermission("20069","btnUpload");
    if (power === "0") {
        return;
    }
 
    var thedlg = {};//文件上传页html代码
    var title = "文件上傳(Upload)";
    var theDomId = "uploader";
    thedlg = '<div id="' + theDomId + '"class="wu-example">';//总div
    thedlg = thedlg + '<div id="thelist" class="uploader-list"  \"></div>';//用于存放文件信息
    thedlg = thedlg + '<div class="btns" style=" text-align:center" >';
    thedlg = thedlg + '<div id="picker" style="margin:auto auto">' + "選擇文件" + '</div>';
    thedlg = thedlg + '<button id="ctlBtn" class="btn btn_default">'+"開始上傳" + '</button>';
    thedlg += '</div>';
    thedlg += '</div>';//文件上传界面设计  比较差
    $("body").append(thedlg);
   
    $('#' + theDomId).dialog({
           cache: false,          
           model:true,
           width: 500,
           height: 400,
           title: "上傳文件(Upload)",           
           resizable: false,
           onClose: function () { $("#" + theDomId).remove();} 
   });
   uploadSetting();//百度webuploader 默认设置
}

//下载设置  百度webuploader 默认设置
function uploadSetting() {   
    var $ = jQuery,
        $list = $('#thelist'),
        $btn = $('#ctlBtn'),
        state = 'pending';
        //开始按钮事件
        $btn.on('click', function () {
            if (state === 'uploading') {
                uploader.stop();
            } else {                
                // uploader.upload();
               uploader.upload();
               
            }
        });
       
    //创建上传对象
    uploader = WebUploader.create({
        // 不压缩  
        resize: false,

        // swf文件路径  
        swf: 'WebUploader/Uploader.swf',

        // 文件接收服务端。  
        server: '/File/File/Upload',///这里需要特别注意  '/Prod/File/Upload'

        // 选择文件的按钮。可选。  
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.  
        pick: '#picker',
        //默认允许类型
        //accept: {
        //    title: 'Excel',
        //    extensions: 'xls,xlsx',
        //    mimeTypes: 'xls/*'
        //}
        /*參考設置
        accept: {
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/*'
        }*/
        formData: {
            currentPath:"public"            
        }
    });

    // 当有文件添加进来的时候  
    uploader.on('fileQueued', function (file) {
        $list.append('<div id="' + file.id + '" class="item" " >' +
            '<h4 >' + file.name + '</h4>' +
            '<p >等待上傳...</p>' +
            '</div>');
        uploader.options.formData.currentPath = currentPath;
    });

    // 文件上传过程中创建进度条实时显示。  
    uploader.on('uploadProgress', function (file, percentage) {
        var $li = $('#' + file.id),
            $percent = $li.find('.progress .progress-bar');

        // 避免重复创建  
        if (!$percent.length) {
            $percent = $('<div class="progress progress-striped active">' +
                '<div class="progress-bar" role="progressbar" style="width: 0%">' +
                '</div>' +
                '</div>').appendTo($li).find('.progress-bar');
        }
        $li.find('p.state').text('上傳中');
        $percent.css('width', percentage * 100 + '%');
    });
    //上传成功后
    uploader.on('uploadSuccess', function (file, response) {
        $('#' + file.id).find('p.state').text('已上傳');
        var path = response.state;
        if (state == "no") {
            
        }
        initData(currentPath); 
    });

    //文件上传错误
    uploader.on('uploadError', function (file) {
        $('#' + file.id).find('p.state').text('上傳出錯');
    });
    //文件上传完成
    uploader.on('uploadComplete', function (file) {
        $('#' + file.id).find('.progress').fadeOut();

    });
    
    uploader.on('all', function (type) {
        if (type === 'startUpload') {
            state = 'uploading';
        } else if (type === 'stopUpload') {
            state = 'paused';
        } else if (type === 'uploadFinished') {
            state = 'done';
        }

        if (state === 'uploading') {
            $btn.text('暂停上傳');
        } else {
            $btn.text('開始上傳');
        }
    });    
} //end of uploadSetting

//* 2023/08/25   
function showMessage(msg) {
    $.messager.show({
        title: '提示信息',
        msg: msg,
        timeout: 1500,
        showType: 'show',
        style: {
            right: '',
            top: document.body.scrollTop + document.documentElement.scrollTop,
            bottom: ''
        }
    });
}
//*
async function checkPermission(menu_id,func_name){    
    var user_id = $("#user_id").val();
    //user_id = document.getElementById("user_id").value;
    var isCanInit = await COMM.checkAuthority(user_id, menu_id, func_name);//20070--菜單功能模塊ID;INIT_FOLDER--初始化目錄結構的權限
   
    if (isCanInit === "0") {
        $.messager.alert('提示信息', "注意:當前操作權限不足!", 'warning');          
        return '0';
    }
    return "1";
}

