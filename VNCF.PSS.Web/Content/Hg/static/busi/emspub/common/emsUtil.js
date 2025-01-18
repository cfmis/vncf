(function ($) {
	window['emsUtil'] = $.emsUtil = {
		setTDTitle : function(tableId){
			var $table = $("#"+table);
			if(!!$table && $table.length>0){
				$table.find("td").each(function(index, val){
					console.log( index, val, this );
					this.attr("title",this.text());
				});
			}
		},	
		/**
		 * json数组排序
		 * @param data	Json数组
		 * @param colId 排序列
		 * @param orderFlag asc升序desc降序
		 */
		sortArray : function(data,colId,orderFlag){
			//对json进行降序排序函数  
		    var desc = function(x,y){  
		        return (x[colId] < y[colId]) ? 1 : -1;
		    }  
		    //对json进行升序排序函数  
		    var asc = function(x,y){  
		        return (y[colId] > x[colId]) ? 1 : -1;
		    }		    
		    if("asc"==orderFlag){
		    	data.sort(asc); //升序排序  
		    }else{
		    	data.sort(desc); //升序排序  
		    }
		},
		/**
		 * json数组排序
		 * @param data	Json数组
		 * @param colId 排序列
		 * @param orderFlag asc升序desc降序
		 */
		sortArray2 : function(data,colId,orderFlag){
			//对json进行降序排序函数  
			var desc = function(x,y){  
				return (parseInt(x[colId]) < parseInt(y[colId])) ? 1 : -1  
			}  
			//对json进行升序排序函数  
			var asc = function(x,y){  
				return (parseInt(x[colId]) > parseInt(y[colId])) ? 1 : -1  
			}		    
			if("asc"==orderFlag){
				data.sort(asc); //升序排序  
			}else{
				data.sort(desc); //升序排序  
			}
		},
		/**
		 * 清除readonly属性
		 * @param idList 
		 * @param isReadonly 默认false
		 * @param formId
		 */
		setReadonly : function(list,isReadonly,formId){
			if(isReadonly==null || isReadonly==""){
				isReadonly = false;
			}
			for(var i in list){
				if(!!formId){
					$("#"+formId+" [name='"+list[i]+"']").attr("readonly",isReadonly);
				}else{
					$("input [name='"+list[i]+"']").attr("readonly",isReadonly);
				}
			}
		},
		removeReadonly:function(formId){
			$('#'+_form+' input').removeAttr("readonly");;
			$('#'+_form+' select').removeAttr("disabled");
		},
		/**
		 * 清空form
		 * @param _form
		 */
		clearForm : function(_form){
			$('#'+_form).clearForm();
			$('#'+_form+' input').val(null);
			$('#'+_form+' select').val(null);
			$('#'+_form+' input').removeAttr('value');
		},
		/**
		 * @param value 判断值是否为空
		 * @returns {Boolean}
		 * @author jinzhenz
		 */
		isEmpty : function(value) {
			return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
		},
		/**
		 * 初始化授权企业下拉框
		 * @param sysId 子系统ID
		 * @param eleId	inputID
		 */
		pubAuthQryInput:function(sysId,eleId){
				var request = {
					sysId : sysId,
					syEtpsNo : Session.cus_reg_no,
					icCard : Session.cards
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
					success : function(json) {
						console.log("委托授权",json)
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
					}
				});
		},
		/**
		 * 根据参数值从CodeList中获取参数名称
		 * @param list	参数数组
		 * @param value	参数值
		 * @returns		参数名称
		 */
		getCodeNameFromList:function(list,value){
			if(!!list){
				for(var i=0;i<list.length;i++){
					if(value==list[i].codeValue){
						return list[i].codeName;
					}
				}
			}
			return "";
		},
		/**
		 * 跳转tab
		 * @param menuName 		菜单名称
		 * @param menuNameCN 	菜单中文名称
		 * @param url 			url
		 * @param tabParamJson 	参数JSON
		 */
		openTab:function(menuName,menuNameCN, url,tabParamJson) {
			var paramStr=JSON.stringify(tabParamJson);
			if(url.indexOf("?")>-1){
				url = url + "&ngBasePath=" + swProxyBasePath;
			}else{
				url = url + "?ngBasePath=" + swProxyBasePath;
			}
			if (top.$(".J_menuItem").length > 0) {
				if (top.$('a#' + menuName).length > 0) {
					top.$('a#' + menuName)[0].setAttribute("data",paramStr);
					top.$('a#' + menuName)[0].setAttribute("href",url);
					top.$('a#' + menuName)[0].setAttribute("title",menuNameCN);
					top.$('a#' + menuName)[0].innerHTML = menuNameCN;
					var aElements= top.document.getElementsByTagName('iframe');
				    var aEle=[];
				    for(var i=0;i<aElements.length;i++)
				    {
				        if(aElements[i].getAttribute('data-id').split("ngBasePath")[0]==url.split("ngBasePath")[0])
				            aEle.push( aElements[i] );
				    }
				    if(aEle[0]){
		    			aEle[0].contentWindow.location.href = url;
				    }
				    top.$('a#' + menuName)[0].click();
				} else {
					var dataIndex = top.$(".J_menuItem").length;
					var hrefEle = '<a id ="' + menuName + '" title="' + menuNameCN
							+ '" class="J_menuItem" href="' + url + '" data-index="'
							+ dataIndex + '" style="display:none;" data='+paramStr+'>' + menuNameCN
							+ '</a>';
					top.$('body').append(hrefEle);
					var contabsUrl =  swProxyBasePath + "static/js/contabs.js";
					top.$.getScript(contabsUrl).done(function() {
						top.$('a#' + menuName)[0].click();
					}).fail(function() {
						layer.alert("打开详情失败", {
							skin : 'layui-layer-lan',
							closeBtn : 1,
							anim : 0
						// 动画类型
						});
					});
				}
			} else {
				window.location.href = url;
			}
		},
		/**
		 * 根据参数值获取参数名称
		 * @param tableName 表名
		 * @param codeValue	值
		 * @returns codeName
		 */
		getCodeList:function(tableName){
			var codeMap = new Array();
			$.ajax({
				type: 'get',
				url: swProxyBasePath + 'sw/base/para/depParaList?tableName='+tableName+'&rowNum=5000&stamp='+Math.random(),
				dataType: 'json',
				async:false,
				contentType: 'application/json;charset=UTF-8',
				success: function(data) {
					codeMap = data;
					return;
				},
				error: function(data, textStatus, errorThrown) {
					var msg="权限不足或会话超时,请重新登录";
					layer.alert(msg);
				}
			});
			return codeMap;
		},
		/**
		 * 根据参数值获取参数名称
		 * @param tableName 表名
		 * @param codeValue	值
		 * @returns codeName
		 */
		getCodeNameByValue:function(tableName,codeValue){
			var name = "";
			$.ajax({
				type: 'get',
				url: swProxyBasePath + 'sw/base/para/depParaMap?tableName='+tableName+'&keyValue='+codeValue+'&rowNum=5000&stamp='+Math.random(),
				dataType: 'json',
				async:false,
				contentType: 'application/json;charset=UTF-8',
				success: function(data) {
					name = data.codeName;
					return;
				},
				error: function(data, textStatus, errorThrown) {
					var msg="权限不足或会话超时,请重新登录";
					layer.alert(msg);
				}
			});
			return name;
		},
		getObjectValue:function(obj,key){
			var value = "";
			$.each(obj, function(i, val) { 
				if(i==key){
					value = val;
				}
			}); 
			return value;
		},
		/**
		 * 删除table行
		 */
		removeRow:function(tableId,key){
			//从列表删除数据
			var ids = $.map($('#'+tableId).bootstrapTable('getSelections'), function (row) {
				return getObjectValue(row,key);
		    });
		    if (ids.length == 0 ) {
		    	showLayerAlert("请选择数据!");
		        return;
		    }
		    $('#'+tableId).bootstrapTable('remove', {
		        field: key,
		        values: ids
		    });	
		},
		/**
		 * table 添加行
		 */
		addRow : function(tableId, rowData, key, indexNo) {
			// 添加数据到列表
			var data = $('#' + tableId).bootstrapTable('getData');
			var index = data.length;
			var id = getObjectValue(rowData, key);
			for (var i = 0; i < data.length; i++) {
				var rowId = getObjectValue(data[i], key);
				if (rowId == id) {
					index = i;
				}
			}
			if (!!key) {
				$('#' + tableId).bootstrapTable('updateRow', {
					index : index,
					row : rowData
				});
			} else {
				$('#' + tableId).bootstrapTable('insertRow', {
					index : indexNo==null ? index : indexNo,
					row : rowData
				});
			}
		},

		/**
		 * 获取企业信息：企业海关编码、社会信用代码、企业名称
		 * 
		 * @param value
		 *            输入值
		 * @param socialId
		 * @param nameId
		 * @param codeId
		 */
		getCustomInfo:function(value, socialId, nameId) {
			if(!value || value==""){
				return false;
			}
			//添加遮罩
			var customInfoIndex = layer.load(1, {
				  shade: [0.1,'#fff'] //0.1透明度的白色背景
				});
			$.ajax({
				type : "GET",
				url : swProxyBasePath + "sw/ems/pub/common/GetCopInfo/code/"+ value + "?refresh=false",
				dataType : "json",
				timeout : 40000,
				contentType : "application/json; charset=utf-8",
				success : function(json) {
					layer.close(customInfoIndex);
					$("#" + nameId).val(null);
					$("#" + socialId).val(null);
					if (json.code==0 && json.data.responseList.length>0) {
						var copInfo = json.data;
						if (!!copInfo.copName) {
							$("#" + nameId).val(copInfo.copName);
						}
						if (!!copInfo.socialCreditCode) {
							$("#" + socialId).val(copInfo.socialCreditCode);
						}
					} else {
						rebackInfo(json,"查询失败!");
					}
				},
				error : function(){	
					layer.close(customInfoIndex);
					showLayerAlert("查询失败，请稍后再试！");
				}
			});
		},

		/**
		 * 获取当前日期yyyyMMdd
		 */
		getCurrDate:function() {
			var now = new Date();
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
		},
		/**
		 * 获取表格下一个序号
		 */
		getTableNextIndex:function(tableId){
			var rowsLength = $('#' + tableId).bootstrapTable('getData').length;
			if(null==rowsLength || rowsLength == 0){
				return 1;
			}
			var total = $('#' + tableId).bootstrapTable('getOptions').totalRows;
			if(total==0){
				total = $('#' + tableId).bootstrapTable('getData').length;
			}
			return  parseInt(total)+ 1;
		},
		/**
		 * 
		 * @param formId 需要校验表单的id
		 * @param rules 校验表单的规则
		 * @param messages 校验表单的提示信息
		 * @returns
		 */
		ValidateFunc:function(formId, rules, messages){
			var validateForm = $("#" + formId).validate({ //表单id
			     focusInvalid: false, //提交表单后，未通过验证的表单是否获得焦点
			     onkeyup: false,		//是否在敲击键盘时验证
			     onfocusout: function(element) { $(element).valid(); }, //在获取焦点时验证
			     onclick: function(element) { $(element).valid(); },   //在鼠标点击时验证
			     onsubmit: true, //是否提交表单时验证
			     ignore: true, //如果要校验下拉框请配置此项
			     submitHandler: function(form){   //表单提交句柄,为一回调函数，带一个参数：form   
			         form.submit();   //提交表单  
			     },
			     rules:rules,
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
				messages:messages
			});  
			return validateForm;
		},
}})(jQuery);
