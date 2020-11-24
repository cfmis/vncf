/**
 * 禁止textarea回车换行
 */

$('body').on('keydown', 'textarea', function(e) {
	var self = $(this);
	var eCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
	if (eCode == 13) {
		e.preventDefault();
	}

});

/**
 * 回车键focus定位
 */

$('body')
		.on(
				'keyup',
				'input, select, textarea',
				function(e) {
					var self = $(this), form = self.parents('form:eq(0)'), focusable, next, prev;
					var eCode = e.keyCode ? e.keyCode : e.which ? e.which
							: e.charCode;
					// shift+enter 光标向上个元素移动
					if (e.shiftKey) {
						if (e.keyCode == 13) {
							// 排除只读,disabled元素
							focusable = form.find('input,a,select,textarea')
									.filter(':visible').not(':input[readonly]')
									.not(':input[disabled]');
							// focusable =
							// form.find('input,a,select,textarea').filter(':visible');
							prev = focusable.eq(focusable.index(this) - 1);

							if (prev.length) {
								if($(this).attr("shiftEnter")=="no"){
									return false;
								}else{
									prev.focus();
								}
							}
							// else {
							// form.submit();
							// }
						}
					} else
					// Ctrl+enter 在textaera中换行
					if (e.ctrlKey && eCode == 13
							&& this.localName == "textarea") {
						var myValue = "\n";
						var $t = $(this)[0];
						if (document.selection) { // ie<9
							this.focus();
							var sel = document.selection.createRange();
							sel.text = myValue;
							this.focus();
							sel.moveStart('character', -l);
							var wee = sel.text.length;
						}
						// 现代浏览器
						else if ($t.selectionStart || $t.selectionStart == '0') {
							var startPos = $t.selectionStart;
							var endPos = $t.selectionEnd;
							var scrollTop = $t.scrollTop;
							$t.value = $t.value.substring(0, startPos)
									+ myValue
									+ $t.value.substring(endPos,
											$t.value.length);
							this.focus();
							// 因为myValue回车显示为\n
							$t.selectionStart = startPos + myValue.length;
							$t.selectionEnd = startPos + myValue.length;
							$t.scrollTop = scrollTop;

						} else {
							this.value += myValue;
							this.focus();
						}

					} else
					// enter 光标向下个元素移动
					if (eCode == 13) {
						if (this.localName == "textarea") {
							e.preventDefault();
							e.stopPropagation();
						}
						// this.context.css("background-color","#b3d7f4");
						// 排除只读,disabled元素
						focusable = form.find('input,select,textarea').filter(
								':visible').not(':input[readonly]').not(
								':input[disabled]');
						// focusable =
						// form.find('input,select,textarea').filter(':visible');

						next = focusable.eq(focusable.index(this) + 1);

						// 下个元素存在
						if (next.length) {
							// console.log(this.id +" "+ next[0].id);
							// var nid = next[0].id;
							// $("#" + nid).css("background-color", "#b3d7f4");
							// $("#" + this.id).css("background-color", "");
							if($(this).attr("enter")=="no"){
								return false;
							}else{
								next.focus();
							}
							

						}

						return false;
					}

				});