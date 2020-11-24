(function ($) {
    'use strict';
	$.validator.setDefaults({ignore: ":hidden, [readonly]"});
})(jQuery);

//表格参数统一设置
var settings = {
		escape: true,
		classes: 'table table-hover',
		method : 'POST',
		dataType : "json",
		cache : false,
		height : 280,
		striped : true,
		queryParamsType: "NO-LIMIT",
		pagination : true,
		paginationLoop: false,
		sidePagination : "client",
		pageSize : 15,
		pageNumber : 1,
		pageList : [ 15, 50, 100, 500],
		search : false,
		sortable: true,      //是否启用排序
		sortOrder: "desc",     //排序方式
		showRefresh : false,
		showToggle : false,
		selectItemName : "radio",
		showColumns : false,
		showExport : false,
		clickToSelect : true,
		singleSelect : false,
		iconSize : 'outline',
		icons : {
			refresh : 'glyphicon-repeat',
			toggle : 'glyphicon-list-alt',
			columns : 'glyphicon-list'
		},
		onPageChange : function(size, number) {
		},
		formatNoMatches : function() {
			return '暂无数据';
		},
		onLoadError: function(status, xhr){
			console.log("错误消息： %s", xhr.statusText || xhr.status);
			layer.open({
				title: "提示",
				content:"查询失败，请稍后再试！",
				icon: 2
			});
        	return {
                data:[]
            }
        }
	};

