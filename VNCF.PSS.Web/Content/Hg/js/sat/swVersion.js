/*
 */
(function () {
    SwVersion = {
    
        getIkeyDownloadUrl : function (){
		
		     var userAgent = navigator.userAgent; // 取得浏览器的userAgent字符串		 
			 var lowUserAgent = userAgent.toLowerCase();			 
			 var isChrome = lowUserAgent.indexOf('chrome') > -1;
			 var url="";
             if(isChrome){		  
				var url = "https://app.singlewindow.cn/downloads/EportClientSetup_V1.5.24.exe";
			 }else{
				var url = "http://update.singlewindow.cn/downloads/EportClientSetup_V1.5.24.exe";
			 }
        	

           return url;
        }
    };
})()
