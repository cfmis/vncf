//表体导入
//当前导入的类型标志
let activeTab;
let TYPE_FLAG_LISTTYPE = "listType";
let TYPE_FLAG_GOODS = "goods";
let TYPE_FLAG_CBECBILLS = "cbecBills";
let TYPE_FLAG_DEC = "dec";

/**
 * 导入(弹出文件选择框)
 *
 */
function importExcelData(importType) {
    if (!isEmpty(importType)) activeTab = importType;//保管段其他草稿导入类型
    else {
        activeTab = $("#invtTabList a[aria-expanded='true']").attr("href");
        if (activeTab != "#invtListTab" && activeTab != "#invtGoodsListTab" && activeTab != "#invtCbecBillTab") {
            showLayerAlert("请选择要导入的表体界面！", 0);
            return;
        }
    }
    var height = 200;
    layer.open({
        type: 1,
        shadeClose: false,
        area: ['530px', height + 'px'],
        title: "表体导入",
        shade: 0.5,
//		shift: -1,
        scrollbar: false,
        btn: [],// 按钮名称
        btnAlign: 'c', // 居中
        yes: function (index) {
            layer.close(index);
        },
        cancel: function () {
            $("#id_cusForm")[0].reset();
        },
        content: $("#importExcel")
    });
}

//文件选择
function fileSelect(FormId) {
    var value = $("#" + FormId + "_file").val();
    if (!value) {
        return false;
    }
    var fileName = value.split('\\').pop();
    $("#" + FormId + " input[id='fileName']").val(fileName);
}

/**
 * 表体导入
 *
 * @param FormId
 * @returns {Boolean}
 */

