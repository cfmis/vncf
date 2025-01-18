var vm = {
    data() {
        return {
            activeName: 'first',
            autoHeight: {height: '800px'},
            tableHeight: 250,
            isEditModeHead: false,
            showDialog: false,
            showDialogSearch: false,
            showDialogFindItem: false,
            isItemSave: true,
            isUpDown: false,
            isLoading: false,
            isDisable: true,
            isDisable2: true,
            isDisableArea: true,
            isDisableMo: true,
            isReadonly: true,
            isCancelItem: false,
            canAddItem: false,
            isRenderSearchWindow: false,//是否一開始就渲染窗體
            isRenderFindItem: false,
            isRenderEditWindow: false,
            //labelPosition: 'right',
            title: '查找',
            ArtImageUrl: '',
            searchFormData: { OcID: '', OrderDate: '', ReceivedDate: '', ForeignFirm: '', Area: '', CustomerID: '', SallerID: '', Season: '', ContractID: '', BrandID: '', ProductMo: '', ProductID: '' },//查詢條件數據
            searchDataSelect: { OcID: '', Ver: '0' },
            formHeadData: {
                OcID: '', Ver: 0, OrderDate: '', CustomerID: '', CustomerCdesc: '', CustomerEdesc: '', CustomerAddress: '', SendAddress: '', CountryID: '', OrderType: '', ReceivedDate: '',
                ForeignFirm: '', Area: '', SallerID: '', Season: '', Contacts: '', ContactsTel: '', ContactsFax: '', ContactsEmail: '', Merchandisers: '', MerchandisersTel: '', MerchandisersEmail: '',
                CurrencyID: '', CurrencyRate: '', DeliveredPort: '', DestinationPort: '', PoNo: '', PaymentType: '', PriceType: '', Transport: '', DiscountRate: '', Discount: '', TaxNo: '', Tax: '',
                ProductAmount: '', TotalAmount: '', BankAccount: '', State: '0', Remark: '', ShipMark: '', CreateBy: '', CreateAt: '', UpdateBy: '', UpdateAt: '', CustomerAddress: '', SendAddress: '', CountryID: ''
            },
            tempHeadData: {},//用于新增/修改前備份當主檔的值
            tempTableData: [],//用于新增/修改前備份當明細表格的值
            tempDetailData: {},//新增,修改前備份當前行的值
            formDetailData: {},//新增,修改,瀏覽共用
            tableDataSearch: [],
            tableData: [],
            tableDataBom: [],
            tableTempList: [],//臨時數組
            curRow: {},
            curRowIndex: -1,
            //定義分頁參數
            tablePage: {
                currentPage: 1,
                pageSize: 10,//每頁的數據條數
                totalResult: 100
            },
            //新增和编辑弹框显示不同标题
            dialogStatus: "",
            titleMap: {
                byAdd: "",
                byEdit: "",
                byBrowse: ""
                /*old code
                byAdd: "@Resource.btn_additem",
                byEdit: "@Resource.btn_edititem",
                byBrowse: "@Resource.btn_browse"
                */
            },
            //初始化下拉列表框
            arrForeignFirm: [],
            arrZone: [],
            arrSallerID: [],
            arrSeason: [],
            arrMerchandisers: [],
            arrMoney: [],
            arrDeliveredPort: [],
            arrPaymentType: [],
            arrPriceType: [],
            arrTransport: [],
            arrBankAccount: [],
            arrState: [],
            arrMoType: [],
            arrMoDept: [],
            arrMoGroup: [],
            arrUnit: [],
            findItem: { ProductID: '', type: 3 },
            tableDataFindItem: [],
            FindItemCurrentRow: { ProductID: '', ProductDesc: '' },
            deleteItemAmount: 0.00,
            cancelItemAmount: 0.00,
            componentKey: 0,
            //主表有效性檢查
            rulesHead: {
                OcID: { required: true, message: 'Oc編號不可為空!', trigger: 'change' },
                Ver: { required: true, message: '版本不可為空!', trigger: 'change' },
                OrderDate: { required: true, message: '訂單日期不可為空!', trigger: 'change' },
                Area: { required: true, message: '區域不可為空!', trigger: 'change' },
                CustomerID: { required: true, message: '客戶編號不可為空!', trigger: 'change' },
                ForeignFirm: { required: true, message: '洋行編號不可為空!', trigger: 'change' },
                SallerID: { required: true, message: '營業員編號不可為空!', trigger: 'change' },
                Contacts: { required: true, message: '聯系人不可為空!', trigger: 'change' },
                Merchandisers: { required: true, message: '跟單員不可為空!', trigger: 'change' },
                CurrencyID: { required: true, message: '貨幣不可為空!', trigger: 'change' },
                PoNo: { required: true, message: 'PoNo.不可為空!', trigger: 'change' },
                PriceType: { required: true, message: '價格條件不可為空!!', trigger: 'change' }
            },
            //明細有效性檢查
            rulesItem: {
                OcID: { required: true, message: 'Oc編號不可為空!', trigger: 'change' },
                MoType: { required: true, message: '制單類型不可為空!', trigger: 'change' },
                MoDept: { required: true, message: '做貨部門不可為空!', trigger: 'change' },
                MoGroup: { required: true, message: '組別不可為空!', trigger: 'change' },
                ProductMo: { required: true, message: '頁數不可為空!', trigger: 'change' },
                ProductID: { required: true, message: '產品編號不可為空!', trigger: 'change' },
                ProductCdesc: { required: true, message: '產品描述不可為空!', trigger: 'change' },
                OrderQty: { required: true, message: '訂單數量必須大于0!', trigger: 'change', type: 'number' },
                OrderUnit: { required: true, message: '訂單單位不可為空!', trigger: 'change' },
                Price: { required: true, message: '單價必須大于0!', trigger: 'change' },
                PriceUnit: { required: true, message: '單價單位不可為空!!', trigger: 'change' },
                PlanCompleteDate: { required: true, message: '預計完成日期不可為空!', trigger: 'change' },
                ArriveDate: { required: true, message: '交貨日期不可為空!', trigger: 'change' },
                FactoryShipOutDate: { required: true, message: '交客日期不可為空!', trigger: 'change' },
            }
        } //--end of return
        
    },//--end of data
    created: function () {
        this.InIt();
    },
    watch: {
        //TODO
    },
    methods: {
        InIt(){
            //洋行編號            
            this.arrForeignFirm = BaseData.getBaseInfoByName('bs_customer');
            //區域
            this.arrZone = BaseData.getBaseInfo('bs_zone');
            //營業員
            this.arrSallerID = BaseData.getBaseInfo('bs_sales');
            //季度
            this.arrSeason = BaseData.getBaseInfoByName('bs_season');
            //跟單員
            this.arrMerchandisers = BaseData.getBaseInfo('bs_personnel');
            //貨幣
            this.arrMoney = BaseData.getBaseInfo('bs_money');
            //裝貨港口/目的港口
            this.arrDeliveredPort = BaseData.getBaseInfoByName('bs_port');
            //附款方式
            this.arrPaymentType = BaseData.getBaseInfo('bs_payment');
            //價格條件
            this.arrPriceType = BaseData.getBaseInfoByName('bs_payment_condition');
            //運輸方式
            this.arrTransport = BaseData.getBaseInfo('bs_shipping_mode');
            //銀行賬號
            this.arrBankAccount = BaseData.getBaseInfoByName('bs_company_accounts');
            //狀態
            this.arrState = BaseData.getBaseInfo('sy_bill_state');
            //制單種類
            this.arrMoType = BaseData.getBaseInfo('bs_type_1');
            //做貨部門
            this.arrMoDept = BaseData.getBaseInfo('bs_type_2');
            //組別
            this.arrMoGroup = BaseData.getBaseInfo('bs_type_3');
            //數量單位/單價單位
            this.arrUnit = BaseData.getBaseInfoByName('bs_unit');  
            this.titleMap.byAdd= window.byAdd;
            this.titleMap.byEdit= window.byEdit;
            this.titleMap.byBrowse= window.byBrowse;           
        },
        checkPrice(){
            var price = this.formDetailData.Price;
            var price = '' + (price===''?0.00:price);
            price = price
                .replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
                .replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
                .replace(/^\./g, '') //保证第一个为数字而不是.
                .replace('.', '$#$')
                .replace(/\./g, '')
                .replace('$#$', '.')
                .replace(/^(\-)*(\d+)\.(\d\d\d).*$/, '$1$2.$3'); //只能输入三位小数
            if (price.indexOf('.') < 0 && price != '') {
                //以上已经过滤,此处控制的是如果没有小数点,首位不能为类似于 01、02的金额
                price = parseFloat(price);
            }
            this.formDetailData.Price = price;
        },
        handleClick(tab, event) {
            //console.log(tab, event);
        },
        showSearch() {
            //顯示查詢窗體
            this.isRenderSearchWindow = true;//渲染查詢窗口
            this.showDialogSearch = true;
            //重置表单数据
            //this.$refs["searchForm"].resetFields();
            this.tableDataSearch = [];
        },
        clearSearch(){
            //重置
            this.$refs["searchForm"].resetFields();
        },
        //不保存直接关闭弹框
        closeDialog(flag) {
            //調用參數flag,此處傳入對應彈窗名稱引用
            this.$refs[flag].resetFields();
            if(flag =='searchForm'){
                this.showDialogSearch = false;
            }
            if(flag=='formDetail'){
                if(this.dialogStatus==="byEdit"){
                    //恢復修改前的值
                    this.formDetailData = JSON.parse(JSON.stringify(this.tempDetailData));
                    //因修改數量,單價等引起主表金額的變更,不保存退出時要完原回去
                    this.formHeadData = JSON.parse(JSON.stringify(this.tempHeadData));
                }
                if(this.dialogStatus==="byAdd"){
                    //恢復修改前的值
                    this.formHeadData = JSON.parse(JSON.stringify(this.tempHeadData));
                }
                this.isReadonly = true;//主檔相關控件設為只讀
                this.isDisable = true;//主檔相關下拉列表框禁為不可用
                this.showDialog = false;
            }
            if(flag=='findItem'){
                this.showDialogFindItem = false;
            }
            this.$emit("closeDialog", flag);
        },
        rowSearchClick(row, event, column){
            //当点击任意一行时都会触发该事件
            this.searchDataSelect.OcID = row.OcID;
            this.searchDataSelect.Ver = row.Ver;
        },
        rowSearchDoubleClick(row){                   
            this.afterSelectOK(row);
        },
        afterSelectOK(){        
            this.getDataHead();
            this.showDialogSearch = false;
        },
        rowDetailsClick(row, event, column){            
            this.ArtImageUrl = row.ArtImage;//圖樣路徑
            this.curRow = row;//保存當前行
            this.curRowIndex = row.index ;//保存當前行索引
            var product_id = row.ProductID;
            this.getBomData(product_id);//顯示BOM資料
        },
        searchData() {//查詢
            this.isLoading = true;
            //this.tableTempList = [];
            var searchParams = {
                OcID: this.searchFormData.OcID,
                CustomerID: this.searchFormData.CustomerID,
                OrderDate: this.searchFormData.OrderDate,
                ReceivedDate: this.searchFormData.ReceivedDate,
                ForeignFirm: this.searchFormData.ForeignFirm,
                Area: this.searchFormData.Area,
                SallerID: this.searchFormData.SallerID,
                Season: this.searchFormData.Season,
                ContractID: this.searchFormData.ContractID,
                BrandID: this.searchFormData.BrandID,
                ProductMo: this.searchFormData.ProductMo,
                ProductID: this.searchFormData.ProductID
            }
            axios.get("GetOcHeadReturnList", { params: searchParams }).then(
                (response) => {
                    this.tableTempList = [];
                    for (var i = 0; i < response.data.length; i++) {
                        this.tableTempList.push(response.data[i]);
                    }
                    //_self.goodsList.push({ goods_id:"",goods_cname:"" });
                    //this.fillData();
                    this.tableDataSearch = this.tableTempList;
                    this.isLoading = false;
                },
                (response) => {
                    alert(response.status);
                }
            ).catch(function (response) {
                this.isLoading = false;
                alert(response);
            });
        },
                
        //主檔明細一起查詢
        getDataHead() {
            var searchParams = {OcID:this.searchDataSelect.OcID};
            //查詢主表
            axios.get("GetOcHead", { params: searchParams }).then(
                (response) => {
                    this.formHeadData=JSON.parse(JSON.stringify(response.data));
                },
                (response) => {
                    alert(response.status);
                }
            ).catch(function (response) {
                //this.isLoading = false;
                alert(response);
            });
            //查詢明細
            axios.get("List", { params: searchParams }).then(
                (response) => {
                    this.tableTempList = [];
                    for (var i = 0; i < response.data.length; i++) {
                        this.tableTempList.push(response.data[i]);
                    }
                    //_self.goodsList.push({ goods_id:"",goods_cname:"" });
                    //this.fillData();
                    this.tableData = this.tableTempList;
                    this.isLoading = false;
                },
                (response) => {
                    alert(response.status);
                }
            ).catch(function (response) {
                this.isLoading = false;
                alert(response);
            });
        },//end of getDataHead()

        //查詢BOM
        getBomData(product_id) {
            this.isLoading = true;
            axios.get("SalesBomList", { params: {ProductID: product_id} }).then(
                (response) => {
                    this.tableTempList = [];
                    for (var i = 0; i < response.data.length; i++) {
                        this.tableTempList.push(response.data[i]);
                    }
                    this.tableDataBom = this.tableTempList;
                    this.isLoading = false;
                },
                (response) => {
                    alert(response.status);
                }
            ).catch(function (response) {
                this.isLoading = false;
                alert(response);
            });
        },
        setToolBarStatus(blFlag){
            this.isEditModeHead=blFlag;
            this.isReadonly=!(blFlag);
            this.isDisable=!(blFlag);
        },
        addHead() {
            this.backupData();//編輯前首先暫存主檔/明細臨時數據
            //清空數據
            this.$refs["formHead"].resetFields();//清空所有對象值
            this.tableData=[];//清空明細表格數據
            this.tableDataBom=[];//清空BOM表格數據
            this.curRow={};
            //新增后初始化相關對象的初始值
            //var now=new Date();
            //var d=now.setDate(now.getDate());
            var d = new Date();//生成日期對象:Fri Oct 15 2021 17:51:20 GMT+0800
            d = COMM.getDate(d,0);//轉成年月日字符串格式
            this.$set(this.formHeadData, "OrderDate",d);
            this.$set(this.formHeadData, "ReceivedDate",d);
            this.$set(this.formHeadData, "Ver",0);
            this.$set(this.formHeadData, "SallerID",'1I005');
            this.setToolBarStatus(true);
            this.isDisableArea=false;
            this.canAddItem = false;
        },
        editHead (){
            //編輯主表
            this.backupData();//編輯前首先暫存主檔/明細臨時數據
            this.setToolBarStatus(true);
            this.canAddItem=false;
            this.isDisableArea=true;
        },
        saveHead (){
            //儲存主表
            this.$refs["formHead"].validate((valid) => {
                if (valid) {
                    var updateParams = JSON.parse(JSON.stringify(this.formHeadData));
                    //console.log(updateParams);
                    axios.post("AddHead", updateParams ).then(
                        (response) => {
                            this.$message({
                                message: "操作成功！",
                                type: "success",
                            });
                            this.setToolBarStatus(false);
                            this.canAddItem=true;
                            this.isDisableArea=true;
                            }
                    ).catch(function (response) {
                        this.$message({
                            message: "保存主檔資料失敗!"+response,
                            type: "error",
                        });
                    });
                    } else {
                    this.$message({
                        message: "請檢查主檔資料的完整性",
                        type: "warning",
                    });
                    return;
                    }
            });
        },
        resetHead (){
            //恢復
            this.setToolBarStatus(false);
            this.formHeadData = JSON.parse(JSON.stringify(this.tempHeadData));//還原主表
            this.tableData = JSON.parse(JSON.stringify(this.tempTableData));//還原明細
            this.canAddItem = true;
            this.isDisableArea = true;
        },
        backupData (){
            this.tempHeadData = JSON.parse(JSON.stringify(this.formHeadData));//暫存主檔臨時數據
            this.tempTableData = JSON.parse(JSON.stringify(this.tableData));//暫存明細臨時數據
        },
        cancelHead (){
            //TODO注銷
        },
        importHead (){   
            let title = window.btn_import;
            SO.openWin('ImportOrder', title, 850, 560, null);
        },
        printPI (){
            //TODO
            let url= "Print?ID=" + this.formHeadData.OcID;
            let title = window.btn_print;
            showMessageDialog(url,title,1024,768,true);
        },
        //新增明細
        addItem() {
            if(this.formHeadData.OcID ==""){
                this.$message({
                    showClose: true,
                    message: '主檔資料不可為空,當前操作無效!',
                    type: 'warning'
                });
                return;
            };
            this.checkHeadDataStatus();
            if(this.canAddItem == false){
                return;
            }
            this.dialogStatus = "byAdd";
            this.tempHeadData = JSON.parse(JSON.stringify(this.formHeadData));//暫存臨時數據
            // this.$refs["formDetail"].resetFields();//清空所有對象值
            this.formDetailData = { OcID:this.formHeadData.OcID,Ver:this.formHeadData.Ver,Seq:'',MoType:'',MoDept:'B',MoGroup:'I',ProductMo:'',ProductMoVer:'0',ProductID:'',ProductCdesc:'',GetColorSample:'',
                StyleNo:'',BrandID:'',CustProductID:'',CustProductName:'',CustColorID:'',CustColorName:'',ContractID:'',CustSize:'',OrderQty:0,OrderUnit:'PCS',Price:0.00,PriceUnit:'PCS',
                RateDiscount:0,AmountDiscount:0.00, AmountProduct:0.00,IsFree:'0',PlanCompleteDate:'',ArriveDate:'',FactoryShipOutDate:'',IsPrint:'1',Remarks:'',OcRemark:'',ProductRemark:'',
                PlateRemark:'',InvoiceRemark:'',MoState:'0',ArtImage:'',ActionType:'NEW'
            };
            var objDate = new Date();//生成日期對象:Fri Oct 15 2021 17:51:20 GMT+0800
            this.$set(this.formDetailData, "ArriveDate",COMM.getDate(objDate,0));
            this.$set(this.formDetailData, "FactoryShipOutDate",COMM.getDate(objDate,3));
            this.setCheckBoxStatus();
            this.setFormEditButtonStatus(true);
            this.isDisableMo = false;
        },
        //編輯明細
        editItem(index,row) {
            this.checkHeadDataStatus();
            if(this.canAddItem == false){
                return;
            }
            this.dialogStatus = "byEdit";
            //start 2024/05/15頁數為注銷狀態時只能瀏覽,禁止修改數據
            if(row.MoState =='2'){
                this.dialogStatus ="byBrowse";
                this.curRow = row;
                this.curRowIndex = index;
                this.formDetailData = JSON.parse(JSON.stringify(row));                       
                this.setCheckBoxStatus();//設置CheckBox狀態
                this.isRenderEditWindow = true;
                this.showDialog = true;
                this.isItemSave = false;
                this.isUpDown = true;
                this.isReadonly = true;
                this.isDisable = true;
                this.isDisableMo = true;
                return;
            }   
            //end 2024/05/15
            this.tempHeadData = JSON.parse(JSON.stringify(this.formHeadData));//暫存臨時數據
            this.curRow = row;
            this.curRowIndex = index;
            this.formDetailData = JSON.parse(JSON.stringify(row));
            //Object.assign(this.formDetailData, row);
            this.setCheckBoxStatus();//設置CheckBox狀態
            this.tempDetailData = this.formDetailData;//暫存編輯前的值,以免修改后不保存直接關閉彈窗,值已改變的問題
            this.formDetailData.ActionType ='EDIT';
            this.setFormEditButtonStatus(true);
            this.isDisableMo = true;
        },
        browseItem(index,row){
            this.checkHeadDataStatus();
            if(this.canAddItem == false){
                return;
            }
            this.dialogStatus ="byBrowse";
            this.curRow = row;
            this.curRowIndex = index;
            this.formDetailData = JSON.parse(JSON.stringify(row));
            //Object.assign(this.formDetailData, row);
            this.setCheckBoxStatus();//設置CheckBox狀態
            this.isRenderEditWindow = true;
            this.showDialog = true;
            this.isItemSave = false;
            this.isUpDown = true;
            this.isReadonly = true;
            this.isDisable = true;
            this.isDisableMo = true;
        },
        deleteItem:async function(index,row){
            this.checkHeadDataStatus();
            if(this.canAddItem === false){
                return;
            }
            //--start已轉生產計劃單的不允許刪除,只能注銷
            let is_del=false;
            await axios.post("CheckPlan", {ProductMo: row.ProductMo}).then(
                (response) => {               
                    if(response.data==="OK"){
                        this.$XModal.alert({ content: '已存在計劃流程,不可以刪除！',status: 'warning' , mask: true });     
                        is_del = false;
                        return;
                    }else{
                        is_del = true;
                    }                    
                }
             ).catch(function (response) {
                 alert(response);
                 is_del = false;
                 return;
             });            
            if(is_del===false){
                return;
            }
            //--end
            
            await this.$confirm(`此操作將删除頁數:${row.ProductMo}的資料, 是否繼續?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {                
                axios.post("DeleteList", {OcID: row.OcID,Ver:row.Ver,Seq:row.Seq}).then(
                        (response) => {
                            this.dialogStatus = "byDeleteItem";
                            this.deleteItemAmount = row.AmountProduct;
                            this.$message({message: "刪除操作成功！",type: "success"});
                            if(row.IsFree =='0'){//判斷當前刪除的行是不是收費,0是收貨,1是免費
                                this.getTotalAmount();//重計算主檔貨品金額,主檔貨品金額中要扣除掉
                                //更新主檔總金額
                                this.updateHeadAmount();
                            }
                            this.dialogStatus = "";//清空刪除標識
                        }
                    ).catch(function (response) {
                        alert(response);
                    });
                this.tableData.splice(index,1);
            }).catch(()=>{})
        },
        //頁數注銷
        cancelItem:async function() {
            if(!(this.curRow.index >= 0)){
                this.$message({message: "請指定要注銷的頁數！",type: "error"});
                return;
            }
            if(this.curRow.MoState =='2'){
                this.$message({message: "當前頁數已是注銷狀態！",type: "error"});
                return;
            }
           await this.$confirm(`此操作將註銷頁數:${this.curRow.ProductMo},確定要進行此操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
               axios.post("CancelItem", {OcID:this.curRow.OcID, Ver:this.curRow.Ver, Seq:this.curRow.Seq}).then(
                        (response) => {
                            this.$set(this.tableData[this.curRow.index],'MoState','2');//更新表格標識
                            this.curRow.MoState ='2';//設置當前行臨時行的注銷狀態
                            this.isCancelItem = true;
                            this.cancelItemAmount = this.curRow.AmountProduct;
                            this.getTotalAmount();//重計算主檔總金額
                            this.isCancelItem = false;
                            this.cancelItemAmount = 0.00;
                            this.updateHeadAmount(); //保存主檔總金額
                        }
                    ).catch(function (response) {
                        alert(response);
                    });
            }).catch(()=>{})
        },//--end cancelItem
        setFormEditButtonStatus(blFlag){
            this.isRenderEditWindow = true;//渲染開關
            this.showDialog = blFlag;

            this.isItemSave = blFlag;
            this.isUpDown = !(blFlag);
            this.isReadonly = !(blFlag);
            this.isDisable = !(blFlag);
        },
        setCheckBoxStatus(){//設置CheckBox狀態
            if(this.formDetailData.IsFree =='1'){
                this.formDetailData.IsFree = true;
            }else{
                this.formDetailData.IsFree = false;
            }
            if(this.formDetailData.IsPrint =='1'){
                this.formDetailData.IsPrint=true;
            }else{
                this.formDetailData.IsPrint=false;
            }
        },
        checkHeadDataStatus(){
            if(this.isEditModeHead == true){
                this.$message({
                    showClose: true,
                    message: '當前操作無效,請首先保存主檔資料!',
                    type: 'warning'
                });
                this.canAddItem = false;
            }else{
                this.canAddItem = true;
            }
        },
        saveItem(){ //保存明細
            this.$refs["formDetail"].validate((valid) => {                        
                if (valid) {
                    if(this.formDetailData.MoState ==="2"){
                        this.$message.error('頁數為注銷狀態,當前操作無效!');
                        return;
                    }
                    if(this.formDetailData.IsFree != undefined){
                        if(this.formDetailData.IsFree === '0'  || this.formDetailData.IsFree == false ){
                            this.$set(this.formDetailData,'IsFree','0');
                        }else{
                            this.$set(this.formDetailData,'IsFree','1');
                        }
                    }else{
                        this.$set(this.formDetailData,'IsFree','0')
                        this.$set(this.tableData[this.curRowIndex],"IsFree",'0');//設置單元格的值
                    }                          

                    if(this.formDetailData.IsPrint != undefined){
                        if(this.formDetailData.IsPrint === '0'  || this.formDetailData.IsPrint == false ){
                            this.$set(this.formDetailData,'IsPrint','0');
                        }else{
                            this.$set(this.formDetailData,'IsPrint','1');
                        }
                    }else{
                        this.$set(this.formDetailData,'IsPrint','0')
                        this.$set(this.tableData[this.curRowIndex],"IsPrint",'0');//設置單元格的值
                    }                           
                    var updateParams = JSON.parse(JSON.stringify(this.formDetailData));
                    /*//TODO檢查頁數是否已存在
                    if(this.formDetailData.ActionType ==='NEW'){
                        axios.post("CheckMoIsRepeat", updateParams ).then(
                                (response) => {
                                    console.log( response);
                                    console.log( response.data);
                                    return;
                                    if(response.data !='OK'){
                                        this.$message.error('不可以添加重復的頁數,當前操作無效!');
                                        return; 
                                    }
                                }
                        ).catch(function (response) {
                            alert(response);
                            return;
                        });
                    }*/
                    //axios.post("AddList?OcID=" + this.formDetailData.OcID, updateParams ).then(//2021.10.21 CANCEL
                    axios.post("AddList", updateParams ).then(
                            (response) => {
                                this.showDialog = false;//關閉彈窗
                                this.isReadonly = true;//設置主表相關控件的只讀
                                this.isDisable = true;//設置主表相關下拉框控件禁用
                                this.forceRerender();//強制渲染CheckBox列.
                                //儲存主檔總金額
                                this.updateHeadAmount();
                            }
                    ).catch(function (response) {
                            alert(response);
                        });
                } else {
                    alert('請返回檢查數據的完整性!');
                    return false;
                }
                });
        },
        //新增,修改,刪除明細時更新主檔中的貨品總金額
        updateHeadAmount(){
            var updateHeadParams = JSON.parse(JSON.stringify(this.formHeadData));
            axios.post("UpdateHeadAmount", updateHeadParams ).then(
                (response) => {
                    this.$message({
                        message: "操作成功！",
                        type: "success",
                    });
                    this.searchDataSelect.OcID = this.formHeadData.OcID;
                    this.getDataHead();//重查刷新數據
                }
            ).catch(function (response) {
                alert(response);
            });
        },
        moveUp() {
            var index = this.curRowIndex;
            if(index > 0){
                var temp = this.tableData[index-1];
                this.curRowIndex = index-1;
                this.moveCurrentRow(temp);
            } else {
                this.curRowIndex = 0;
                this.$message('已經是第一條記錄!');
            }
        },
        moveDown() {
            var index = this.curRowIndex;
            if ((index+1) === this.tableData.length){
                this.curRowIndex = index;
                this.$message('已經是最后一條記錄!');
            } else {
                var temp = this.tableData[index+1];
                this.curRowIndex = index+1;
                this.moveCurrentRow(temp);
            }
        },
        moveCurrentRow(objRow){
            //跳轉至目的行
            this.$refs.elTable.bodyWrapper.scrollTop = this.$refs.elTable.bodyWrapper.scrollHeight;
            this.$refs.elTable.setCurrentRow(objRow);
            //目的行轉為Json格式賦值給formDetailData變量
            this.formDetailData =JSON.parse(JSON.stringify(objRow));
            this.setCheckBoxStatus();
        },
        openFindItem(){
            this.FindItemCurrentRow.ProductID = '';
            this.isRenderFindItem = true;//開始渲染查找貨品編碼頁面
            this.showDialogFindItem = true;
        },
        getFindItemData() {//查詢
            this.isLoading = true;
            var searchParams = {
                ProductID: this.findItem.ProductID,
                type: this.findItem.type
                //type:3
            };
            axios.get("/SalesOrder/FindItemReturnList", { params: searchParams }).then(
                (response) => {
                    this.tableTempList = [];
                    for (var i = 0; i < response.data.length; i++) {
                        this.tableTempList.push(response.data[i]);
                    }
                    this.fillData();
                    //this.tableDataFindItem = this.tableTempList;
                    //this.isLoading = false;
                },
                (response) => {
                    alert(response.status);
                }
            ).catch(function (response) {
                this.isLoading = false;
                alert(response);
            });
        },
        rowFindItemClick(row, event, column){
            //当点击任意一行时都会触发该事件
            this.FindItemCurrentRow.ProductID = row.ProductID;
            this.FindItemCurrentRow.ProductCdesc = row.ProductCdesc;
        },
        rowFindItemDoubleClick(){
            if(this.FindItemCurrentRow.ProductID !=''){
                this.formDetailData.ProductID = this.FindItemCurrentRow.ProductID;
                this.formDetailData.ProductCdesc = this.FindItemCurrentRow.ProductCdesc;
                this.showDialogFindItem = false;
            }
        },
        handleCurrentChange: function (val) {
            this.tablePage.currentPage = val;
            this.fillData();
        },
        handleSizeChange(val) {
            this.tablePage.pageSize = val;
        },
        fillData: function () {
            this.tableDataFindItem = [];
            this.tablePage.totalResult = this.tableTempList.length;
            this.tableDataFindItem = this.tableTempList.slice((this.tablePage.currentPage - 1) * this.tablePage.pageSize, this.tablePage.currentPage * this.tablePage.pageSize);
            this.isLoading = false;
        },
        onAreaChange(){
            var area = this.formHeadData.Area;
            if(area){
                this.getMaxiId(area);
            }
        },
        onForeignFirmBlur(el){
            var strId = el.target.value||''
            //val = val.toUpperCase();     
            //var strId = this.formDetailData.ForeignFirm;                                                    
            if(strId.length>0){
                axios.get("/BaseData/CheckForeignFirm?id=" + strId).then(
                    (response) => {
                        if(response.data.length>0){
                            this.$set(this.formDetailData, "ForeignFirm",response.data);
                        }else{
                            this.$message('洋行代碼不存在['+strId+']'+'不存在!');
                            el.target.value="";
                        }
                    }
                );
            }
        },
        onCustomerIDBlur(){
            if(this.isEditModeHead == false){
                return;
            }
            var customerId = this.formHeadData.CustomerID;
            if(customerId){
                axios.get("/SalesOrder/GetCustomer?strCustomerID=" + customerId).then(
                    (response) => {
                        if(response.data['Id'] !=""){
                            this.formHeadData.CustomerID = response.data['Id'];
                            this.formHeadData.CustomerCdesc = response.data['CustomerCdesc'];
                            this.formHeadData.CustomerEdesc = response.data['CustomerEdesc'];
                            this.formHeadData.CustomerAddress = response.data['CustomerAddress'];
                            this.formHeadData.SendAddress = response.data['SendAddress'];
                            this.formHeadData.CountryID = response.data['CountryID'];
                            this.formHeadData.Contacts = response.data['Contacts'];
                            this.formHeadData.ContactsTel = response.data['ContactsTel'];
                            this.formHeadData.ContactsFax = response.data['ContactsFax'];
                            this.formHeadData.ContactsEmail = response.data['ContactsEmail'];
                            this.formHeadData.CurrencyID = response.data['CurrencyID'];
                            this.formHeadData.CurrencyRate = response.data['CurrencyRate'];
                        }else{
                            alert("此客戶編碼不存在!");
                        }
                    }
                );
            }
        },
        onBrandBlur(){
            var brand = this.formDetailData.BrandID;
            if(brand.length>0){
                axios.get("/BaseData/CheckBrand?strBrand=" + brand).then(
                    (response) => {
                        if(response.data.length>0){
                            this.$set(this.formDetailData, "BrandID",response.data);
                        }else{
                            this.$message('牌子編碼['+brand+']'+'不存在!');
                            this.$set(this.formDetailData, "BrandID","");
                        }
                    }
                );
            }
        },
        onCurrencyIDChange(){
            var currencyId = this.formHeadData.CurrencyID;
            if(currencyId){
                axios.get("/SalesOrder/GetCurrencyRate?strCurrencyID="+currencyId).then(
                    (response) => {
                        this.formHeadData.CurrencyRate=response.data;
                    }
                );
            }
        },
        onOrderQtyBlur(){
            this.getAmountProduct();
        },
        onOrderUnit(){
            //change 触发事件onOrderUnit(event, item)
            this.getAmountProduct();
        },
        onPriceBlur(){
            this.getAmountProduct();
        },
        onPriceUnit(){
            this.getAmountProduct();
        },
        onRateDiscountBlur(){
            this.getAmountProduct();
        },
        onDiscountRateBlur(){
            if(this.isEditModeHead===false){
                return;
            }
            //主算主表總金額
            this.getTotalAmount();
        },
        onToUpperCaseBlur(el,elName,dataType){
            var val=el.target.value||''
            val = val.toUpperCase();
            el.target.value=val;
            if(dataType==1){
                this.$set(this.formHeadData, elName,val);
            }else{
                this.$set(this.formDetailData, elName,val);
            }
        },
        //計算明細金額
        getAmountProduct(){           
            if(this.dialogStatus == "byBrowse"){
                return;
            }                    
            //數量單位與單價單位相同直接相乘 RateDiscount,AmountDiscount
            var order_qty = this.formDetailData.OrderQty;
            order_qty = (order_qty==undefined || order_qty === "") ? 0 : order_qty;
            var price = this.formDetailData.Price;
            price = (price===undefined || price === "" || price<0) ? 0.00 : price;
            var order_unit = this.formDetailData.OrderUnit;
            var price_unit = this.formDetailData.PriceUnit;
            var rate_price = 1;
            var rate_order_qty = 1;
            var amount_product = 0.00,Total_Amount=0.00;
            var rate_discount = this.formDetailData.RateDiscount;
            rate_discount = (rate_discount===undefined || rate_discount === "" ) ? 0 : rate_discount;
            this.formDetailData.RateDiscount=rate_discount;
            var amount_discount=0;
            if(order_unit===price_unit){
                amount_product = parseFloat(order_qty * price).toFixed(2);
            }else{
                //轉成與單價相同單位
                amount_product = parseFloat((order_qty*SO.getRate(order_unit)/SO.getRate(price_unit)) * price).toFixed(2);
            }

            if(rate_discount>0){
                amount_discount = parseFloat(amount_product * (rate_discount / 100)).toFixed(2);
                amount_product = parseFloat(amount_product-amount_discount).toFixed(2);//parseFloat(amount_product*(1-rate_discount/100)).toFixed(2);
            }else{
                amount_discount = 0.00;
                rate_discount = 0;
            }
            this.formDetailData.AmountDiscount = amount_discount;
            this.formDetailData.AmountProduct = amount_product;
            //====以上為明細金額====

            //主表總金額,折扣額
            var Product_Amount = 0.00;
            var Disc_Amount = 0.00;
            var Disc_Rate = this.formHeadData.DiscountRate; //主表折扣率
            Disc_Rate = (Disc_Rate===undefined || Disc_Rate==="") ? 0 : parseFloat(Disc_Rate);
            //加總金額,但排除當前行(seq)
            Product_Amount = SO.getTotalAmountEdit(this.formHeadData.OcID, this.formHeadData.Ver, this.formDetailData.Seq);
            Product_Amount = parseFloat(Product_Amount).toFixed(2);

            //加上當前行時需考慮是否免費
            if ((this.formDetailData.IsFree === undefined) || (this.formDetailData.IsFree === false)) {
                //即不打勾代表收費
                Product_Amount = Number(Product_Amount) + Number(amount_product);//再加上當前值
            }
            if (Disc_Rate > 0) {
                Disc_Amount = parseFloat(Product_Amount * (Disc_Rate / 100)).toFixed(2);
                Total_Amount = Product_Amount - Disc_Amount;
            } else {
                Disc_Amount = 0;
            }
            this.formHeadData.Discount = Disc_Amount;
            this.formHeadData.ProductAmount = Product_Amount;
            this.formHeadData.TotalAmount = Total_Amount;
        },
        //更改主表匯率時計算總金額
        getTotalAmount(){
            //主檔總金額,折扣額            
            var Product_Amount = 0.00;
            var Total_Amount = 0.00;
            var Disc_Amount = 0;
            var Disc_Rate = this.formHeadData.DiscountRate;
            Disc_Rate = (Disc_Rate ===undefined || Disc_Rate ==="") ? 0 : parseFloat(Disc_Rate);
            //刪除明細中的頁數時,主檔總金額要扣除
            if(this.dialogStatus =="byDeleteItem"){
                this.formHeadData.ProductAmount = (this.formHeadData.ProductAmount - this.deleteItemAmount);
            }
            //注銷明細中的頁數時,主檔總金額要扣除           
            if(this.isCancelItem){
                this.formHeadData.ProductAmount = (this.formHeadData.ProductAmount - this.cancelItemAmount);
            }
            Product_Amount = this.formHeadData.ProductAmount;
            Product_Amount = (Product_Amount ===undefined || Product_Amount ==="") ? 0 : parseFloat(Product_Amount).toFixed(2);
            if (Disc_Rate > 0) {
                Disc_Amount = parseFloat(Product_Amount * (Disc_Rate / 100)).toFixed(2);
                Total_Amount = Product_Amount - Disc_Amount;
            } else {
                Disc_Amount = 0;
                Total_Amount = Product_Amount;
            }
            this.formHeadData.Discount = Disc_Amount;
            this.formHeadData.ProductAmount = Product_Amount;
            this.formHeadData.TotalAmount = Total_Amount;
        },
        //取最大單據編號
        getMaxiId(area){
            axios.get("/SalesOrder/GetMaxOcID?strArea=" + area).then(
                (response) => {
                    this.formHeadData.OcID = response.data;
                }
            );
        },
        //日期轉換
        dateChange(fieldDate){           
            var objDate = this.$refs[fieldDate].value;//生成日期對象:Fri Oct 15 2021 17:51:20 GMT+0800
            //--start是否日期對象,非日期對象時會出錯
            //是字串[object String], 是對象[object date]
            var res = Object.prototype.toString.call(objDate);
            if(res==="[object String]"){
                this.$set(this.searchFormData, fieldDate,"");
                return;
            }
            //--end
            var strDate = COMM.getDate(objDate,0);//轉成年月日字符串格式
            switch (fieldDate) {
                case "OrderDate": case "ReceivedDate":
                    this.$set(this.formHeadData, fieldDate,strDate);
                    if(fieldDate==='OrderDate'){
                        this.$set(this.formHeadData, 'ReceivedDate',strDate);
                    }
                    break;
                case "ArriveDate": case "FactoryShipOutDate": case "PlanCompleteDate": //匹配多個值
                    this.$set(this.formDetailData, fieldDate,strDate);
                    if(fieldDate==='ArriveDate'){
                        this.$set(this.formDetailData, "FactoryShipOutDate",COMM.getDate(objDate,3));
                    }
                    break;
                case "Order_Date": case "Received_Date":
                    if(fieldDate==='Order_Date'){
                        this.$set(this.searchFormData, 'OrderDate',strDate);
                    }
                    if(fieldDate==='Received_Date'){
                        this.$set(this.searchFormData, 'ReceivedDate',strDate);
                    }
                    break;
            }
        },
        onMoTypeChange(){
            this.getMoSerialNo();
        },
        onMoDeptChange(){
            this.getMoSerialNo();
        },
        onMoGroupChange(){
            this.getMoSerialNo();
        },
        getMoSerialNo(){//生成頁數
            var moType = this.formDetailData.MoType;  //当前combobox的值
            var moDept =  this.formDetailData.MoDept;
            var moGroup = this.formDetailData.MoGroup;
            if (moType > "" && moDept > "" && moGroup > "") {
                var searchParams = { strMoType: moType, strMoDept: moDept, strMoGroup: moGroup };
                axios.get("GetMoSerialNo",{ params: searchParams }).then(
                    (response) => {
                        this.formDetailData.ProductMo=response.data;
                    },
                    (response) => {
                        alert(response.status);
                    }
                ).catch(function (response) {
                    alert(response);
                });
            }
        },
        onIsFreeChange(){
            this.getAmountProduct();//重計算主檔中的金額
        },
        // 状态过滤
        formatStatus(val) {
            switch(val){
                case '0':
                    return '未批準';
                    break;
                case '1':
                    return '已批準';
                    break;
                case '2':
                    return '已注銷';
                    break;
                default:
                    return '未知';
                    break;
            }
        },
        forceRerender() {
            this.componentKey += 1;
        },
        ////隐藏表头**********
        //handerMethod({rowIndex}){
        //    if (rowIndex === 1) {
        //        //这里为了是将第二列的表头隐藏，就形成了合并表头的效果
        //        return {display: 'none'};
        //    }
        //},
        //將行索引放進row
        tableRowClassName({row, rowIndex}){
            row.index = rowIndex;
            //alert(rowIndex);
        },
        //******************

    }, // --end of methods
    mounted() {            
        this.tableHeight = $(parent.window).height()-(450+120);        
        let that = this; 
        window.onresize = () => {
            return (() => {
                that.tableHeight = $(parent.window).height()-(450+120);               
            })()
        };
    }   
    

} //--end of var vm

var app = new Vue(vm).$mount('#app');
Vue.prototype.$XModal = VXETable.modal;
//Vue.prototype.$utils = XEUtils;