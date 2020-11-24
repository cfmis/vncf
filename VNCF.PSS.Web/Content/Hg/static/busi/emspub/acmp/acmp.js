/**
 * 随附单据页面  js 代码
 */

//暂存
var nemsAcmpRLSaveUrl = swProxyBasePath + 'sw/ems/pub/acmp/nemsAcmpRLSaveService';
var sasAcmpRLSaveUrl = swProxyBasePath + 'sw/ems/pub/acmp/sasAcmpRLSaveService';
var nptsAcmpRLSaveUrl = swProxyBasePath + 'sw/ems/pub/acmp/nptsAcmpRLSaveService';
var nbhlAcmpRLSaveUrl = swProxyBasePath + 'sw/ems/pub/acmp/nbhlAcmpRLSaveService';
//查询
var nemsAcmpRLQueryUrl = swProxyBasePath + 'sw/ems/pub/acmp/nemsAcmpRLQueryService';
var sasAcmpRLQueryUrl = swProxyBasePath + 'sw/ems/pub/acmp/sasAcmpRLQueryService';
var nptsAcmpRLQueryUrl = swProxyBasePath + 'sw/ems/pub/acmp/nptsAcmpRLQueryService';
var nbhlAcmpRLQueryUrl = swProxyBasePath + 'sw/ems/pub/acmp/nbhlAcmpRLQueryService';

var acmpParam = new Object();
var acmpFormReadOnlyList = ['blsTypename','blsNo','icCardNo','chgTmsCnt','transferTradeName'];
//获取上传信息
var acmpQueryInfoUrl = swProxyBasePath + 'sw/ems/pub/acmp/queryUploadInfo';
//随附单据下载地址
var acmpDownloadUrl = swProxyBasePath + "sw/ems/pub/acmp/download";

//业务单证类型
var acmpBlsTypeList = getCodeList("EMS_BLSTYPE");
//随附单据格式
/*var acmpDocufmtList = getCodeList("EMS_DOCUFMT");
//随附单据类型代码
var acmpDocuTypeList = getCodeList("EMS_DOCUTYPE");
//随附单据状态
var acmpDocuStatList = getCodeList("EMS_DOCUSTAT");
*/


/**
 * 设置随附单据相关参数
 * 参数0 sysFlag		nems;npts;sas
 * 参数1 blsType 		业务单证类型
 * 参数2 blsNo 		业务单证统一编号
 * 参数3 chgTmsCnt 	变更次数
 * 参数4 isViwe 		true查看；false：编辑，默认false
 * 参数5 modfMarkCd 	修改标记代码 0-未修改 1-修改 2-删除 3-增加
 * 参数6 blsOperate  	货物流转转入、转出标识
 */
function setAcmpParam(sysFlag,blsType,blsNo,chgTmsCnt,isViwe,blsOperate){
	acmpParam.sysFlag = sysFlag;
	acmpParam.blsType = blsType;
	acmpParam.blsNo = blsNo;
	acmpParam.blsOperate = blsOperate;
	if(!chgTmsCnt){
		chgTmsCnt = '0';
	}
	acmpParam.chgTmsCnt = chgTmsCnt;
	acmpParam.icCardNo = Session.cards;
	acmpParam.isViwe = isViwe==true ? true : false;
//	acmpParam.modfMarkCd = '3';
	$("#resetAcmpBtn").click();
	//ww 清单安全加固读卡校验修改
	//searchAcmpList();
	if('4' == blsType){
		searchInvtAcmpList();
	}else{
		searchAcmpList();
	}
}

