/**
 * 将form里面的内容序列化成json
 * 相同的checkbox用分号拼接起来
 * @param {dom} 指定的选择器
 * @param {obj} 需要拼接在后面的json对象
 * @method serializeJson
 * */
$.fn.serializeJson=function(otherString){
    var serializeObj={},
        array=this.serializeArray();
    $(array).each(function(){
        if(serializeObj[this.name]){
            serializeObj[this.name]+=';'+this.value;
        }else{
            serializeObj[this.name]=this.value;
        }
    });

    if(otherString!=undefined){
        var otherArray = otherString.split(';');
        $(otherArray).each(function(){
            var otherSplitArray = this.split(':');
            serializeObj[otherSplitArray[0]]=otherSplitArray[1];
        });
    }
    return serializeObj;
};

/**
 * 将json对象赋值给form
 * @param {dom} 指定的选择器
 * @param {obj} 需要给form赋值的json对象
 * @method serializeJson
 * */
$.fn.setForm = function(jsonValue){
    var obj = this;
    $.each(jsonValue,function(name,ival){
        var $oinput = obj.find("input[name="+name+"]");
        if($oinput.attr("type")=="checkbox"){
            if(ival !== null){
                var checkboxObj = $("[name="+name+"]");
                var checkArray = ival.split(";");
                for(var i=0;i<checkboxObj.length;i++){
                    for(var j=0;j<checkArray.length;j++){
                        if(checkboxObj[i].value == checkArray[j]){
                            checkboxObj[i].checked = true;
                        }
                    }
                }
            }
        }
        else if($oinput.attr("type")=="radio"){
            $oinput.each(function(){
                var radioObj = $("[name="+name+"]");
                for(var i=0;i<radioObj.length;i++){
                    if(radioObj[i].value == ival){
                        radioObj[i].checked = true;
                    }
                }
            });
        }
        else if($oinput.attr("type")=="textarea"){
            obj.find("[name="+name+"]").html(ival);
        }
        else{
            obj.find("[name="+name+"]").val(ival);
        }
    })
}

/**
 * 将json对象赋值给form 中的span
 * @param {dom} 指定的选择器
 * @param {obj} 需要给form赋值的json对象
 * @method serializeJson
 * */
$.fn.setForm2 = function(jsonValue){
    var obj = this;
    for(var key in jsonValue){
        var $oinput = obj.find("[name="+key+"]");
        $oinput.text(jsonValue[key]);
    }
}

/**
 * 将json对象部分数据赋值给form中的checkbox
 * */
var fillckb = function (name, json) {
    var jsonObj = json;
    if (typeof json === 'string') {
        jsonObj = $.parseJSON(json);
    }
    var str = jsonObj[name];
    if (typeof str === "string") {
        var array = str.split(",");
        $.each(array, function (key, value) {
            setCkb(name, value);
        });
    }
}
var setCkb = function (name, value) {
    $("[name=" + name + "][val=" + value + "]").attr("checked", "checked");
}