/**标志是否已经打开了窗口*/
var isOpenGoodsWindow = false;
var isOpenGoodsElementWindow = false;


/**
 * 表体商品编号弹窗
 * element	商品编码ID
 * callback 回调函数
 */
function openGoodsWindow(ele, callback) {
	if(typeof callback !== "function"){
		return;
	}
	if(isOpenGoodsWindow){
		return false;
	}
	var _ele;
	if(typeof ele === "string"){
		_ele = $("#" + ele);
	}else{
		_ele = $(ele);
	}
	if(_ele == null || !_ele.length){
		return;
	}
	
	// 输入商品编号大于等于4位时才弹商品列表框
	var codeTs = _ele.val();
	if(!codeTs){
		return false;
	}else if(codeTs.length >= 4) {
		var oldvalue = _ele.attr("oldvalue");
		if(codeTs != oldvalue){
			openGoods(_ele, callback);
		}else{
			$(this).focus();
		}
	}else{
		layerMsg('请至少输入四位商品编码！', 2, 2000);
		$(this).focus();
		return false;
	}
}

//主表：
//商品规范申报--商品申报要素
function openGoods(element, callback) {
	if(element.attr("readonly")){
		return false;
	}
	isOpenGoodsWindow = true;//标志窗口已经打开
	getGoods(element, callback);
};

//加载商品列表
function getGoods(element, callback) {
	$('#goodsListElemTable').bootstrapTable("destroy");
	$('#goodsListElemTable').bootstrapTable({
		responseHandler:"goodTableResponse",
		escape: true,
		classes: 'table table-hover',
		method : 'get',
		url : swProxyBasePath+"sw/ems/pub/common/getGoodsList",
		cache : false,
		height : 300,
		striped : true,
		search : false,
		showRefresh : false,
		showToggle : false,
		showColumns : false,
		showExport : false,
		clickToSelect : true,
		singleSelect : true,
		selectItemName: 'btSelectItemName',
		sidePagination : "server",
		pagination : false,
		queryParams : function(param){
			var keyValue = element.val();
			return {
				limit : param.limit,// 页面大小
				offset : param.offset,// 页码
				keyValue : keyValue
			};
		},
		iconSize : 'outline',
		icons : {
			refresh : 'glyphicon-repeat',
			toggle : 'glyphicon-list-alt',
			columns : 'glyphicon-list'
		},
		formatNoMatches : function() {
			return '暂无数据';
		},
		onLoadSuccess: function(data){//加载成功时执行check
			// 表格数据加载成功才弹窗
			var decGoodsLists=$("#goodsListElemTable").bootstrapTable("getData");
			if(!decGoodsLists || decGoodsLists.length<1){
				element.val('');
				element.attr("oldvalue", "");
				element.focus();
				isOpenGoodsWindow = false;
				layerMsg('无此商品编码！', 2, 2000);
			}else{
				goodsLayerOpenIndex = layer.open({
					type : 1,
					shadeClose : false,
					area : [ '600px', '450px' ],
					title : "商品列表",
					content : $("#goodsListElemContent"),
					shade : 0.5,
					scrollbar : false,
					btn : [ '确定', '关闭' ],
					btnAlign : 'c', 
					yes : function(index) {
						isOpenGoodsWindow = false;
						setGValue(element, callback); //根据商品编码获取商品信息
						element.focus();// 焦点 放到 商品编号
						layer.close(index);
					},
					btn2: function(index){
						isOpenGoodsWindow = false;
						element.focus();// 焦点 放到 商品编号
						layer.close(index);
					},
					cancel: function(index){
						isOpenGoodsWindow = false;
						element.focus();// 焦点 放到 商品编号
						layer.close(index);
					},
					success: function(){
						$("#goodsListElemTable").bind('keypress',function(event){
							if(event.keyCode == "13" ){
								var rows = $("#goodsListElemTable").bootstrapTable("getSelections");
								if(rows.length>0){
									isOpenGoodsWindow = false;
									layer.close(goodsLayerOpenIndex);
									setGValue(element, callback);
								}
							}
						});
						//弹窗层创建完毕时执行
						$('#goodsListElemTable').bootstrapTable('resetView');
						var rows = data.rows;
						if(rows && rows.length > 0){
							$('#goodsListElemTable').bootstrapTable("check", 0);//默认选中第一行
							$('#goodsListElemTable input[data-index="0"]').focus();//焦点放在表格第一行
						}
					},
					end:function(){
						$("#goodsListElemTable").unbind();
					}
				});
			}
        }
	});
}

//根据商品编码获取商品信息
function setGValue(element, callback) {
	var goodsSelects = $("#goodsListElemTable").bootstrapTable("getSelections");
	if(goodsSelects.length<1){
		return false;
	}
	var decModFlag = false;
	var	codeTs = goodsSelects[0].codeTs;
	element.attr("isChange","false");
	if(goodsSelects.length>0){
		var codeTs = goodsSelects[0].codeTs;
		$.ajax({
			type : "POST",
			url : swProxyBasePath+ "sw/ems/pub/common/getGoodsInfo",
			data : JSON.stringify({"codeTs" : codeTs}),
			dataType : "json",
			contentType : "application/json; charset=utf-8",
			dataFilter:function(data,type){
				return ajaxDataFilter(data);
			},//加密数据解密
			success : function(data) {
				data.codeTs = codeTs;
				callback(data);
			}
		});
	}
}


/*非法调用时添加*/
function goodTableResponse(resp) {
//	var result = loadMenuTypeStr(resp);
	var respData = ajaxDataFilter2json(resp);
	return{
		"total":respData.total,
		"rows":respData.rows
	}
}