$(document).ready(function(){
	initAcmpValidate();
	initAcmpBtn();
	//业务单证类型
	$("#acmp_form #blsTypename").autocomp({// 显示框
		tableName : 'EMS_BLSTYPE',// 查询的同义词
		hiddenId : 'blsType',// 隐藏框
	});
	//随附单据格式
	$("#acmp_form #acmpFormFmtname").autocomp({// 显示框
		tableName : 'EMS_DOCUFMT',// 查询的同义词
		hiddenId : 'acmpFormFmt',// 隐藏框
	});
	//随附单据类型代码
	$("#acmp_form #acmpFormTypeCDname").autocomp({// 显示框
		tableName : 'EMS_DOCUTYPE',// 查询的同义词
		hiddenId : 'acmpFormTypeCD',// 隐藏框
	});
	
	//随附单据格式
	$("#acmp_form #acmpFormFmtname").blur(function(){
		acmpFormFmtChange();
	});
	
	//随附单据所属单位信息查询
	var setTransferTrade = function(data){
		if(data && data.code == "0"){
			$("#acmp_form #transferTradeName").val(data.data.copName);
		}else{
			$("#acmp_form #transferTradeName").val("");
		}
	}

	$("#acmp_form #transferTradeCode").blur(function(){
		if($("#acmp_form #transferTradeCode").valid() && $(this).attr("readonly")!="readonly"){
			getCopInfo(this.value, false, setTransferTrade);
		}
	});
	//随附单据所属单位 刷新缓存
	$("#acmp_form #forTransferTradeCode").click(function(){
		if($(this).parent("span.input-group-addon").prev("input").is("[readonly]")){
			return;
		}
		getCopInfo($("#acmp_form #transferTradeCode").val(), true, setTransferTrade);
	});

	
	//随附单据表
    $('#acmpRLTalbe').bootstrapTable({
    	escape: true,
    	classes: 'table table-hover',
        cache : false,
        height : 380,
        striped : true,
        pagination : true,
        pageSize : 1000,
        pageNumber : 1,
        pageList : [ 10, 50, 100, 500, 1000 ],
        search : false,
        showRefresh : false,
        showToggle : false,
        showColumns : false,
        showExport : false,
        exportTypes : [ 'excel' ],
        clickToSelect : true,
        singleSelect : false,
        sidePagination : "client",
//        toolbar : '#acmpRLTalbeToolbar',
        iconSize : 'outline',
        icons : {
            refresh : 'glyphicon-repeat',
            toggle : 'glyphicon-list-alt',
            columns : 'glyphicon-list'
        },
        onClickRow:function(row){ 
        	$("#resetAcmpBtn").click();
        	$("#acmp_form").setForm(row);
        	if(acmpParam.sysFlag == "nbhl"){
        		var blsTypename = "申报表";
        		if(acmpParam.blsOperate == "1"){
        			blsTypename += "（转入）";
        		}else{
        			blsTypename += "（转出）";
        		}
        		$("#acmp_form #blsTypename").val(blsTypename);
        	}
        	$("#acmp_form #span-acmp").text(row.rmk);
//        	setCodeValue("#acmp_form #acmpFormFmt",acmpDocufmtList,row.acmpFormFmt);
//        	setCodeValue("#acmp_form #acmpFormTypeCD",acmpDocuTypeList,row.acmpFormTypeCD);
        	getCopInfo(row.transferTradeCode, false, setTransferTrade);
        	if(!acmpParam.isViwe){
        		acmpFormFmtChange();
	        	if(!row.acmpBlsStatus || row.acmpBlsStatus==8){//待上传
	        		$("#acmp_form #acmpFormFmtname").attr("readonly",false);
	        		$("#acmp_form #acmpFormTypeCDname").attr("readonly",false);
	        	}else if(row.acmpBlsStatus==9){//已上传
	        		$("#acmp_form #acmpFormFmtname").attr("readonly",true);
	        		$("#acmp_form #acmpFormTypeCDname").attr("readonly",true);
	        	}
        	}else {
        		if(row.acmpFormFmt=='2'){
        			$("#downloadAcmpBtn").attr("disabled",false);
        		}else{
        			$("#downloadAcmpBtn").attr("disabled",true);
        		}
        	}
        	$("#acmpOperateFlag").val("save");
        },
        formatNoMatches : function() {
            return '暂无数据';
        }
    });
    
});