//index页面所有功能方法
var Invt = function(){
	//功能方法---------------------start----------
	//页面初始化
	function init(bizKey){
		initAutoComp();
		SetViewOnly(invtListForm, true);
		SetViewOnly(invtGoodsForm, true);
		if(bizKey) { //带有参数初始化
			//加载数据
			loadData(bizKey);
		}else {
			initSomeField();
		}
	}
	
	//初始化下拉列表
	function initAutoComp(){
		//======表头=========
		if(COMMON_INFO.impexpMarkcd == "I"){
			//清单类型
			invtTypeName.autocomp({
				tableName:'EMS_INVT_TYPE',// 表名
				hiddenId:'invtType',// 隐藏框
				callback: changeTabs,
				filterCon: "NOTE4:C"
			});
		}else{
			invtTypeName.autocomp({
			tableName:'EMS_INVT_TYPE',// 表名
			hiddenId:'invtType',// 隐藏框
			callback: changeTabs,
			filterCon: "NOTE1:A"
			});
		}
		//料件、成品标志
		mtpckEndprdMarkcdName.autocomp({
			tableName:'EMS_MTPCK_ENDPRD_MARKCD',
			hiddenId:'mtpckEndprdMarkcd'
		});
		//监管方式
		invtHeadForm.find("#supvModecdName").autocomp({
			tableName:'CUS_EMS_TRADE',
			hiddenId:'supvModecd'
		});
		//运输方式
		invtHeadForm.find("#trspModecdName").autocomp({
			tableName:'CUS_TRANSF',
			hiddenId:'trspModecd'
		});
		//进(出)口口岸
		invtHeadForm.find("#impexpPortcdName").autocomp({
			tableName:'CUS_CUSTOMS',
			hiddenId:'impexpPortcd'
		});
		//主管海关
		invtHeadForm.find("#dclPlcCuscdName").autocomp({
			tableName:'CUS_CUSTOMS',
			hiddenId:'dclPlcCuscd'
		});
		//启运国(运抵国)
		invtHeadForm.find("#stshipTrsarvNatcdName").autocomp({
			tableName:'CUS_COUNTRY',
			hiddenId:'stshipTrsarvNatcd'
		});
		//核扣标志
		invtHeadForm.find("#vrfdedMarkcdName").autocomp({
			tableName:'EMS_VRFDED_MARKCD',
			hiddenId:'vrfdedMarkcd'
		});
		//清单进出口卡口状态
		invtHeadForm.find("#invtIochkptStucdName").autocomp({
			tableName:'EMS_INVT_IOCHKPT_STUCD',
			hiddenId:'invtIochkptStucd'
		});
		//流转类型
		invtHeadForm.find("#listTypeName").autocomp({
			tableName:'EMS_LIST_TYPE',
			hiddenId:'listType'
		});
		//报关标志
		invtHeadForm.find("#dclcusFlagName").autocomp({
			tableName:'EMS_DCLCUS_FLAG',
			hiddenId:'dclcusFlag'
		});
		//报关单标志
		invtHeadForm.find("#genDecFlagName").autocomp({
			tableName:'EMS_GENDEC_FLAG',
			hiddenId:'genDecFlag'
		});
		//报关类型
		invtHeadForm.find("#dclcusTypecdName").autocomp({
			tableName:'EMS_DCLCUS_TYPECD',
			hiddenId:'dclcusTypecd',
			callback: changeDclCusType
		});
		//报关单类型
		invtHeadForm.find("#decTypeName").autocomp({
			tableName:'EMS_DEC_TYPE',
			hiddenId:'decType',
			callback: changeDecType
		});
		//申报类型
		invtHeadForm.find("#dclTypecdName").autocomp({
			tableName : 'INVT_DCL_TYPECD',// 查询的同义词
			hiddenId : 'dclTypecd'// 隐藏框
		});

		//======表体=========
		//币制
		invtListForm.find("#dclCurrcdName").autocomp({
			tableName:'CUS_CURR',
			hiddenId:'dclCurrcd'
		});
		//申报计量单位
		invtListForm.find("#dclUnitcdName").autocomp({
			tableName:'CUS_UNIT',
			hiddenId:'dclUnitcd'
		});
		//法定计量单位
		invtListForm.find("#lawfUnitcdName").autocomp({
			tableName:'CUS_UNIT',
			hiddenId:'lawfUnitcd'
		});
		//第二法定计量单位
		invtListForm.find("#secdLawfUnitcdName").autocomp({
			tableName:'CUS_UNIT',
			hiddenId:'secdLawfUnitcd'
		});
		//原产国/产销国
		invtListForm.find("#natcdName").autocomp({
			tableName:'CUS_COUNTRY',
			hiddenId:'natcd'
		});
		//目的国
		invtListForm.find("#destinationNatcdName").autocomp({
			tableName:'CUS_COUNTRY',
			hiddenId:'destinationNatcd'
		});
		//用途代码
//		invtListForm.find("#useCdName").autocomp({
//			tableName:'EMS_USE_CD',
//			hiddenId:'useCd'
//		});
		//征免方式
		invtListForm.find("#lvyrlfModecdName").autocomp({
			tableName:'CUS_LEVYMODE',
			hiddenId:'lvyrlfModecd'
		});

		//======料件=========
		//币制
		invtGoodsForm.find("#goods-dclCurrcdName").autocomp({
			tableName:'CUS_CURR',
			hiddenId:'goods-dclCurrcd'
		});
		//申报计量单位
		invtGoodsForm.find("#goods-dclUnitcdName").autocomp({
			tableName:'CUS_UNIT',
			hiddenId:'goods-dclUnitcd'
		});
		//法定计量单位
		invtGoodsForm.find("#goods-lawfUnitcdName").autocomp({
			tableName:'CUS_UNIT',
			hiddenId:'goods-lawfUnitcd'
		});
		//第二法定计量单位
		invtGoodsForm.find("#goods-secdLawfUnitcdName").autocomp({
			tableName:'CUS_UNIT',
			hiddenId:'goods-secdLawfUnitcd'
		});
		//原产国/产销国
		invtGoodsForm.find("#goods-natcdName").autocomp({
			tableName:'CUS_COUNTRY',
			hiddenId:'goods-natcd'
		});
		//目的国
		invtGoodsForm.find("#goods-destinationNatcdName").autocomp({
			tableName:'CUS_COUNTRY',
			hiddenId:'goods-destinationNatcd'
		});
		//用途代码
//		invtGoodsForm.find("#goods-useCdName").autocomp({
//			tableName:'EMS_USE_CD',
//			hiddenId:'goods-useCd'
//		});
		//征免方式
		invtGoodsForm.find("#goods-lvyrlfModecdName").autocomp({
			tableName:'CUS_LEVYMODE',
			hiddenId:'goods-lvyrlfModecd'
		});
		
	}

	//初始化默认表单值
	function initSomeField(){
		//清单类型
		invtType.val("0");
		invtTypeName.val("普通清单");
		SetViewOnly(putrecNo, false);
		//申报类型
		$("#dclTypecd").val("1");
		$("#dclTypecdName").val(getCodeNameFromList(getCodeList("INVT_DCL_TYPECD"),"1"));
		//变更次数
		$("#chgTmsCnt").val("0");
//		genDecFlag.val("1");
//		$("#genDecFlagName").val("生成");
//		$("#genDecFlagName").val(getCodeNameFromList(getCodeList("EMS_GENDEC_FLAG"),"1"));
		//录入日期
		invtHeadForm.find("input[name=inputTime]").val(getCurrDate());
		//进出口标识
		invtHeadForm.find("input[name=impexpMarkcd]").val(COMMON_INFO.impexpMarkcd);
		//申报企业信息
		invtHeadForm.find("input[name=dclEtpsno]").val(Session.cus_reg_no);
		invtHeadForm.find("input[name=dclEtpsSccd]").val(Session.social_credit_code);
		invtHeadForm.find("input[name=dclEtpsNm]").val(Session.etps_name);
		//录入企业信息
		invtHeadForm.find("input[name=inputCode]").val(Session.cus_reg_no);
		invtHeadForm.find("input[name=inputCreditCode]").val(Session.social_credit_code);
		invtHeadForm.find("input[name=inputName]").val(Session.etps_name);
		//清单表体商品序号
		invtListGdsSeqno.val(getTableNextIndex(invtListTable));
		//表体用途代码默认“其他”  --date:20180719
//		invtListForm.find("#useCd").val("11");
//		invtListForm.find("#useCdName").val("其他");
		invtGoodsGdsSeqno.val(getTableNextIndex(invtGoodsTable));
		invtCbecBillGNo.val(getTableNextIndex(invtCbecBillTable));
	}
	
	//重置页面
	function reset(){
		//表头
		invtHeadForm.clearForm(true);
		SetViewOnly(invtHeadForm, false);
		SetElementEnable(mtpckEndprdMarkcdName, true);
		$("#btn-invt-cancel").hide();
		$("#label_applyNo").html('申报表编号');
		SetElementEnable(invtHeadForm.find("#forceBizOpEtpsInfo"), true);
		SetElementEnable(invtHeadForm.find("#forceRcvgdEtpsInfo"), true);
		$('ul.nav-tabs a[data-toggle=tab]:first').tab('show');
		//清单类型
		//20190115 modefied by zongjie 清空清单类型下拉框主键
		$("#invtTypeName").autocompleter( "destroy" );
		if(COMMON_INFO.impexpMarkcd == "I"){
			//清单类型
			//20180109 modified by zongjie 修改新增按钮重置清单类型下拉值
			invtTypeName.autocomp({
				tableName:'EMS_INVT_TYPE',// 表名
				hiddenId:'invtType',// 隐藏框
				callback: changeTabs,
				filterCon: "NOTE4:C"
			});
		}else{
			invtTypeName.autocomp({
			tableName:'EMS_INVT_TYPE',// 表名
			hiddenId:'invtType',// 隐藏框
			callback: changeTabs,
			filterCon: "NOTE1:A"
			});
		}
		//表体
		invtListForm.clearForm(true);
		invtListTable.bootstrapTable("removeAll");
		invtDecListTable.bootstrapTable("removeAll");
		SetViewOnly(invtListForm, true);
		SetElementEnable(invtListAddBtn, false);
		SetElementEnable(invtListDelBtn, false);
		SetElementEnable(invtListCopyBtn, false);
		SetElementEnable(openGoodsSearchBtn, false);
		SetElementEnable(decImportBtn, false);
		$("#btn-invt-dec-import").hide();
		$("#invt_dec_head_form_fieldset").hide();
		//料件
		invtGoodsForm.clearForm(true);
		invtGoodsTable.bootstrapTable("removeAll");
		SetViewOnly(invtGoodsForm, true);
		SetElementEnable(invtGoodsAddBtn, false);
		SetElementEnable(invtGoodsDelBtn, false);
		//出入库单
		invtWarehouseTable.bootstrapTable("removeAll");
		//保税电商
		invtCbecBillTable.bootstrapTable("removeAll");
		SetViewOnly(invtCbecBillForm, true);
		invtCbecBillForm.clearForm(true);
		invtCbecBillAddBtn.hide();
		invtCbecBillDelBtn.hide();
		invtCbecBillDelAllBtn.hide();
		SetElementEnable(invtCbecBillAddBtn, false);
		SetElementEnable(invtCbecBillDelBtn, false);
		SetElementEnable(invtCbecBillDelAllBtn, false);
		SetElementEnable(openQueryCbecBillBtn, false);
		SetElementEnable(getCbecGroupBtn, false);
		//随附单据
		setAcmpParam("nems", "4" , "", 0, false);
		initSomeField();
		changeDclCusType();
		changeDecType();
		changeTabs();
		setButtonStat();
		COMMON_INFO.bizKey = "";
		COMMON_INFO.opera = "";
		$("input[oldvalue]").attr("oldvalue", "");
	}

	//获取下一个tab的Index
	function getTableNextIndex(table){
		if(typeof table === "string"){
			table = $("#" + table);
		}
		var total = $(table).bootstrapTable('getData').length;
		return  parseInt(total)+ 1;
	}

	//tab页改变
	function changeTabs(value){
		//1：集报清单  增加出入库单列表
		//4：简单加工清单  增加料件表体
		//9:一纳成品内销  增加成品表体    20181017 21:00:00
		SetElementEnable(invtHeadForm.find("#dclcusFlagName"), true);
		SetElementEnable(invtHeadForm.find("#genDecFlagName"), true);
		switch(value){
		case "4" : 
			listTabName.html("成品");
			invtGoodsListTabLi.show();
			$("#invtGoodsListTabLi span").text("料件");
			invtWarehouseTabLi.hide();
			invtCbecBillTabLi.hide();
			openGoodsSearchBtn.hide();
			invtType.attr("readonly", "readonly");
			invtTypeName.attr("readonly", "readonly");
			break;
		case "1" :
			listTabName.html("表体");
			SetElementEnable(invtListAddBtn, false);
			SetElementEnable(invtListDelBtn, false);
			SetElementEnable(invtListCopyBtn, false);
			SetElementEnable(openGoodsSearchBtn, false);
			SetElementEnable(importBtn, false);
			SetViewOnly(invtListDclQty, true);	//申报数量
			//20181127 modified by zongjie 申报单价和申报总价字段放开，可修改
			SetViewOnly(invtListDclUprcAmt, false);	//申报单价
			SetViewOnly(invtListDclTotalAmt, false);	//申报总价
			openGoodsSearchBtn.show();
			invtGoodsListTabLi.hide();
			invtWarehouseTabLi.show();
			invtCbecBillTabLi.hide();
			invtType.removeAttr("readonly");
			invtTypeName.removeAttr("readonly");
			break;
		case "8" :
			//20180905 add by zheng
			invtHeadForm.find("#dclcusFlag").val("2");
			invtHeadForm.find("#dclcusFlagName").val("非报关");
			SetElementEnable(invtHeadForm.find("#dclcusFlagName"), false);
			$("#genDecFlag").val("2");
			$("#genDecFlagName").val("不生成");
			SetElementEnable(invtHeadForm.find("#genDecFlagName"), false);
			listTabName.html("表体");
			invtGoodsListTabLi.hide();
			invtWarehouseTabLi.hide();
			invtCbecBillTabLi.show();
			invtType.attr("readonly", "readonly");
			invtTypeName.attr("readonly", "readonly");
			if(!seqNo.val()){
				//选择联网查询还是手工录入
				layer.confirm('选择获取保税电商数据方式', {icon: 0, closeBtn: 0, btnAlign: 'c', btn: ['联网查询', '手工录入']},
					//联网查询，表体不允许操作，可以维护字段
					function(index){
						invtHeadForm.find("input[name=param1]").val("1");
						SetElementEnable(openGoodsSearchBtn, false);
						SetElementEnable(invtListAddBtn, false);
						SetElementEnable(invtListDelBtn, false);
						SetElementEnable(invtListCopyBtn, false);
						SetElementEnable(invtCbecBillDelBtn, true);
						SetElementEnable(invtCbecBillDelAllBtn, true);
						SetElementEnable(importBtn, false);
						openGoodsSearchBtn.hide();
						invtCbecBillAddBtn.hide();
						invtCbecBillDelBtn.show();
						invtCbecBillDelAllBtn.show();
						SetElementEnable(openQueryCbecBillBtn, true);
						SetElementEnable(getCbecGroupBtn, true);
						openQueryCbecBillBtn.show();
						getCbecGroupBtn.show();
						layer.close(index);
					},
					//手工录入
					function(index){
						invtHeadForm.find("input[name=param1]").val("0");
						openGoodsSearchBtn.show();
						SetElementEnable(openGoodsSearchBtn, false);
						SetElementEnable(invtListAddBtn, false);
						SetElementEnable(invtListDelBtn, false);
						SetElementEnable(invtListCopyBtn, false);
						SetElementEnable(importBtn, false);
						SetElementEnable(invtCbecBillAddBtn, false);
						SetElementEnable(invtCbecBillDelBtn, false);
						SetElementEnable(invtCbecBillDelAllBtn,false);
						invtCbecBillAddBtn.show();
						invtCbecBillDelBtn.show();
						invtCbecBillDelAllBtn.show();
						SetElementEnable(openQueryCbecBillBtn, false);
						SetElementEnable(getCbecGroupBtn, false);
						openQueryCbecBillBtn.hide();
						getCbecGroupBtn.hide();
						invtListForm.find("#lvyrlfModecd").val("3");
						invtListForm.find("#lvyrlfModecdName").val("全免");
						layer.close(index);
					}
				);
			}
			break;
		case "9":
			listTabName.html("料件");
			invtGoodsListTabLi.show();
			$("#invtGoodsListTabLi span").text("成品");
//			invtGoodsListTabLi.html("成品");
			invtWarehouseTabLi.hide();
			invtCbecBillTabLi.hide();
			openGoodsSearchBtn.hide();
			invtType.attr("readonly", true);
			invtTypeName.attr("readonly",true);
			$("#label_applyNo").html('<i style="color: red;">*</i>&nbsp;申报表编号');
			$("#dclcusTypecdName").attr("readonly",true);
			$("#listTypeName").attr("readonly",true);
			$("#dclcusFlagName").attr("readonly",true);
			$("#genDecFlagName").attr("readonly",true);
			$("#dclcusFlag").val("1");//报关标志
			$("#dclcusFlagName").val("报关");
			$("#genDecFlag").val("1");//报关单标志
			$("#genDecFlagName").val("生成");
			$("#dclcusTypecd").val("2");//报关类型
			$("#dclcusTypecdName").val("对应报关");
			$("#listType").val("Y");//流转类型
			$("#listTypeName").val("一纳企业进出区");
			changeDclCusType(invtHeadForm.find("#dclcusTypecd").val());	//报关类型
			changeDecType(invtHeadForm.find("#decType").val()); //报关单类型
			break;
		default :
			listTabName.html("表体");
			openGoodsSearchBtn.show();
			invtGoodsListTabLi.hide();
			invtWarehouseTabLi.hide();
			invtCbecBillTabLi.hide();
			invtType.removeAttr("readonly");
			invtTypeName.removeAttr("readonly");
		}	
	}
	
	//报关类型改变
	function changeDclCusType(dclCusType){
		//关联报关
		if("1" == dclCusType){
			$("input.corr-entry").attr("readonly", "readonly");
			$("input.corr-entry").val("");
			$("input.corr-entry[oldvalue]").attr("oldvalue", "");
			$("input.rlt-entry[name!=rltEntryNo][name!=entryDclTime][name!=rltInvtNo][name!=rltPutrecNo]").removeAttr("readonly");
		}else if("2" == dclCusType){	//对应报关
			$("input.rlt-entry").attr("readonly", "readonly");
			$("input.rlt-entry").val("");
			//对应报关单位填充经营企业信息 --date:20180719
			if(!corrEntryDclEtpsNo.val() && !corrEntryDclEtpsSccd.val() && !corrEntryDclEtpsNm.val()){
				corrEntryDclEtpsNo.val(bizopEtpsno.val());
				corrEntryDclEtpsSccd.val(bizopEtpsSccd.val());
				corrEntryDclEtpsNm.val(bizopEtpsNm.val());
			}
			$("input.rlt-entry[oldvalue]").attr("oldvalue", "");
			$("input.corr-entry[name!=entryNo]").removeAttr("readonly");
		}else{
			$("input.corr-entry[name!=entryNo]").removeAttr("readonly");
			$("input.rlt-entry[name!=rltEntryNo][name!=entryDclTime][name!=rltInvtNo][name!=rltPutrecNo]").removeAttr("readonly");
		}
	}

	//报关单类型改变
	function changeDecType(decType){
		var dclcusTypecd = $("#dclcusTypecd").val();
		//两步申报
		if(dclcusTypecd == "1" && ("X" == decType || "Y" == decType)){
			$("input.corr-entry[name=entryNo]").attr("readonly", "readonly");
			$("input.corr-entry[name=entryNo]").val("");
			$("input.rlt-entry[name=rltEntryNo]").removeAttr("readonly");
			$("input.rlt-entry[name=rltEntryNo]").rules("add", {required : true});
		}else if(dclcusTypecd == "2" && ("X" == decType || "Y" == decType)){
			$("input.rlt-entry[name=rltEntryNo]").attr("readonly", "readonly");
			$("input.rlt-entry[name=rltEntryNo]").val("");
			
			$("input.corr-entry[name=entryNo]").removeAttr("readonly");
			$("input.corr-entry[name=entryNo]").rules("add", {required : true});
			
		}else{
			$("input.rlt-entry[name=rltEntryNo]").val("");
			$("input.corr-entry[name=entryNo]").val("");
			$("input.corr-entry[name=entryNo]").attr("readonly", "readonly");
			$("input.rlt-entry[name=rltEntryNo]").attr("readonly", "readonly");
		}
	}
	
	//变更验证规则
	function changeValidateRule(isDeclare){
		//如果是简单加工清单账册号可以不填
        if (invtType.val() == "4"){
        	putrecNo.rules("remove", "required");
        }else if(invtType.val() == "9"){
        	applyNo.rules("add", {required : true});
        }else{
        	putrecNo.rules("add", {required : true});
        }
		if(isDeclare){
			$.each(headValid.DeclareRules, function(i, v){
				invtHeadForm.find("input[name=" + i + "]").rules("add", v);
			});
			// 报关 or 非报关
			if (dclcusFlag.val() == "1"){
				invtHeadForm.find("input[name=dclcusTypecd]").rules("add", {required : true});
				invtHeadForm.find("input[name=dclcusTypecdName]").rules("add", {required : true});
			}else{
				invtHeadForm.find("input[name=dclcusTypecd]").rules("remove", "required");
	        	invtHeadForm.find("input[name=dclcusTypecdName]").rules("remove", "required");
			}
			if (dclcusFlag.val() == "1" && $("#genDecFlag").val() == "1"){
				
				invtHeadForm.find("input[name=decType]").rules("add", {required : true});
				invtHeadForm.find("input[name=decTypeName]").rules("add", {required : true});
	        }else{
	        	
	        	invtHeadForm.find("input[name=decType]").rules("remove", "required");
	        	invtHeadForm.find("input[name=decTypeName]").rules("remove", "required");
	        }
			
			//对应报关 or 关联报关
			corrEntryDclEtpsNo.rules("remove", "required");
			corrEntryDclEtpsNm.rules("remove", "required");
			rltEntryRcvgdEtpsno.rules("remove", "required");
			rltEntryRcvgdEtpsNm.rules("remove", "required");
			rltEntryBizopEtpsno.rules("remove", "required");
			rltEntryBizopEtpsNm.rules("remove", "required");
			rltEntryDclEtpsno.rules("remove", "required");
			rltEntryDclEtpsNm.rules("remove", "required");
			var dclcusTypecd = invtHeadForm.find("#dclcusTypecd").val();
			if("1" == dclcusTypecd){
				rltEntryRcvgdEtpsno.rules("add", {required : true});
				rltEntryRcvgdEtpsNm.rules("add", {required : true});
				rltEntryBizopEtpsno.rules("add", {required : true});
				rltEntryBizopEtpsNm.rules("add", {required : true});
				rltEntryDclEtpsno.rules("add", {required : true});
				rltEntryDclEtpsNm.rules("add", {required : true});
			}else if("2" == dclcusTypecd){
				corrEntryDclEtpsNo.rules("add", {required : true});
				corrEntryDclEtpsNm.rules("add", {required : true});
			}
		}else{
			$.each(headValid.DeclareRules, function(i, v){
				invtHeadForm.find("input[name=" + i + "]").rules("remove", $.map(v, function(idx, ele){return ele}).join(" "));
			});
			corrEntryDclEtpsNo.rules("remove", "required");
			corrEntryDclEtpsNm.rules("remove", "required");
			rltEntryRcvgdEtpsno.rules("remove", "required");
			rltEntryRcvgdEtpsNm.rules("remove", "required");
			rltEntryBizopEtpsno.rules("remove", "required");
			rltEntryBizopEtpsNm.rules("remove", "required");
			rltEntryDclEtpsno.rules("remove", "required");
			rltEntryDclEtpsNm.rules("remove", "required");
		}
	}
	
	//初始化功能按钮
	function setButtonStat(state){
		if(!state || state == "0"){ //默认
			SetElementEnable(resetBtn, true);
			SetElementEnable(saveBtn, true);
			SetElementEnable(deleteHeadBtn, false);
			SetElementEnable(declareBtn, false);
			SetElementEnable(printBtn, false);
            SetElementEnable(importBtn, false); //关闭导入按钮

		}else if(state == "1"){	//暂存
			SetElementEnable(resetBtn, true);
			SetElementEnable(saveBtn, true);
			SetElementEnable(deleteHeadBtn, true);
			SetElementEnable(declareBtn, true);
			SetElementEnable(printBtn, true);
            SetElementEnable(importBtn, true); //开启导入按钮

		}else if(state == "2"){	//申报之后
			SetElementEnable(resetBtn, true);
			SetElementEnable(saveBtn, false);
			SetElementEnable(deleteHeadBtn, false);
			SetElementEnable(declareBtn, false);
			SetElementEnable(printBtn, true);
            SetElementEnable(importBtn, false); //开启导入按钮

		}
	}
	
	//查看明细
	function loadData(bizKey){
		//添加遮罩
		var customInfoIndex;
		$.ajax({
			type : "POST",
			url : InvtHelper.Url.DetailsService.replace("{{subSys}}", COMMON_INFO.subSystem).replace("{{seqNo}}", bizKey),
			dataType : "json",
			contentType : "application/json; charset=utf-8",
			timeout : 120000,
			beforeSend: function(XHR){
				customInfoIndex = layer.load(1,{shade:[0.3]});
			},
			success : function(data, textStatus, jqXHR) {
				//非法调用处理
				data = decryptServerMsg(data);
				if(!data || data.code != "0"){
					layer.open({
						title: "提示",
						content: data.message || data.detail,
						icon: 2
					});
					return;
				}
				COMMON_INFO.impexpMarkcd = data.data.invtHeadType.impexpMarkcd;
				//反填信息
				if("copy" == COMMON_INFO.opera){
					//复制清空原记录的数据
					data.data.invtHeadType.entryNo = null;
					data.data.invtHeadType.rltEntryNo = null;
					//20190115 modefied by zongjie 复制时清空报关单申报日期
					data.data.invtHeadType.entryDclTime = null;
					$.each(data.data.invtListType, function(i, v){
						v.param3 = null;
						v.modfMarkcd = "3";
					});
					$.each(data.data.invtDecListType, function(i, v){
						v.decSeqNo = null;
					});
				}
				if(("cancel" == COMMON_INFO.opera) || (data.data.invtHeadType.dclTypecd == "3" && "copy" != COMMON_INFO.opera)){
					$("#btn-invt-cancel").show();
					SetElementEnable(cancelBtn, true);
				}else {
					$("#btn-invt-cancel").hide();
				}
				if(data.data.invtHeadType.dclcusFlag == "1" && data.data.invtHeadType.genDecFlag == "1"){
					$("#btn-invt-dec-import").show();
					SetElementEnable(decImportBtn, true);
					$("#invt_dec_head_form_fieldset").show();
					$("#invt_dec_head_form").setForm(data.data.invtDecHeadType);
				}else{
					$("#btn-invt-dec-import").hide();
//					$("#invt_dec_head_form").hide();
					$("#invt_dec_head_form_fieldset").hide();
				}
				invtHeadForm.setForm(data.data.invtHeadType);
				data.data.invtDecHeadType && decRmk.val(data.data.invtDecHeadType.rmk);	//报关单草稿备注
				data.data.invtDecHeadType && decNo.val(data.data.invtDecHeadType.decSeqNo);	//报关单统一编号
				InvtHelper.changeLabel(data.data.invtHeadType.impexpMarkcd);
				invtListTable.bootstrapTable("load", data.data.invtListType);
				invtDecListTable.bootstrapTable("load", data.data.invtDecListType);
				invtGoodsTable.bootstrapTable("load", data.data.invtGoodsType);
				invtWarehouseTable.bootstrapTable("load",data.data.invtWarehouseType);
				invtCbecBillTable.bootstrapTable("load", data.data.invtCbecBill);
//				invtListTable.bootstrapTable("load", {data: data.data.invtListType});
//				invtDecListTable.bootstrapTable("load", {data: data.data.invtDecListType});
//				invtGoodsTable.bootstrapTable("load", {data: data.data.invtGoodsType});
//				invtWarehouseTable.bootstrapTable("load", {data: data.data.invtWarehouseType});
//				invtCbecBillTable.bootstrapTable("load", {data: data.data.invtCbecBill});
				//界面控制
				loadDataControl(data.data.listStat);
			},
			error : function(XMLHttpRequest, textStatus, errorThrown){	
				layer.open({
					title: "提示",
					content:"加载数据失败，请稍后再试！",
					icon: 2
				});
			},
			complete: function(XHR, textStatus){
				layer.close(customInfoIndex);
			}
		});
	}

	//加载数据后的界面控制
	function loadDataControl(status){
		changeTabs(invtType.val());	//清单类型
//		//获取账册数据
//		EmsHeadQuery(putrecNo.val(), COMMON_INFO.subSystem, function(data){
//			if(data && data.code == "0"){
//				bizopEtpsno.val(data.data.bizopEtpsno);
//				bizopEtpsSccd.val(data.data.bizopEtpsSccd);
//				bizopEtpsNm.val(data.data.bizopEtpsNm);
//				rcvgdEtpsno.val(data.data.rcvgdEtpsno);
//				rvsngdEtpsSccd.val(data.data.rcvgdEtpsSccd);
//				rcvgdEtpsNm.val(data.data.rcvgdEtpsNm);
//				putrecType.val(data.data.emsTypecd);
//			}else{
//				showLayerAlert(data.message);
//				putrecNo.val("");
//				bizopEtpsno.val("");
//				bizopEtpsSccd.val("");
//				bizopEtpsNm.val("");
//				rcvgdEtpsno.val("");
//				rvsngdEtpsSccd.val("");
//				rcvgdEtpsNm.val("");
//				putrecType.val("");
//			}
//		});
		
		if(!COMMON_INFO.opera){
			return;
		}
		switch(COMMON_INFO.opera){
		case "view":	//查看
			SetViewOnly(invtHeadForm, true);
			SetViewOnly(invtListForm, true);
			SetViewOnly(invtGoodsForm, true);
			SetViewOnly(invtCbecBillForm, true);
			setAcmpParam("nems", "4" , seqNo.val(), $("#chgTmsCnt").val(), true);
			SetElementEnable(declareBtn, false);
			SetElementEnable(deleteHeadBtn, false);
			SetElementEnable(saveBtn, false);
			SetElementEnable(printBtn, true);
            SetElementEnable(importBtn, false);
            SetElementEnable(decImportBtn, false);
            SetElementEnable(cancelBtn, false);
			break;
			
		case "cancel":	//申请删除
			initcancel();
			break;
			
		case "change":  //变更
			initChange();
			break;
			
		case "copy":	//复制
			seqNo.val("");
			invtHeadForm.find("input[name=bondInvtNo]").val("");
			invtHeadForm.find("input[name=etpsInnerInvtNo]").val("");
			invtHeadForm.find("input[name=inputTime]").val(getCurrDate());
			invtHeadForm.find("input[name=invtDclTime]").val("");
			invtHeadForm.find("#vrfdedMarkcd").val("");
			invtHeadForm.find("#vrfdedMarkcdName").val("");
			invtHeadForm.find("#invtIochkptStucd").val("");
			invtHeadForm.find("#invtIochkptStucdName").val("");
			invtHeadForm.find("#decRmk").val("");
			invtHeadForm.find("#decNo").val("");
			//申报企业信息
			invtHeadForm.find("input[name=dclEtpsno]").val(Session.cus_reg_no);
			invtHeadForm.find("input[name=dclEtpsSccd]").val(Session.social_credit_code);
			invtHeadForm.find("input[name=dclEtpsNm]").val(Session.etps_name);
			//录入企业信息
			invtHeadForm.find("input[name=inputCode]").val(Session.cus_reg_no);
			invtHeadForm.find("input[name=inputCreditCode]").val(Session.social_credit_code);
			invtHeadForm.find("input[name=inputName]").val(Session.etps_name);
			//申报类型
			$("#dclTypecd").val("1");
			$("#dclTypecdName").val(getCodeNameFromList(getCodeList("INVT_DCL_TYPECD"),"1"));
			//变更次数
			$("#chgTmsCnt").val("0");
			SetViewOnly(invtHeadForm, false);
			SetViewOnly(invtListForm, false);
			resetList();
			SetViewOnly(invtGoodsForm, false);
			resetGoods();
			SetElementEnable(invtListAddBtn, false);
			SetElementEnable(invtListDelBtn, false);
			SetElementEnable(invtListCopyBtn, false);
			SetElementEnable(openGoodsSearchBtn, false);
            SetElementEnable(importBtn, true);
			changeDclCusType(invtHeadForm.find("#dclcusTypecd").val());	//报关类型
			changeDecType(invtHeadForm.find("#decType").val()); //报关单类型
			//表体中“规格型号”改为可修改  - date:20180718
			SetViewOnly(invtListGdsSpcfModelDesc, false);
			//物流账册
			if (IsBwlNo(putrecNo.val())){ 
				SetViewOnly(invtListGdsMtno, false); //商品料号
				SetViewOnly(invtListGdecd, false); //商品编码
				SetViewOnly(invtListGdsNm, false); //商品名称
				//表体中“规格型号”改为可修改  - date:20180718
				//SetViewOnly(invtListGdsSpcfModelDesc, false); //商品规格型号
				SetViewOnly(invtListDclUnitcdName, false); //申报计量单位
            }
            //3-耗料式账册商品信息需要可以让企业自己录入
            if (putrecNo.val().startsWith("T") && putrecNo.val().charAt(5) === 'H') {
            	SetViewOnly(invtListGdsMtno, false); //商品料号
            	SetViewOnly(invtListGdecd, false); //商品编码
            	SetViewOnly(invtListGdsNm, false); //商品名称
            	//表体中“规格型号”改为可修改  - date:20180718
            	//SetViewOnly(invtListGdsSpcfModelDesc, false); //商品规格型号
            }
            //如果是简单清单、保税展示交易清单 需要获取Sas申请表数据
            if (invtType.val() == "4" || invtType.val() == "5"){
                InitSasAppInfo();
            }
            //8-保税电商
            if(invtType.val() == "8"){
            	resetCbecBill();
            	var notWrite = invtHeadForm.find("input[name=param1]").val();
            	//联网
            	if(notWrite == "1"){
            		SetViewOnly(invtCbecBillForm, true);
            	}else{
            		SetViewOnly(invtCbecBillForm, false);
            	}
            }
			break;
			
		default:
			SetElementEnable(printBtn, true);
			//新增F-申报失败，允许修改
			if ($.inArray(status, ["0", "9", "6", "C", "D", "e", "F"]) >= 0){
				if($("#dclTypecd").val() == "2"){
					SetElementEnable(deleteHeadBtn, true);
					initChange();
				} else if($("#dclTypecd").val() == "3"){
					initcancel();
					SetElementEnable(deleteHeadBtn, true);//20190806    删除申请退单可以删除恢复以前状态
				} else{
					SetViewOnly(invtHeadForm, false);
					SetViewOnly(invtListForm, false);
					resetList();
					SetViewOnly(invtGoodsForm, false);
					resetGoods();
					setAcmpParam("nems", "4" , seqNo.val(), 0, false);
					SetElementEnable(deleteHeadBtn, true);
					SetElementEnable(declareBtn, true);
					SetElementEnable(invtListAddBtn, true);
					SetElementEnable(invtListDelBtn, true);
					SetElementEnable(invtListCopyBtn, true);
					SetElementEnable(openGoodsSearchBtn, true);
					SetElementEnable(invtGoodsAddBtn, true);
					SetElementEnable(invtGoodsDelBtn, true);
	                SetElementEnable(importBtn, true);
	                if(dclcusFlag.val() == "1" && $("#genDecFlag").val() === "1" && $("#dclTypecd").val() =="1"){
	                	SetElementEnable(decImportBtn, true);
	                }else{
	                	SetElementEnable(decImportBtn, false);
	                }
					changeDclCusType(invtHeadForm.find("#dclcusTypecd").val());	//报关类型
					changeDecType(invtHeadForm.find("#decType").val()); //报关单类型
					//表体中“规格型号”改为可修改  - date:20180718
					SetViewOnly(invtListGdsSpcfModelDesc, false);
					//20180109 modefied by zongjie 表头中的报关标志改为不可修改
					SetViewOnly($("#dclcusFlagName"), true);
					SetViewOnly($("#genDecFlagName"), true);
					//物流账册
					if (IsBwlNo(putrecNo.val())){ 
						SetViewOnly(invtListGdsMtno, false); //商品料号
						SetViewOnly(invtListGdecd, false); //商品编码
						SetViewOnly(invtListGdsNm, false); //商品名称
						//表体中“规格型号”改为可修改  - date:20180718
						//SetViewOnly(invtListGdsSpcfModelDesc, false); //商品规格型号
						SetViewOnly(invtListDclUnitcdName, false); //申报计量单位
		            }
		            //3-耗料式账册商品信息需要可以让企业自己录入
		            if (putrecNo.val().startsWith("T") && putrecNo.val().charAt(5) === 'H') {
		            	SetViewOnly(invtListGdsMtno, false); //商品料号
		            	SetViewOnly(invtListGdecd, false); //商品编码
		            	SetViewOnly(invtListGdsNm, false); //商品名称
		            	//表体中“规格型号”改为可修改  - date:20180718
		            	//SetViewOnly(invtListGdsSpcfModelDesc, false); //商品规格型号
		            }
		            //1-集报清单  表体不允许新增和删除
		            if (invtType.val() == "1") {
		            	SetViewOnly(invtListForm, true);
		            	//20181128 10:44:00 modified by zongjie 放开申报单价和申报总价可修改
		            	SetViewOnly(invtListDclUprcAmt, false);	//申报单价
		    			SetViewOnly(invtListDclTotalAmt, false);//申报总价
						SetViewOnly(invtListGdecd, false); //商品编码
		            	//报关单序号 add at 20180608 16:15
		            	//重量比例因子 第一比例因子 第二比例因子 备注
		            	//用途代码 征免方式
		            	//SetViewOnly(invtListForm.find("[name=entryGdsSeqno],[name=wtSfVal],[name=fstSfVal],[name=secdSfVal],[name=ucnsVerno],[name=rmk],#useCd,#useCdName,#lvyrlfModecd,#lvyrlfModecdName"), false);
		            	SetViewOnly(invtListForm.find("[name=entryGdsSeqno],[name=wtSfVal],[name=fstSfVal],[name=secdSfVal],[name=ucnsVerno],[name=rmk],#lvyrlfModecd,#lvyrlfModecdName"), false);
		            	SetElementEnable(invtListAddBtn, false);
						SetElementEnable(invtListDelBtn, false);
						SetElementEnable(invtListCopyBtn, false);
						SetElementEnable(openGoodsSearchBtn, false);
						SetElementEnable(importBtn, false);
						if (dclcusFlag.val() == "1" && $("#genDecFlag").val() == "1"){
							InitInvtList2DecList();
						}
		            }
		            //如果是简单清单、保税展示交易清单 需要获取Sas申请表数据
		            if (invtType.val() == "4" || invtType.val() == "5"){
		                InitSasAppInfo();
		            }
		            //8-保税电商 
		            if (invtType.val() == "8") {
		            	resetCbecBill();
		            	var notWrite = invtHeadForm.find("input[name=param1]").val();
		            	//联网
		            	if(notWrite == "1"){
		            		SetViewOnly(invtListForm, true);
		            		//SetViewOnly(invtListForm.find("input[name=gdsMtno],#gdecd,input[name=gdsNm],input[name=gdsSpcfModelDesc],#dclUnitcdName,#useCdName,#lvyrlfModecdName,input[name=rmk]"), false);
		            		SetViewOnly(invtListForm.find("input[name=gdsMtno],#gdecd,input[name=gdsNm],input[name=gdsSpcfModelDesc],#dclUnitcdName,#lvyrlfModecdName,input[name=rmk]"), false);
		            		SetElementEnable(invtListAddBtn, false);
		            		SetElementEnable(invtListDelBtn, false);
		            		SetElementEnable(invtListCopyBtn, false);
		            		SetElementEnable(invtCbecBillDelBtn, true);
							SetElementEnable(invtCbecBillDelAllBtn, true);
		            		SetElementEnable(openGoodsSearchBtn, false);
		            		openGoodsSearchBtn.hide();
		            		SetElementEnable(importBtn, false);
		            		SetViewOnly(invtCbecBillForm, true);
		            		invtCbecBillAddBtn.hide();
							invtCbecBillDelBtn.show();
							invtCbecBillDelAllBtn.show();
							openQueryCbecBillBtn.show();
							getCbecGroupBtn.show();
							SetElementEnable(openQueryCbecBillBtn, true);
							SetElementEnable(getCbecGroupBtn, true);
		            	}else{
		            		SetViewOnly(invtCbecBillForm, false);
		            		openGoodsSearchBtn.show();
							SetElementEnable(openGoodsSearchBtn, true);
							SetElementEnable(invtListAddBtn, true);
							SetElementEnable(invtListDelBtn, true);
							SetElementEnable(invtListCopyBtn, true);
							SetElementEnable(importBtn, true);
							SetElementEnable(invtCbecBillAddBtn, true);
							SetElementEnable(invtCbecBillDelBtn, true);
							SetElementEnable(invtCbecBillDelAllBtn, true);
							invtCbecBillAddBtn.show();
							invtCbecBillDelBtn.show();
							invtCbecBillDelAllBtn.show();
							openQueryCbecBillBtn.hide();
							getCbecGroupBtn.hide();
		            	}
		            }
		            //一纳成品内销
		            if(invtType.val() == "9"){
		            	$("#dclcusTypecdName").attr("readonly",true);
		    			$("#listTypeName").attr("readonly",true);
		            }
				} 
			}else{
				SetViewOnly(invtHeadForm, true);
				SetViewOnly(invtListForm, true);
				SetViewOnly(invtGoodsForm, true);
				SetViewOnly(invtCbecBillForm, true);
				setAcmpParam("nems", "4" , seqNo.val(), 0, true);
				SetElementEnable(invtListAddBtn, false);
				SetElementEnable(invtListDelBtn, false);
				SetElementEnable(invtListCopyBtn, false);
				SetElementEnable(openGoodsSearchBtn, false);
				SetElementEnable(invtGoodsAddBtn, false);
				SetElementEnable(invtGoodsDelBtn, false);
				invtCbecBillAddBtn.hide();
				invtCbecBillDelBtn.hide();
				invtCbecBillDelAllBtn.hide();
				SetElementEnable(openQueryCbecBillBtn, false);
				SetElementEnable(getCbecGroupBtn, false);
				SetElementEnable(deleteHeadBtn, false);
				SetElementEnable(saveBtn, false);
				SetElementEnable(declareBtn, false);
			}
			break;
		}
		SetViewOnly(putrecNo, true);
		SetElementEnable(mtpckEndprdMarkcdName, false);
		SetViewOnly(invtTypeName, true);
		var SupvModecd = invtHeadForm.find("#supvModecd");
		//集报清单
        if (invtType.val() == "1"){
        	//20181018 新增优化：放开 料件成品标志字段
        	SetViewOnly(mtpckEndprdMarkcdName, false);
        	//20190507 报关标志可以修改
        	if(COMMON_INFO.opera == "view" || COMMON_INFO.opera == "cancel" || $("#dclTypecd").val() == "3"){
        		SetViewOnly($("#dclcusFlagName"), true);
        		SetViewOnly($("#genDecFlagName"), true);
        	}else{
        		SetViewOnly($("#dclcusFlagName"), false);
        		SetViewOnly($("#genDecFlagName"), false);
        	}
            if(SupvModecd == null || SupvModecd == ""){//集报清单监管方式为空时可以选择
                SetViewOnly(invtHeadForm.find("#supvModecdName"), false);
            }
        }
	}

	//变更页面控制
	function initChange(){
		SetViewOnly(invtHeadForm, true);
		SetViewOnly(invtListForm, true);
		SetViewOnly(invtGoodsForm, true);
		SetViewOnly(invtCbecBillForm, true);
		setAcmpParam("nems", "4" , seqNo.val(), $("#chgTmsCnt").val(), false);
		SetViewOnly($("#supvModecdName"), false);
		SetViewOnly($("#trspModecdName"), false);
		SetViewOnly($("#impexpPortcdName"), false);
		SetViewOnly($("#stshipTrsarvNatcdName"), false);
		SetViewOnly(invtHeadForm.find("input[name=rmk]"), false);
		SetViewOnly($("#gdecd"), false);
		SetViewOnly(invtListGdsNm, false);
		SetViewOnly(invtListGdsSpcfModelDesc, false);
		SetViewOnly($("#dclCurrcdName"), false);
		SetViewOnly(invtListDclQty, false);
		let impexpMarkcd = invtHeadForm.find("input[name=impexpMarkcd]").val();
		let invtListType = invtListTable.bootstrapTable("getData");
		if(IsBwlNo(putrecNo.val()) && impexpMarkcd == "I" && invtListType[0].putrecSeqno == undefined){
			SetViewOnly(invtListDclUnitcdName, false);
		}
		SetViewOnly(invtListForm.find("input[name=lawfQty]"), false);
		SetViewOnly(invtListForm.find("input[name=secdLawfQty]"), false);
		SetViewOnly(invtListDclUprcAmt, false);
		SetViewOnly(invtListDclTotalAmt, false);
		SetViewOnly($("#natcdName"), false);
		SetViewOnly($("#destinationNatcdName"), false);
		SetViewOnly(invtListForm.find("input[name=secdLawfQty]"), false);
		SetViewOnly(invtListForm.find("[name=ucnsVerno]"),false);
		SetViewOnly(invtListForm.find("input[name=rmk]"), false);
		SetViewOnly($("#lvyrlfModecdName"), false);
		SetElementEnable(declareBtn, true);
		SetElementEnable(deleteHeadBtn, true);
		SetElementEnable(saveBtn, true);
		SetElementEnable(printBtn, true);
        SetElementEnable(importBtn, false);
        SetElementEnable(decImportBtn, false);
        SetElementEnable(invtListAddBtn, false);
		SetElementEnable(invtListDelBtn, false);
		SetElementEnable(invtListCopyBtn, false);
		SetElementEnable(openGoodsSearchBtn, false);
	}

	//删除申请页面控制
	function initcancel(){
		SetViewOnly(invtHeadForm, true);
		SetViewOnly(invtListForm, true);
		SetViewOnly(invtGoodsForm, true);
		SetViewOnly(invtCbecBillForm, true);
		setAcmpParam("nems", "4" , seqNo.val(), $("#chgTmsCnt").val(), false);
		SetElementEnable(cancelBtn, true);
		SetElementEnable(declareBtn, false);
		SetElementEnable(deleteHeadBtn, false);
		SetElementEnable(saveBtn, false);
		SetElementEnable(printBtn, true);
		SetElementEnable(importBtn, false);
		SetElementEnable(decImportBtn, false);
	}

	//初始化sas申请表信息
	function InitSasAppInfo(){
		if ($.trim(putrecNo.val()) == ""){
			showLayerAlert("手(账)册编号不能为空！");
			applyNo.val("");
            return false;
        }
		//不是物流账册不查询申请表数据
        if (!IsBwlNo(putrecNo.val())){
            return false;
        }
        if ($.trim(applyNo.val()) == "") {
        	showLayerAlert("请录入申请表编号！");
            applyNo.focus();
            return false;
        }
        var shadeIndex;
    	$.ajax({
    		type : "GET",
    		url : swProxyBasePath + "sw/ems/invt/SasAppQuery/blsNo/{{blsNo}}".replace("{{blsNo}}", $.trim(applyNo.val())),
    		dataType : "json",
    		timeout : 120000,
    		async: false,
    		contentType : "application/json; charset=utf-8",
    		beforeSend: function(XHR){
    			shadeIndex = layer.load(1,{shade:[0.3]});
    		},
    		success : function(data, textStatus, jqXHR) {
				//非法调用处理
				data = decryptServerMsg(data);
    			if(data.code == "0"){
    				SetViewOnly(applyNo, true);
    				return true;
    			}else{
    				layer.open({
						title: "提示",
						content: data.message || data.detail,
						icon: 2
					});
    				if(invtType == "4" || invtType == "5"){
    					applyNo.focus();
    				}
    				return false;
    			}
    		},
    		error : function(XMLHttpRequest, textStatus, errorThrown){	
    			layer.msg("查询失败，请稍后再试！", {
    				icon: 2,//成功图标
    				time: 3000
    			});
    			return false;
    		},
    		complete: function(XHR, textStatus){
    			layer.close(shadeIndex);
    		}
    	});
	}
	
	//暂存
	function tempSave(){
		changeValidateRule(false);
		if(!invtHeadForm.valid()){
			return;
		}
		var invtMessage = {
			invtHeadType : invtHeadForm.serializeJson(),
			invtListType : invtListTable.bootstrapTable("getData"),
			invtDecHeadType : invtDecHeadForm.serializeJson(),
			invtDecListType : invtDecListTable.bootstrapTable("getData"),
			invtGoodsType : invtGoodsTable.bootstrapTable("getData"),
			invtWarehouseType : invtWarehouseTable.bootstrapTable("getData"),
			invtCbecBill : invtCbecBillTable.bootstrapTable("getData"),
		};
		//添加遮罩
		var customInfoIndex;
		$.ajax({
			type : "POST",
			url : InvtHelper.Url.SaveService.replace("{{subSys}}", COMMON_INFO.subSystem),
			data: JSON.stringify(invtMessage),
			dataType : "json",
			contentType : "application/json; charset=utf-8",
			timeout : 120000,
			beforeSend: function(XHR){
				customInfoIndex = layer.load(1,{shade:[0.3]});
			},
			success : function(data, textStatus, jqXHR) {
				//非法调用处理
				data = decryptServerMsg(data);
				if(!data || data.code != "0"){
					layer.open({
						title: "暂存提示",
						content: data.message || data.detail,
						icon: 2
					});
					return;
				}
				showLayerMsg("暂存成功！", 3000);
				//控制按钮
				setButtonStat("1");
				//界面字段控制
				SetViewOnly(invtTypeName, true); //清单类型
				SetViewOnly(putrecNo, true);	//账册号
				SetElementEnable(mtpckEndprdMarkcdName, false); //料件成品
				//反填信息
				seqNo.val(data.data.seqNo);	//预录入编号
				//表体控制
				SetViewOnly(invtListForm, false);
				if(dclcusFlag.val() === "1" && $("#genDecFlag").val() === "1"){
					$("#btn-invt-dec-import").show();
					SetElementEnable(decImportBtn, true);
					$("#invt_dec_head_form_fieldset").show();
				}else{
					$("#btn-invt-dec-import").hide();
					$("#invt_dec_head_form_fieldset").hide();
//					SetElementEnable(decImportBtn, false);
				}
				//20181102
//				SetViewOnly(invtListDclUprcAmt, true);
				SetElementEnable(invtListAddBtn, true); //新增按钮
				SetElementEnable(invtListDelBtn, true); //删除按钮
				SetElementEnable(invtListCopyBtn, true); //复制按钮
				SetElementEnable(openGoodsSearchBtn, true); //快速查询按钮
				//20181114 modified by zongjie 
				if("9" == $("#invtType").val()){
					SetViewOnly(invtGoodsForm, false);
					SetElementEnable(invtGoodsAddBtn, true); //新增按钮
					SetElementEnable(invtGoodsDelBtn, true); //删除按钮
				}
				//手册系统B1时，表体字段控制
				if (COMMON_INFO.subSysId === "B1" && invtMessage.invtHeadType.applyNo ) {
					SetViewOnly(invtListForm.find("input[name=putrecSeqno]"), true);
	            }
				SetViewOnly(invtListGdsSpcfModelDesc, false); //商品规格型号
	            //监管方式为:0844、0845、5200、0400、0864、0865 时商品编码、名称、规格型号、计量单位、数量 可修改
                if ($.inArray(invtMessage.invtHeadType.supvModecd, ["0844", "0845", "5200", "0400", "0864", "0865"]) >= 0){
                	SetViewOnly(invtListGdecd, false); //商品编码
                	SetViewOnly(invtListGdsNm, false); //商品名称
                	//SetViewOnly(invtListGdsSpcfModelDesc, false); //商品规格型号
                	SetViewOnly(invtListDclUnitcdName, false); //申报计量单位
                }
                //物流账册
				if (IsBwlNo(putrecNo.val())){ 
					SetViewOnly(invtListGdsMtno, false); //商品料号
					SetViewOnly(invtListGdecd, false); //商品编码
					SetViewOnly(invtListGdsNm, false); //商品名称
					//SetViewOnly(invtListGdsSpcfModelDesc, false); //商品规格型号
					SetViewOnly(invtListDclUnitcdName, false); //申报计量单位
	            }
	            //3-耗料式账册商品信息需要可以让企业自己录入
	            if (putrecNo.val().startsWith("T") && putrecNo.val().charAt(5) === 'H') {
	            	SetViewOnly(invtListGdsMtno, false); //商品料号
	            	SetViewOnly(invtListGdecd, false); //商品编码
	            	SetViewOnly(invtListGdsNm, false); //商品名称
	            	//SetViewOnly(invtListGdsSpcfModelDesc, false); //商品规格型号
	            }
	            //4-简单加工清单  增加料件表体
	            if (invtMessage.invtHeadType.invtType == "4") {
	            	SetViewOnly(invtGoodsForm, false);
	            	SetElementEnable(invtGoodsAddBtn, true); //新增按钮
					SetElementEnable(invtGoodsDelBtn, true); //删除按钮
	            }
	            //1-集报清单  表体不允许新增和删除，每项表体的申报数量、申报计量单位、单价不允许修改
	            if (invtMessage.invtHeadType.invtType == "1") {
	            	//20181105 modified by zongjie
	            	SetElementEnable(invtListAddBtn, false); //新增按钮
					SetElementEnable(invtListDelBtn, false); //删除按钮
					SetElementEnable(invtListCopyBtn, false); //复制按钮
					SetElementEnable(openGoodsSearchBtn, false); 
					SetElementEnable(importBtn, false);
	            	SetViewOnly(invtListForm, true);
	            	//20181105 modified by zongjie
	            	resetList();
	            	//20181213 modified by zongjie 添加申报单价和申报总价字段
	            	SetViewOnly(invtListForm.find("[name=entryGdsSeqno],[name=dclUprcAmt],[name=dclTotalAmt],[name=wtSfVal],[name=fstSfVal],[name=secdSfVal],[name=ucnsVerno],[name=rmk],#useCd,#useCdName,#lvyrlfModecd,#lvyrlfModecdName,#gdecd"), false);
	            }
	            //8-保税电商 
	            if (invtType.val() == "8") {
	            	var notWrite = invtHeadForm.find("input[name=param1]").val();
	            	//联网
	            	if(notWrite == "1"){
	            		SetViewOnly(invtListForm, true);
//	            		SetViewOnly(invtListForm.find("input[name=gdsMtno],#gdecd,input[name=gdsNm],input[name=gdsSpcfModelDesc],#dclUnitcdName,#useCdName,#lvyrlfModecdName,input[name=rmk]"), false);
	            		SetViewOnly(invtListForm.find("input[name=gdsMtno],#gdecd,input[name=gdsNm],input[name=gdsSpcfModelDesc],#dclUnitcdName,#lvyrlfModecdName,input[name=rmk]"), false);
	            		SetElementEnable(invtListAddBtn, false);
	            		SetElementEnable(invtListDelBtn, false);
	            		SetElementEnable(invtListCopyBtn, false);
	            		SetElementEnable(invtCbecBillDelBtn, true);
						SetElementEnable(invtCbecBillDelAllBtn, true);
	            		SetElementEnable(openGoodsSearchBtn, false);
	            		openGoodsSearchBtn.hide();
	            		SetElementEnable(importBtn, false);
	            		SetViewOnly(invtCbecBillForm, true);
	            		invtCbecBillAddBtn.hide();
						invtCbecBillDelBtn.show();
						invtCbecBillDelAllBtn.show();
						SetElementEnable(openQueryCbecBillBtn, true);
						SetElementEnable(getCbecGroupBtn, true);
						openQueryCbecBillBtn.show();
						getCbecGroupBtn.show();
	            	}else{
	            		SetViewOnly(invtCbecBillForm, false);
	            		openGoodsSearchBtn.show();
						SetElementEnable(openGoodsSearchBtn, true);
						SetElementEnable(invtListAddBtn, true);
						SetElementEnable(invtListDelBtn, true);
						SetElementEnable(invtListCopyBtn, true);
						SetElementEnable(importBtn, true);
						SetElementEnable(invtCbecBillAddBtn, true);
						SetElementEnable(invtCbecBillDelBtn, true);
						SetElementEnable(invtCbecBillDelAllBtn, true);
						invtCbecBillAddBtn.show();
						invtCbecBillDelBtn.show();
						invtCbecBillDelAllBtn.show();
						openQueryCbecBillBtn.hide();
						getCbecGroupBtn.hide();
	            	}
	            }
	            setAcmpParam("nems", "4" , seqNo.val(), 0, false);
	            if (invtMessage.invtHeadType.dclTypecd == "2") {
	            	initChange();
	            }
			},
			error : function(XMLHttpRequest, textStatus, errorThrown){	
				layer.open({
					title: "暂存提示",
					content:"操作超时，请稍后再试！",
					icon: 2
				});
			},
			complete: function(XHR, textStatus){
				layer.close(customInfoIndex);
			}
		});
	}
	
	//申报
	function declare(){
		var json = invtHeadForm.serializeJson();
		if(Session.cus_reg_no != json.dclEtpsno){
			layer.open({
				title: "申报提示",
				content: "当前申报单位与登录用户账号绑定的企业海关编码（{{CUS_REG_NO}}）不一致".replace("{{CUS_REG_NO}}", Session.cus_reg_no),
				icon: 2
			});
			return;
		}
		// 增加报关情况数据非空判断
		changeValidateRule(true);
		$('ul.nav-tabs a[data-toggle=tab]:first').tab('show');
		if(!invtHeadForm.valid()){
			return;
		}
		// 表体非空判断
		if(!invtListTable.bootstrapTable("getData") || invtListTable.bootstrapTable("getData").length == 0){
			layer.open({
				title: "申报提示",
				content: "表体记录不能为空",
				icon: 2
			});
			return;
		}
		// 料件表体非空判断
		if(invtType.val() == "4"){
			if(!invtGoodsTable.bootstrapTable("getData") || invtGoodsTable.bootstrapTable("getData").length == 0){
				layer.open({
					title: "申报提示",
					content: "料件记录不能为空",
					icon: 2
				});
				return;
			}
		}
		if(dclcusFlag.val() == "1" && $("#genDecFlag").val() === "1"){//两单一审校验
			var putrecno = putrecNo.val();
			var str = putrecno.substring(0,1);//
			if($("#trspModecd").val() == "9" && $("#stshipTrsarvNatcd").val() == "142" && $("#dclcusTypecd").val() == "2" && 
					($.inArray($("#supvModecd").val(), ["1200", "5000", "5100", "5300", "1371", "1300"]) >= 0) && 
					($.inArray(str, ["H", "T", "L"]) >= 0)){
				$("#rltPutrecNo").rules("add", {required : true});
				if($("#rltPutrecNo").val() == ""){
					layer.open({
						title: "申报提示",
						content: "当满足（1）、运输方式为9；（2）、底账编号首字母为H、T、L；（3）、起运抵国为142；4）、报关类型为对应报关；（5）、监管方式：1200、5000、5100、5300、1371、1300 时，关联备案号为必填项。",
						icon: 2
					});
					return;
				}
				var rltPutrecNo = $("#rltPutrecNo").val();
				var str1 = rltPutrecNo.substring(0,1);
				var str2 = rltPutrecNo.substring(7,8);
				var str3 = rltPutrecNo.substring(0,4);
				var p = /[0-9]/;
				if((($.inArray(str1, ["B", "C", "D", "E"]) >= 0) && p.test(str2)) || str3.toUpperCase() == "NULL"){
					if($.inArray($("#decType").val(), ["5", "6"]) < 0){
						layer.open({
							title: "申报提示",
							content: "当满足（1）、运输方式为9；（2）、底账编号首字母为H、T、L；（3）、起运抵国为142；4）、报关类型为对应报关；（5）、监管方式：1200、5000、5100、5300、1371、1300 时；(6)关联备案号为“null00000000”或旧底账（BCDE）的，报关单类型必须为两单一审类型。",
							icon: 2
						});
						return;
					}
				}
			}
		}

		// 申报时加签,加签字段
		// 清单类型+备案编号+经营单位+加工单位+ *申报类型* +料件成品标志+监管方式+运输方式+进境关别+主管海关+启运国+报关标志
		var signStr = ""+invtType.val()+putrecNo.val()+bizopEtpsno.val()+rcvgdEtpsno.val()+invtHeadForm.find("#dclTypecd").val()
						+mtpckEndprdMarkcd.val()+invtHeadForm.find("#supvModecd").val()+invtHeadForm.find("#trspModecd").val()
						+invtHeadForm.find("#impexpPortcd").val()+invtHeadForm.find("#dclPlcCuscd").val()
						+invtHeadForm.find("#stshipTrsarvNatcd").val()+dclcusFlag.val();
		emsSignData(declInvts,signStr);

	}

	//插卡校验
	//isInstalled(function(){
	function declInvts(sign) {
		layer.confirm('是否确认申报该数据?', {icon: 3, title: '提示'}, function (index) {
			var invtMessage = {
				invtHeadType: invtHeadForm.serializeJson(),
				invtDecHeadType: invtDecHeadForm.serializeJson(),
				invtListType: invtListTable.bootstrapTable("getData"),
				invtDecListType: invtDecListTable.bootstrapTable("getData"),
				invtGoodsType: invtGoodsTable.bootstrapTable("getData"),
				invtWarehouseType: invtWarehouseTable.bootstrapTable("getData"),
				invtCbecBill: invtCbecBillTable.bootstrapTable("getData"),
			};
			var invtSign = new Object();//申报请求实体
			invtSign.signInfo = sign.signature;//加签后字符串
			invtSign.certNo = sign.certno;//证书号
			invtSign.signDate = getCurrDate();//加签日期-当前日期
			invtSign.icCode = Session.cards;
			invtSign.icEtpsNo = Session.cus_reg_no;
			invtSign.icEtpsSccd = Session.social_credit_code;
			//invtSign.seqNo = $("#PRHeadForm #seqNo").val();
			invtSign.bizopEtpsNo = bizopEtpsno.val();
			invtSign.bizopEtpsSccd = bizopEtpsSccd.val();
			invtSign.ownerEtpsNo = rcvgdEtpsno.val();
			invtSign.ownerEtpsSccd = rvsngdEtpsSccd.val();
			invtSign.chgTmsCnt = $("#chgTmsCnt").val()
			invtMessage.invtSign = invtSign;
			//添加遮罩
			var customInfoIndex;
			$.ajax({
				type: "POST",
				url: InvtHelper.Url.DeclareService.replace("{{subSys}}", COMMON_INFO.subSystem),
				data: JSON.stringify(invtMessage),
				dataType: "json",
				contentType: "application/json; charset=utf-8",
				timeout: 120000,
				beforeSend: function (XHR) {
					customInfoIndex = layer.load(1, {shade: [0.3]});
				},
				success: function (data, textStatus, jqXHR) {
					//非法调用处理
					data = decryptServerMsg(data);
					if (!data || data.code != "0") {
						layer.open({
							title: "申报提示",
							content: data.message || data.detail,
							icon: 2
						});
						return;
					}
					showLayerMsg("申报成功！", 3000);
					//控制按钮
					setButtonStat("2");
					//界面字段控制
					seqNo.val(data.data.seqNo);	//预录入编号
					invtHeadForm.find("input[name=invtDclTime]").val(data.data.invtDclTime);	//申报时间
					SetViewOnly(invtHeadForm, true);
					SetViewOnly(invtListForm, true);
					SetViewOnly(invtGoodsForm, true);
					SetViewOnly(invtCbecBillForm, true);
					setAcmpParam("nems", "4", seqNo.val(), $("#chgTmsCnt").val(), true);
					SetElementEnable(invtListAddBtn, false);
					SetElementEnable(invtListDelBtn, false);
					SetElementEnable(invtListCopyBtn, false);
					SetElementEnable(decImportBtn, false);
					SetElementEnable(openGoodsSearchBtn, false);
					SetElementEnable(invtGoodsAddBtn, false);
					SetElementEnable(invtGoodsDelBtn, false);
					invtCbecBillAddBtn.hide();
					invtCbecBillDelBtn.hide();
					invtCbecBillDelAllBtn.hide();
					SetElementEnable(openQueryCbecBillBtn, false);
					SetElementEnable(getCbecGroupBtn, false);
					SetElementEnable(invtHeadForm.find("#forceBizOpEtpsInfo"), false);
					SetElementEnable(invtHeadForm.find("#forceRcvgdEtpsInfo"), false);
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					layer.open({
						title: "申报提示",
						content: "申报超时，请稍后再试！",
						icon: 2
					});
				},
				complete: function (XHR, textStatus) {
					layer.close(customInfoIndex);
				}
			});
			layer.close(index);
		});
		//});
	}
	
	//删除申请
	function cancel(){
		layer.confirm('确认当前数据发起删除申请？', {icon: 3, title:'提示'}, function(index){
			//添加遮罩
			var customInfoIndex;
			$.ajax({
				type : "GET",
				url : InvtHelper.Url.CancelService.replace("{{subSys}}", COMMON_INFO.subSystem).replace("{{seqNo}}", seqNo.val()).replace("{{blsNo}}", bondInvtNo.val()),
				dataType : "json",
				contentType : "application/json; charset=utf-8",
				timeout : 120000,
				beforeSend: function(XHR){
					customInfoIndex = layer.load(1,{shade:[0.3]});
				},
				success : function(data, textStatus, jqXHR) {
					//非法调用处理
					data = decryptServerMsg(data);
					if(!data || data.code != "0"){
						layer.open({
							title: "删除申请提示",
							content: data.message || data.detail,
							icon: 2
						});
						return;
					}
					showLayerMsg("删除申请成功！", 3000);
					//控制按钮
					//setButtonStat("2");
					SetViewOnly(invtHeadForm, true);
					SetViewOnly(invtListForm, true);
					SetViewOnly(invtGoodsForm, true);
					SetViewOnly(invtCbecBillForm, true);
					setAcmpParam("nems", "4" , seqNo.val(), $("#chgTmsCnt").val(), true);
					SetElementEnable(cancelBtn, false);
					SetElementEnable(declareBtn, false);
					SetElementEnable(deleteHeadBtn, false);
					SetElementEnable(saveBtn, false);
					SetElementEnable(printBtn, true);
					SetElementEnable(importBtn, false);

				},
				error : function(XMLHttpRequest, textStatus, errorThrown){
					layer.open({
						title: "删除申请提示",
						content: "删除申请失败，请稍后再试！",
						icon: 2
					});
				},
				complete: function(XHR, textStatus){
					layer.close(customInfoIndex);
				}
			});
			layer.close(index);
		});
	}
	
	//表头删除
	function delHead(){ 
		if(!seqNo.val()){
			layer.msg("您录入的数据未保存，无需删除!", {
				icon: 0,
				time: 3000
			});
			return;
		}
		layer.confirm('确认删除当前数据？', {icon: 3, title:'提示'}, function(index){
			//添加遮罩
			var customInfoIndex;
			$.ajax({
				type : "GET",
				url : InvtHelper.Url.DeleteService.replace("{{subSys}}", COMMON_INFO.subSystem).replace("{{seqNo}}", seqNo.val()),
				dataType : "json",
				contentType : "application/json; charset=utf-8",
				timeout : 120000,
				beforeSend: function(XHR){
					customInfoIndex = layer.load(1,{shade:[0.3]});
				},
				success : function(data, textStatus, jqXHR) {
					//非法调用处理
					data = decryptServerMsg(data);
					if(!data || data.code != "0"){
						layer.open({
							title: "删除提示",
							content: data.message || data.detail,
							icon: 2
						});
						return;
					}
					showLayerMsg("删除成功！", 3000);
					//控制按钮
					reset();
				},
				error : function(XMLHttpRequest, textStatus, errorThrown){	
					layer.open({
						title: "删除提示",
						content: "删除失败，请稍后再试！",
						icon: 2
					});
				},
				complete: function(XHR, textStatus){
					layer.close(customInfoIndex);
				}
			});
			layer.close(index);
		});
	}

	//表体新增（1）
	function addList(){
		if(!invtListForm.valid()){
			return;
		}
		var putrecno = putrecNo.val();
		var str = putrecno.substring(0,1);
		var impexpMarkcd = invtHeadForm.find("input[name=impexpMarkcd]").val();
		var ucnsVerno = invtListForm.find("input[name=ucnsVerno]").val();
		if(str == "E" && ($.inArray($("#supvModecd").val(), ["4400", "4600"]) >= 0) && impexpMarkcd == "I"){
			if(ucnsVerno == ""){
				layer.open({
	        		title: "提示",
	        		content: "核注清单表头备案号字段为E开头，监管方式为4400来料成品退换、4600进料成品退换，且进出口标记为“进口”的保税核注清单，清单表体各商品项的单耗版本号为必填项。",
	        		icon: 2
	        	});
				return;
			}
		}
		var data = invtListForm.serializeJson();
		if($("#dclTypecd").val() == "2"){
			data.modfMarkcd = "1";
			data.modfMarkcdName = "修改";
		}else{
			data.modfMarkcd = "3";
			data.modfMarkcdName = "增加";
		}
		_addList(data);
	}

	//表体新增（2）
	function _addList(data){
		
		var listData = invtListTable.bootstrapTable("getData");
		//集报不允许新增
		if ((invtType.val() == "1" || (invtType.val() == "8" && invtHeadForm.find("input[name=param1]").val() == "1"))&& data.gdsSeqno > listData.length){
			layer.open({
        		title: "提示",
        		content: "当前清单类型不允许新增！",
        		icon: 2
        	});
			return;
		}
		var decListData = invtDecListTable.bootstrapTable("getData");
		var _row = {};
		$.extend(_row, invtListTable.bootstrapTable("getRowByUniqueId", data.gdsSeqno));
		if(_row && _row.gdsSeqno && _row.gdsSeqno != data.gdsSeqno){
			layer.open({
        		title: "提示",
        		content: "表体序号不能修改！",
        		icon: 2
        	});
			return;
		}
		//如果报关则生成报关商品
		if(dclcusFlag.val() === "1" && $("#genDecFlag").val() === "1" && $("#dclTypecd").val() ==="1"){
			//如果用户设置报关单序号，检查序号是否合规
			if (DecListGNoCheck(data, decListData) === false) return;
			//判断原来是否存在报关单序号，
            //如果存在且是最大号，可以清空该号
            //如果不是最大号，清空后查看是否还有表体使用该号，如果有可以清空，如果没有提示不能清空该序号
            if ($.trim(data.entryGdsSeqno) == "" && data.gdsSeqno < listData.length){
                if (_row.entryGdsSeqno == ""){
                	//小于最大序号
                    if (_row.entryGdsSeqno < decListData.length){
						for(var i = 0; i < decListData.length; i++){
                        //for(var dl in decListData){
                            if (decListData[i].entryGdsSeqno === _row.entryGdsSeqno){
                            	//就包含该商品记录
                                if (decListData[i].putrecSeqno && decListData[i].putrecSeqno.split(",").length < 3){
                                	layer.open({
                                		title: "提示",
                                		content: "该表体报关单序号不能修改其他值！",
                                		icon: 2
                                	});
                                	var _entryGdsSeqno = invtListForm.find("input[name=entryGdsSeqno]");
                                	_entryGdsSeqno.val(_row.entryGdsSeqno);
                                	_entryGdsSeqno.focus();
                                    return;
                                }
                            }
                        }
                    }
                }
            }
		}
		if ($("#dclTypecd").val() === "1"){//清单修改申请时修改表体不走校验
			if (decListData.length == 50 && GoodDutyType(data.gdecd) === true){
	            //涉税商品不能再新增
				layer.open({
					title: "提示",
					content: "报关单商品项最多50条，新增该涉税商品后无法归并到报关单商品项中！",
					icon: 2
				});
	            return;
	        }
	        if (DecListCountCheck(data, decListData) === false){
	        	layer.open({
					title: "提示",
					content: "本保税核注清单对应的报关单表体已经50条(不可超过50条)，请确认后重新录入！",
					icon: 2
				});
	            return;
	        }
		}
		if(_row && _row.gdsSeqno){
			invtListTable.bootstrapTable("updateRow", {row: data, index: data.gdsSeqno-1});
		}else{
			if ($("#dclTypecd").val() == "2"){
				layer.open({
	        		title: "提示",
	        		content: "当前清单不允许新增！",
	        		icon: 2
	        	});
				return;
			}
			invtListTable.bootstrapTable("insertRow", {row: data, index: data.gdsSeqno-1});
		}
		//如果报关则生成报关商品
		if (dclcusFlag.val() == "1" && $("#genDecFlag").val() === "1" && $("#dclTypecd").val() ==="1"){
			if(InitInvtList2DecList() === false){
				invtListTable.bootstrapTable("removeByUniqueId", _row.gdsSeqno);
				invtListTable.bootstrapTable("insertRow", {row: _row, index: _row.gdsSeqno-1});
				return;
			}
		}
		//非集报清单则可以添加新数据
//		if (invtType.val() == "1"){
//			SetViewOnly(invtListForm, true);
//        }
		resetList();
	}

	//报关单商品序号检查
	function DecListGNoCheck(data, decData){
		var gNo = $.trim(data.entryGdsSeqno);
		if(gNo != ""){
			if(gNo <= decData.length){
				var _decRow = decData[gNo - 1];
				var InvtList = $("#InvtListTable").bootstrapTable("getData");
				var putrecSeqnos =  _decRow.putrecSeqno.toString().replace(/\@/g, "").split(",");
				var bool ;
				//20181214 modefied by zongjie 修复老数据最终目的国字段没有值无法归并的问题
				if("1" != $("#invtType").val() && ("" == _decRow.destinationNatcd || undefined == _decRow.destinationNatcd)){
					bool = data.gdecd == _decRow.gdecd && data.gdsNm == _decRow.gdsNm &&
					data.dclUnitcd == _decRow.dclUnitcd &&
					data.dclCurrcd == _decRow.dclCurrCd &&
					data.natcd == _decRow.natCd &&
					data.entryGdsSeqno == _decRow.entryGdsSeqno;
				}else if("1" == $("#invtType").val() && ("" == _decRow.destinationNatcd || undefined == _decRow.destinationNatcd) ){
					//20181213 modefied by zongjie
					bool = data.gdecd == _decRow.gdecd && data.gdsNm == _decRow.gdsNm &&
					data.dclUnitcd == _decRow.dclUnitcd &&
					data.dclCurrcd == _decRow.dclCurrCd &&
					data.entryGdsSeqno == _decRow.entryGdsSeqno;
				}else{
					bool = data.gdecd == _decRow.gdecd && data.gdsNm == _decRow.gdsNm &&
					data.dclUnitcd == _decRow.dclUnitcd &&
					data.natcd == _decRow.natCd &&
					//20181018 优化 新增目的国
					data.destinationNatcd == _decRow.destinationNatcd &&
					data.dclCurrcd == _decRow.dclCurrCd &&
					data.entryGdsSeqno == _decRow.entryGdsSeqno;
				}
				if(bool){
					//判断是否涉税商品(E成品需要判断)
                    if (mtpckEndprdMarkcd.val() == "E" && GoodDutyType(data.gdecd)){
                        if (_decRow.putrecSeqno && _decRow.putrecSeqno.indexOf("@"+data.gdsSeqno+",") >= 0 ){
                        	layer.open({
                        		title: "提示",
                        		content: "表体序号[" + data.gdsSeqno + "]：报关单序号已经存在，该商品为涉税商品不能进行归并！",
                        		icon: 2
                        	});
                            return false;
                        }
                    }else{
                    	if("1" != $("#invtType").val() && ("" == _decRow.destinationNatcd || undefined == _decRow.destinationNatcd)){
							for(var i = 0; i < putrecSeqnos.length; i++){
                    		//for(var i in putrecSeqnos){
                    			if(data.gdsSeqno != putrecSeqnos[i]){
									for(var j = 0; j < InvtList.length; j++){
                    				//for(var j in InvtList){
                    					if(putrecSeqnos[i] == InvtList[j].gdsSeqno){
                    						InvtList[j].destinationNatcd = data.destinationNatcd;
                    						InvtList[j].destinationNatcdName = data.destinationNatcdName;
                    					}
                    				}
                    			}
                    		}
                    	}
                    	return true;
                    }
				}else if(putrecSeqnos.length == 1 && putrecSeqnos[0] == data.gdsSeqno){
					return true;
				}else{
					layer.open({
						title: "提示",
						content: "表体序号[" + data.gdsSeqno + "]：报关单序号已经存在，但是与对应的报关商品信息归并条件不同，不能进行归并",
						icon: 2
					});
					return false;
				}
			}else if(gNo == (decData.length + 1)){
				return true;
			}else{
				layer.open({
					title: "提示",
					content: "报关单序号必须按照自然数顺序排号，不允许断号",
					icon: 2
				});
				return false;
			}
		}
		return true;
	}
	
	/**
	 * 是否涉税商品
	 * returns false：不涉税；true:涉税
	 */
	function GoodDutyType(gdecd){
		if(CodeTsFlag[gdecd] && CodeTsFlag[gdecd] === "0"){
			return false;
		}else if(CodeTsFlag[gdecd] && CodeTsFlag[gdecd] === "1"){
			return true;
		}
		$.ajax({
			type : "POST",
			url : swProxyBasePath+ "sw/ems/pub/common/getGoodsInfo",
			data : JSON.stringify({"codeTs" : gdecd}),
			dataType : "json",
			async: false,
			contentType : "application/json; charset=utf-8",
			success : function(data) {
				//非法调用处理
				data = decryptServerMsg(data);
				CodeTsFlag[gdecd] = data.outDutyTypeFlag;
				return data.outDutyTypeFlag === "0";
			},
			error: function(){
				return false;
			}
		});
		return false;
	}

	//报关单草稿表体数量控制
	function DecListCountCheck(invtListData, invtDecListData){
		//小于50项可以操作数据
        if (invtDecListData.length < 50){
            return true;
        } else {//等于50项时
            //判断新增或修改的数据是否可进行归并
            for (var i = 0; i < invtDecListData.length; i++){
            	var decList = invtDecListData[i];
                if (invtListData.gdecd == decList.gdecd &&
                		invtListData.gdsNm == decList.gdsNm &&
                		invtListData.dclUnitcd == decList.dclUnitcd &&
                		invtListData.natcd == decList.natCd &&
                		//20181018 优化 新增目的国
                		invtListData.destinationNatcd == decList.destinationNatcd &&
                		invtListData.dclCurrcd == decList.dclCurrCd) {
                	if (invtListData.entryGdsSeqno && invtListData.entryGdsSeqno != decList.entryGdsSeqno) {
                        if(i == 49){
                        	return false;
                        }
                		continue;
                	}else {
                		return true;
                	}
                }
            }
            return false;
        }
    }
	
	/**
	 * 核注商品生成报关单商品
	 */
	function InitInvtList2DecList(){
		var listData = invtListTable.bootstrapTable("getData");
		var newDecListData = [];
		var entryGdsSeqNos = [];
        if (listData.length > 0){
			for (var i = 0; i < listData.length; i++){
            //for (var i in listData){
            	var l = listData[i];
            	//不做归并
            	var _tmpDec = InvtList2DecList(l);
            	if(newDecListData.length == 0){
            		newDecListData.push(_tmpDec);
            		entryGdsSeqNos.push(newDecListData.length);
            	}else if(mtpckEndprdMarkcd.val() == "E" && GoodDutyType(l.gdecd)){
            		newDecListData.push(_tmpDec);
            		entryGdsSeqNos.push(newDecListData.length);
            	}else if(l.param1 == "1"){
            		newDecListData.push(_tmpDec);
            		entryGdsSeqNos.push(newDecListData.length);
            	}else{
            		var flag = false;
            		for (var j = 0; j < newDecListData.length; j++){
            			var _tmp = newDecListData[j];
            			//商品编码+商品名称+计量单位+币制+产销国
            			if (l.gdecd == _tmp.gdecd &&
            					l.gdsNm == _tmp.gdsNm &&
            					l.dclUnitcd == _tmp.dclUnitcd &&
            					l.natcd == _tmp.natCd &&
            					//20181018 优化 新增目的国
            					l.destinationNatcd == _tmp.destinationNatcd &&
            					l.dclCurrcd == _tmp.dclCurrCd ) {
            				if(l.entryGdsSeqno && l.entryGdsSeqno != _tmp.entryGdsSeqno ){
            					//20180912 修复bug，报关单序号为1,2,3,3时，第四条归并失败
            					if(entryGdsSeqNos.filter(function(v){return l.entryGdsSeqno == v}).length > 0){
            						flag = false;
            						continue;
            					}
            					newDecListData.push(_tmpDec);
            					entryGdsSeqNos.push(newDecListData.length);
            					flag = true;
            					break;
            				}else{
            					combineDec(_tmpDec, _tmp);
            					flag = true;
            					break;
            				}
            			}else{
            				flag = false;
            			}
            		}
            		if(!flag){
            			newDecListData.push(_tmpDec);
            			entryGdsSeqNos.push(newDecListData.length);
            		}
            	}
            }
            //更细报关单商品数据
            var _listData = [];
            $.extend(_listData, listData);
            _listData.sort(function(a,b){return !a.entryGdsSeqno ? 1 : (!b.entryGdsSeqno ? 0 : b.entryGdsSeqno - a.entryGdsSeqno)});
//            var maxEntryGdsSeqno = _listData[0].entryGdsSeqno;
//            if(maxEntryGdsSeqno && maxEntryGdsSeqno > newDecListData.length){
//            	layer.open({
//					title: "提示",
//					content: "报关单序号必须按照自然数顺序排号，不允许断号",
//					icon: 2
//				});
//            	return false;
//            }
//            invtDecListTable.bootstrapTable("load", {data: newDecListData});
            invtDecListTable.bootstrapTable("load",  newDecListData);
        }else{
        	invtDecListTable.bootstrapTable("removeAll");
        }
	}

	//清单表体信息转换报关单信息
	function InvtList2DecList(invtList){
		 var decList = {};
		 decList.dclCurrCd = invtList.dclCurrcd;
         decList.dclCurrCdName = invtList.dclCurrcdName;
         decList.dclQty = invtList.dclQty;
         decList.dclTotalAmt = invtList.dclTotalAmt;
         decList.dclUnitcd = invtList.dclUnitcd;
         decList.dclUnitcdName = invtList.dclUnitcdName;
         decList.dclUprcAmt = invtList.dclUprcAmt;
         decList.entryGdsSeqno = invtList.entryGdsSeqno;
         decList.gdecd = invtList.gdecd;
         decList.gdsNm = invtList.gdsNm;
         decList.gdsSpcfModelDesc = invtList.gdsSpcfModelDesc;
         decList.lawfQty = invtList.lawfQty;
         decList.lawfUnitcd = invtList.lawfUnitcd;
         decList.lawfUnitcdName = invtList.lawfUnitcdName;
         decList.natCd = invtList.natcd;
         decList.natCdName = invtList.natcdName;
         //20181018 新增目的国字段
         decList.destinationNatcd = invtList.destinationNatcd;
         decList.destinationNatcdName = invtList.destinationNatcdName;
         decList.putrecSeqno = "@" + invtList.gdsSeqno;//报关单备案序号里面存储核注商品序号（为了生成报关单序号时返填核注商品信息）
         decList.secdLawfQty = invtList.secdLawfQty;
         decList.secdLawfUnitcd = invtList.secdLawfUnitcd;
         decList.secdLawfUnitcdName = invtList.secdLawfUnitcdName;
//         decList.useCd = invtList.useCd;
//         decList.useCdName = invtList.useCdName;
         return decList;
	}
	
	//表体删除
	function delList(){
		var rows = invtListTable.bootstrapTable("getSelections");
//		if(!!rows && rows.length==1){
		if(!!rows  && rows.length!=0){
			var row = rows[0];
			var msg = "确认删除当前数据？";
			if ($.trim(row.entryGdsSeqno) != ""){
				msg = "该表体记录存在对应的报关单商品序号，由于报关单商品序号不能断号，如果删除会更改其他商品对应的报关单商品序号。\n\n确认是要删除当前数据吗？";
			}
			var lock = false;//默认未锁定
			layer.confirm(msg, {icon: 3, title:'提示'}, function(index){
				if(!lock){
					lock = true;
					for (var i = 0; i < rows.length; i++) {
						row = rows[i];
						invtListTable.bootstrapTable("removeByUniqueId", row.gdsSeqno);
						if (dclcusFlag.val() == "1" && $("#genDecFlag").val() == "1"){
							if(InitInvtList2DecList() === false){
								invtListTable.bootstrapTable("insertRow", {index: row.gdsSeqno-1, row:row});
							}
						}
					}
					resetList();
					layer.close(index);
				}
			});
		}else{
			showLayerAlert("请选择一条数据！");
		}
	}

	//表体复制
	function copyList(){
		var rows = invtListTable.bootstrapTable("getSelections");
		if(!!rows && rows.length==1){
			var row = rows[0];
			layer.confirm("确认复制当前数据？", {icon: 3, title:'提示'}, function(index){
				var _row = {};
				$.extend(_row, row);
				_row.gdsSeqno = getTableNextIndex(invtListTable);
				_addList(_row);
				resetList();
				invtListTable.bootstrapTable("uncheckAll");
				invtListTable.bootstrapTable("check", _row.gdsSeqno - 1);
				layer.close(index);
			});
		}else{
			showLayerAlert("请选择一条数据！");
		}
	}
	
	//表体表单重置
	function resetList(){
		invtListForm.clearForm(true);
		$("#modfMarkcd").val("3");//表体修改标志
		$("#modfMarkcdName").val("增加");//表体修改标志
		invtListForm.find("input[oldvalue]").attr("oldvalue", "");
		invtListGdsSeqno.val(getTableNextIndex(invtListTable));
//		invtListForm.find("input[name=dclUprcAmt]").attr("readonly",true);
		//表体用途代码默认“其他”  --date:20180719
		invtListForm.find("#useCd").val("11");
		invtListForm.find("#useCdName").val("其他");
		if($("#invtType").val() == "8"){
			invtListForm.find("#lvyrlfModecd").val("3");
			invtListForm.find("#lvyrlfModecdName").val("全免");
		}
		invtListForm.find("input[name=gdsSeqno]").focus();
	}
	
	//料件新增
	function addGoods(){
		if(!invtGoodsForm.valid()){
			return;
		}
		var data = invtGoodsForm.serializeJson();
		var _row = {};
		$.extend(_row, invtGoodsTable.bootstrapTable("getRowByUniqueId", data.gdsSeqno));

		if(_row && _row.gdsSeqno){
			invtGoodsTable.bootstrapTable("updateRow", {row: data, index: data.gdsSeqno-1});
		}else{
			invtGoodsTable.bootstrapTable("insertRow", {row: data, index: data.gdsSeqno-1});
		}
		resetGoods();
	}
	
	//料件删除
	function delGoods(){
		var rows = invtGoodsTable.bootstrapTable("getSelections");
		if(!!rows ){
			layer.confirm('确认删除当前数据？', {icon: 3, title:'提示'}, function(index){
				var row = rows[0];
				for (var i = 0; i < rows.length; i++) {
					row = rows[i];
					invtGoodsTable.bootstrapTable("removeByUniqueId", row.gdsSeqno);
				}
				resetGoods();
				layer.close(index);
			});
		}else{
			showLayerAlert("请选择一条数据！");
		}
	}
	
	//料件表单重置
	function resetGoods(){
		invtGoodsForm.clearForm(true);
		invtGoodsForm.find("modfMarkcd").val("3");
		invtGoodsForm.find("input[oldvalue]").attr("oldvalue", "");
		invtGoodsGdsSeqno.val(getTableNextIndex(invtGoodsTable));
//		invtGoodsForm.find("input[name=dclUprcAmt]").attr("readonly",true);
		invtGoodsForm.find("input[name=gdsSeqno]").focus();
	}
	
	//保税电商新增
	function addCbecBill(){
		var data = invtCbecBillForm.serializeJson();
		if(data.cbecBillNo == ""){
			showLayerAlert("电商清单编号不能为空！");
			return;
		}
		var row = invtCbecBillTable.bootstrapTable("getData");
		var _tmp = row.filter(function(val,idx,arr){
			return val.gno != data.gno && val.cbecBillNo == data.cbecBillNo
		});
		if(_tmp.length > 0){
			showLayerAlert("该电商清单编号已经存在！");
			return;
		}
		var _row = {};
		$.extend(_row, invtCbecBillTable.bootstrapTable("getRowByUniqueId", data.gno));
		
		if(_row && _row.gno){
			invtCbecBillTable.bootstrapTable("updateRow", {row: data, index: data.gno-1});
		}else{
			invtCbecBillTable.bootstrapTable("insertRow", {row: data, index: data.gno-1});
		}
		resetCbecBill();
	}
	
	//电商删除
	function delCbecBill(){
		var rows = invtCbecBillTable.bootstrapTable("getSelections");
		//修改
		if(!!rows && rows.length>0){
			layer.confirm('确认删除选中数据？', {icon: 3, title:'提示'}, function(index){
				//var row = rows[0];
				//invtCbecBillTable.bootstrapTable("removeByUniqueId", row.gno);
				for(var i=0;i<rows.length;i++){
					invtCbecBillTable.bootstrapTable("removeByUniqueId", rows[i].gno);
				}
				resetCbecBill();
				layer.close(index);
			});
		}else{
			showLayerAlert("请选择一条数据！");
		}
	}

	//电商全部删除
	function delCbecAllBill(){
		layer.confirm('确认删除全部数据？', {icon: 3, title:'提示'}, function(index){
			invtCbecBillTable.bootstrapTable("removeAll");
			resetCbecBill();
			layer.close(index);
		});
	}
	
	//电商表单重置
	function resetCbecBill(){
		invtCbecBillForm.clearForm(true);
		invtCbecBillForm.find("input[oldvalue]").attr("oldvalue", "");
		invtCbecBillGNo.val(getTableNextIndex(invtCbecBillTable));
		invtCbecBillForm.find("input[name=cbecBillNo]").focus();
	}

	//经营单位
	function setBizopEtpsInfo(data){
		if(data && data.code == "0"){
			bizopEtpsSccd.val(data.data.socialCreditCode);
			bizopEtpsNm.val(data.data.copName);
			bizopEtpsno.attr("oldvalue", data.data.copCusCode);
		}else{
			bizopEtpsSccd.val("");
			bizopEtpsNm.val("");
			bizopEtpsno.attr("oldvalue", "");
		}
	}

	//加工单位
	function setRcvgdEtpsInfo(data){
		if(data && data.code == "0"){
			rvsngdEtpsSccd.val(data.data.socialCreditCode);
			rcvgdEtpsNm.val(data.data.copName);
			rcvgdEtpsno.attr("oldvalue", data.data.copCusCode);
		}else{
			rvsngdEtpsSccd.val("");
			rcvgdEtpsNm.val("");
			rcvgdEtpsno.attr("oldvalue", "");
		}
	}

	//申报单位
	function setDclEtpsInfo(data){
		if(data && data.code == "0"){
			dclEtpsSccd.val(data.data.socialCreditCode);
			dclEtpsNm.val(data.data.copName);
			dclEtpsno.attr("oldvalue", data.data.copCusCode);
		}else{
			dclEtpsSccd.val("");
			dclEtpsNm.val("");
			dclEtpsno.attr("oldvalue", "");
		}
	}

	//对应报关单申报单位
	function setCorrEntryDclEtpsInfo(data){
		if(data && data.code == "0"){
			corrEntryDclEtpsSccd.val(data.data.socialCreditCode);
			corrEntryDclEtpsNm.val(data.data.copName);
			corrEntryDclEtpsNo.attr("oldvalue", data.data.copCusCode);
		}else{
			corrEntryDclEtpsSccd.val("");
			corrEntryDclEtpsNm.val("");
			corrEntryDclEtpsNo.attr("oldvalue", "");
		}
	}

	//关联报关单相关单位
	function setRltEntryRcvgdEtpsInfo(data){
		if(data && data.code == "0"){
			rltEntryRvsngdEtpsSccd.val(data.data.socialCreditCode);
			rltEntryRcvgdEtpsNm.val(data.data.copName);
			rltEntryRcvgdEtpsno.attr("oldvalue", data.data.copCusCode);
		}else{
			rltEntryRvsngdEtpsSccd.val("");
			rltEntryRcvgdEtpsNm.val("");
			rltEntryRcvgdEtpsno.attr("oldvalue", "");
		}
	}

	//关联报关单收货人单位
	function setRltEntryBizopEtpsInfo(data){
		if(data && data.code == "0"){
			rltEntryBizopEtpsSccd.val(data.data.socialCreditCode);
			rltEntryBizopEtpsNm.val(data.data.copName);
			rltEntryBizopEtpsno.attr("oldvalue", data.data.copCusCode);
		}else{
			rltEntryBizopEtpsSccd.val("");
			rltEntryBizopEtpsNm.val("");
			rltEntryBizopEtpsno.attr("oldvalue", "");
		}
	}

	//关联报关单申报单位
	function setRltEntryDclEtpsInfo(data){
		if(data && data.code == "0"){
			rltEntryDclEtpsSccd.val(data.data.socialCreditCode);
			rltEntryDclEtpsNm.val(data.data.copName);
			rltEntryDclEtpsno.attr("oldvalue", data.data.copCusCode);
		}else{
			rltEntryDclEtpsSccd.val("");
			rltEntryDclEtpsNm.val("");
			rltEntryDclEtpsno.attr("oldvalue", "");
		}
	}
	
	//归并
	function combineDec(decList, tmpDecList){
		if(!!decList.dclQty){
			var __t = new BigDecimal(decList.dclQty)
			.add(new BigDecimal(tmpDecList.dclQty == "" ? "0" : tmpDecList.dclQty))
			.setScale(5, MathContext.ROUND_HALF_EVEN).toString();
			tmpDecList.dclQty = cutZero(__t);
		}
		if(!!decList.dclTotalAmt){
			var __t = new BigDecimal(decList.dclTotalAmt)
			.add(new BigDecimal(tmpDecList.dclTotalAmt == "" ? "0" : tmpDecList.dclTotalAmt))
			.setScale(2, MathContext.ROUND_HALF_EVEN).toString();
			tmpDecList.dclTotalAmt = cutZero(__t);
		}
		if(!!decList.lawfQty){
			var __t = new BigDecimal(decList.lawfQty)
			.add(new BigDecimal(tmpDecList.lawfQty == "" ? "0" : tmpDecList.lawfQty))
			.setScale(5, MathContext.ROUND_HALF_EVEN).toString();
			tmpDecList.lawfQty = cutZero(__t);
		}
		if(!!decList.secdLawfQty){
			var __t = new BigDecimal(decList.secdLawfQty)
			.add(new BigDecimal(tmpDecList.secdLawfQty == "" ? "0" : tmpDecList.secdLawfQty))
			.setScale(5, MathContext.ROUND_HALF_EVEN).toString();
			tmpDecList.secdLawfQty = cutZero(__t); 
		}
		if(!!tmpDecList.dclQty && tmpDecList.dclQty != "0" && !!tmpDecList.dclTotalAmt){
			var __t = new BigDecimal(tmpDecList.dclTotalAmt).divide(new BigDecimal(tmpDecList.dclQty), 5, MathContext.ROUND_HALF_EVEN)
			.setScale(4, MathContext.ROUND_HALF_EVEN).toString();
			tmpDecList.dclUprcAmt = cutZero(__t);
		}
		
		var _tmpPutrecSeqNos = tmpDecList.putrecSeqno.toString().split(",");
		_tmpPutrecSeqNos.push(decList.putrecSeqno);
		tmpDecList.putrecSeqno = _tmpPutrecSeqNos.join(",");
	}
	
	var CodeTsFlag = {};	//存放商品编码信息
	// 功能方法---------------------end----------
	
	// 校验规则 ---------------------start-----------------
	var headValid = {
		TempSaveRules : {
			invtType:{required: true},	// 清单类型
			invtTypeName:{required: true},	// 清单类型
			bondInvtNo : {pattern:/^\w{0,64}$/},	//清单编号
			putrecNo:{required: true, pattern: /^\w{12}$/},	// 手账册编号
			bizopEtpsno:{required: true, pattern:/^\w{10}$/},//经营单位代码
			bizopEtpsSccd : {pattern:/^\w{18}$/},
			bizopEtpsNm:{cnTwoLength:512},//经营单位名称
			rcvgdEtpsno:{pattern:/^\w{10}$/},//加工单位代码
			rvsngdEtpsSccd : {pattern:/^\w{18}$/},
			rcvgdEtpsNm:{cnTwoLength:512},//加工单位名称
			dclEtpsno:{pattern:/^\w{10}$/},//申报单位代码
			dclEtpsSccd : {pattern:/^\w{18}$/},
			dclEtpsNm:{cnTwoLength:512},//申报单位名称
			inputTime:{pattern : /^[1-9]\d{3}(0\d|1[0-2])([0-2]\d|3[01])$/, isDate:true},//录入日期
			mtpckEndprdMarkcd:{required: true},	//料件、成品标志
			mtpckEndprdMarkcdName:{required: true},	//料件、成品标志
			dclcusFlag:{required: true},	//报关标志
			dclcusFlagName:{required: true},	//报关标志
			genDecFlag:{required: true},	//报关标志
			genDecFlagName:{required: true},	//报关标志
			supvModecd:{required: true},   //监管方式
			supvModecdName:{required: true},   //监管方式
			etpsInnerInvtNo:{cnTwoLength:64},//企业内部编号
			applyNo : {pattern:/^\w{0,64}$/},	//申报表编号
			rltInvtNo : {pattern:/^\w{0,64}$/},	//关联清单编号
			rltPutrecNo : {pattern:/^\w{0,64}$/},	//关联手(账)册备案号
			corrEntryDclEtpsNo:{pattern:/^\w{10}$/},//对应报关申报单位代码
			corrEntryDclEtpsSccd:{pattern:/^\w{18}$/},//对应报关申报单位代码
			corrEntryDclEtpsNm:{cnTwoLength:512},//对应报关申报单位名称
			rltEntryRcvgdEtpsno:{pattern:/^\w{10}|NO$/},//关联报关单收发货人单位代码
			rltEntryRvsngdEtpsSccd:{pattern:/^\w{18}$/},//
			rltEntryRcvgdEtpsNm:{cnTwoLength:512},//关联报关单收发货人单位名称
			rltEntryBizopEtpsno:{pattern:/^\w{10}|NO$/},//关联报关单生产销售(消费使用)单位代码
			rltEntryBizopEtpsSccd:{pattern:/^\w{18}$/},//
			rltEntryBizopEtpsNm:{cnTwoLength:512},//关联报关单生产销售(消费使用)单位名称
			rltEntryDclEtpsno:{pattern:/^\w{10}|NO$/},//关联报关单申报单位代码
			rltEntryDclEtpsSccd:{pattern:/^\w{18}$/},//关联报关单申报单位代码
			rltEntryDclEtpsNm:{cnTwoLength:512},//关联报关单申报单位名称
			entryNo:{pattern:/^\w{18}$/},//对应报关单编号
			rltEntryNo:{pattern:/^\w{18}$/},//关联报关单编号
			rmk:{cnTwoLength:255}//备注
		},
		DeclareRules : {
			bizopEtpsNm: {required: true},//经营单位名称
			rcvgdEtpsno:{required: true},//加工单位代码
			rcvgdEtpsNm:{required: true},//加工单位名称
			dclEtpsno:{required: true},//申报单位代码
			dclEtpsNm:{required: true},//申报单位名称
			inputTime:{required: true},//录入日期
			//etpsInnerInvtNo:{required: true},//企业内部编号
			trspModecd:{required: true},//运输方式
			trspModecdName:{required: true},//运输方式
			impexpPortcd:{required: true},//进出口口岸
			impexpPortcdName:{required: true},//进出口口岸
			dclPlcCuscd:{required: true},//主管海关
			dclPlcCuscdName:{required: true},//主管海关
			stshipTrsarvNatcd:{required: true}, //启运国/运抵国
			stshipTrsarvNatcdName:{required: true}, //启运国/运抵国
			dclcusTypecd: {required : true},
			dclcusTypecdName: {required : true},
			decType:{required : true},
			decTypeName:{required : true}
			//decType:{required: true} //报关单类型
		},
		Msg : {
			putrecNo:{pattern: "请录入12位手(账)册编号"},
			bizopEtpsno:{pattern: "请输入10位经营单位编码"},
			bizopEtpsSccd:{pattern: "请输入18位社会信用代码"},//
			rcvgdEtpsno:{pattern: "请输入10位加工单位编码"},//加工单位代码
			rvsngdEtpsSccd:{pattern: "请输入18位社会信用代码"},//
			dclEtpsno:{pattern: "请输入10位申报单位编码"},//申报单位代码
			dclEtpsSccd:{pattern: "请输入18位社会信用代码"},//
			entryNo:{pattern: "请输入18位对应报关单编号"},//对应报关单编号
			rltEntryNo:{pattern: "请输入18位关联报关单编号"},//关联报关单编号	
			
			corrEntryDclEtpsNo:{pattern: "请输入10位对应报关单申报单位编码"},//
			corrEntryDclEtpsSccd:{pattern: "请输入18位社会信用代码"},//
			rltEntryBizopEtpsno:{pattern: "请输入10位收发货人编码或NO"},//
			rltEntryBizopEtpsSccd:{pattern: "请输入18位社会信用代码"},//
			rltEntryRcvgdEtpsno:{pattern: "请输入10位生产销售(消费使用)单位编码或NO"},//
			rltEntryRvsngdEtpsSccd:{pattern: "请输入18位社会信用代码"},//
			rltEntryDclEtpsno:{pattern: "请输入10位申报单位编码或NO"},//
			rltEntryDclEtpsSccd:{pattern: "请输入18位社会信用代码"},//
			inputTime: {pattern : "请输入'yyyyMMdd'格式的日期"}
		}
	};
	var listValid = {
		Rules : {
			putrecSeqno:{pattern: /^\d{0,19}$/}, //备案序号
			gdsMtno:{required: true},	//商品料号
			entryGdsSeqno:{pattern: /^\d{0,19}$/},	//报关单商品序号
			applyTbSeqno:{pattern: /^\d{0,19}$/}, //流转申报表序号 
			gdecd:{required: true, pattern: /^\d{10}$/}, //商品编码 
			gdsNm:{required: true, cnTwoLength:512}, //商品名称
			gdsSpcfModelDesc:{required: true, cnTwoLength:255},	//规格型号
			dclUnitcd:{required: true},	//币制
			dclUnitcdName:{required: true}, //币制
			dclCurrcd:{required: true}, //申报计量单位
			dclCurrcdName:{required: true}, //申报计量单位
			natcd:{required: true},	//原产国（地区）
			natcdName:{required: true}, //原产国（地区）
			//20181018 优化，新增目的国
			destinationNatcd:{required: true},	//目的国（地区）
			destinationNatcdName:{required: true}, //目的国（地区）
			dclQty: {required: true, decimalLength: [13,5]},//申报数量
			lawfQty: {required: true, decimalLength: [13,5]}, //法定数量
			secdLawfQty: {decimalLength: [13,5]}, //第二法定数量
			dclUprcAmt: {required: true, decimalLength: [14,4]}, //企业申报单价
			dclTotalAmt: {required: true, decimalLength: [15,2]}, //企业申报总价
			wtSfVal: {decimalLength: [13,5]},//重量比例因子
			fstSfVal: {decimalLength: [13,5]}, //第一比例因子
			secdSfVal: {decimalLength: [13,5]}, //第二比例因子
			grossWt: {decimalLength: [13,5]}, //毛重
			netWt: {decimalLength: [13,5]}, //净重
			//useCd:{required: true},	//用途代码
			//useCdName:{required: true},	//用途代码
			lvyrlfModecd:{required: true},	//征免方式
			lvyrlfModecdName:{required: true},	//征免方式
			ucnsVerno:{cnTwoLength:8},
			//ucnsVerno:{pattern: /^\d{8}$/},
			rmk:{cnTwoLength:255}
		},
		Msg : {
			gdecd:{pattern: "商品编码必须为10位数字"},
			//ucnsVerno:{pattern: "单耗版本号必须为8位数字"},
			putrecSeqno:{pattern: "最大为19位数字"},
			entryGdsSeqno:{pattern: "最大为19位数字"},
			applyTbSeqno:{pattern: "最大为19位数字"},
			dclQty: {decimalLength: "输入格式错误，整数最多{0}位，小数最多{1}位，不可输入负数"},//申报数量
			lawfQty: {decimalLength: "输入格式错误，整数最多{0}位，小数最多{1}位，不可输入负数"}, //法定数量
			secdLawfQty: {decimalLength: "输入格式错误，整数最多{0}位，小数最多{1}位，不可输入负数"}, //第二法定数量
			dclUprcAmt: {decimalLength: "输入格式错误，整数最多{0}位，小数最多{1}位，不可输入负数"}, //企业申报单价
			dclTotalAmt: {decimalLength: "输入格式错误，整数最多{0}位，小数最多{1}位，不可输入负数"}, //企业申报总价
			grossWt: {decimalLength: "输入格式错误，整数最多{0}位，小数最多{1}位，不可输入负数"}, //毛重
			netWt: {decimalLength: "输入格式错误，整数最多{0}位，小数最多{1}位，不可输入负数"} //净重
		}
	};
	var goodsValid = {
			Rules : {
				putrecSeqno:{pattern: /^\d{0,19}$/}, //备案序号
				gdsMtno:{required: true},	//商品料号
				applyTbSeqno:{pattern: /^\d{0,19}$/}, //流转申报表序号 
				gdecd:{required: true, pattern: /^\d{10}$/}, //商品编码 
				gdsNm:{required: true, cnTwoLength:512}, //商品名称
				gdsSpcfModelDesc:{cnTwoLength:255},	//规格型号
				dclUnitcd:{required: true},	//币制
				dclUnitcdName:{required: true}, //币制
				dclCurrcd:{required: true}, //申报计量单位
				dclCurrcdName:{required: true}, //申报计量单位
				natcd:{required: true},	//原产国（地区）
				natcdName:{required: true}, //原产国（地区）
				//20181018 优化，新增目的国
				destinationNatcd:{required: true},	//目的国（地区）
				destinationNatcdName:{required: true}, //目的国（地区）
				dclQty: {required: true, decimalLength: [13,5]},//申报数量
				lawfQty: {required: true, decimalLength: [13,5]}, //法定数量
				secdLawfQty: {decimalLength: [13,5]}, //第二法定数量
				dclUprcAmt: {required: true, decimalLength: [14,4]}, //企业申报单价
				dclTotalAmt: {required: true, decimalLength: [15,2]}, //企业申报总价
				wtSfVal: {decimalLength: [13,5]},//重量比例因子
				fstSfVal: {decimalLength: [13,5]}, //第一比例因子
				secdSfVal: {decimalLength: [13,5]}, //第二比例因子
				grossWt: {decimalLength: [13,5]}, //毛重
				netWt: {decimalLength: [13,5]}, //净重
				//useCd:{required: true},	//用途代码
				//useCdName:{required: true},	//用途代码
				lvyrlfModecd:{required: true},	//征免方式
				lvyrlfModecdName:{required: true},	//征免方式
				ucnsVerno:{cnTwoLength:8},
				//ucnsVerno:{pattern: /^\d{8}$/},
				rmk:{cnTwoLength:255}
			},
			Msg : {
				gdecd:{pattern: "商品编码必须为10位数字"},
				//ucnsVerno:{pattern: "单耗版本号必须为8位数字"},
				putrecSeqno:{pattern: "最大为19位数字"},
				applyTbSeqno:{pattern: "最大为19位数字"},
				dclQty: {decimalLength: "输入格式错误，整数最多{0}位，小数最多{1}位，不可输入负数"},//申报数量
				lawfQty: {decimalLength: "输入格式错误，整数最多{0}位，小数最多{1}位，不可输入负数"}, //法定数量
				secdLawfQty: {decimalLength: "输入格式错误，整数最多{0}位，小数最多{1}位，不可输入负数"}, //第二法定数量
				dclUprcAmt: {decimalLength: "输入格式错误，整数最多{0}位，小数最多{1}位，不可输入负数"}, //企业申报单价
				dclTotalAmt: {decimalLength: "输入格式错误，整数最多{0}位，小数最多{1}位，不可输入负数"}, //企业申报总价
				grossWt: {decimalLength: "输入格式错误，整数最多{0}位，小数最多{1}位，不可输入负数"}, //毛重
				netWt: {decimalLength: "输入格式错误，整数最多{0}位，小数最多{1}位，不可输入负数"} //净重
			}
	};
    var cbecBillQueryValid = {
        Rules: {
            inputDateStart : { required: true, pattern : /^[1-9]\d{3}(0\d|1[0-2])([0-2]\d|3[01])(20|21|22|23|[0-1]\d)[0-5]\d[0-5]\d$/ ,isDate:true},// 录入开始日期
            inputDateEnd : { required: true, pattern : /^[1-9]\d{3}(0\d|1[0-2])([0-2]\d|3[01])(20|21|22|23|[0-1]\d)[0-5]\d[0-5]\d$/,
                isDate:true,
                compareDate_new : 'inputDateStart',
                strDateDiff_new : [ 'inputDateStart', 2 ]
            }
        },
        Msg: {
            inputDateStart : {
                pattern : "请输入'yyyyMMddHHmmss'格式的日期"
            },
            inputDateEnd : {
                pattern : "请输入'yyyyMMddHHmmss'格式的日期",
                compareDate_new : "录入截止日期必须大于等于录入开始日期",
                strDateDiff_new : "录入日期条件中时间间隔必须小于3天"
            }
        }
    }
	//校验规则 ---------------------end-----------------

	//表格参数集成统一设置并改变设置部分参数值 ---------------------start-----------------
	var invtListOption={};
	var invtDecListOption={};
	var searchGoodsOption ={};
	var invtCbecBillOption ={};
	var invtGoodsOption={};
	var searchCbecBillOption={};
	$.extend(invtListOption, settings,{
		uniqueId: "gdsSeqno",
		onCheck: function (row) {
			resetList();
			invtListForm.setForm(row);
			//20181213 modefied by zongjie 判断最终目的国为空时可修改原产国和最终目的国
			if("modify" == COMMON_INFO.opera){
				if("1" == $("#invtType").val() && $("#destinationNatcd").val() == ""){
					$("#natcdName").removeAttr("readonly");
					$("#destinationNatcdName").removeAttr("readonly");
				}else if("1" == $("#invtType").val() && !!$("#destinationNatcd").val()){
					$("#natcdName").attr("readonly",true);
					$("#destinationNatcdName").attr("readonly",true);
				}
			}
		},
		onUncheck: function(row){
			resetList();
		},
		onPreBody: function(data){
			if(data.length > 0){
				for(var i = 0; i < data.length; i++){
					var _d = data[i];
					if(_d.gdsSeqno != (i+1)){
						_d.gdsSeqno = (i+1);
						data[i] = _d;
					}
				}
			}
		}
	});
	$.extend(invtDecListOption, settings,{
		onPreBody: function(data){
			if(data.length > 0){
				var _index = 1;
				for(var i = 0; i < data.length; i++){
					if(data[i].entryGdsSeqno == (i+1)){
						_index++;
					}else if(!data[i].entryGdsSeqno || data[i].entryGdsSeqno == ""){
						data[i].entryGdsSeqno = _index++;
					}
				}
				data.sort(function(a,b){return a.entryGdsSeqno - b.entryGdsSeqno});
				var res = [];
				data.filter(function(l) {
					var _tmp = res[l.entryGdsSeqno-1];
					if(_tmp){
						combineDec(l, _tmp);
						return false;
					}
					return res.push(l);
				});
				if(data.length > res.length){
					data.splice(0);
					$.each(res, function(i,v){data.push(v)});
				}
				var listData = invtListTable.bootstrapTable("getData");
				$.each(data, function(i,v){
					v.entryGdsSeqno = i+1;
					if (typeof v.putrecSeqno != "undefined" && v.putrecSeqno != null && v.putrecSeqno != "" ){
						$.each(v.putrecSeqno.toString().replace(/\@/g, "").split(","), function(idx, val){
							if(listData[val-1] && listData[val-1].entryGdsSeqno != v.entryGdsSeqno){
								invtListTable.bootstrapTable("updateRow", {index:val-1, row:{entryGdsSeqno:v.entryGdsSeqno}})
							}
						});
					} 
				});
			}
		}
	} );
	$.extend(invtGoodsOption, settings,{
		escape: true,
		classes: 'table table-hover',
		uniqueId: "gdsSeqno",
			onClickRow: function (row) {
				resetGoods();
				invtGoodsForm.setForm(row);
			},
			onUncheck: function(row){
				resetGoods();
			},
			onPreBody: function(data){
				if(data.length > 0){
					for(var i = 0; i < data.length; i++){
						var _d = data[i];
						if(_d.gdsSeqno != (i+1)){
							_d.gdsSeqno = (i+1);
							data[i] = _d;
						}
					}
				}
			}
	});
	$.extend(searchGoodsOption, settings,{
		sidePagination : "server",
		queryParams : function (param){
            var page = new Object();
            page.curPage = param.pageNumber;
            page.pageSize = param.pageSize;
            var params = searchGoodsForm.serializeJson();
            params.putrecNo = putrecNo.val();
            params.mtpckEndprdMarkCD = mtpckEndprdMarkcd.val();
            params.page = page;
            return JSON.stringify(params);
        },
		responseHandler : function (respJson){
            var total;
            var rows;
			//非法调用处理
			respJson = decryptServerMsg(respJson);
            if (respJson.code == 0) {
                total = respJson.data.page.totalRecords;
                rows = respJson.data.nemsInvtEmsGood;
            }else{
                total = 0;
                rows = "";
            }

            return {
                "total" : total,
                "rows" : rows
            }
        },
		clickToSelect : true,
		singleSelect : true,
		escape: true,
		classes: 'table table-hover',
		height:200
	});
	$.extend(invtCbecBillOption, settings,{
		uniqueId: "gno",
			onClickRow: function (row) {
				resetCbecBill();
				invtCbecBillForm.setForm(row);
			},
			onUncheck: function(row){
				resetCbecBill();
			},
			onPreBody: function(data){
				if(data.length > 0){
					for(var i = 0; i < data.length; i++){
						var _d = data[i];
						if(_d.gno != (i+1)){
							_d.gno = (i+1);
							data[i] = _d;
						}
					}
				}
			}
		});
	$.extend(searchCbecBillOption, settings, {
		escape: true,
		classes: 'table table-hover',
		pageSize : 100,
		pageList : [ 100, 1000, 2000,3000],
		//pagination : true,
		singleSelect : false,
		checkboxHeader : true
	});
	//表格参数集成统一设置并改变设置部分参数值 ---------------------start-----------------

	//添加控件事件 ---------------------start-----------------
	var listTabName = $("#listTabName"),
		invtGoodsListTabLi = $("#invtGoodsListTabLi"),
		invtWarehouseTabLi = $("#invtWarehouseTabLi"),
		invtCbecBillTabLi = $("#invtCbecBillTabLi"),
		//功能按钮
		resetBtn = $("#btn-invt-reset"),
		saveBtn = $("#btn-invt-save"),
		deleteHeadBtn = $("#btn-invt-delete"),
		declareBtn = $("#btn-invt-declare"),
		cancelBtn = $("#btn-invt-cancel"),
		printBtn = $("#btn-invt-print"),
		importBtn = $("#btn-invt-import"),
		decImportBtn = $("#btn-invt-dec-import"),
		//putrecType
		putrecType = $("#putrecType"),
		//表头
		invtHeadForm = $("#invt_head_form"),
		seqNo = invtHeadForm.find("input[name=seqNo]"),//统一编号
		bondInvtNo = invtHeadForm.find("input[name=bondInvtNo]"),//清单编号
		invtType = invtHeadForm.find("#invtType"),//清单类型
		invtTypeName = invtHeadForm.find("#invtTypeName"),
		putrecNo = invtHeadForm.find("input[name=putrecNo]"),//手账册号
		dclcusFlag = invtHeadForm.find("#dclcusFlag"),	//报关标志
		genDecFlag = invtHeadForm.find("#genDecFlag"),	//报关标志
		applyNo = invtHeadForm.find("input[name=applyNo]"),
		mtpckEndprdMarkcd = invtHeadForm.find("#mtpckEndprdMarkcd"),
		mtpckEndprdMarkcdName = invtHeadForm.find("#mtpckEndprdMarkcdName"),
		//企业信息
		bizopEtpsno = invtHeadForm.find("input[name=bizopEtpsno]"),	//经营企业
		bizopEtpsSccd = invtHeadForm.find("input[name=bizopEtpsSccd]"),
		bizopEtpsNm = invtHeadForm.find("input[name=bizopEtpsNm]"),
		rcvgdEtpsno = invtHeadForm.find("input[name=rcvgdEtpsno]"),	//加工企业
		rvsngdEtpsSccd = invtHeadForm.find("input[name=rvsngdEtpsSccd]"),
		rcvgdEtpsNm = invtHeadForm.find("input[name=rcvgdEtpsNm]"),
		dclEtpsno = invtHeadForm.find("input[name=dclEtpsno]"),	//申报企业
		dclEtpsSccd = invtHeadForm.find("input[name=dclEtpsSccd]"),
		dclEtpsNm = invtHeadForm.find("input[name=dclEtpsNm]"),
		//报关相关信息
		listTypeName = invtHeadForm.find("input[name=listTypeName]"),	//流转类型
		corrEntryDclEtpsNo = invtHeadForm.find("input[name=corrEntryDclEtpsNo]"),	//对应报关单位
		corrEntryDclEtpsSccd = invtHeadForm.find("input[name=corrEntryDclEtpsSccd]"),
		corrEntryDclEtpsNm = invtHeadForm.find("input[name=corrEntryDclEtpsNm]"),
		rltEntryRcvgdEtpsno = invtHeadForm.find("input[name=rltEntryRcvgdEtpsno]"), //关联报关收发货人
		rltEntryRvsngdEtpsSccd = invtHeadForm.find("input[name=rltEntryRvsngdEtpsSccd]"),
		rltEntryRcvgdEtpsNm = invtHeadForm.find("input[name=rltEntryRcvgdEtpsNm]"),
		rltEntryBizopEtpsno = invtHeadForm.find("input[name=rltEntryBizopEtpsno]"), //关联报关生产销售(消费使用)单位
		rltEntryBizopEtpsSccd = invtHeadForm.find("input[name=rltEntryBizopEtpsSccd]"),
		rltEntryBizopEtpsNm = invtHeadForm.find("input[name=rltEntryBizopEtpsNm]"),
		rltEntryDclEtpsno = invtHeadForm.find("input[name=rltEntryDclEtpsno]"), //关联报关申报单位
		rltEntryDclEtpsSccd = invtHeadForm.find("input[name=rltEntryDclEtpsSccd]"),
		rltEntryDclEtpsNm = invtHeadForm.find("input[name=rltEntryDclEtpsNm]"),
		decRmk = invtHeadForm.find("#decRmk"),	//报关单草稿备注
		decNo = invtHeadForm.find("#decNo"),	//报关单统一编号
		//表体
		searchGoodsContent = $("#searchGoodsContent"), //备案数据列表
		searchGoodsForm = $("#searchGoodsForm"),
		invtListForm = $("#invt_list_form"),
		invtListGdsSeqno = invtListForm.find("input[name=gdsSeqno]"), //序号
		invtListGdsMtno = invtListForm.find("input[name=gdsMtno]"),	//商品料号
		invtListGdecd = invtListForm.find("input[name=gdecd]"),	//商品编码
		invtListGdsNm = invtListForm.find("input[name=gdsNm]"),	//商品名称
		invtListGdsSpcfModelDesc = invtListForm.find("input[name=gdsSpcfModelDesc]"),	//商品规格型号
		invtListDclUnitcdName = invtListForm.find("input[name=dclUnitcdName]"),	//申报计量单位
		invtListDclQty = invtListForm.find("input[name=dclQty]"),	//申报数量
		invtListDclUprcAmt = invtListForm.find("input[name=dclUprcAmt]"),	//申报单价
		invtListDclTotalAmt = invtListForm.find("input[name=dclTotalAmt]"),	//申报总价
		//表体按钮
		invtListAddBtn = $("#invt-list-add-btn"),	//新增按钮
		invtListDelBtn = $("#invt-list-del-btn"),	//删除按钮
		invtListCopyBtn = $("#invt-list-copy-btn"),	//复制按钮
		openGoodsSearchBtn = $("#open-goods-search-modal-btn"), //备案数据查询按钮
		invtGoodsSearchBtn = $("#invt-goods-search-btn"), //备案数据查询按钮
		//表体相关表格，表单
		invtListTable = $("#InvtListTable").bootstrapTable(invtListOption),
		invtDecHeadForm = $("#invt_dec_head_form"),
		invtDecListTable = $("#InvtDecListTable").bootstrapTable(invtDecListOption),
		searchGoodsTable = $("#searchGoodsTable").bootstrapTable(searchGoodsOption);
		//料件
		invtGoodsForm = $("#invt_goods_form"),
		invtGoodsGdsSeqno = invtGoodsForm.find("input[name=gdsSeqno]"),
		invtGoodsGdsMtno = invtGoodsForm.find("input[name=gdsMtno]"),	//商品料号
		invtGoodsGdecd = invtGoodsForm.find("input[name=gdecd]")
		invtGoodsDclQty = invtGoodsForm.find("input[name=dclQty]"),	//申报数量
		invtGoodsDclUprcAmt = invtGoodsForm.find("input[name=dclUprcAmt]"),	//申报单价
		invtGoodsDclTotalAmt = invtGoodsForm.find("input[name=dclTotalAmt]"),	//申报总价
		//料件表体按钮
		invtGoodsAddBtn = $("#invt-goods-add-btn"),
		invtGoodsDelBtn = $("#invt-goods-del-btn"),
		//料件表体表格
		invtGoodsTable = $("#InvtGoodsTable").bootstrapTable(invtGoodsOption),
		//出入库单
		invtWarehouseTable = $("#InvtWarehouseTable").bootstrapTable(settings),
		//随附电商单
		invtCbecBillForm = $("#invt_cbec_bill_form"),
		invtCbecBillGNo = invtCbecBillForm.find("input[name=gno]"),
		invtCbecBillAddBtn = $("#invt-cbecbill-add-btn"),
		invtCbecBillDelBtn = $("#invt-cbecbill-del-btn"),
		invtCbecBillDelAllBtn = $("#invt-cbecbill-del-all-btn"),
		openQueryCbecBillBtn = $("#open-query-cbecbill-modal-btn"),
		getCbecGroupBtn = $("#get-cbec-group-btn"),
		searchCbecBillContent = $("#searchCbecBillContent"),
		searchCbecBillForm = $("#searchCbecBillForm"),
		invtCbecBillSearchBtn = $("#invt-cbecbill-search-btn"),
		invtCbecBillTable = $("#InvtCbecBillTable").bootstrapTable(invtCbecBillOption),
		searchCbecBillTable = $("#searchCbecBillTable").bootstrapTable(searchCbecBillOption);

	//清单服务地址路径
	var InvtHelper = {
		Url : {
			DeleteService: swProxyBasePath + "sw/ems/invt/{{subSys}}/delete/{{seqNo}}", //核注清单删除服务
			CancelService: swProxyBasePath + "sw/ems/invt/{{subSys}}/deleteApply/{{seqNo}}/{{blsNo}}", //核注清单删除服务
			DetailsService : swProxyBasePath + "sw/ems/invt/{{subSys}}/details/{{seqNo}}", //核注清单暂存服务
			SaveService : swProxyBasePath + "sw/ems/invt/{{subSys}}/save", //核注清单暂存服务
			DeclareService : swProxyBasePath + "sw/ems/invt/{{subSys}}/declare", //核注清单申报服务
			PrintService : swProxyBasePath + "sw/ems/invt/{{subSys}}/{{ieType}}/print/{{seqNo}}", //核注清单打印服务
			GoodsSearchService : swProxyBasePath+ "sw/ems/pub/common/invt/goodsquery", //备案数据查询
			CebQueryListService : swProxyBasePath+ "sw/ems/pub/common/invt/cebquerylist", //跨境清单查询服务
			CebGroupService : swProxyBasePath+ "sw/ems/pub/common/invt/getcebgroup" //跨境清单商品查询服务
		},
		_label_ : {
			imp: {
				iePortCD: "进境关别",
				tradeCountry: "启运国(地区)"
			},
			exp: {
				iePortCD: "出境关别",
				tradeCountry: "运抵国(地区)"
			}
		},
		changeLabel: function(ieflag){
			var that = this;
			switch(ieflag){
			case "E" : 
				$.each(that._label_.exp, function(i, v){
					$("span[name=label-" + i + "]").html(v);
				});
				break;
			case "I" : 
			default:
				$.each(that._label_.imp, function(i, v){
					$("span[name=label-" + i + "]").html(v);
				});
				break;
			}
		}
	}
	
	resetBtn.on("click", function(){
		if(this.getAttribute("disabled")){
			return;
		}
		reset()
	});//新增单击
	saveBtn.on("click", function(){
		if(this.getAttribute("disabled")){
			return;
		}
		isInstalled(tempSave);
	});//暂存单击
	declareBtn.on("click", function(){
		if(this.getAttribute("disabled")){
			return;
		}
		declare();
	});//申报单击
	cancelBtn.on("click", function(){
		if(this.getAttribute("disabled")){
			return;
		}
		isInstalled(cancel);
	});//撤销单击

	// Fix it by NJ 2019/5/14 0014  打印选择框功能
	printBtn.on("click", function(){
		//查询界面打印时，新增插卡校验
		isInstalled(function() {
			if (!seqNo.val()){
				return;
			}

			esapiInit();
			//打印条数限制校验
			var listSize = $("#InvtListTable").bootstrapTable('getData').length;// 成品
			var decListSize = $("#InvtDecListTable").bootstrapTable('getData').length;//报关单草稿
			var goodsSize = $("#InvtGoodsTable").bootstrapTable('getData').length;// 料件
			var warehouseSize = $("#InvtWarehouseTable").bootstrapTable('getData').length;//出入库
			var cbecBillSize = $("#InvtCbecBillTable").bootstrapTable('getData').length;//电商清单
			var impexpMarkcd = invtHeadForm.find("input[name=impexpMarkcd]").val();
			var ieType = "I" == impexpMarkcd ? "import" : "export";
			//打开
			var printInvtUrl = InvtHelper.Url.PrintService.replace("{{subSys}}", esapiUrlValue(COMMON_INFO.subSystem))
				.replace("{{seqNo}}", esapiUrlValue(seqNo.val())).replace("{{ieType}}", esapiUrlValue(ieType));

			let numMax = 3000;
			let elemStart = $("#invtPrintChoseForm input[id='start']");
			let elemEnd = $("#invtPrintChoseForm input[id='end']");
			let chose = "not-chose";
			let numStart = "0";
			let numEnd = "0";
			if ((listSize + decListSize + goodsSize + warehouseSize + cbecBillSize) > numMax) {
				// showLayerAlert("您打印的数据量过大，系统暂时仅支持打印总条数3000条，后续系统将提供相关功能支持！");
				var index = layer.open({
					type: 1,
					btn: ['确定'],
					shadeClose: false,
					area: ['500px', '300px'],
					title: "打印设置",
					shade: 0.5,
					zIndex: 19891000,
					content: $("#invt-print-model"),
					scrollbar: false,
					btnAlign: 'c',//居中
					yes: function (index, layero) {
						let radios = $("#invtPrintChoseForm input[name='printList']");
						for (let i = 0; i < radios.length; i++) {
							if (radios[i].checked === true) {
								chose = radios[i].value;
								break;
							}
						}
						numStart = elemStart.val();
						numEnd = elemEnd.val();
						let numPattern = /^[0-9]+$/;
						if (!numPattern.test(numStart) || !numPattern.test(numEnd) || (numStart - numEnd) > 0) {
							showLayerAlert("请输入合法打印范围！！");
							elemStart.val("");
							elemEnd.val("");
							return;
						}
						if ((numEnd - numStart) >= numMax) {
							showLayerAlert("打印范围不得超过 " + numMax);
							elemStart.val("");
							elemEnd.val("");
							return;
						}
						window.open(printInvtUrl + "/" + esapiUrlValue(chose) + "/" + esapiUrlValue(numStart) + "/" + esapiUrlValue(numEnd));
						//初始化选择页面
						for (let i = 0; i < radios.length; i++) {
							radios[i].checked = false;
						}
						radios[0].checked = true;
						elemStart.val("");
						elemEnd.val("");
						layer.close(index);
					},
				});
			} else {
				window.open(printInvtUrl + "/" + esapiUrlValue(chose) + "/" + esapiUrlValue(numStart) + "/" + esapiUrlValue(numEnd));
			}
		});
	});//打印单击
	// Fix it by NJ 2019/5/14 0014   end

	deleteHeadBtn.on("click", function(){
		if(this.getAttribute("disabled")){
			return;
		}
		isInstalled(delHead);
	});//删除单击
	invtListAddBtn.on("click", function(){
		if(this.getAttribute("disabled")){
			return;
		}
		resetList()
	});//表体新增单击
	invtListDelBtn.on("click", function(){
		if(this.getAttribute("disabled")){
			return;
		}
		delList()
	});//表体删除单击
	invtListCopyBtn.on("click", function(){
		if(this.getAttribute("disabled")){
			return;
		}
		copyList()
	});//表体复制单击

	//商品快速查询（1）--打开模态窗口
	openGoodsSearchBtn.on("click", function(){
		if(this.getAttribute("disabled")){
			return;
		}
		//商品快速查询时，新增插卡校验
		isInstalled(function() {
			//清空查询条件 查询结果
			searchGoodsForm.clearForm(true);
			searchGoodsTable.bootstrapTable("removeAll");
			layer.open({
				type: 1,
				shadeClose: false,
				area: ['750px', '480px'],
				title: "商品快速查询",
				content: searchGoodsContent,
				shade: 0.5,
				scrollbar: false,
				btn: ['确定', '关闭'],
				btnAlign: 'c',
				yes: function (index) {
					//校验是否选中
					var rows = searchGoodsTable.bootstrapTable("getSelections");
					if (!!rows && rows.length == 1) {
						var row = rows[0];
						//清空表体表单
						resetList();
						//处理选中数据
						invtListForm.find("input[name=putrecSeqno]").val(row.putrecSeqNo); //备案序号
						invtListGdsMtno.val(row.gdsMtno);	//商品料号
						invtListGdecd.val(row.gdeCD);	//商品编码
						invtListGdsNm.val(row.gdsNm);	//商品名称
						invtListGdsSpcfModelDesc.val(row.gdsSpcfModelDesc);	//商品规格型号
						invtListDclUnitcdName.val(row.dclUnitCDName);	//申报计量单位
						invtListForm.find("#dclUnitcd").val(row.dclUnitCD);
						invtListForm.find("[name=wtSfVal]").val(row.wtSfVal);	//重量比例因子
						invtListForm.find("[name=fstSfVal]").val(row.fstSfVal);	//第一比例因子
						invtListForm.find("[name=secdSfVal]").val(row.secdSfVal);	//第二比例因子
						invtListForm.find("#param1").val(row.adjmtrMarkCd);	//主料 耗料标志

						$.ajax({
							type: "POST",
							url: swProxyBasePath + "sw/ems/pub/common/getGoodsInfo",
							data: JSON.stringify({"codeTs": row.gdeCD}),
							dataType: "json",
							contentType: "application/json; charset=utf-8",
							success: function (tsInfo) {
								//非法调用处理
								tsInfo = decryptServerMsg(tsInfo);
								invtListForm.find("#lawfUnitcdName").val(tsInfo.unit1Name);	//法定计量单位
								invtListForm.find("#lawfUnitcd").val(tsInfo.unit1);
								invtListForm.find("#secdLawfUnitcdName").val(tsInfo.unit2Name);	//法定第二计量单位
								invtListForm.find("#secdLawfUnitcd").val(tsInfo.unit2);
							}
						});

						layer.close(index);
					} else {
						showLayerAlert("请选择一条商品记录!");
					}
				}
			});
		});
	});
	//商品快速查询（2）--模态窗口查询
	invtGoodsSearchBtn.on("click", function(){
		//校验表单
		var json = searchGoodsForm.serializeJson();
		if(!json.gdsMtno && !json.gdsCd && !json.gdsNm && !json.invtNo && !json.invtGNo){
			layer.msg("查询条件不能为空！", {
				icon: 2,
				time: 3000
			});
			return;
		}
		searchGoodsTable.bootstrapTable("removeAll");
		searchGoodsTable.bootstrapTable("refresh", {
			silent: true,
			url :InvtHelper.Url.GoodsSearchService,
            pageNumber: 1
		});
		/*json.putrecNo = putrecNo.val();
		json.mtpckEndprdMarkCD = mtpckEndprdMarkcd.val();
		//后台加载数据
		$.ajax({
			type : "POST",
			url : InvtHelper.Url.GoodsSearchService,
			data : JSON.stringify(json),
			dataType : "json",
			contentType : "application/json; charset=utf-8",
			success : function(data) {
				if(data.code == "0"){
					searchGoodsTable.bootstrapTable("load", data.data.nemsInvtEmsGood);
				}
			}
		});*/
	});
	//商品快速查询--请求参数处理
	/*function queryGoodsRequestMap(param){
		var page = new Object();
		page.curPage = param.pageNumber;
		page.pageSize = param.pageSize;
		var params = searchGoodsForm.serializeJson();
		params.putrecNo = putrecNo.val();
		params.mtpckEndprdMarkCD = mtpckEndprdMarkcd.val();
		params.page = page;
		return JSON.stringify(params);
	}*/
	//商品快速查询--响应数据处理
	/*function queryGoodsResponeseMap(respJson){
		var total;
		var rows;
		if (respJson.code == 0) {
			total = respJson.data.page.totalRecords;
			rows = respJson.data.nemsInvtEmsGood;
		}else{
			total = 0;
			rows = "";
		}

		return {
			"total" : total,
			"rows" : rows
		}
	}*/

	invtGoodsAddBtn.on("click", function(){
		if(this.getAttribute("disabled")){
			return;
		}
		resetGoods()
	});//商品表体新增单击
	invtGoodsDelBtn.on("click", function(){
		if(this.getAttribute("disabled")){
			return;
		}
		delGoods()
	});//商品表体删除单击

	//电商清单联网查询（1）--快速查询，打开模态窗口
	openQueryCbecBillBtn.on("click", function(){
		if(this.getAttribute("disabled")){
			return;
		}
		//清空查询条件 查询结果
		searchCbecBillForm.clearForm(true);
		searchCbecBillTable.bootstrapTable("removeAll");
		layer.open({
			type : 1,
			shadeClose : false,
			area : [ '500px', '450px' ],
			title : "随附电商单查询",
			content : searchCbecBillContent,
			shade : 0.5,
			scrollbar : false,
			btn : [ '确定'],
			btnAlign : 'c', 
			yes : function(index) {
				var cbecBillData = invtCbecBillTable.bootstrapTable("getData");
				var rows = searchCbecBillTable.bootstrapTable("getSelections");
				var tmp = [];
//				if($("#searchCbecBillContent").find("[name = btSelectAll]").is(":checked")){
//					rows = rows.slice(0,10);
//					showLayerAlert("本次操作只会反填10条数据");
//				}
				$.each(cbecBillData, function(idx, val){tmp.push(val.cbecBillNo)});
				$.each(rows, function(idx, val){if(tmp.indexOf(val.cbecBillNo) < 0){cbecBillData.push(val)}});
//				if(cbecBillData.length>10){
//					showLayerAlert("随附电商单的最大数量不能超过10条！");
//					return;
//				}
				invtCbecBillTable.bootstrapTable("load", cbecBillData);
				layer.close(index);
			}
		});
	});
	//电商清单联网查询（2）--模态窗口查询
	invtCbecBillSearchBtn.on("click", function(){
		//校验表单
		if(!searchCbecBillForm.valid()){
			return;
		}
		var json = searchCbecBillForm.serializeJson();
        /* 日期格式化添加sss */
        json.inputDateStart += "000";
        json.inputDateEnd += "000";
		json.nemsType = COMMON_INFO.impexpMarkcd;
		json.sysId = COMMON_INFO.subSystem;
		json.putrecNo = putrecNo.val();
		json.invtSeqNo = seqNo.val();
		searchCbecBillTable.bootstrapTable("removeAll");
		invtCbecBillForm.find("input[name=startTime]").val(json.inputDateStart += "000");
		invtCbecBillForm.find("input[name=endTime]").val(json.inputDateEnd += "000");
		//添加遮罩
		var customInfoIndex;
		//后台加载数据
		$.ajax({
			type : "POST",
			url : InvtHelper.Url.CebQueryListService,
			timeout:165000,
			data : JSON.stringify(json),
			dataType : "json",
			contentType : "application/json; charset=utf-8",
			beforeSend: function(XHR){
				customInfoIndex = layer.load(1,{shade:[0.3]});
			},
			success : function(data) {
				//非法调用处理
				data = decryptServerMsg(data);
				if(data.code == "0"){
					if(!data.data.resultList || data.data.resultList.length == 0){
						showLayerAlert("没有查询到对应的数据！");
					}else{
						searchCbecBillTable.bootstrapTable("load", data.data.resultList);
					}
				}else{
					showLayerAlert(data.message);
				}
			},
			error : function(XMLHttpRequest, textStatus, errorThrown){	
				layer.open({
					title: "提示",
					content:"加载数据失败，请稍后再试！",
					icon: 2
				});
			},
			complete: function(XHR, textStatus){
				layer.close(customInfoIndex);
			}
		});
	});
	//电商清单联网查询（3）--获取数据
	getCbecGroupBtn.on("click", function(){
		if(this.getAttribute("disabled")){
			return;
		}
		var data = invtCbecBillTable.bootstrapTable("getData");
		if(data.length == 0){
			showLayerAlert("请先查询电商清单数据！");
			return;
		}
		var cbecBillNos = [];
		if(invtHeadForm.find("input[name=param1]").val() == "1"){
			$.each(data, function(idx, val){cbecBillNos.push(val.col1)});
		}else{
			$.each(data, function(idx, val){cbecBillNos.push(val.cbecBillNo)});
		}
		var json = {
			cbecBillNo : cbecBillNos,
			nemsType : COMMON_INFO.impexpMarkcd,
			sysId : COMMON_INFO.subSystem,
			putrecNo : putrecNo.val(),
			invtSeqNo : seqNo.val(),
			startTime : invtCbecBillForm.find("input[name=startTime]").val(),
			endTime : invtCbecBillForm.find("input[name=endTime]").val()
		};
		//添加遮罩
		var customInfoIndex;
		//后台加载数据
		$.ajax({
			type : "POST",
			url : InvtHelper.Url.CebGroupService,
			timeout:165000,
			data : JSON.stringify(json),
			dataType : "json",
			contentType : "application/json; charset=utf-8",
			beforeSend: function(XHR){
				customInfoIndex = layer.load(1,{shade:[0.3]});
			},
			success : function(data) {
				//非法调用处理
				data = decryptServerMsg(data);
				if(data.code == "0"){
					invtListTable.bootstrapTable("load", data.data.resultList);
					layer.open({
						title: "提示",
						content: "获取表体数据成功",
						icon: 1
					});
				}else {
					layer.open({
						title: "提示",
						content: data.message,
						icon: 2
					});
				}
			},
			error : function(XMLHttpRequest, textStatus, errorThrown){	
				layer.open({
					title: "提示",
					content:"加载数据失败，请稍后再试！",
					icon: 2
				});
			},
			complete: function(XHR, textStatus){
				layer.close(customInfoIndex);
			}
		});
	});

	invtCbecBillAddBtn.on("click", function(){
		if(this.getAttribute("disabled")){
			return;
		}
		resetCbecBill()
	});//电商清单表体新增单击
	invtCbecBillDelBtn.on("click", function(){
		if(this.getAttribute("disabled")){
			return;
		}
		delCbecBill()
	});//电商清单表体删除单击
	invtCbecBillDelAllBtn.on("click",function(){
		if(this.getAttribute("disabled")){
			return;
		}
		delCbecAllBill()
	});//电商清单表体全部删除单击

	//-------------回车逻辑处理----------------
	//表头备注
	invtHeadForm.find("input[name=rmk]").on("keypress", function(e){
		if(this.getAttribute("readonly")){
			return;
		}
		var eCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
		if (eCode == 13) {
			isInstalled(tempSave);
		}
	});
	//表体备注
	invtListForm.find("input[name=rmk]").on("keypress", function(e){
		if(this.getAttribute("readonly")){
			return;
		}
		if(0 == invtListDclQty.val()){
			showLayerAlert("申报数量不能为0！");
			return;
		}
		var eCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
		if (eCode == 13) {
			addList();
		}
	});
	//料件备注
	invtGoodsForm.find("input[name=rmk]").on("keypress", function(e){
		if(this.getAttribute("readonly")){
			return;
		}
		if(0 == invtGoodsDclQty.val()){
			showLayerAlert("申报数量不能为0！");
			return;
		}
		var eCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
		if (eCode == 13) {
			addGoods();
		}
	});
	//电商清单编号
	invtCbecBillForm.find("input[name=cbecBillNo]").on("keypress", function(e){
		if(this.getAttribute("readonly")){
			return;
		}
		var eCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
		if (eCode == 13) {
			addCbecBill();
		}
	});
	//手(账)册编号
	putrecNo.bind('keypress',function(e){
		if(this.getAttribute("readonly")){
			return;
		}
		var eCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
		if(eCode == 13 && $(this).valid() && this.value != $(this).attr("oldvalue")){
			var that = this;
			EmsHeadQuery(this.value, COMMON_INFO.subSystem, function(data){
				if(data && data.code == "0"){
					bizopEtpsno.val(data.data.bizopEtpsno);
					bizopEtpsSccd.val(data.data.bizopEtpsSccd);
					bizopEtpsNm.val(data.data.bizopEtpsNm);
					rcvgdEtpsno.val(data.data.rcvgdEtpsno);
					rvsngdEtpsSccd.val(data.data.rcvgdEtpsSccd);
					rcvgdEtpsNm.val(data.data.rcvgdEtpsNm);
					putrecType.val(data.data.emsTypecd);
					$(that).attr("oldvalue", that.value);
				}else{
					showLayerAlert(data.message || data.detail);
					that.value = "";
					bizopEtpsno.val("");
					bizopEtpsSccd.val("");
					bizopEtpsNm.val("");
					rcvgdEtpsno.val("");
					rvsngdEtpsSccd.val("");
					rcvgdEtpsNm.val("");
					putrecType.val("");
					$(that).attr("oldvalue", "");
				}
			});
		}
	});
	//经营单位
	bizopEtpsno.bind('keypress',function(e){
		if(this.getAttribute("readonly")){
			return;
		}
		var eCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
		if(eCode == 13 && $(this).valid() && this.value != $(this).attr("oldvalue")){
			getCopInfo(this.value, false, setBizopEtpsInfo );
		}
	});
	//经营单位刷新
	invtHeadForm.find("#forceBizOpEtpsInfo").on("click", function(){
		if($(this).prev("input").is("[readonly]")){
			return;
		}
		getCopInfo(bizopEtpsno.val(), true, setBizopEtpsInfo );
	});
	//加工单位
	rcvgdEtpsno.bind('keypress',function(e){
		if(this.getAttribute("readonly")){
			return;
		}
		var eCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
		if(eCode == 13 && $(this).valid() && this.value != $(this).attr("oldvalue")){
			getCopInfo(this.value, false, setRcvgdEtpsInfo);
		}
	});
	//加工单位刷新
	invtHeadForm.find("#forceRcvgdEtpsInfo").on("click", function(){
		if($(this).prev("input").is("[readonly]")){
			return;
		}
		getCopInfo(rcvgdEtpsno.val(), true, setRcvgdEtpsInfo );
	});
	//申报单位
	dclEtpsno.bind('keypress',function(e){
		if(this.getAttribute("readonly")){
			return;
		}
		var eCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
		if(eCode == 13 && $(this).valid() && this.value != $(this).attr("oldvalue")){
			getCopInfo(this.value, false, setDclEtpsInfo);
		}
	});
	//申报单位刷新
	invtHeadForm.find("#forceDclEtpsInfo").on("click", function(){
		if($(this).prev("input").is("[readonly]")){
			return;
		}
		getCopInfo(dclEtpsno.val(), true, setDclEtpsInfo );
	});
	//申报表编号
	applyNo.bind('keypress',function(e){
		if(this.getAttribute("readonly")){
			return;
		}
		//金二手册系统不查询申请表信息
		if($.trim(this.value) == "" || COMMON_INFO.subSystem == "Npts"){
            return;
        }
		var eCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
		if(eCode == 13){
			InitSasAppInfo();
		}
	});
	//流转类型
	listTypeName.blur(function(){
		if(this.getAttribute("readonly")){
			return;
		}
		var listType = $("#listType").val();
		var invtType = $("#invtType").val();
		if("9" == invtType && "Y" != listType){
			showLayerAlert("该清单类型下流转类型只能选择一纳企业进出区");
			return;
		}
	});
	//报关标志
	//20190109 add by zongjie 添加选择报关标志后输入框置灰控制
	$("#dclcusFlagName").blur(function(){
		if(this.getAttribute("readonly")){
			return;
		}
		var dclcusFlag = $("#dclcusFlag").val();
		if (dclcusFlag == "2"){
			$("#genDecFlag").val("2");
			$("#genDecFlagName").val(getCodeNameFromList(getCodeList("EMS_GENDEC_FLAG"),"2"));
			$("#genDecFlagName").attr("readOnly","true");
		}
		if(!!dclcusFlag){
			$("#dclcusFlagName").attr("readonly",true);
		}
	});
	//是否生成报关单
	$("#genDecFlagName").blur(function(){
		if(this.getAttribute("readonly")){
			return;
		}
		var genDecFlag = $("#genDecFlag").val();
		if(!!genDecFlag){
			$("#genDecFlagName").attr("readonly",true);
		}
	});
	//报关类型
	$("#dclcusTypecdName").blur(function(){
		if(this.getAttribute("readonly")){
			return;
		}
		var dclcusTypecd = $("#listType").val();
		var invtType = $("#invtType").val();
		if("9" == invtType && "2" != dclcusTypecd){
			showLayerAlert("该清单类型下报关类型只能选择对应报关");
			return;
		}
	});
	//对应报关单位
	corrEntryDclEtpsNo.bind('keypress',function(e){
		if(this.getAttribute("readonly")){
			return;
		}
		var eCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
		if(eCode == 13 && $(this).valid() && this.value != $(this).attr("oldvalue")){
			getCopInfo(this.value, false, setCorrEntryDclEtpsInfo);
		}
	});
	//对应报关单位刷新
	invtHeadForm.find("#forceCorrEntryDclEtpsInfo").on("click", function(){
		if($(this).prev("input").is("[readonly]")){
			return;
		}
		getCopInfo(corrEntryDclEtpsNo.val(), true, setCorrEntryDclEtpsInfo );
	});
	
	//关联报关收发货人
	rltEntryRcvgdEtpsno.bind('keypress',function(e){
		if(this.getAttribute("readonly")){
			return;
		}
		var eCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
		if(eCode == 13 && $(this).valid() && this.value != $(this).attr("oldvalue")){
			getCopInfo(this.value, false, setRltEntryRcvgdEtpsInfo);
		}
	});
	//关联报关收发货人刷新
	invtHeadForm.find("#forceRltEntryRcvgdEtpsInfo").on("click", function(){
		if($(this).prev("input").is("[readonly]")){
			return;
		}
		getCopInfo(corrEntryDclEtpsNo.val(), true, setRltEntryRcvgdEtpsInfo );
	});
	//关联报关生产销售(消费使用)单位
	rltEntryBizopEtpsno.bind('keypress',function(e){
		if(this.getAttribute("readonly")){
			return;
		}
		var eCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
		if(eCode == 13 && $(this).valid() && this.value != $(this).attr("oldvalue")){
			getCopInfo(this.value, false, setRltEntryBizopEtpsInfo);
		}
	});
	//关联报关生产销售(消费使用)单位刷新
	invtHeadForm.find("#forceRltEntryBizopEtpsInfo").on("click", function(){
		if($(this).prev("input").is("[readonly]")){
			return;
		}
		getCopInfo(rltEntryBizopEtpsno.val(), true, setRltEntryBizopEtpsInfo );
	});
	//关联报关申报单位
	rltEntryDclEtpsno.bind('keypress',function(e){
		if(this.getAttribute("readonly")){
			return;
		}
		var eCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
		if(eCode == 13 && $(this).valid() && this.value != $(this).attr("oldvalue")){
			getCopInfo(this.value, false, setRltEntryDclEtpsInfo);
		}
	});
	//关联报关申报单位刷新
	invtHeadForm.find("#forceRltEntryDclEtpsInfo").on("click", function(){
		if($(this).prev("input").is("[readonly]")){
			return;
		}
		getCopInfo(rltEntryDclEtpsno.val(), true, setRltEntryDclEtpsInfo );
	});

	//表体备案序号
	invtListForm.find("input[name=putrecSeqno]").bind('keypress',function(e){
		if (invtType.val() == "4" || invtType.val() == "5"){// 简单加工清单、保税展示交易清单
			return;
		}
		if(this.getAttribute("readonly")){
			return;
		}
		var eCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
		if(eCode == 13 && $.trim(this.value) != "" && this.value != $(this).attr("oldvalue")){
			var that = this;
			if(invtType.val() == "9"){
				EmsListQuery(putrecNo.val(), $.trim(this.value), "I", COMMON_INFO.subSystem, 
						function(data){
					if(data && data.code == "0"){
						var listInfo = data.data;
						invtListGdsMtno.val(listInfo.gdsMtno);	//商品料号
						invtListGdecd.val(listInfo.gdecd);	//商品编码
						invtListGdsNm.val(listInfo.gdsnm);	//商品名称
						invtListGdsSpcfModelDesc.val(listInfo.gdsSpcfModelDesc);	//商品规格型号
						invtListDclUnitcdName.val(listInfo.dclUnitcdName);	//申报计量单位
						invtListForm.find("#dclUnitcd").val(listInfo.dclUnitcd);
						invtListForm.find("#lawfUnitcdName").val(listInfo.lawfUnitcdName);	//法定计量单位
						invtListForm.find("#lawfUnitcd").val(listInfo.lawfUnitcd);
						invtListForm.find("#secdLawfUnitcdName").val(listInfo.secdLawfUnitcdName);	//法定第二计量单位
						invtListForm.find("#secdLawfUnitcd").val(listInfo.secdLawfUnitcd);
						invtListForm.find("#dclCurrcdName").val(listInfo.dclCurrcdName);	//币制
						invtListForm.find("#dclCurrcd").val(listInfo.dclCurrcd);
						invtListForm.find("#param1").val(listInfo.adjmtrMarkcd);
						$(that).attr("oldvalue", that.value);
						invtListGdecd.attr("oldvalue", listInfo.gdecd);	//商品编码
					}else{
						showLayerAlert(data.message || data.detail);
						that.value = "";
						invtListGdsMtno.val("");	//商品料号
						invtListGdecd.val("");	//商品编码
						invtListGdsNm.val("");	//商品名称
						invtListGdsSpcfModelDesc.val("");	//商品规格型号
						invtListDclUnitcdName.val("");	//申报计量单位
						invtListForm.find("#dclUnitcd").val("");
						invtListForm.find("#lawfUnitcdName").val("");	//法定计量单位
						invtListForm.find("#lawfUnitcd").val("");
						invtListForm.find("#secdLawfUnitcdName").val("");	//法定第二计量单位
						invtListForm.find("#secdLawfUnitcd").val("");
						invtListForm.find("#dclCurrcdName").val("");	//币制
						invtListForm.find("#dclCurrcd").val("");
						invtListForm.find("#param1").val("");
						$(that).attr("oldvalue", "");
						invtListGdecd.attr("oldvalue", "");	//商品编码
					}
				});
			} else{
				EmsListQuery(putrecNo.val(), $.trim(this.value), mtpckEndprdMarkcd.val(), COMMON_INFO.subSystem, 
						function(data){
					if(data && data.code == "0"){
						var listInfo = data.data;
						invtListGdsMtno.val(listInfo.gdsMtno);	//商品料号
						invtListGdecd.val(listInfo.gdecd);	//商品编码
						invtListGdsNm.val(listInfo.gdsnm);	//商品名称
						invtListGdsSpcfModelDesc.val(listInfo.gdsSpcfModelDesc);	//商品规格型号
						invtListDclUnitcdName.val(listInfo.dclUnitcdName);	//申报计量单位
						invtListForm.find("#dclUnitcd").val(listInfo.dclUnitcd);
						invtListForm.find("#lawfUnitcdName").val(listInfo.lawfUnitcdName);	//法定计量单位
						invtListForm.find("#lawfUnitcd").val(listInfo.lawfUnitcd);
						invtListForm.find("#secdLawfUnitcdName").val(listInfo.secdLawfUnitcdName);	//法定第二计量单位
						invtListForm.find("#secdLawfUnitcd").val(listInfo.secdLawfUnitcd);
						invtListForm.find("#dclCurrcdName").val(listInfo.dclCurrcdName);	//币制
						invtListForm.find("#dclCurrcd").val(listInfo.dclCurrcd);
						invtListForm.find("#param1").val(listInfo.adjmtrMarkcd);
						$(that).attr("oldvalue", that.value);
						invtListGdecd.attr("oldvalue", listInfo.gdecd);	//商品编码
					}else{
						showLayerAlert(data.message || data.detail);
						that.value = "";
						invtListGdsMtno.val("");	//商品料号
						invtListGdecd.val("");	//商品编码
						invtListGdsNm.val("");	//商品名称
						invtListGdsSpcfModelDesc.val("");	//商品规格型号
						invtListDclUnitcdName.val("");	//申报计量单位
						invtListForm.find("#dclUnitcd").val("");
						invtListForm.find("#lawfUnitcdName").val("");	//法定计量单位
						invtListForm.find("#lawfUnitcd").val("");
						invtListForm.find("#secdLawfUnitcdName").val("");	//法定第二计量单位
						invtListForm.find("#secdLawfUnitcd").val("");
						invtListForm.find("#dclCurrcdName").val("");	//币制
						invtListForm.find("#dclCurrcd").val("");
						invtListForm.find("#param1").val("");
						$(that).attr("oldvalue", "");
						invtListGdecd.attr("oldvalue", "");	//商品编码
					}
					
				});
			}
		getGoodsByGdecd(invtListGdecd.val(), "invtList");
		}
	});

	//表体流转申报表序号
	invtListForm.find("input[name=applyTbSeqno]").bind('keypress',function(e){
		if(this.getAttribute("readonly")){
			return;
		}
		var eCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
		if(eCode == 13 && $.trim(this.value) != "" && this.value != $(this).attr("oldvalue")){
			var impexpMarkcd = invtHeadForm.find("input[name=impexpMarkcd]").val();
			if("Npts" === COMMON_INFO.subSystem && !/^[IE]$/.test(impexpMarkcd)){
				return;
			}
			if("Npts" !== COMMON_INFO.subSystem && invtType.val() != "4" && invtType.val() != "5"){
				return;
			}
			var that = this;
			//applyNo, applyTbSeqno, invtType, ieType, subSystem
			EmsApplyQuery($.trim(applyNo.val()), $.trim(this.value), invtType.val(),
					impexpMarkcd, COMMON_INFO.subSystem, function(data){
				if(data && data.code == "0"){
					var applyInfo = data.data;
				    invtListForm.find("input[name=putrecSeqno]").val(applyInfo.putrecSeqno);//备案序号
					invtListGdsMtno.val(applyInfo.gdsMtno);	//商品料号
					invtListGdecd.val(applyInfo.gdecd);	//商品编码
					invtListGdsNm.val(applyInfo.gdsNm);	//商品名称
					invtListGdsSpcfModelDesc.val(applyInfo.gdsSpcfModelDesc);	//商品规格型号
					invtListDclUnitcdName.val(applyInfo.dclUnitcdName);	//申报计量单位
					invtListForm.find("#dclUnitcd").val(applyInfo.dclUnitcd);
					invtListForm.find("#lawfUnitcdName").val(applyInfo.lawfUnitcdName);	//法定计量单位
					invtListForm.find("#lawfUnitcd").val(applyInfo.lawfUnitcd);
					invtListForm.find("#secdLawfUnitcdName").val(applyInfo.secdLawfUnitcdName);	//法定第二计量单位
					invtListForm.find("#secdLawfUnitcd").val(applyInfo.secdLawfUnitcd);
					invtListForm.find("#dclCurrcdName").val(applyInfo.dclCurrcdName);	//币制
					invtListForm.find("#dclCurrcd").val(applyInfo.dclCurrcd);
					invtListDclUprcAmt.val(applyInfo.dclUprcAmt); //单价
					$(that).attr("oldvalue", that.value);
					invtListGdecd.attr("oldvalue", applyInfo.gdecd);	//商品编码
				}else{
					showLayerAlert(data.message || data.detail);
					that.value = "";
					invtListForm.find("input[name=putrecSeqno]").val("");//备案序号
					invtListGdsMtno.val("");	//商品料号
					invtListGdecd.val("");	//商品编码
					invtListGdsNm.val("");	//商品名称
					invtListGdsSpcfModelDesc.val("");	//商品规格型号
					invtListDclUnitcdName.val("");	//申报计量单位
					invtListForm.find("#dclUnitcd").val("");
					invtListForm.find("#lawfUnitcdName").val("");	//法定计量单位
					invtListForm.find("#lawfUnitcd").val("");
					invtListForm.find("#secdLawfUnitcdName").val("");	//法定第二计量单位
					invtListForm.find("#secdLawfUnitcd").val("");
					invtListForm.find("#dclCurrcdName").val("");	//币制
					invtListForm.find("#dclCurrcd").val("");
					invtListDclUprcAmt.val(""); //单价
					$(that).attr("oldvalue", "");
					invtListGdecd.attr("oldvalue", "");	//商品编码
				}
			});
			getGoodsByGdecd(invtListGdecd.val(), "invtList");
		}
	});
	
	//表体商品编码
	invtListGdecd.bind('keypress',function(e){
		if(this.getAttribute("readonly")){
			return;
		}
		var eCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
		if(eCode == 13 && !!this.value && this.value != $(this).attr("oldvalue")){
			var that = this;
			openGoodsWindow(this, function(tsInfo){
				that.value = tsInfo.codeTs;
				invtListGdsNm.val(tsInfo.gname);
				if($("#dclTypecd").val() == "1"){
					invtListDclUnitcdName.val(tsInfo.unit1Name);
					invtListForm.find("#dclUnitcd").val(tsInfo.unit1);
				}
				invtListForm.find("#lawfUnitcdName").val(tsInfo.unit1Name);
				invtListForm.find("#lawfUnitcd").val(tsInfo.unit1);
				invtListForm.find("#secdLawfUnitcdName").val(tsInfo.unit2Name);
				invtListForm.find("#secdLawfUnitcd").val(tsInfo.unit2);
				CodeTsFlag[tsInfo.codeTs] = tsInfo.outDutyTypeFlag;
				$(that).attr("oldvalue", tsInfo.codeTs);
				invtListGdsNm.focus();
			});
		}
	});
	
	//表体数量
	invtListDclQty.bind('keypress',function(e){
		if(this.getAttribute("readonly")){
			return;
		}
		var eCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
		if(eCode == 13 && !this.value == ""){
			//modify 20180831 核注清单申报单位、法定单位、法定第二单位一致时，法定数量和法定第二数量根据申报数量自动返填
			var dclUnitcd = invtListForm.find("#dclUnitcd").val(),
				lawfUnitcd = invtListForm.find("#lawfUnitcd").val(),
				secdLawfUnitcd = invtListForm.find("#secdLawfUnitcd").val();
			if(dclUnitcd == lawfUnitcd && $.trim(invtListForm.find("input[name=lawfQty]").val()) == ""){
				invtListForm.find("input[name=lawfQty]").val(this.value);
			}
			if(dclUnitcd == secdLawfUnitcd && $.trim(invtListForm.find("input[name=secdLawfQty]").val()) == ""){
				invtListForm.find("input[name=secdLawfQty]").val(this.value);
			}
			
			var price = invtListDclUprcAmt.val(), total = invtListDclTotalAmt.val();
			Calculate(this.value, price, total, function(count, price2, total2){
				//其中一个计算值相等，则不需要修改
				if (total == total2 || price == price2) return;
				layer.confirm('', {btn: ['修改企业申报单价', '修改企业申报总价']},
					function(index, layero){
						invtListDclUprcAmt.val(price2);
						layer.close(index);
					},
					function(){
						invtListDclTotalAmt.val(total2);
					}
				);
			});
		}
	});
	
	//表体单价
	invtListDclUprcAmt.bind('keypress',function(e){
		if(this.getAttribute("readonly")){
			return;
		}
		var eCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
		if(eCode == 13 && !this.value == ""){
			var count = invtListDclQty.val();
			Calculate(count, this.value, "", function(count2, price2, total2){
				invtListDclTotalAmt.val(total2);
			});
		}
	});
	
	//表体总价
	invtListDclTotalAmt.bind('keypress',function(e){
		if(this.getAttribute("readonly")){
			return;
		}
		var eCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
		if(eCode == 13 && !this.value == ""){
			var count = invtListDclQty.val();
			Calculate(count, "", this.value, function(count2, price2, total2){
				invtListDclUprcAmt.val(price2);
			});
		}
	});
	
	//料件商品编码
	invtGoodsGdecd.bind('keypress',function(e){
		if(this.getAttribute("readonly")){
			return;
		}
		var eCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
		if(eCode == 13 && !!this.value && this.value != $(this).attr("oldvalue")){
			var that = this;
			openGoodsWindow(this, function(tsInfo){
				that.value = tsInfo.codeTs;
				invtGoodsForm.find("input[name=gdsNm]").val(tsInfo.gname);
				if($("#dclTypecd").val() == "1") {
					invtGoodsForm.find("#dclUnitcdName").val(tsInfo.unit1Name);
					invtGoodsForm.find("#dclUnitcd").val(tsInfo.unit1);
				}
				invtGoodsForm.find("#lawfUnitcdName").val(tsInfo.unit1Name);
				invtGoodsForm.find("#lawfUnitcd").val(tsInfo.unit1);
				invtGoodsForm.find("#secdLawfUnitcdName").val(tsInfo.unit2Name);
				invtGoodsForm.find("#secdLawfUnitcd").val(tsInfo.unit2);
				invtGoodsForm.find("input[name=gdsNm]").focus();
				$(that).attr("oldvalue", tsInfo.codeTs);
			});
		}
	});
	
	//料件流转申报表序号
	invtGoodsForm.find("input[name=applyTbSeqno]").bind('keypress',function(e){
		if(this.getAttribute("readonly")){
			return;
		}
		var eCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
		if(eCode == 13 && $.trim(this.value) != "" && this.value != $(this).attr("oldvalue")){
			if(invtType.val() != "4" && invtType.val() != "9"){
				return;
			}
			var that = this;
			//applyNo, applyTbSeqno, invtType, subSystem
			EmsGoodsQuery($.trim(applyNo.val()), $.trim(this.value), invtType.val(),
					COMMON_INFO.subSystem, function(data){
				if(data && data.code == "0"){
					var applyInfo = data.data;
				    invtGoodsForm.find("input[name=putrecSeqno]").val(applyInfo.putrecSeqno);//备案序号
					invtGoodsGdsMtno.val(applyInfo.gdsMtno),	//商品料号
					invtGoodsGdecd.val(applyInfo.gdecd),	//商品编码
					invtGoodsForm.find("input[name=gdsNm]").val(applyInfo.gdsNm),	//商品名称
					invtGoodsForm.find("input[name=gdsSpcfModelDesc]").val(applyInfo.gdsSpcfModelDesc),	//商品规格型号
					invtGoodsForm.find("#goods-dclUnitcdName").val(applyInfo.dclUnitcdName),	//申报计量单位
					invtGoodsForm.find("#goods-dclUnitcd").val(applyInfo.dclUnitcd);
					invtGoodsForm.find("#goods-lawfUnitcdName").val(applyInfo.lawfUnitcdName);	//法定计量单位
					invtGoodsForm.find("#goods-lawfUnitcd").val(applyInfo.lawfUnitcd);
					invtGoodsForm.find("#goods-secdLawfUnitcdName").val(applyInfo.secdLawfUnitcdName);	//法定第二计量单位
					invtGoodsForm.find("#goods-secdLawfUnitcd").val(applyInfo.secdLawfUnitcd);
					invtGoodsForm.find("#goods-dclCurrcdName").val(applyInfo.dclCurrcdName);	//币制
					invtGoodsForm.find("#goods-dclCurrcd").val(applyInfo.dclCurrcd);
					invtGoodsDclUprcAmt.val(applyInfo.dclUprcAmt); //单价
					$(that).attr("oldvalue", that.value);
				}else{
					showLayerAlert(data.message || data.detail);
					that.value = "";
					$(that).attr("oldvalue", "");
					invtGoodsForm.find("input[name=putrecSeqno]").val("");//备案序号
					invtGoodsGdsMtno.val(""),	//商品料号
					invtGoodsGdecd.val(""),	//商品编码
					invtGoodsForm.find("input[name=gdsNm]").val(""),	//商品名称
					invtGoodsForm.find("input[name=gdsSpcfModelDesc]").val(""),	//商品规格型号
					invtGoodsForm.find("#goods-dclUnitcdName").val(""),	//申报计量单位
					invtGoodsForm.find("#goods-dclUnitcd").val("");
					invtGoodsForm.find("#goods-lawfUnitcdName").val("");	//法定计量单位
					invtGoodsForm.find("#goods-lawfUnitcd").val("");
					invtGoodsForm.find("#goods-secdLawfUnitcdName").val("");	//法定第二计量单位
					invtGoodsForm.find("#goods-secdLawfUnitcd").val("");
					invtGoodsForm.find("#goods-dclCurrcdName").val("");	//币制
					invtGoodsForm.find("#goods-dclCurrcd").val("");
					invtGoodsDclUprcAmt.val(""); //单价
				}
			});
			getGoodsByGdecd(invtGoodsGdecd.val(), "invtGoods");
		}
	});
	
	//料件数量
	invtGoodsDclQty.bind('keypress',function(e){
		if(this.getAttribute("readonly")){
			return;
		}
		var eCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
		if(eCode == 13 && !this.value == ""){
			//modify 20180831 核注清单申报单位、法定单位、法定第二单位一致时，法定数量和法定第二数量根据申报数量自动返填
			var dclUnitcd = invtGoodsForm.find("#goods-dclUnitcd").val(),
				lawfUnitcd = invtGoodsForm.find("#goods-lawfUnitcd").val(),
				secdLawfUnitcd = invtGoodsForm.find("#goods-secdLawfUnitcd").val();
			if(dclUnitcd == lawfUnitcd){
				invtGoodsForm.find("input[name=lawfQty]").val(this.value);
			}
			if(dclUnitcd == secdLawfUnitcd){
				invtGoodsForm.find("input[name=secdLawfQty]").val(this.value);
			}
			
			var price = invtGoodsDclUprcAmt.val(), total = invtGoodsDclTotalAmt.val();
			Calculate(this.value, price, total, function(count, price2, total2){
				//其中一个计算值相等，则不需要修改
				if (total == total2 || price == price2) return;
				layer.confirm('', {btn: ['修改企业申报单价', '修改企业申报总价']},
					function(index, layero){
						invtGoodsDclUprcAmt.val(price2);
						layer.close(index);
					},
					function(){
						invtGoodsDclTotalAmt.val(total2);
					}
				); 
			});
		}
	});
	
	//料件单价
	invtGoodsDclUprcAmt.bind('keypress',function(e){
		if(this.getAttribute("readonly")){
			return;
		}
		var eCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
		if(eCode == 13 && !this.value == ""){
			var count = invtGoodsDclQty.val();
			Calculate(count, this.value, "", function(count2, price2, total2){
				invtGoodsDclTotalAmt.val(total2);
			});
		}
	});
	
	//料件总价
	invtGoodsDclTotalAmt.bind('keypress',function(e){
		if(this.getAttribute("readonly")){
			return;
		}
		var eCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
		if(eCode == 13 && !this.value == ""){
			var count = invtGoodsDclQty.val();
			Calculate(count, "", this.value, function(count2, price2, total2){
				invtGoodsDclUprcAmt.val(price2);
			});
		}
	});
	//添加控件事件 ---------------------end-----------------

	$(window).resize(function () {
		invtListTable.bootstrapTable('resetView');
		invtDecListTable.bootstrapTable('resetView');
		invtGoodsTable.bootstrapTable('resetView');
		invtWarehouseTable.bootstrapTable('resetView');
		invtCbecBillTable.bootstrapTable('resetView');
	});
	init(COMMON_INFO && COMMON_INFO.bizKey);
	//校验表头
	ValidateFunc(invtHeadForm, headValid.TempSaveRules, headValid.Msg);
	ValidateFunc(invtListForm, listValid.Rules, listValid.Msg);
	ValidateFunc(invtGoodsForm, goodsValid.Rules, goodsValid.Msg);
	ValidateFunc(searchCbecBillForm, cbecBillQueryValid.Rules, cbecBillQueryValid.Msg);
	
	this.f_addList = function(listData){
		var decListData = invtDecListTable.bootstrapTable("getData");
		insertListBatch(listData, decListData);
	}

	//清单表体导入
	function insertListBatch(listData, decListData) {
	    //集报不允许新增
	    if ((invtType.val() == "1" || (invtType.val() == "8" && invtHeadForm.find("input[name=param1]").val() == "1")) && data.gdsSeqno > listData.length) {
	        layer.open({
	            title: "提示",
	            content: "当前清单类型不允许新增！",
	            icon: 2
	        });
	        return;
	    }
	    if (!listData.length || listData.length == 0) {
	        return;
	    }
	    var checkFlag = true;
	    var entryGdsSeqNos = [];
	    $.each(decListData, function(idx, val) {
	        entryGdsSeqNos.push(idx + 1);
	    });

	    for (var i = 0; i < listData.length; i++) {
	        var l = listData[i];
	        if (l.gdsSeqno != (i + 1)) {
	            layer.open({
	                title: "提示",
	                content: "表体序号[" + data.gdsSeqno + "]：序号填写不正确！",
	                icon: 2
	            });
	            checkFlag = false;
	            break;
	        }
	        //如果报关则生成报关商品
	        if (dclcusFlag.val() === "1" && $("#genDecFlag").val() === "1") {
	        	 SetElementEnable(decImportBtn, true);
	            //如果用户设置报关单序号，检查序号是否合规
	            if (DecListGNoCheck(l, decListData) === false) {
	                checkFlag = false;
	                break;
	            }
	            if (decListData.length == 50 && GoodDutyType(l.gdecd) === true) {
	                //涉税商品不能再新增
	                layer.open({
	                    title: "提示",
	                    content: "报关单商品项最多50条，新增该涉税商品后无法归并到报关单商品项中！",
	                    icon: 2
	                });
	                checkFlag = false;
	                break;
	            }
	            if (DecListCountCheck(l, decListData) === false) {
	                layer.open({
	                    title: "提示",
	                    content: "本保税核注清单对应的报关单表体已经50条(不可超过50条)，请确认后重新录入！",
	                    icon: 2
	                });
	                checkFlag = false;
	                break;
	            }
	            //生成报关单草稿
	            var _tmpDec = InvtList2DecList(l);
	            //不做归并
	            if (decListData.length == 0) {
	                decListData.push(_tmpDec);
	                entryGdsSeqNos.push(decListData.length);
	                l.entryGdsSeqno = decListData.length;
	            } else if (mtpckEndprdMarkcd.val() == "E" && GoodDutyType(l.gdecd)) {
	                decListData.push(_tmpDec);
	                entryGdsSeqNos.push(decListData.length);
	                l.entryGdsSeqno = decListData.length;
	            } else if (l.param1 == "1") {
	                decListData.push(_tmpDec);
	                entryGdsSeqNos.push(decListData.length);
	                l.entryGdsSeqno = decListData.length;
	            } else {
	                var flag = false;
	                for (var j = 0; j < decListData.length; j++) {
	                    var _tmp = decListData[j];
	                    //商品编码+商品名称+计量单位+币制+产销国
	                    if (l.gdecd == _tmp.gdecd &&
	                        l.gdsNm == _tmp.gdsNm &&
	                        l.dclUnitcd == _tmp.dclUnitcd &&
	                        l.natcd == _tmp.natCd &&
	                        l.dclCurrcd == _tmp.dclCurrCd &&
	                        //20181018 优化，新增目的国
	                        l.destinationNatcd == _tmp.destinationNatcd ) {
	                        if (l.entryGdsSeqno && l.entryGdsSeqno != _tmp.entryGdsSeqno) {
	                            //20180912 修复bug，满足归并条件，但报关单序号为1,2,2时，第三条归并失败
	                            if (entryGdsSeqNos.filter(function(v) { return l.entryGdsSeqno == v }).length > 0) {
	                                flag = false;
	                                continue;
	                            }
	                            decListData.push(_tmpDec);
	                            entryGdsSeqNos.push(decListData.length);
	                            l.entryGdsSeqno = decListData.length;
	                            flag = true;
	                            break;
	                        } else {
	                            combineDec(_tmpDec, _tmp);
	                            flag = true;
	                            break;
	                        }
	                    } else {
	                        flag = false;
	                    }
	                }
	                if (!flag) {
	                    decListData.push(_tmpDec);
	                    entryGdsSeqNos.push(decListData.length);
	                    l.entryGdsSeqno = decListData.length;
	                }
	            }
	        }
	    }
	    if (checkFlag === false) {
	        return;
	    } else {
	        invtListTable.bootstrapTable("load", listData);
	        dclcusFlag.val() === "1" && invtDecListTable.bootstrapTable("load", decListData);
	        return true;
	    }
	}

	//商编信息查询
	function getGoodsByGdecd(gdecdss, invtListTypes) {
		if(gdecdss == ""){
			return;
		}
		$.ajax({
			type : "POST",
			url : swProxyBasePath+ "sw/ems/pub/common/getGoodsInfo",
			data : JSON.stringify({"codeTs" : gdecdss}),
			dataType : "json",
			contentType : "application/json; charset=utf-8",
			success : function(data) {
				//非法调用处理
				data = decryptServerMsg(data);
//				data.codeTs = codeTs;
//				callback(data);
				if(invtListTypes == "invtList"){
					$("#lawfUnitcdName").val(data.unit1Name);	//法定计量单位
					$("#lawfUnitcd").val(data.unit1);
					$("#secdLawfUnitcdName").val(data.unit2Name);	//法定第二计量单位
					$("#secdLawfUnitcd").val(data.unit2);	
				}else if(invtListTypes == "invtGoods"){
					$("#goods-lawfUnitcdName").val(data.unit1Name);	//法定计量单位
					$("#goods-lawfUnitcd").val(data.unit1);
					$("#goods-secdLawfUnitcdName").val(data.unit2Name);	//法定第二计量单位
					$("#goods-secdLawfUnitcd").val(data.unit2);	
				}
			}
		});
	}

	/***
	 * 解决非法调用服务端加密数据解密方法
	 * 将server加密后的字符串数据解密为json格式
	 */
	function decryptServerMsg(data) {
		if (typeof data == 'string') {
			data = loadMenuTypeStr (data);
			data = JSON.parse(data);
		}
		return data;
	}


	function esapiInit() {
		org.owasp.esapi.ESAPI.initialize();
	}

	function esapiUrlValue(value) {
		return $ESAPI.encoder().encodeForURL(value + '');
	}

}

var InvtObj = new Invt();