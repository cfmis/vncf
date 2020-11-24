
!(function(){
	//zxb 20190619  所有文本输入框添加前后去空格
	$("input[type=text]:not([readonly])").attr("trimCheck","true").blur(function(){
	    $(this).val($(this).val().replace(/(^\s*)|(\s*$)/g,"").replace(/[\r\n]/g,""));    
	});;
	
	//修改超时时间为120秒·
	$.ajaxSetup({
	   	timeout : 120000,
	});
	
	$.extend($.validator.messages, {
		required: "此项为必填项",
		remote: "请修正该字段",
		email: "请输入正确格式的电子邮件",
		url: "请输入合法的网址",
		date: "请输入合法的日期",
		dateISO: "请输入合法的日期 (ISO).",
		number: "请输入合法的数字",
		digits: "只能输入整数",
		creditcard: "请输入合法的信用卡号",
		equalTo: "请再次输入相同的值",
		accept: "请输入拥有合法后缀名的字符串",
		maxlength: $.validator.format("请输入一个长度最多是 {0} 的字符串"),
		minlength: $.validator.format("请输入一个长度最少是 {0} 的字符串"),
		rangelength: $.validator.format("请输入一个长度介于 {0} 和 {1} 之间的字符串"),
		range: $.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
		max: $.validator.format("请输入一个最大为 {0} 的值"),
		min: $.validator.format("请输入一个最小为 {0} 的值")
	});
})();
(function ($) {
    'use strict';

    $.fn.bootstrapTable.locales['zh-CN'] = {
        formatLoadingMessage: function () {return '正在努力地加载数据中，请稍候……';},
        formatRecordsPerPage: function (pageNumber) {return '每页显示 ' + pageNumber + ' 条记录';},
        formatShowingRows: function (pageFrom, pageTo, totalRows) {return '显示第 ' + pageFrom + ' 到第 ' + pageTo + ' 条记录，总共 ' + totalRows + ' 条记录';},
        formatSearch: function () {return '搜索';},
        formatNoMatches: function () {return '没有找到匹配的记录';},
        formatPaginationSwitch: function () {return '隐藏/显示分页';},
        formatRefresh: function () {return '刷新';},
        formatToggle: function () {return '切换';},
        formatColumns: function () {return '列';}
    };
    $.extend($.fn.bootstrapTable.defaults, $.fn.bootstrapTable.locales['zh-CN']);
})(jQuery);
/**
 * 消息框
 * 
 * @param msg
 *             需要提示的消息
 * @param time
 *             消息框出现多久自动关闭
 * @returns
 */
function showLayerMsg(msg, time) {
	layer.msg(msg, {
		icon : 1,// 成功图标
		time : time || 2000
	// 2秒关闭（如果不配置，默认是3秒）
	});
}
/**
 * 消息框 
 * @param msg 需要提示的消息
 * @param iconVal 显示图标
 * @param showTime 消息框出现多久自动关闭
 * @returns
 */
function layerMsg(msg, iconVal, showTime) {
	layer.msg(msg, {
		icon : iconVal, //显示图标 (1：成功 2：失败)
		time : showTime //2秒关闭（如果不配置，默认是3秒）
	});
}
/**
 * 
 * @param msg
 *             需要显示的tips信息
 * @param elem
 *             定位 tips 出现的位置 dom 节点 如：$("#xxx");
 * @param time
 *             tips 出现多久自动关闭
 * @returns
 */
function showLayerTip(msg, elem, time) {
	layer.tips(msg, elem, { // 所需提醒的元素ID
		tips : [ 3, '#DC143C' ], // 在元素的下面出现 1上面，2右边 3下面
		tipsMore : true, // 允许同时存在多个
		time : time || 2000
	// tips自动关闭时间，毫秒
	});
}
/**
 * 弹出框：需要手动关闭
 * 
 * @param msg
 *             弹出框的内容
 * @param num
 *             弹出框的内容
 * @returns
 */
function showLayerAlert(msg, num) {
	try{
		layer.alert(msg, {
			icon : num!=null ? num : 2,
			yes : function(index) {
				layer.close(index);
			}
		});
	}catch(e){
		console.info("错误信息",e);
	}
}

// ajax 返回的错误提示消息
function rebackInfo(json, info) {
	// var errorcode = json.errorCode;
	// if(errorcode){
	// showLayerAlert(info+":<br>错误编码:"+errorcode+";<br>"+json.errors.join("<br>"));
	// }else{
	// showLayerAlert(info+":<br>" +json.errors.join("<br>"));
	// }
	// 修改为resultTip格式回执
	var errorcode = json.code;
	var message = json.message;
	if(!!message){
		if (errorcode < 0) {
			showLayerAlert(message);
		} else if (errorcode) {
			showLayerAlert(message, 2);
		}
	}
}

/**
 * 添加jQuery 校验方法
 * 
 * @param value
 *             校验字段的值
 * @param element
 *             校验字段dom
 * @param param
 *             需要依赖字段的Id
 * @returns
 */
jQuery.validator.addMethod("dependon", function(value, element, param) {
	var dependEle = $('#' + param).val();
	if (dependEle)
		return !!value;
	return true;
}, "此项不能为空");

/**
 * 添加jQuery 校验方法
 * 
 * @param value
 *             校验字段的值
 * @param element
 *             校验字段dom
 * @param param
 *             正则表达式
 * @returns
 */
$.validator.addMethod("pattern", function(value, element, param) {
	if (!value) {
		return true;
	} else {
		return new RegExp(param).test(value);
	}

}, "无法匹配");
/** 
 * 校验输入数字大于指定输入框值
 * 使用方法：定义validateRules时直接定义 {gt：10}
 * 			
 */