//校验
function initAcmpValidate(){
	//表头 校验规则
	var acmpFormValidateRules = {
			blsTypename:{required:true},
			blsNo:{required:true},
			icCardNo:{required:true},
			acmpFormNo:{required:true,cnTwoLength:64},
			acmpFormFmtname:{required:true},
			invtGdsSeqNo:{digits:true,maxlength:19},
			transferTradeCode:{pattern:/^[0-9a-zA-Z]{10}$/g}
	}
	//询问界面 提示信息
	var acmpFormValidateMsgs = {	
			acmpFormNo:{cnTwoLength : "最大长度{0}个字符（一个汉字为两个字符）"},
			transferTradeCode:{pattern : "请输入10位随附单据所属单位"}
	};
	
	ValidateFunc('acmp_form',acmpFormValidateRules,acmpFormValidateMsgs);
}

//初始化按钮
function initAcmpBtn(){
	//选择文件
	$("#btn-chooseFile").click(function(){
		choosefile();
	});
	
	//新增 清空数据
	$("#resetAcmpBtn").click(function(){
		_clearform("acmp_form");
		initAcmpRL();
	});
	//暂存
	$("#saveAcmpBtn").click(function(){	
		isInstalled(function(){
			if(!$("#acmp_form").valid()){
				return false;
			}
			var oldRows = $('#acmpRLTalbe').bootstrapTable("getData");
			oldRows = JSON.parse(JSON.stringify(oldRows));
			var row = $("#acmp_form").serializeJson();
			var acmpOperateFlag = $("#acmpOperateFlag").val();
			if(!row.modfMarkCd){
				row.modfMarkCd = '3';
			}
			if(!!acmpOperateFlag){
				if('0'==row.modfMarkCd){
					row.modfMarkCd = '1';
				}
				row = deleteNullProperty(row);
				emsUtil.addRow("acmpRLTalbe",row,'acmpFormSeqNo');
			}else{
				if(row.acmpFormFmt=='2'){//非结构化
					row.acmpBlsStatus = '8';//待上传
					row.acmpBlsStatusname = '待上传';//待上传
				}
				row = deleteNullProperty(row);
				emsUtil.addRow("acmpRLTalbe",row,null,0);
			}
			var rows = $('#acmpRLTalbe').bootstrapTable("getData");
			
			acmpRLSave("save",rows,oldRows);
		});
	});
	
	//删除
	$("#delAcmpBtn").click(function(){
		isInstalled(function(){
			var row = $('#acmpRLTalbe').bootstrapTable("getSelections");
			if(!!row && row.length>0){
				var oldRows = $('#acmpRLTalbe').bootstrapTable("getData");
				oldRows = JSON.parse(JSON.stringify(oldRows));
				var noDelStr = "";
				for(var i=0;i<row.length;i++){
					if(acmpParam.chgTmsCnt != row[i].chgTmsCnt){
						if(!!noDelStr){
							noDelStr += "、";
						}
						noDelStr += row[i].acmpFormSeqNo;
					}
				}
				if(!!noDelStr){
					showLayerAlert("序号为"+noDelStr+"的随附单据为非本次变更数据，不允许删除！");
					return false;
				}
				emsUtil.removeRow("acmpRLTalbe","acmpFormSeqNo");
				//序号重排
				var rows = $('#acmpRLTalbe').bootstrapTable("getData");
				for(var i=0;i<rows.length;i++){
					rows[i].acmpFormSeqNo = rows.length-i;
				}
				acmpRLSave('del',rows,oldRows);
			}else{
				showLayerAlert("请选择数据！");
			}
		});
	});
	//文件上传
	$("#filesUploadAcmpBtn").click(function(){
		isInstalled(function(){
			var rows = $('#acmpRLTalbe').bootstrapTable("getData");
			if(!!rows && rows.length>0){
				var data = new Array();
				for(var i=0;i<rows.length;i++){
					var status = rows[i].acmpBlsStatus;
					var acmpFormFmt = rows[i].acmpFormFmt;
					var rmk = rows[i].rmk;
					if(status==8 && acmpFormFmt==2 && !!rmk){
						data.push(rows[i]);
					}
				}
				if(data.length>0){
					isInstalled(function(){
						emsAcmpUpload(data);
					});
				}else{
					showLayerAlert("没有待上传的数据，请确认！");
				}
			}else{
				showLayerAlert("请添加数据！");
			}
		});
	});
	//文件下载
	$("#downloadAcmpBtn").click(function(){
		isInstalled(function(){
			var rows = $('#acmpRLTalbe').bootstrapTable("getSelections");
			if(!!rows && rows.length==1){
				var row = rows[0];
				var status = row.acmpBlsStatus;
				
				if(!!status && status!=8){
					var fileSeqNo = row.fileName.split('.')[0];
					emsAcmpDownload(fileSeqNo);
				}
			}else{
				showLayerAlert("请选择一条数据！");
			}
		});
	});
}