function uploadExcelData(FormId) {
    var value = $("#" + FormId + "_file").val();
    if (!value) {
        layer.open({
            title: '提示',
            content: "请先选择要导入的模板文件！"
        });
        return false;
    }
    if (!value.match(/.xls|.XLS|.xlxs|.XLXS/i)) {
        layer.open({
            title: '提示',
            content: "导入格式错误，请导入xls/xlsx格式文件！"
        });
        return false;
    }
    if(limitFileSize(FormId + "_file")){
        return false;
    }
    //#################配置信息########################
    let IMPORT_TYPE_FLAG;
    let importUrl = swProxyBasePath + '/sw/ems/invt/client-import';
    let invtType = $("#invt_head_form").find("#invtType").val();
    let currentIndex;
    switch (activeTab){
        case "#invtListTab":
            currentIndex = $("#InvtListTable").bootstrapTable('getData').length;
            importUrl = importUrl + '/listType' + "?currentIndex=" + currentIndex + "&invtType=" + invtType;
            IMPORT_TYPE_FLAG = TYPE_FLAG_LISTTYPE;
            break;
        case "#invtGoodsListTab":
            currentIndex = $("#InvtGoodsTable").bootstrapTable('getData').length;
            importUrl = importUrl + '/goods' + "?currentIndex=" + currentIndex + "&invtType=" + invtType;
            IMPORT_TYPE_FLAG = TYPE_FLAG_GOODS;
            break;
        case "#invtCbecBillTab":
            importUrl = importUrl + '/cbecBills';
            IMPORT_TYPE_FLAG = TYPE_FLAG_CBECBILLS;
            break;
        case 'invt-dec-import':
            importUrl = importUrl + '/invt-dec-import';
            IMPORT_TYPE_FLAG = TYPE_FLAG_DEC;
            break;
        default:
            break;
    }
    //#################开始上传############################
    $("#uploadBtn").attr("disabled", true);
    var option = {
        url: importUrl,
        timeout: 120000,
        type: 'POST',
        dataType: 'json',
        headers: {
            "ClientCallMode": "ajax"
        }, // 添加请求头部
        success: function (response) {
            var successStr = "";
            layer.closeAll();
            var isImportSuccess = true;
            if (response.code == 0) {
                switch (IMPORT_TYPE_FLAG){
                    case TYPE_FLAG_LISTTYPE://表体
                        if(!isEmpty(response.data.invtListType)){
                            var invtListType = response.data.invtListType;
                            if (invtListType[0].gdsSeqno != "1"){
                                invtListType =  $("#InvtListTable").bootstrapTable('getData').concat(invtListType);
                            }
                            for (let i = 0; i < invtListType.length; i++) invtListType[i].modfMarkcd = '3';
                            //移除掉表体及对应报关单草稿
                            // $("#InvtListTable").bootstrapTable('removeAll');
                            // $("#InvtDecListTable").bootstrapTable('removeAll');
                            //生成报关单草稿
                            isImportSuccess = InvtObj.f_addList(invtListType);
                        }
                        break;
                    case TYPE_FLAG_GOODS:
                        if(!isEmpty(response.data.invtGoodsType)){
                            var goods = response.data.invtGoodsType;
                            if (goods[0].gdsSeqno != "1"){
                                goods =  $("#InvtGoodsTable").bootstrapTable('getData').concat(goods);
                            }
                            $("#InvtGoodsTable").bootstrapTable("load", goods);
                        }
                        isImportSuccess = true;
                        break;
                    case TYPE_FLAG_CBECBILLS:
                        if(!isEmpty(response.data.invtCbecBill)){
                            var cbecBills = response.data.invtCbecBill;
                            var cbecBillsOld = $("#InvtCbecBillTable").bootstrapTable('getData');
                            var pool = [];
                            //重复校验逻辑
                            if (!isEmpty(cbecBills)){
                                for (var i = 0; i < cbecBills.length; i++){
                                    pool.push(cbecBills[i].cbecBillNo);
                                }
                            }
                            if (!isEmpty(cbecBillsOld)){
                                for (var i = 0; i < cbecBillsOld.length; i++){
                                    pool.push(cbecBillsOld[i].cbecBillNo);
                                }
                            }
                            pool.sort();
                            for (var i = 0; i < pool.length; i++){
                                if (i === pool.length - 1)
                                    break;
                                if (pool[i] === pool[i + 1]){
                                    $("#uploadBtn").attr("disabled", false);
                                    $("#cusCiqUpload").attr("disabled", false);
                                    $("#" + FormId + "_file").val("");
                                    $("#" + FormId + " input[id='fileName']").val("");
                                    showLayerAlert("存在重复数据！");
                                    return;
                                }
                            }
                            //添加数据
                            cbecBills =  cbecBillsOld.concat(cbecBills);
                            $("#InvtCbecBillTable").bootstrapTable("load", cbecBills);
                        }
                        $("#invt_cbec_bill_form").find("input[name=gno]").val(getTableNextIndex("InvtCbecBillTable"));
                        isImportSuccess = true;
                        break;
                    case TYPE_FLAG_DEC:
                        if(!isEmpty(response.data.invtDecHeadType)){
                            $("#invt_dec_head_form").setForm(response.data.invtDecHeadType);
                        }
                        let decList = response.data.invtDecListType;
                        if(!isEmpty(decList)){
                            let allData = $("#InvtDecListTable").bootstrapTable("getData");
                            $.each(decList, function (index, dec) {//遍历其他字段
                                let data;
                                for (let i = 0; i < allData.length; i++) {
                                    data = allData[i];
                                    if (String(dec.entryGdsSeqno) === String(data.entryGdsSeqno)) {
                                        break;
                                    }
                                    data = undefined;
                                }
                                if (undefined === data) {
                                    //未找到对应的报关单草稿
                                    showLayerMsg("存在差异数据请核对！", 3000);
                                    isImportSuccess = false;
                                    return false;
                                }
                                data.entryGdsSeqno = dec.entryGdsSeqno;
                                data.ciqCode = dec.ciqCode;
                                data.declGoodsEname = dec.declGoodsEname;
                                data.origPlaceCode = dec.origPlaceCode;
                                data.purpose = dec.purpose;
                                data.prodValidDt = dec.prodValidDt;
                                data.prodQgp = dec.prodQgp;
                                data.goodsAttr = dec.goodsAttr;
                                data.stuff = dec.stuff;
                                data.unCode = dec.unCode;
                                data.dangName = dec.dangName;
                                data.dangPackType = dec.dangPackType;
                                data.dangPackSpec = dec.dangPackSpec;
                                data.engManEntCnm = dec.engManEntCnm;
                                data.noDangFlag = dec.noDangFlag;
                                data.destCode = dec.destCode;
                                data.goodsSpec = dec.goodsSpec;
                                data.goodsModel = dec.goodsModel;
                                data.goodsBrand = dec.goodsBrand;
                                data.produceDate = dec.produceDate;
                                data.prodBatchNo = dec.prodBatchNo;
                                data.districtCode = dec.districtCode;
                                data.ciqName = dec.ciqName;
                                data.mnufctrRegno = dec.mnufctrRegno;
                                data.mnufctrRegName = dec.mnufctrRegName;
                            });
                            if (isImportSuccess) $("#InvtDecListTable").bootstrapTable("load", allData);
                        }
                        break;
                    default:
                        break;
                }
                successStr = "导入成功！";
            } else {
                successStr += response.message;
            }

            $("#uploadBtn").attr("disabled", false);
            $("#cusCiqUpload").attr("disabled", false);
            if (isImportSuccess){
                //报关单等数据生成成功
                layer.alert(successStr);
            }
            $("#" + FormId + "_file").val("");
            $("#" + FormId + " input[id='fileName']").val("");
        },
        error: function (data) {
            $("#uploadBtn").attr("disabled", false);
            $("#cusCiqUpload").attr("disabled", false);
            alert(JSON.stringify(data) + "--上传失败,请刷新后重试");
        }
    };
    $("#" + FormId).ajaxSubmit(option);
    return false; // 最好返回false，因为如果按钮类型是submit,则表单自己又会提交一次;返回false阻止表单再次提交
}