jQuery.validator.addMethod("gt", function(value, element, param) {
	var paramVal = $(param).val();
	return parseInt(value) > parseInt(paramVal);
});

/** 
 * 校验number类型数据的整数和小数部分长度
 * 使用方法：定义validateRules时直接定义 {decimalLength：[10,2]} ,参数为数组形式，其中10表示整数部分不超过10位，2表示小数部分不超过2位
 * 			可以自定义validateMsgs{decimalLength："自定义"}，默认为[整数部分不能超过{0}位，小数部分不能超过{1}位.]
 */
jQuery.validator.addMethod("decimalLength", function(value, element, param) {
	var regex = new RegExp("^\\d{1,"+param[ 0 ]+"}(\\.\\d{1,"+param[ 1 ]+"}){0,1}$")
	return this.optional( element ) || regex.test(value);
}, $.validator.format( "整数部分不能超过{0}位，小数部分不能超过{1}位." )); 

/**
 * 添加jQuery 校验方法 日期比较
 * 
 * @param value
 *             校验字段的值
 * @param element
 *             校验字段dom
 * @param param
 *             正则表达式
 */
$.validator.addMethod("compareDate", function(value, element, param) {
	var startDate = $("#" + param).val();
	if (!!startDate) {
		var date1 = new Date(Date.parse(convertDate(startDate)));
		var date2 = new Date(Date.parse(convertDate(value)));
		return date1 <= date2;
	}
	return true;
}, "结束日期必须大于等于开始日期!");

/* 比较两个日期之间相差的天数，下取整，不足一天按0计算 */
$.validator.addMethod("strDateDiff", function(value, element, param) {
	var startDate = $("#" + param[0]).val();
	if (!!startDate) {
		return swUtil.strDateDiff(value, startDate, "YYYYMMDD") <= param[1];
	}
	return true;
});

// yyyyMMdd to yyyy/MM/dd
function convertDate(str) {
	var year = str.substring(0, 4);
	var month = str.substring(4, 6);
	var day = str.substring(6, str.length);
	return year + "/" + month + "/" + day;
}

/* 基于 保税电商数据查询 使用 'YYYY-MM-DD hh:mm:ss' 时间格式查询 新增方法 2018.11.12 edit by nj start */

/**
 * 添加jQuery  'YYYY-MM-DD hh:mm:ss' 时间格式 校验方法 日期比较
 *
 * @param value
 *             校验字段的值
 * @param element
 *             校验字段dom
 * @param param
 *             正则表达式
 */
$.validator.addMethod("compareDate_new", function(value, element, param) {
    var startDate = $("#" + param).val();
    if (!!startDate) {
        var date1 = new Date(Date.parse(convertDate_new(startDate)));
        var date2 = new Date(Date.parse(convertDate_new(value)));
        return date1 <= date2;
    }
    return true;
}, "结束日期必须大于等于开始日期!");

/* 比较两个日期之间相差的天数，下取整，不足一天按0计算 */
$.validator.addMethod("strDateDiff_new", function(value, element, param) {
    var startDate = $("#" + param[0]).val();
    if (!!startDate) {
        return swUtil.strDateDiff(value, startDate, "YYYYMMDDhhmmss") <= param[1];
    }
    return true;
});

// yyyyMMdd to yyyy/MM/dd
function convertDate_new(str) {
    var year = str.substring(0, 4);
    var month = str.substring(4, 6);
    var day = str.substring(6,8);
    var hour = str.substring(8,10);
    var min = str.substring(10,12);
    var second = str.substring(12,14);
    return year + "/" + month + "/" + day + " " + hour + ":" + min + ":" + second;
}

/* 基于 保税电商数据查询 使用 'YYYY-MM-DD hh:mm:ss' 时间格式查询 新增方法  edit by nj end */

/**
 * 添加jQuery 校验方法  计算字符长度且汉字算两个字符
 *
 * @param value 校验字段的值
 * @param element 校验字段dom
 * @param max 最长长度
 */
$.validator.addMethod("byteRangeLength", function(value, element, max) {
	var length = value.length;
	for(var i = 0; i < value.length; i++){
		if(value.charCodeAt(i) > 127){
			length++;
		}
	}
	return this.optional(element) || ( length <= max );
},"字符长度超长，且一个汉字算两个字符！");

/**
 * 校验是否为yyyyMMdd格式日期
 */
$.validator.addMethod("isyMd", function(value, element, params) {
	if (!value) {
		return true;
	} else {
		return /^[1-9]\d{3}(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[01])$/.test(value);
	}
},"请输入'yyyyMMdd'格式的日期");

$.validator.addMethod("isDate", function(value, element, params) {
	var date = DateUtils.parse(value, "yyyyMMdd");
	if(date.day > DateUtils.getDaysInMonth(date.year, date.month)){
		return false;
	}else{
		return true;
	}
},"请输入正确的日期");


$.validator.addMethod("isNowDate", function(value, element, params) {
	if(!!value){
		var date = new Date();
		var nowDate =  new Date(Date.parse(convertDate(date.getFullYear() +
				""+(date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1)
				+date.getDate())));
		var date2 = new Date(Date.parse(convertDate(value)));
		return nowDate <=date2;
	}
	return true;
},"有效期必须大于当前日期");