//删除空属性
function deleteNullProperty(obj) {
	if (!(typeof obj == 'object')) {
		return;
	};
	for ( var key in obj) {
		if (obj.hasOwnProperty(key)
				&& (obj[key] == null || obj[key] == undefined || obj[key] == '')) {
			delete obj[key];
		}
	}
	return obj;
}


/**
 * 初始化随附单据
 */
function initAcmpRL(){
	//回填数据
	
	if(acmpParam.sysFlag == "nbhl"){
		var blsTypename = "申报表";
		if(acmpParam.blsOperate == "1"){
			blsTypename += "（转入）";
		}else{
			blsTypename += "（转出）";
		}
		$("#acmp_form #blsType").val(acmpParam.blsType);
		$("#acmp_form #blsTypename").val(blsTypename);
	}else{
		setCodeValue("#acmp_form #blsType",acmpBlsTypeList,acmpParam.blsType);//业务单证类型
	}
	
	$("#acmp_form #blsNo").val(acmpParam.blsNo);//业务单证统一编号
	$("#acmp_form #icCardNo").val(acmpParam.icCardNo);//上传人IC卡号
	$("#acmp_form #chgTmsCnt").val(acmpParam.chgTmsCnt);//变更次数
	$("#acmp_form #modfMarkCd").val("3");//修改标记
	if(acmpParam.isViwe){
		$("#acmp_form input").attr("readonly",true);
		$("#acmpRLTalbeToolbar button").attr("disabled",true);
		$("#downloadAcmpBtn").attr("disabled",false);
	}else{
		$("#acmpRLTalbeToolbar button").attr("disabled",false);
		$("#acmp_form input").attr("readonly",false);
		emsUtil.setReadonly(acmpFormReadOnlyList, true, "acmp_form");// 字段置为只读状态
//		$("#acmp_form #acmpFormFmtname").attr("readonly",false);
//		$("#acmp_form #acmpFormTypeCDname").attr("readonly",false);
	}
	$("#acmp_form").find("#acmpFormSeqNo").val(getNextIndex());
	$("#span-acmp").text(null);
	//获取焦点
	if($("#acmp_form #acmpFormFmtname").attr("readonly")!="readonly"){
		$("#acmp_form #acmpFormFmtname").focus();
	}
}

