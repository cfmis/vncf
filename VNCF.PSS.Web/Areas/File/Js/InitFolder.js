var main = {
    data() {
        return {
            title:"初始化目錄結構",
            userId:""
        }
    },
    created() { 
        this.userId = $("#user_id").val();
    },
    methods: {        
        initFiles:async function(){
            //檢查是否是初始化權限
            var user_id = this.userId;
            var isCanInit = await COMM.checkAuthority(user_id,"20070","INIT_FOLDER");//20070--菜單功能模塊ID;INIT_FOLDER--初始化目錄結構的權限
            if(isCanInit ==="0"){
                this.$XModal.alert({ content: "注意:您沒有初始目錄結構的權限!", mask: false });
                return;
            }
            this.$XModal.confirm('您确认要初始化當前目錄?').then(type => {
                if (type == "confirm") {                                   
                    axios.post("/File/File/IntFiles",{path: "public"}).then(
                        (res) => {
                            if(res.data.result ==="ok"){                                
                                this.$XModal.message({ content: "目錄結構初始化成功!", status: "success" });                                    
                            }
                            else{                                       
                                this.$XModal.alert({ content: "目錄結構初始化失敗!",status: "warning" , mask: false });                                 
                            }                            
                        }
                    ).catch(function (res) {                       
                        this.$XModal.alert({ content: "錯誤提示:" + res.data.message,status: "error" , mask: false });                                              
                    });
                }
            })
        },//end of function

    }//end fo methods
}

var app = new Vue(main).$mount('#app');
Vue.prototype.$XModal = VXETable.modal;
//Vue.prototype.$utils = XEUtils;