var DateUtils = {
    parse : function(dateStr, format) {
        var date = {};
        if (dateStr == null || format == null) return date;
        if (typeof dateStr !== "string" || typeof format !== "string") return date;
        if (dateStr.length != format.length || dateStr.length == 0) return date;
        var o = {
            "y+": { field: "year", offset: 0 }, //年份
            "M+": { field: "month", offset: -1 }, //月份 
            "d+": { field: "day", offset: 0 }, //日 
            "h+": { field: "hour", offset: 0 }, //小时 
            "m+": { field: "minute", offset: 0 }, //分 
            "s+": { field: "second", offset: 0 }, //秒 
            "z+": { field: "millisecond", offset: 0 } //毫秒 
        };
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                var _val = dateStr.substr(format.indexOf(RegExp.$1), RegExp.$1.length);
                _val = !isNaN(_val) ? parseInt(_val) + o[k].offset : null;
                date[o[k].field] = _val;
            }
        }
        return date;
    },
    isLeapYear : function(year) {
        return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
    },
    getDaysInMonth : function(year, month) {
        return [31, (this.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    },
    addDate: function(date, days) {//只支持yyyymmdd
        if (days == undefined || days == '') {
            days = 1;
        }
        if (date == undefined || date == '') {
        	date = new Date();
        }else{
        	date = date.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3");
        	date = new Date(date);
        }
        
        date.setDate(date.getDate() + days);
        return this.getyyyyMMdd(date);
    },
    getyyyyMMdd :function (d){
        var curr_date = d.getDate();
        var curr_month = d.getMonth() + 1; 
        var curr_year = d.getFullYear();
        String(curr_month).length < 2 ? (curr_month = "0" + curr_month): curr_month;
        String(curr_date).length < 2 ? (curr_date = "0" + curr_date): curr_date;
        var yyyyMMdd = [curr_year,curr_month,curr_date].join("");
        return yyyyMMdd;
    }  
}


/**
 * 
 * @param formId
 *             需要校验表单的id
 * @param rules
 *             校验表单的规则
 * @param messages
 *             校验表单的提示信息
 * @returns
 */
function ValidateFunc(formId, rules, messages) {
        var formEle = typeof formId == 'string' ? $("#" + formId) : formId;
	var validateForm = formEle.validate({ // 表单id
		focusInvalid : false, // 提交表单后，未通过验证的表单是否获得焦点
		onkeyup : false, // 是否在敲击键盘时验证
		ignore:"[readonly]",//忽略只读
		onfocusout : function(element) {
			$(element).valid();
		}, // 在获取焦点时验证
		onclick : function(element) {
			$(element).valid();
		}, // 在鼠标点击时验证
		onsubmit : true, // 是否提交表单时验证
		submitHandler : function(form) { // 表单提交句柄,为一回调函数，带一个参数：form
			form.submit(); // 提交表单
		},
		rules : rules,
		errorPlacement : function(error, element) {
			// 提示消息回调
			if (element.is(':radio') || element.is(':checkbox')) {
				var objValList = document.getElementsByName(element[0].name);// 为了显示在同一单选/复选框的最后面
				showLayerTip(error[0].innerText, objValList[objValList.length - 1], 3000);
			} else if (element[0].nodeName == "SELECT") { // 伪选择器不支持SELECT,下拉框需要单独定位
				var selectTipsObj = $(element[0]).next('div');
				showLayerTip(error[0].innerText, selectTipsObj, 3000);
			} else {
				showLayerTip(error[0].innerText, element[0].parentElement, 3000);
			}
		},
		messages : messages
	});
	return validateForm;
}

function indexFormatter(value, row, index) {
	return index + 1;
}

//数量、单价、总价计算
function Calculate(qty, uprcAmt, totalAmt, callback) {
	var count = $.trim(qty), total = $.trim(totalAmt), price = $.trim(uprcAmt);
	if(count == "") return;
	if(total == "" && price == "") return;
    try {
    	//数量变动，且总价 单价均存在时
        if (!total == "" && !price == ""){
            var total2 = new BigDecimal(count).multiply(new BigDecimal(price)).setScale(2, MathContext.ROUND_HALF_EVEN).toString();
            var price2 = new BigDecimal(total).divide(new BigDecimal(count), 4, MathContext.ROUND_HALF_EVEN).setScale(4, MathContext.ROUND_HALF_EVEN).toString();
            
            callback(count, cutZero(price2), cutZero(total2));
        } else {
        	//计算总价
        	if (total == "" && !price == ""){
        		var total2 = new BigDecimal(count).multiply(new BigDecimal(price)).setScale(2, MathContext.ROUND_HALF_EVEN).toString();
        		callback(count, price, cutZero(total2));
        	}else if(!total == "" && price == ""){	//计算单价
        		var price2 = new BigDecimal(total).divide(new BigDecimal(count), 4, MathContext.ROUND_HALF_EVEN).setScale(4, MathContext.ROUND_HALF_EVEN).toString();
        		callback(count, cutZero(price2), total);
        	}
        }
    } catch(err){console && console.log(err)}
}

//去除末尾多余的零
function cutZero(old) {
	var newstr = old;
	var leng = old.length - old.indexOf(".") - 1
	// 无小数点不处理
	if (old.indexOf(".") > -1) {
		// 循环小数部分
		for (var i = leng; i > 0; i--) {
			// 如果newstr末尾有0
			if (newstr.lastIndexOf("0") > -1 && newstr.substr(newstr.length - 1, 1) == 0) {
				var k = newstr.lastIndexOf("0");
				// 如果小数点后只有一个0 去掉小数点
				if (newstr.charAt(k - 1) == ".") {
					return newstr.substring(0, k - 1);
				} else {
					// 否则 去掉一个0
					newstr = newstr.substring(0, k);
				}
			} else {
				// 如果末尾没有0
				return newstr;
			}
		}
	}
	return old;
}

// 获取当前日期yyyyMMdd
/**
 * offset 以天为单位
 */
function getCurrDate(offset) {
	var now = new Date();
	if(offset && !isNaN(offset)){
		now = new Date(now.getTime() + (offset * 24 * 3600 * 1000));
	}
	var year = now.getFullYear(); // 年
	var month = now.getMonth() + 1; // 月
	var day = now.getDate(); // 日
	if (month < 10) {
		month = "0" + month;
	}
	if (day < 10) {
		day = "0" + day;
	}
	return [year,month,day].join("");
}

function IsBwlNo(putrecNo){
	if (!putrecNo || putrecNo.length < 12) return false;

    //物流账册
    if ((putrecNo.startsWith("T") && (putrecNo.charAt(5) === 'D' || putrecNo.charAt(5) === 'W')) 
            || (putrecNo.startsWith("L") && (putrecNo.charCodeAt(8) >= 65 && putrecNo.charCodeAt(8) <= 90))) {
        return true;
    }
    return false;
}

//设置表单元素是否只读
function SetViewOnly(ele, readonly){
	var element;
	if(typeof ele === "string"){
		element = $("#" + ele);
	}else{
		element = $(ele);
	}
	if(element == null || !element.length){
		return;
	}
	if(element.is("form")){
		if(readonly){
			element.find("input").attr("readonly", "readonly");
		}else{
			element.find("input").each(function(i,v){
				if(v.attributes["data-readonly"]){
					v.setAttribute("readonly", "readonly");
				}else{
					v.removeAttribute("readonly");
				}
			});
		}
	}else{
		if(readonly){
			element.attr("readonly", "readonly");
		}else{
			if(element.attr["data-readonly"]){
				element.attr("readonly", "readonly");
			}else{
				element.removeAttr("readonly");
			}
		}
	}
}

function SetElementEnable(ele, enabled){
	var element;
	if(typeof ele === "string"){
		element = $("#" + ele);
	}else{
		element = $(ele);
	}
	if(element == null || !element.length){
		return;
	}
	if(!enabled){
		element.attr("disabled", "disabled");
	}else{
		if(element.attr["data-enabled"]){
			element.attr("disabled", "disabled");
		}else{
			element.removeAttr("disabled");
		}
	}
}

/**
 * 获取企业信息：企业海关编码、社会信用代码、企业名称
 * 
 * @param value
 *            输入值
 * @param socialId
 * @param nameId
 * @param codeId
 */
function getCopInfo(value, refresh, callback) {
	if(!value || value==""){
		callback();
		return ;
	}
	
	//添加遮罩
	var customInfoIndex;
	$.ajax({
		type : "GET",
		url : swProxyBasePath + "sw/ems/pub/common/GetCopInfo/code/"+ value + "?refresh=" + refresh,
		dataType : "json",
		timeout : 40000,
		contentType : "application/json; charset=utf-8",
		beforeSend: function(XHR){
			customInfoIndex = layer.load(1,{shade:[0.3]});
		},
		dataFilter:function(data,type){
			return ajaxDataFilter(data);
		},//加密数据解密
		success : function(data, textStatus, jqXHR) {
			callback(data);
		},
		error : function(XMLHttpRequest, textStatus, errorThrown){	
			layer.msg("查询失败，请稍后再试！", {
				icon: 2,
				time: 3000
			});
		},
		complete: function(XHR, textStatus){
			layer.close(customInfoIndex);
		}
	});
}

/**
 * 账册号表头查询
 * @param emsNo 账册号
 * @param subSystem 子系统名 Sas Bws Grt Nwgt Nems
 * @param callback 回调函数
 */
function EmsHeadQuery(emsNo, subSystem, callback){
	if(!emsNo || !/^\w{12}$/.test($.trim(emsNo))){
		layer.msg("请录入12位账(手)册编号！", {
			  icon: 2,
			  time: 3000
		});
		return;
	}
	if(!subSystem){
		layer.msg("没有获取符合查询条件的结果！", {
			icon: 2,
			time: 3000
		});
		return;
	}
	//添加遮罩
	var shadeIndex;
	$.ajax({
		type : "GET",
		url : swProxyBasePath + "sw/ems/pub/common/EmsHeadQuery/" + subSystem + "/emsno/" + $.trim(emsNo),
		dataType : "json",
		timeout : 40000,
		async: false,
		contentType : "application/json; charset=utf-8",
		beforeSend: function(XHR){
			shadeIndex = layer.load(1,{shade:[0.3]});
		},
		dataFilter:function(data,type){
			return ajaxDataFilter(data);
		},//加密数据解密
		success : function(data, textStatus, jqXHR) {
			callback(data);
		},
		error : function(XMLHttpRequest, textStatus, errorThrown){
			layer.msg("查询失败，请稍后再试！", {
				icon: 2,
				time: 3000
			});
		},
		complete: function(XHR, textStatus){
			layer.close(shadeIndex);
		}
	});
}

/**
 * 表体备案序号查询
 * @param emsNo 账册号
 * @param putrecNo 备案序号
 * @param imgExgFlag 料件成品标识 I/E
 * @param subSystem 子系统名 Sas Bws Grt Nwgt Nems
 * @param callback 回调函数
 */
function EmsListQuery(emsNo, putrecSeqno, imgExgFlag, subSystem, callback){
	if(!emsNo || !/^\w{12}$/.test($.trim(emsNo))){
		layer.msg("请录入12位账(手)册编号！", {
			  icon: 2,
			  time: 3000
		});
		return;
	}
	if(!putrecSeqno || !/^\d{1,19}$/.test($.trim(putrecSeqno))){
		layer.msg("请录入正确的备案序号！", {
			icon: 2,
			time: 3000
		});
		return;
	}
	if(!/^[IE]$/.test(imgExgFlag)){
		return;
	}
	if(!subSystem){
		layer.msg("没有获取符合查询条件的结果！", {
			icon: 2,
			time: 3000
		});
		return;
	}
	var url = swProxyBasePath + "sw/ems/pub/common/EmsListQuery/" + subSystem + "/"
	+ $.trim(emsNo) + "/" + imgExgFlag + "/" + $.trim(putrecSeqno);
	//添加遮罩
	var shadeIndex;
	$.ajax({
		type : "GET",
		url : url,
		dataType : "json",
		timeout : 40000,
		async: false,
		contentType : "application/json; charset=utf-8",
		beforeSend: function(XHR){
			shadeIndex = layer.load(1,{shade:[0.3]});
		},
		dataFilter:function(data,type){
			return ajaxDataFilter(data);
		},//加密数据解密
		success : function(data, textStatus, jqXHR) {
			callback(data);
		},
		error : function(XMLHttpRequest, textStatus, errorThrown){	
			layer.msg("查询失败，请稍后再试！", {
				icon: 2,
				time: 3000
			});
		},
		complete: function(XHR, textStatus){
			layer.close(shadeIndex);
		}
	});
}

/**
 * 
 * @param applyNo 申请表编号
 * @param applyTbSeqno 申请表序号
 * @param invtType 清单类型
 * @param ieType 进出口标记
 * @param subSystem 子系统名 Sas Bws Grt Nwgt Nems Npts
 * @param callback 回调函数
 */
function EmsApplyQuery(applyNo, applyTbSeqno, invtType, ieType, subSystem, callback){
	if($.trim(applyNo) == ""){
		layer.msg("请录入申报表编号！", {
			icon: 2,
			time: 3000
		});
		return;
	}
	if($.trim(applyTbSeqno) == ""){
		layer.msg("请录入正确的申报表序号！", {
			icon: 2,
			time: 3000
		});
		return;
	}
	if("Npts" === subSystem && !/^[IE]$/.test(ieType)){
		return;
	}
	if("Npts" !== subSystem && invtType != "4" && invtType != "5"){
		return;
	}
	var url = swProxyBasePath + "sw/ems/pub/common/EmsApplyQuery/" + subSystem + "/" 
		+ $.trim(applyNo) + "/" + $.trim(applyTbSeqno) + "?invtType=" + invtType + "&ieType=" + ieType;
	//添加遮罩
	var shadeIndex;
	$.ajax({
		type : "GET",
		url : url,
		dataType : "json",
		timeout : 40000,
		async: false,
		beforeSend: function(XHR){
			shadeIndex = layer.load(1,{shade:[0.3]});
		},
		dataFilter:function(data,type){
			return ajaxDataFilter(data);
		},//加密数据解密
		success : function(data, textStatus, jqXHR) {
			callback(data);
		},
		error : function(XMLHttpRequest, textStatus, errorThrown){	
			layer.msg("查询失败，请稍后再试！", {
				icon: 2,
				time: 3000
			});
		},
		complete: function(XHR, textStatus){
			layer.close(shadeIndex);
		}
	});
}

/**
 * 申报表商品信息
 * @param applyNo 申报表编号
 * @param applyTbSeqno 申报表序号
 * @param invtType 清单类型
 * @param subSystem 子系统
 * @param callback 回调
 * @returns
 */
function EmsGoodsQuery(applyNo, applyTbSeqno, invtType, subSystem, callback){
	if($.trim(applyNo) == ""){
		layer.msg("请录入申报表编号！", {
			icon: 2,
			time: 3000
		});
		return;
	}
	if($.trim(applyTbSeqno) == ""){
		layer.msg("请录入正确的申报表序号！", {
			icon: 2,
			time: 3000
		});
		return;
	}
	if(invtType != "4" && invtType != "9"){
		return;
	}
	var url = swProxyBasePath + "sw/ems/pub/common/EmsGoodsQuery/" + subSystem + "/" + $.trim(applyNo) 
		+ "/" + $.trim(applyTbSeqno) + "?invtType=" + invtType;
	//添加遮罩
	var shadeIndex;
	$.ajax({
		type : "GET",
		url : url,
		dataType : "json",
		timeout : 40000,
		async: false,
		beforeSend: function(XHR){
			shadeIndex = layer.load(1,{shade:[0.3]});
		},
		dataFilter:function(data,type){
			return ajaxDataFilter(data);
		},//加密数据解密
		success : function(data, textStatus, jqXHR) {
			callback(data);
		},
		error : function(XMLHttpRequest, textStatus, errorThrown){	
			layer.msg("查询失败，请稍后再试！", {
				icon: 2,
				time: 3000
			});
		},
		complete: function(XHR, textStatus){
			layer.close(shadeIndex);
		}
	});
}

/**
 * 获取企业信息：企业海关编码、社会信用代码、企业名称
 * 
 * @param value
 *             输入值
 * @param socialId
 * @param nameId
 * @param codeId
 */
function getCustomInfo(value, socialId, nameId) {
	if (!value || value == "") {
		return false;
	}

	// 添加遮罩
	var customInfoIndex = layer.load(1, {
		shade : [ 0.5, '#fff' ]
	// 0.1透明度的白色背景
	});
	$.ajax({
		type : "GET",
		url : swProxyBasePath + "sw/ems/pub/common/GetCopInfo/code/"+ value + "?refresh=false",
		dataType : "json",
		timeout : 40000,
		contentType : "application/json; charset=utf-8",
		dataFilter:function(data,type){
			return ajaxDataFilter(data);
		},//加密数据解密
		success : function(json) {
			layer.close(customInfoIndex);
			$("#" + nameId).val(null);
			$("#" + socialId).val(null);
			if (json.code == 0 && json.data != null) {
				var copInfo = json.data;
				if (!!copInfo.copName) {
					$("#" + nameId).val(copInfo.copName);
				}
				if (!!copInfo.socialCreditCode) {
					$("#" + socialId).val(copInfo.socialCreditCode);
				}
			} else {
				rebackInfo(json, "查询失败!");
			}
		},
		error : function() {
			layer.close(customInfoIndex);
			showLayerAlert("查询失败，请稍后再试！");
		}
	});
}


// 获取表格下一个序号
function getTableNextIndex(tableId) {
	var rowsLength = $('#' + tableId).bootstrapTable('getData').length;
	if(null==rowsLength || rowsLength == 0){
		return 1;
	}
	var total = $('#' + tableId).bootstrapTable('getOptions').totalRows;
	if(total==0){
		total = $('#' + tableId).bootstrapTable('getData').length;
	}
	return  parseInt(total)+ 1;
}

function getObjectValue(obj, key) {
	var value = "";
	$.each(obj, function(i, val) {
		if (i == key) {
			value = val;
		}
	});
	return value;
}

/**
 * 根据参数值获取参数名称
 * 
 * @param tableName
 *             表名
 * @param codeValue
 *             值
 * @returns codeName
 */
function getCodeNameByValue(tableName, codeValue) {
	var name = "";
	$.ajax({
		type : 'get',
		url : swProxyBasePath + 'sw/base/para/depParaMap?tableName=' + tableName + '&keyValue=' + codeValue
				+ '&stamp=' + Math.random(),
		dataType : 'json',
		async : false,
		contentType : 'application/json;charset=UTF-8',
		success : function(data) {
			name = data.codeName;
			return;
		},
		dataFilter:function(data,type){
			return ajaxDataFilter(data);
		},//加密数据解密
		error : function(data, textStatus, errorThrown) {
			var msg = "加载参数失败！";
			layer.alert(msg);
		}
	});
	return name;
}

/**
 * 根据参数值获取参数名称
 * 
 * @param tableName
 *             表名
 * @param codeValue
 *             值
 * @returns codeName
 */
function getCodeList(tableName) {
	var codeMap = new Array();
	$.ajax({
		type : 'get',
		url : swProxyBasePath + 'sw/base/para/depParaList?tableName=' + tableName + '&stamp=' + Math.random(),
		dataType : 'json',
		async : false,
		contentType : 'application/json;charset=UTF-8',
		success : function(data) {
			codeMap = data;
			return;
		},
		dataFilter:function(data,type){
			return ajaxDataFilter(data);
		},//加密数据解密
		error : function(data, textStatus, errorThrown) {
			var msg = "加载参数失败！";
			layer.alert(msg);
		}
	});
	return codeMap;
}
/*
*//**
 * 跳转tab
 * 
 * @param menuName
 *             菜单名称
 * @param menuNameCN
 *             菜单中文名称
 * @param url
 *             url
 * @param tabParamJson
 *             参数JSON
 *//*
function openTab(menuName, menuNameCN, url, tabParamJson, contextPath) {
	var paramStr = JSON.stringify(tabParamJson);
	var __basePath = swProxyBasePath;
	Begin:Modified for 修改basePath,平台未提供修改basePath by zxb 20190329			
	if(contextPath){
		var _tmp = __basePath.split("/");
		_tmp[_tmp.length - 2] = contextPath;
		__basePath = _tmp.join("/");
	}
	if (url.indexOf("?") > -1) {
		url = url + "&ngBasePath=" + __basePath;
	} else {
		url = url + "?ngBasePath=" + __basePath;
	}
	End :Modified for 修改basePath,平台未提供修改basePath by zxb 20190329
	
	if (top.$(".J_menuItem").length > 0) {
		if (top.$('a#' + menuName).length > 0) {
			top.$('a#' + menuName).remove();
			refreshTabByMenuSW(menuNameCN);
		}
		var dataIndex = top.$(".J_menuItem").length;
		
		Begin:Modified for 取消绑定事件 by chenyongda 20181010			
		var hrefEle = '<a id ="' + menuName + '" title="' + menuNameCN
				+ '" class="J_menuItem" data-id=' + url + ' href="' + url
				+ '" data-index="' + dataIndex
				+ '" style="display:none;" data=\'' + paramStr + '\'>'
				+ menuNameCN + '</a>'; // Modified by cyd for 货物申报特殊字符 * 20180426
		top.$('body').append(hrefEle);
		
		top.$('.J_tabShowActive').on('click', showActiveTab);
					
	    return menuItem(url,dataIndex,menuNameCN);
	    
		End :Modified for 取消绑定事件 by chenyongda 20181010

	} else {
		window.location.href = url;
	}
}*/


/**
 * 初始化授权企业下拉框
 * 
 * @param sysId
 *             子系统ID
 * @param eleId
 *             inputID
 */
function pubAuthQryInput(sysId, eleId) {
	var request = {
		sysId : sysId,
		syEtpsNo : Session.cus_reg_no,
		icCard : Session.cards,
	}
	if(!!Session.social_credit_code){
		request.syEtpsSccd = Session.social_credit_code;
	}
	// 添加遮罩
	var index = layer.load(1, {
		shade : [ 0.5, '#fff' ]
	// 0.1透明度的白色背景
	});

	$.ajax({
		type : "POST",
		url : swProxyBasePath + 'sw/ems/pub/common/pubAuthQryService?stamp=' + Math.random(),
		data : JSON.stringify(request),
		contentType : "application/json;charset=utf-8",
		dataType : "json",
		dataFilter:function(data,type){
			return ajaxDataFilter(data);
		},//加密数据解密
		success : function(json) {
			console.log("委托授权",json)
			_setCache("ems_pubAuth", json);
			layer.close(index);
			if (json.code == 0) {
				var selTradeList = new Array();
				var resultList = json.data.resultList;
				var thisObj = new Object();
				thisObj.value = Session.cus_reg_no;
				thisObj.name = Session.cus_reg_no;
				thisObj.label = Session.cus_reg_no;
				selTradeList.push(thisObj);
				for (var i = 0; i < resultList.length; i++) {
					var obj = new Object();
					obj.value = resultList[i].etpsNo;
					obj.label = resultList[i].etpsNo;
					selTradeList.push(obj);
				}

				$("#" + eleId).autocompleter({
					hiddenId : eleId,
					source : selTradeList
				});
			}else if(json.code == -21003){//未查到数据
				var selTradeList = new Array();
				var thisObj = new Object();
				thisObj.value = Session.cus_reg_no;
				thisObj.name = Session.cus_reg_no;
				thisObj.label = Session.cus_reg_no;
				selTradeList.push(thisObj);
				$("#" + eleId).autocompleter({
					hiddenId : eleId,
					source : selTradeList
				});
			}else {
				rebackInfo(json, "查询失败!");
			}
		},
		error : function() {
			layer.close(index);
			showLayerAlert("查询失败，请稍后再试！");
		},
		complete: function(XHR, textStatus){
			layer.close(index);
		}
	});
}

/**
 * 根据参数值从CodeList中获取参数名称
 * 
 * @param list
 *             参数数组
 * @param value
 *             参数值
 * @returns 参数名称
 */
function getCodeNameFromList(list, value) {
	if (!!list) {
		for (var i = 0; i < list.length; i++) {
			if (value == list[i].codeValue) {
				return list[i].codeName;
			}
		}
	}
	return "";
}

/**
 * @param value
 *             判断值是否为空
 * @returns {Boolean}
 * @author jinzhenz
 */
function isEmpty(value) {
	return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
}

/**
 * 清空form
 * 
 * @param _form
 */
function _clearform(_form) {
	$('#' + _form).clearForm();
	$('#' + _form + ' input').val(null);
	$('#' + _form + ' input').data("oldvalue",null);
	$('#' + _form + ' select').val(null);
	$('#' + _form + ' input').removeAttr('value');
}

/**
 * 判断是否是物流账册
 */
function isBwlNo(areainOriactNo){
	isBwlNoFlag = false;
	if (areainOriactNo == null || areainOriactNo.Length < 12) 
	{
		isBwlNoFlag = false;
	}
	var tempStr = /[A-Z]/i;
    if ((areainOriactNo.substring(0, 1) == "T" && (areainOriactNo.substring(5, 6) == "D"||areainOriactNo.substring(5, 6) == "W")) || (areainOriactNo.substring(0, 1) == "L" && tempStr.test(areainOriactNo.substring(8,9))))//物流账册
    {
    	isBwlNoFlag = true;
    }
}

//获取当前日期yyyyMMdd
function getStartDateByMilliseconds(offsetMilliseconds) {
    var now = new Date();
    now = new Date(now.getTime() - offsetMilliseconds);
    var year = now.getFullYear(); // 年
    var month = now.getMonth() + 1; // 月
    if (month <= 0){
        month += 12;
        year -= 1;
    }
    var day = now.getDate(); // 日
    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    return [year,month,day].join("");
}

//卡控件打印错误信息
function alertErrMsg(msg) {
    if (!!msg.Error && msg.Error.length > 0) {
    	if(msg.Error[1]=='Err:Custom50200' || msg.Error[1]=='Err:Custom51590'){
    		showLayerAlert("请插入当前用户绑定的电子钥匙！",0);
    	}else{
    		showLayerAlert(JSON.stringify(msg.Error));
    	}
    }
}
/**
 * 检测当前卡是否一致
 * @param callback 回调函数
 */
function isInstalled(callback,index){
	var cardIndex = layer.load(1, {shade: [0.1,'#fff']});
	EportClient.getGetCardUserInfoAll(function(msg){//获取卡的用户信息
		layer.close(cardIndex);
		if (!msg.Result) {
			if(!!index){
				layer.close(index); 
			}
			alertErrMsg(msg);
			return;
		}
		var data = msg.Data[0];
		if(!!data && data.indexOf("||")>0){
			var iccard = data.split("||")[5];
			if(Session.cards != iccard){
				if(!!index){
					layer.close(index); 
				}
				showLayerAlert("当前插的IC卡/KEY与登录用户账号绑定的IC卡/KEY（"+Session.cards+"）不一致");
				return;
			}
			if(!!index){
				callback(index);
			}else{
				callback();
			}
		}else{
			showLayerAlert("读取卡信息失败！"+JSON.stringify(msg.Error));
		}
	});
}

/**
 * 获取加签原文
 * @param formId 		表单ID
 * @param list			字段名
 * @returns {String}	拼接后的字符串
 */
function getSignStr(formId,list){
	var str = "";
	if(null != list && list.length>0){
		for(var i=0;i<list.length;i++){
			str+=$("#"+formId+" #"+list[i]).val();
		}
	}
	return str;
}


/**
 * 卡控件加签
 * @param callback 成功后的回调函数,必须的参数sign(signature:加签后的字符串，certno：证书号)
 * @param signStr  要加签的数据
 */
function emsSignData(callback,signStr){
	$.getJSON(swProxyBasePath + "sw/ems/pub/common/getUserInfo",function(data){
		var jsonStr = loadMenuTypeStr(data);
	   	var result = JSON.parse(jsonStr);
	   	if(result.code != 0){
		   showLayerAlert("获取当前登录用户信息失败！");
		   return;
	   	}
		var pwd = result.data.pwd; 
		var cardIndex = layer.load(1, {shade: [0.1,'#fff']});
		EportClient.getGetCardUserInfoAll(function(msg){//获取卡号
			layer.close(cardIndex);
			if (!msg.Result) {
				alertErrMsg(msg);
				return;
			}
			var data = msg.Data[0];
			if(!!data && data.indexOf("||")>0){
				var iccard = data.split("||")[5];
				if(Session.cards != iccard){//校验是否是当前卡
					showLayerAlert("当前插的IC卡/KEY与登录用户账号绑定的IC卡/KEY（"+Session.cards+"）不一致");
					return;
				}
				cardIndex = layer.load(1, {shade: [0.1,'#fff']});
				EportClient.cusSpcSignDataAsPEM(signStr, pwd, function(msg) {//加签
					layer.close(cardIndex);
					if (msg.Result) {
						var sign = new Object();
						sign.signature = msg.Data[0];
						sign.certno = msg.Data[1];
						console.debug("PEM编码后："+sign.signature);
						callback(sign);
					}else{
						showLayerAlert("数据加签失败！"+JSON.stringify(msg.Error));
					}
				});
			}else{
				showLayerAlert("读取卡信息失败！"+JSON.stringify(msg.Error));
			}
		});
	});
}

//excel下载
function excelDownload(flag) {
	var urlStr = swProxyBasePath + "sw/ems/pub/common/excel/download/" + flag;
	window.open(urlStr);
}

//xss校验
function xssCheck(str,reg){    return str ? str.replace(reg ||/[&<">'](?:(amp|lt|quot|gt|#39|nbsp|#\d+);)?/g,function (a, b) {
      if(b){
        return a;
      }else{
        return{
          '<':'&lt;',
          '&':'&amp;',
          '"':'&quot;',
          '>':'&gt;',
//          "'":'''
        }[a]
      }
    }): '';
  }
  
  
  /**
   * 导入文件大小限制
   * true 	大于4M
   * false 	小于等于4M
   */
  function limitFileSize(fileId){
  	if($("#" + fileId)[0].files[0].size.toFixed(1) > 4 * 1024 *1024){
  		layer.open({
  			title : '提示',
  			content : "请选择小于4M的文件！"
  		});
  	    return true;
  	}
  	return false;
  }
  
  
  /**
   * 生成页面表单属性名称静态map
   */
  function exportTool_getFormMap(){
  	$("form").each(function(){
  		var formId = $(this).attr("id");
  		var title = formId.replace(/\_(\w)/g,function(all, letter){
  	        return letter.toUpperCase();
  	    }).replace("Form","");
  		var str = "public static Map<String,String> "+title+"Map = new LinkedHashMap<String, String>(){{\r\n";
  		$("#"+formId +" :input[type='text']").each(function(){
  			var name = $(this).parents("td").prev().text();
  			name = name.replace("*","").trim();
  			str += "\tput(\""+$(this).attr("name")+"\",\""+name+"\");\r\n";
  		});
  		str += "}};\r\n";
  		console.info(str);
  	});
  }

  function isEBA(emsNo){
      if(emsNo==null||emsNo.length!=12){
          return false;
      }
      var str1 = emsNo.charAt(0);
      var str2 = emsNo.charAt(5);
      var str3 = emsNo.charAt(7);
      if(str1=="E"&&str2=="B"&&str3=="A"){
          return true;
      }
      return false;
  }
  
  
  function ajaxDataFilter(data){
	  if(!!data){
		  if(isJSON(data)){
			  return data;
		  }else{
			  try {
				var str = data.replace('"', '');
				var jsonStr = loadMenuTypeStr(str);
				//var json = JSON.parse(jsonStr);
				return jsonStr;
			} catch (e) {
				return JSON.stringify(data);
			}
		  }
	  }
	  return data;
  }
  
  
  function ajaxDataFilter2json(data){
	  if(!!data){
		  if(isJSON(data)){
			  return data;
		  }else{
			  try {
				var str = data.replace('"', '');
				var jsonStr = loadMenuTypeStr(str);
				var json = JSON.parse(jsonStr);
				return json;
			} catch (e) {
				return data;
			}
		  }
	  }
	  return data;
  }
  
function isJSON(str) {
    if (typeof str == 'string') {
        try {
            var obj=JSON.parse(str);
            if(typeof obj == 'object' && obj ){
                return true;
            }else{
                return false;
            }
        } catch(e) {
//            console.log('error：'+str+'!!!'+e);
            return false;
        }
    }
//    console.log('It is not a string!')
}