//列表查询
function searchAcmpList(){
	isInstalled(function(){
		$('#acmpRLTalbe').bootstrapTable("removeAll");
		var request = new Object();
		request.seqNo=acmpParam.blsNo;
		request.blsType=acmpParam.blsType;
		request.operCusRegCode=Session.cus_reg_no;
		
		var url = "";
		if(acmpParam.sysFlag=='nems'){
			url = nemsAcmpRLQueryUrl;
		}else if(acmpParam.sysFlag=='npts'){
			url = nptsAcmpRLQueryUrl;
		}else if(acmpParam.sysFlag=='nbhl'){
			request.seqNo=null;
			request.blsNo=acmpParam.blsNo;
			request.blsOperate=acmpParam.blsOperate;
			url = nbhlAcmpRLQueryUrl;
		}else{//默认sas
			url = sasAcmpRLQueryUrl;
		}
		
		//添加遮罩
		var index = layer.load(1, {
			  shade: [0.1,'#fff'] //0.1透明度的白色背景
			});
		$.ajax({
			type : "POST",
			url : url,
			data : JSON.stringify(request),
			contentType: "application/json;charset=utf-8",
			dataType : "json",
			dataFilter:function(data,type){
				return ajaxDataFilter(data);
			},//加密数据解密
			success : function(json) {				
				layer.close(index);
				if (json.code==0) {
					$('#acmpRLTalbe').bootstrapTable("removeAll");
					var data = new Array();
					if(acmpParam.sysFlag=='nems'){
						data = json.data.nemsAcmpRLType;
					}else if(acmpParam.sysFlag=='npts'){
						data = json.data.nptsAcmpRLType;
					}else if(acmpParam.sysFlag=='nbhl'){
						data = json.data.nbhlAcmpRLType;
					}else{//默认sas
						data = json.data.sasAcmpRLList;
					}
					if(!!data && data.length>0){
						$('#acmpRLTalbe').bootstrapTable("load",data);
					}
					$("#acmp_form").find("#acmpFormSeqNo").val(getNextIndex());
				} else {	
					//showLayerAlert(json.message);
				}
			},
			error : function(){	
				layer.close(index);
				showLayerAlert("查询失败，请稍后再试！");
			}
		});	
	});	
}

//清单附件列表查询ww
function searchInvtAcmpList(){
	$('#acmpRLTalbe').bootstrapTable("removeAll");
	var request = new Object();
	request.seqNo=acmpParam.blsNo;
	request.blsType=acmpParam.blsType;
	request.operCusRegCode=Session.cus_reg_no;

	var url = "";
	if(acmpParam.sysFlag=='nems'){
		url = nemsAcmpRLQueryUrl;
	}else if(acmpParam.sysFlag=='npts'){
		url = nptsAcmpRLQueryUrl;
	}else if(acmpParam.sysFlag=='nbhl'){
		request.seqNo=null;
		request.blsNo=acmpParam.blsNo;
		request.blsOperate=acmpParam.blsOperate;
		url = nbhlAcmpRLQueryUrl;
	}else{//默认sas
		url = sasAcmpRLQueryUrl;
	}

	//添加遮罩
	var index = layer.load(1, {
		shade: [0.1,'#fff'] //0.1透明度的白色背景
	});
	$.ajax({
		type : "POST",
		url : url,
		data : JSON.stringify(request),
		contentType: "application/json;charset=utf-8",
		dataType : "json",
		dataFilter:function(data,type){
			return ajaxDataFilter(data);
		},//加密数据解密
		success : function(json) {
			layer.close(index);
			if (json.code==0) {
				$('#acmpRLTalbe').bootstrapTable("removeAll");
				var data = new Array();
				if(acmpParam.sysFlag=='nems'){
					data = json.data.nemsAcmpRLType;
				}else if(acmpParam.sysFlag=='npts'){
					data = json.data.nptsAcmpRLType;
				}else if(acmpParam.sysFlag=='nbhl'){
					data = json.data.nbhlAcmpRLType;
				}else{//默认sas
					data = json.data.sasAcmpRLList;
				}
				if(!!data && data.length>0){
					$('#acmpRLTalbe').bootstrapTable("load",data);
				}
				$("#acmp_form").find("#acmpFormSeqNo").val(getNextIndex());
			} else {
				//showLayerAlert(json.message);
			}
		},
		error : function(){
			layer.close(index);
			showLayerAlert("查询失败，请稍后再试！");
		}
	});
}

/**
 * 暂存
 */
function acmpRLSave(flag,rows,oldRows,isShowTip){
	var nemsAcmpRLMessage = new Object();
	nemsAcmpRLMessage.blsNo = acmpParam.blsNo;
	nemsAcmpRLMessage.blsType = acmpParam.blsType;
	nemsAcmpRLMessage.chgTmsCnt =acmpParam.chgTmsCnt;
	
//	var nemsAcmpRLTypeList = $('#acmpRLTalbe').bootstrapTable("getData");
	var nemsAcmpRLTypeList = rows;
	if(nemsAcmpRLTypeList.length>0){
		if(acmpParam.sysFlag=='nems'){
			nemsAcmpRLMessage.nemsAcmpRLType = nemsAcmpRLTypeList;
		}else if(acmpParam.sysFlag=='npts'){
			nemsAcmpRLMessage.nptsAcmpRLType = nemsAcmpRLTypeList;
		}else if(acmpParam.sysFlag=='nbhl'){
			nemsAcmpRLMessage.blsOperate = acmpParam.blsOperate;
			nemsAcmpRLMessage.nbhlAcmpRLType = nemsAcmpRLTypeList;
		}else{//默认sas sasAcmpRLList
			nemsAcmpRLMessage.sasAcmpRLList = nemsAcmpRLTypeList;
		}
	}
	
	var url = "";
	if(acmpParam.sysFlag=='nems'){
		url = nemsAcmpRLSaveUrl;
	}else if(acmpParam.sysFlag=='npts'){
		url = nptsAcmpRLSaveUrl;
	}else if(acmpParam.sysFlag == 'nbhl'){
		url = nbhlAcmpRLSaveUrl;
	}else{//默认sas
		url = sasAcmpRLSaveUrl;
	}
	//添加遮罩
	var index = layer.load(1, {
		  shade: [0.1,'#fff'] //0.1透明度的白色背景
		});
	$.ajax({
		type : "POST",
		url : url,
		data : JSON.stringify(nemsAcmpRLMessage),
		contentType: "application/json;charset=utf-8",
		dataType : "json",
		async:"false",
		dataFilter:function(data,type){
			return ajaxDataFilter(data);
		},//加密数据解密
		success : function(json) {				
			layer.close(index);
			if (json.code==0) {
				$("#resetAcmpBtn").click();
				if(flag=='del'){
					showLayerMsg("删除成功！",3000);
					$('#acmpRLTalbe').bootstrapTable("load",rows);
				}else if(flag=='upload'){
					if(isShowTip){
						showLayerMsg("上传成功！",3000);
					}
				}else{
					showLayerMsg("暂存成功！",3000);
					$('#acmpRLTalbe').bootstrapTable("load",rows);
				}
			} else {
				showLayerAlert(json.message);
				$('#acmpRLTalbe').bootstrapTable("load",oldRows);
				/*if(!flag){
					var seqNo = $("#acmp_form #seqNo").val();
					 $('#acmpRLTalbe').bootstrapTable('remove', {field: 'seqNo',values: [seqNo]});	
				}*/
				
			}
		},
		error : function(){	
			layer.close(index);
			if(flag=='del'){
				showLayerAlert("删除失败，请稍后再试！");
			}else if(flag=='upload'){
				showLayerAlert("上传失败，请稍后再试！");
			}else{
				showLayerAlert("暂存失败，请稍后再试！");
			}
		}
	});	
}

//文件选择
function choosefile(){
    EportClient.isInstalledTest(EportClient.choosefile, "PDF文件|*.pdf", "4M", function (msg) {
    	//处理返回值,msg为JS对象
    	if(msg.Result){//选取成功
//    		var rmk = $("#acmp_form #rmk").val();
//    		rmk = rmk.replace(/(\\)/g,'/');
    		var filePath = msg.Data[0];
    		console.info(filePath);
    		$("#span-acmp").text(filePath);
    		$("#acmp_form #rmk").val(filePath);
    		filePath=filePath.replace(/(\\)/g,'/');
            var fileName =filePath.substr(filePath.lastIndexOf("/")+1);	
    		$("#acmp_form #acmpFormFileNm").val(fileName);
    		
//    		if(rmk!=filePath){
    		$("#acmp_form #acmpBlsStatus").val(8);
    		$("#acmp_form #acmpBlsStatusname").val("待上传");
//    		}
    	}else{
    		showLayerAlert(msg.Error.join(","),2);
    	}
    });
}

/**
 * 随附单据格式校验完成之后上传
 * @param pdf_cookies
 * @param pdf_uploadurl
 * @param pdf_assono
 * @param pdf_sysname
 * @param pdf_replace
 * @param uploadFileinfo
 */
function emsAcmpUpload(rows){
	var serverParam = getServerParam(rows.length,"pdf");
	
	if(null == serverParam){
		showLayerAlert("随附单据上传出错，未获取到上传服务！",2);
		return;
	}
	var pdf_datetiem = serverParam.datetime;
	var fileName = JSON.parse(serverParam.fileName);	
	var uploadFileinfo = new Array();
	for(var i=0;i<rows.length;i++){
		var filePath = rows[i].rmk;
		var info = {
				"filePath" : filePath,
				"fileName" : fileName[i]
		};
		uploadFileinfo.push(info);
	}
	console.log("文件上传参数：",serverParam,uploadFileinfo);
	EportClient.fileBatchUpload({
        "cookies":serverParam.cookies,
//        "uploadurl": "http://192.168.1.221:8021/fileserver/DdocSrv",//开发文件服务器地址
//        "uploadurl": "https://apphg.singlewindow.cn/fileserver/DdocSrv",//开发文件服务器地址
        "uploadurl": serverParam.basePath,
        "assono":acmpParam.blsNo,
        "sysname":"EMS",
        "sync":"Y",
        "replace":"Y",//同文件是否覆盖[Y/N]
        "delLocalFile":"N",
        "filesInfo":uploadFileinfo
	},function(msg){
		console.log("上传附件返回结果：",msg);
        if (msg.Result) {
           console.log("上传成功！");
           //修改随附单据状态
            var attEdocIds="";
			var fileinfo=msg.Data[0].filesInfo;
			for(var i=0;i<rows.length;i++){
				var info = fileinfo[i];
				var row = rows[i];
				//成功的不会有上传失败所以不用处理失败情况
				dealFileUpload(info,row,uploadFileinfo[i].fileName);
			}
			var rowData = $('#acmpRLTalbe').bootstrapTable("getData");
			acmpRLSave('upload',rowData,rowData);
        }else {
			if (!!msg.Error && msg.Error.length > 0) {
				var errorContent="随附单据上传出错：<br>";
				var errNum = 0;
				if(msg.Error.length == 3){
					var errorFilesInfo =msg.Error[2].filesInfo;
					for(var i=0;i<errorFilesInfo.length;i++){
						var errMsg = dealFileUpload(errorFilesInfo[i],rows[i],uploadFileinfo[i].fileName);
						if(""!=errMsg){
							errNum++;
						}
						errorContent += errMsg;
					}
				}else if(msg.Error[1] == 'Err:Base60000'){
					errorContent += "文件上传失败，请稍候再试！";
//					errorContent += "本地磁盘未找到上传文件！";
				}
				//返回的数据中有处理成功的情况需要进行保存
				if(errNum!=uploadFileinfo.length){
					var rowData = $('#acmpRLTalbe').bootstrapTable("getData");
					acmpRLSave('upload',rowData,rowData,false);
				}
				layer.alert(errorContent, {icon: 2});   						
			}
		}
    });
}

/**
 * 处理文件上传返回的响应
 * @param fileInfo
 * @param row
 * @param fileName
 * @returns {String}
 */
function dealFileUpload(fileInfo,row,fileName){
	var errorMsg = "";
	if(4!=fileInfo.status){
		var errMsg = fileInfo.uploadFileInfo.replace("失败:文件服务器返回信息:","").replace("异常(Exception):","");
		errorMsg +=  "随附单据存储名："+fileInfo.uploadFileName+" ["+errMsg+"]；<br>";
	}else{
		row.acmpBlsStatus = 9;
		row.acmpBlsStatusname = "已上传";
		row.fileName = fileName;
		emsUtil.addRow("acmpRLTalbe", row, "acmpFormSeqNo");
	}
	return errorMsg;
}


/**
 * 单据下载
 */
function emsAcmpDownload(attEdocId) {
	if (!attEdocId) {
		layer.open({
			title : '提示',
			content : "当前没有可下载的文件！"
		});
		return false;
	}
	window.location.href = acmpDownloadUrl+"/"+attEdocId;
}


/**
 * 获取卡控件的后台参数
 * @param times
 * @param extName
 * @returns
 */
function getServerParam(times,extName){
	var params={
		"times":times,
		"extName":extName
	};
	var serverParam = null;
	$.ajax({
		type : "POST",
		url : acmpQueryInfoUrl,
		data : JSON.stringify(params),
		dataType : "json",
		async: false,
		contentType : "application/json; charset=utf-8",
		dataFilter:function(data,type){
			return ajaxDataFilter(data);
		},//加密数据解密
		success : function(data) {
			serverParam=data;
		},
		error : function() {
			
		}
	});
	return serverParam;
}

//设置代码值
function setCodeValue(eleId,list,value){
	if(value==null){
		$(eleId).val(null);
		$(eleId+'name').val(null);
	}else{
		$(eleId).val(value);
		$(eleId+'name').val(emsUtil.getCodeNameFromList(list,value));
	}
}

//随附单据格式 改变事件
function acmpFormFmtChange(){
	var value = $("#acmp_form  #acmpFormFmt").val();
	if(value=="1"){//结构化
		$("#btn-chooseFile").attr("disabled",true);
		$("#span-acmp").text(null);
		$("#filePath").val(null);
		$(".td-acmpFormNo").html('<i style="color: red;">*</i>&nbsp;随附单据编号');
		$("#acmpFormNo").addClass("non-empty");
		$("#acmpFormNo").rules("remove")
		$("#acmpFormNo").rules("add",{required:true,cnTwoLength:64});
	}else{//非结构化
		$("#btn-chooseFile").attr("disabled",false);
		$(".td-acmpFormNo").html('随附单据编号');
		$("#acmpFormNo").rules("remove");
		$("#acmpFormNo").removeClass("non-empty");
		$("#acmpFormNo").rules("add",{required:false,cnTwoLength:64});
	}
}

/**
 * 检查是否存在未上传数据
 * 2018-12-26 zhouxiaobin add
 * @returns {Boolean} true 非结构化的全部已上传，false 存在未上传数据
 */
function isUploadAll(){
	var result = true;
	var rows = $('#acmpRLTalbe').bootstrapTable("getData");
	if(!!rows && rows.length>0){
		for(var i=0;i<rows.length;i++){
			var row = rows[i];
			if(row.acmpFormFmt=='2' && row.modfMarkCd=='3' && row.acmpBlsStatus!='9'){//非结构化，已上传或已发送
				result = false;
				break;
			}
		}
	}
	return result;
}

function getNextIndex(){
	var rows = $('#acmpRLTalbe').bootstrapTable('getData');
	var rowsLength = rows.length;
	if(null==rowsLength || rowsLength == 0){
		return 1;
	}
	var curNum = parseInt(rows[0].acmpFormSeqNo);
	if(curNum>0){
		return curNum+1;
	}else{
		return 1;
	}
}

/*
function fmt_acmpFormFmt(value,row,index){
	return getCodeNameFromList(acmpDocufmtList,value) =='' ? '-' : getCodeNameFromList(acmpDocufmtList,value);
}
function fmt_acmpBlsStatus(value,row,index){
	return getCodeNameFromList(acmpDocuStatList,value) =='' ? '-' : getCodeNameFromList(acmpDocuStatList,value);
}
function fmt_acmpFormTypeCD(value,row,index){
	return getCodeNameFromList(acmpDocuTypeList,value) =='' ? '-' : getCodeNameFromList(acmpDocuTypeList,value);
}*/
