var Main = {
    data() {
        return {
            selectTab: 'tab1',
            edit_mode: 0,
            showEdit: false,
            showCopy: false,
            showSearch: false,
            showSearchOc: false,
            selectRow: null,
            tablePlanDetails: [],
            tablePlanDetailsDel: [],
            tableOcDetaDel: [],
            editPlanDetails: {},
            prevEditPlanDetails: {},
			searchParasData:{
				ProductMoFrom:'',
				ProductMoTo:'',
				PlanDateFrom:'',
				PlanDateTo:'',
			},
			searchOcData:{
			    ProductMoFrom:'',
			    ProductMoTo:'',
			    OrderDateFrom:'',
			    OrderDateTo:'',
			},
			tablePlanHeadList: [],
			tableOcHeadList: [], 
            searchGoodsDetails: { GoodsID: '', },
            searchProductMo: '',
            loading3: false,
            searchLoading: false,
            //ArtImageUrl: '/Images/photo.png',
            //formData: {
            //    ProductMo: '',
            //    PlanDate: '',
            //    Ver: 0,
            //    OrderQty: 0,
            //    OrderUnit: '',
            //    CustomerID: '',
            //    RequestDate: '',
            //    DeliveryDate: '',
            //    GoodsID: '',
            //    ProductRemark: '',
            //    MoRemark: '',
            //    PlanRemark: '',
            //    ApprovedTime: '',
            //    ApprovedUser: '',
            //    CreateUser: '',
            //    CreateTime: '',
            //    AmendUser: '',
            //    AmendTime:'',
            //},
            formData: { 
                EditFlag: 1,
                ProductMo: '',
                PlanDate: '',
                Ver: 0,
                OrderQty: 0,
                OrderUnit: '',
                CustomerID: '',
                RequestDate: '',
                DeliveryDate: '',
                GoodsID: '',
                GoodsCname:'',
                ProductRemark: '',
                MoRemark: '',
                PlanRemark: '',
                ApprovedTime: '',
                ApprovedUser: '',
                CreateUser: '',
                CreateTime: '',
                AmendUser: '',
                AmendTime: '',
                ArtImageUrl: '',
                State:'0'
            },
            prevForm: {},
			copyData:{
				SourceType:'1',
				ProductMo:'',
			},
            editFormChanged: false, // 是否修改标识
            sexList: [
            { label: '', value: '' },
            { label: '女', value: '0' },
            { label: '男', value: '1' }
            ],
			QtyUnitList:[],
            wipList: [],
            name: '',
            sex: 1,
            date: '',
        }
    },
    created: function () {
        this.getWipID();
		this.getQtyUnit();
        //this.findList3();
    },
    methods: {
        showMsg() {
            //if (this.name.length >= 9)
            alert("ok");
            //var vl = value;
        },
        clickCopyEvent() {
            this.showCopy = true;
        },
		clickSearchEvent(){
			this.showSearch = true;
		},
		clickSearchOcEvent(){
		    this.showSearchOc = true;
		},
        addNew() {
            this.edit_mode = 1;
            nowDateTime = COMM.getCurrentDateTime();
            this.formData = {
                EditFlag: 1,
                ProductMo: '',
                PlanDate: COMM.getCurrentDate(),
                Ver: 0,
                OrderQty: 0,
                OrderUnit: 'PCS',
                CustomerID: '',
                RequestDate: '',
                DeliveryDate: '',
                GoodsID: '',
				GoodsCname:'',
                ProductRemark: '',
                MoRemark: '',
                PlanRemark: '',
                ApprovedTime: nowDateTime,
                ApprovedUser: '',
                CreateUser: '',
                CreateTime: nowDateTime,
                AmendUser: '',
                AmendTime: nowDateTime,
                ArtImageUrl: '',
                //ArtImageUrl: '/Images/photo.png',
                State:'0',
            };
            //深度複製一個對象，用來判斷數據是否有修改
            this.prevForm = JSON.parse(JSON.stringify(this.formData));
            this.tablePlanDetails = [];
        },
        productMoBlurEvent() {           
            if (this.formData.ProductMo === ""){
                return;
            }
            if (this.edit_mode === 1){
                this.getPlanFromOrder();
            }
        },
        searchByProductMo(_ProductMo) {            
            if(this.$utils.getSize(_ProductMo)===0){
                return;
            }
            this.edit_mode = 0,
            this.loading3 = true;
            setTimeout(() => {
                this.getPlanHead('S',_ProductMo);
                this.getPlanDetails('S',_ProductMo);
                this.loading3 = false;
            }, 500);

        },
		searchCellDBLClickEvent ({ row }) {
              this.SelectSearchMoEvent(row)
        },
		SelectSearchMoEvent(row){
			this.searchByProductMo(row.ProductMo);
			this.$refs.xModalSearch.close();
		},
		searchPlan(){
            //axios.get("GetGoodsDetails", { params: { goods_id: _id, } })//也可以將參數寫在這裡
			this.searchLoading=true;
		    axios.get("SearchPlan", 
                { params: { ProductMoFrom: this.searchParasData.ProductMoFrom,
		                    ProductMoTo:this.searchParasData.ProductMoTo,PlanDateFrom: this.searchParasData.PlanDateFrom,
		                    PlanDateTo:this.searchParasData.PlanDateTo } 
                }).then(
                    (response) => {
				        this.searchLoading=false;
				        this.tablePlanHeadList=response.data;
                    },
                    (response) => {
                        alert(response.status);
                    }
                ).catch(function (response) {
                    alert(response);
                });
		},
        getOcData(){            
		    this.searchLoading=true;
		    axios.get("SearchOcData", 
                { params: { ProductMoFrom: this.searchOcData.ProductMoFrom,ProductMoTo:this.searchOcData.ProductMoTo,
                            OrderDateFrom: this.searchOcData.OrderDateFrom,OrderDateTo:this.searchOcData.OrderDateTo } 
                }).then(
                    (response) => {
                        this.searchLoading=false;
                        this.tableOcHeadList=response.data;
                    },
                    (response) => {
                        alert(response.status);
                    }
                ).catch(function (response) {
                    alert(response);
                });
		},
        getPlanHead(IsUpdate,_ProductMo) {
            var _self = this;
            //axios.get("GetGoodsDetails", { params: { goods_id: _id, } })//也可以將參數寫在這裡
            axios.get("GetPlanHeadByMo", { params: { ProductMo: _ProductMo } }).then(
            (response) => {               
                //this.formData.ProductMo = response.data.ProductMo,
                //    this.formData.Ver = response.data.Ver,
                //    this.formData.PlanDate = response.data.PlanDate,
                //    this.formData.CustomerID = response.data.CustomerID,
                //    this.formData.GoodsID = response.data.GoodsID,
                //    this.formData.OrderQty = response.data.OrderQty,
                //    this.formData.OrderUnit = response.data.OrderUnit,
                //    this.formData.MoRemark = response.data.MoRemark,
                //    this.formData.PlanRemark = response.data.PlanRemark,
                //    this.formData.ProductRemark = response.data.ProductRemark
                //以下賦值方法簡潔些.                
                this.formData = {
                    ProductMo: response.data.ProductMo,
                    Ver: response.data.Ver,
                    PlanDate: response.data.PlanDate,
                    CustomerID: response.data.CustomerID,
                    GoodsID: response.data.GoodsID,
					GoodsCname:response.data.GoodsCname,
                    OrderQty: response.data.OrderQty,
                    OrderUnit: response.data.OrderUnit,
					RequestDate: response.data.RequestDate,
					DeliveryDate: response.data.DeliveryDate,
                    MoRemark: response.data.MoRemark,
                    PlanRemark: response.data.PlanRemark,
                    ProductRemark: response.data.ProductRemark,
                    ArtImageUrl: response.data.ArtImageUrl,
                    CreateUser: response.data.CreateUser,
                    CreateTime: response.data.CreateTime,
                    AmendUser: response.data.AmendUser,
                    AmendTime: response.data.AmendTime,
                    State:response.data.State,
                }
                if(IsUpdate=='S'){
                    //深度複製一個對象，用來判斷數據是否有修改
                    this.prevForm = JSON.parse(JSON.stringify(this.formData));
                    //var ImagePath = "/art/artwork/" + "AAAA/A888020.bmp";
                    //this.ArtImageUrl = ImagePath;
                }
                else
                {
                    this.formData.EditFlag=1;
                    this.formData.ProductMo='';
                    this.formData.Ver=0;
                    var nowDateTime = COMM.getCurrentDateTime();
                    this.PlanDate = COMM.getCurrentDate();
                    this.CreateTime = nowDateTime;
                    this.AmendTime = nowDateTime;
                }
            },
            (response) => {
                alert(response.status);
            }
        ).catch(function (response) {
            alert(response);
        });
        },
        getPlanDetails(IsUpdate,_ProductMo) {
            var _self = this;
            axios.get("GetPlanDetailsByMo", { params: { ProductMo: _ProductMo } }).then(
            (response) => {
                this.tablePlanDetails = response.data;
				if(IsUpdate=='U')
				{
					// for(int i=0;i<this.tablePlanDetails.length;i++)
					// {
						// var dtRow=this.tablePlanDetails[i];
						// dtRow.GoodsID='';
					// }
					
					this.tablePlanDetails.forEach((item,i) => {
						item.EditFlag = 1;
						item.ProductMo='';
						item.Ver=0;
						item.RequestDate='';
					})
				}
            },
            (response) => {
                alert(response.status);
            }
        ).catch(function (response) {
            alert(response);
        });
        },
        getPlanFromOrder() {                
                //var _self = this;
                //axios.get("GetGoodsDetails", { params: { goods_id: _id, } })//也可以將參數寫在這裡
                //axios.get("GetOrderByMo", { params: { ProductMo: _self.formData.ProductMo } }).then( 
                axios.get("GetOrderByMo", { params: { ProductMo: this.formData.ProductMo } }).then(
                (response) => { 
                    let rpData = response.data[0];                   
                    if(rpData){
                        this.formData.ProductMo = rpData.ProductMo,
                        this.formData.CustomerID = rpData.CustomerID,
                        this.formData.GoodsID = rpData.GoodsID,
                        this.formData.OrderQty = rpData.OrderQty,
                        this.formData.OrderUnit = rpData.OrderUnit,
                        this.formData.ProductRemark = rpData.ProductRemark,
                        this.formData.ArtImageUrl = rpData.ArtImageUrl,
                        this.tablePlanDetails = response.data
                    }else{
                        this.$XModal.alert({ content: `制單頁數【${this.formData.ProductMo}】并不存在!`,status: 'warning' , mask: false }); 
                        this.formData.ProductMo = "";
                    }
                },
                (response) => { 
                    alert(response.status);
                }
            ).catch(function (response) {
                alert(response);
            });
        },
        submitSearch() {

       },		
       insertEvent() { 
           if(this.formData){
               if(this.formData.State==="2"){
                   this.$XModal.alert({ content: '注銷狀態,當前操作無效！',status: 'warning' , mask: false });
                   return;
               }
               var $table = this.$refs.xTable1;
               var rowEndIndex = -1             
               var record = {
                   ProductMo: this.formData.ProductMo,
                   Ver: this.formData.Ver,
                   GoodsID: '',
                   GoodsCname: '',
                   RequestQty: '',
                   RequestDate: '',
                   WipID: '',
                   NextWipID: '',
                   EditFlag: 1,//allen add 2024/05/21
               }            
               //this.tablePlanDetails.push(record); //allen cancel 2024/05/22
               //await $table.setActiveCell(-1, 'GoodsID') //allen cancel 2024/05/22

               //--start allen 2024/05/21              
               this.tablePlanDetails.push(record);
               this.$set(this.formData, "EditFlag",1);//明細有插入,需設置主表更新標識
               $table.insertAt(record,rowEndIndex).then(({ row }) => {                  
                   $table.setCurrentRow(row);//當前行高亮
                   $table.setActiveCell(rowEndIndex, 'GoodsID');
               })             
               //--end 2024/05/21
           }else{
               this.$XModal.alert({ content: '請首先新增主檔資料!',status: 'warning' , mask: false }); 
           }
        },
        showInsertEvent() {
            this.editPlanDetails = {
                EditFlag: 0,
                ProductMo: this.formData.ProductMo,
                Ver: this.formData.Ver,
                GoodsID: '',
                GoodsCname: '',
                RequestQty: '',
                RequestDate: '',
                WipID: '',
                NextWipID: ''
            },
            this.selectRow = null
            this.showEdit = true

        },
        getWipID() {
            var _self = this;///Base/BaseData///, { params: { ProductMo: this.editPlanDetails.GoodsID } }
            axios.get("GetWipID").then(
                (response) => {
                    this.wipList = response.data;
                },
                (response) => {
                    alert(response.status);
                }
            ).catch(function (response) {
                alert(response);
            });
        },
		getQtyUnit() {
            var _self = this;///Base/BaseData///, { params: { ProductMo: this.editPlanDetails.GoodsID } }
            axios.post("/Base/BaseData/GetUnit?kind=05").then(
                (response) => {
                    this.QtyUnitList = response.data;
                },
                (response) => {
                    alert(response.status);
                }
            ).catch(function (response) {
                alert(response);
            });
        },
        updateEvent() {
            if(this.formData.State==='2')
            {
                this.$XModal.alert({ content: '注銷狀態,當前操作無效！',status: 'warning' , mask: false });
                return;
            }
            //this.showEdit = false
            //this.$XModal.message({ content: '保存成功', status: 'success' })
            //Object.assign(this.selectRow, this.tablePlanDetails)
            //return;
            if (this.selectRow) {
                //項目修改
                this.showEdit = false;
                //this.$XModal.message({ content: '保存成功', status: 'success' })
                for (let i in this.editPlanDetails) {
                    if (this.editPlanDetails[i] != this.prevEditPlanDetails[i]) {
                        this.editPlanDetails.EditFlag = 1;
                        this.formData.EditFlag = 1; //allen add 2024/05/23
                        break;
                    }
                }
                Object.assign(this.selectRow, this.editPlanDetails)
            } else {
                //項目新增
                this.editPlanDetails.EditFlag = 1;
                this.tablePlanDetails.push(this.editPlanDetails);
                this.formData.EditFlag = 1; //allen add 2024/05/23
                this.editPlanDetails = {
                    EditFlag: 0,
                    ProductMo: this.formData.ProductMo,
                    Ver: this.formData.Ver,
                    GoodsID: '',
                    GoodsCname: '',
                    RequestQty: '',
                    RequestDate: '',
                    WipID: '',
                    NextWipID: ''
                };
                this.selectRow = null;//allen add 2024/05/23
            }
        },
		tableGoodsIDChangeEvent(row){		   
			this.changeRowState(row);
		},
		tableWipIDChangeEvent(row){
			this.changeRowState(row);
		},
		tableNextWipIDChangeEvent(row){
			this.changeRowState(row);
		},
		tableRequestQtyChangeEvent(row){
			this.changeRowState(row);
		},
		tableRequestDateChangeEvent(row){
			this.changeRowState(row);
		},

		changeRowState(row){
		    row.EditFlag=1;
		    if(this.$utils.isEmpty(row.GoodsID)){
		        return;
		    }
		    let goods_id = row.GoodsID;
		    row.GoodsID=COMM.stringToUppercase(goods_id);  //row.GoodsID.toUpperCase();
		},
		tableGoodsIDBlurEvent(row){
		    if(row.GoodsID !=""){
		        this.getGoodsByID(row,row.GoodsID);
		    }
		},
		modalGoodsIDBlurEvent(){
		    if(this.editPlanDetails.GoodsID !=""){
		        this.getGoodsByID('modal',this.editPlanDetails.GoodsID);
		    }
		},
		formDataGoodsIDBlurEvent(){
		    if(this.formData.GoodsID !=""){
		        this.getGoodsByID('formData',this.formData.GoodsID);
		    }
		},
        getGoodsByID(row,val) {
            var GoodsCname ="";
            if(val ==="")
            {
                return;
            }
            if (this.editPlanDetails.GoodsID != "") {
                axios.get("GetGoodsByID", { params: { GoodsID: val } }).then(
                (response) => {
                    GoodsCname = response.data.goods_cname
                    let goodsID ="";
                    if(GoodsCname ===""){
                        if(row ==='modal'){      
                            goodsID = this.editPlanDetails.GoodsID;
                            this.editPlanDetails.GoodsID ='';
                            this.editPlanDetails.GoodsCname ='';
                        }
                        else{
                            if(row ==='formData'){  
                                goodsID = this.formData.GoodsID;
                                this.formData.GoodsID ='';
                                this.formData.GoodsCname ='';
                            }
                        }
                        this.$XModal.alert({ content: `物料編號不存在!【${goodsID}】`,status: 'warning' , mask: false });      
                        row.GoodsCname=''; 
                        //this.$refs.xTable1.setActiveCell(row, "GoodsID");
                    }else{
						if(row ==='modal')
							this.editPlanDetails.GoodsCname = GoodsCname;
						else if(row ==='formData')
							this.formData.GoodsCname = GoodsCname;
						else
							row.GoodsCname = GoodsCname;
					}
                },
                (response) => {
                    alert(response.status);
                }
            ).catch(function (response) {
                alert(response);
            });
            }
			
        },
		tablePlanDetailsCellDBLClickEvent ({ row }) {
            this.editRowEvent(row)
        },
        editRowEvent (row) {            
            this.editPlanDetails = {
                //EditFlag: 0, //allen cancel 2024/05/21               
                EditFlag: row.EditFlag, //allen add 2024/05/21
                GoodsID: row.GoodsID,
                GoodsCname: row.GoodsCname,
                RequestQty: row.RequestQty,
                RequestDate: row.RequestDate,
                WipID: row.WipID,
                NextWipID: row.NextWipID
            }            
            //深度複製一個對象，用來判斷數據是否有修改
            this.prevEditPlanDetails = JSON.parse(JSON.stringify(this.editPlanDetails));
            this.selectRow = row
            this.showEdit = true
        },
        saveEvent() {
            if(this.formData.State==='2')
            {
                this.$XModal.alert({ content: '注銷狀態,當前操作無效！',status: 'warning' , mask: false });
                return;
            }
            this.validData();//設置表頭是否要更改的標識EditFlag
            //--start allen 2024/05/29
            if(this.validDetails()==false){
                this.$XModal.alert({ content: '請返回檢查明細資料的有效性！',status: 'warning' , mask: false });                 
                return;
            }           
            //--end allen 2024/05/29
            var PlanHead = this.formData;            
            var PlanDetails = this.tablePlanDetails;
            var PlanDetailsDel = this.tablePlanDetailsDel;
            axios.post("SavePlan", { PlanHead, PlanDetails, PlanDetailsDel }).then(
            (response) => {
				if(response.data.Status=="0")
				{
					this.searchByProductMo(response.data.ReturnValue);
					this.SavePlan = {
						ProductMo: "",
					};
					this.$XModal.message({ content: '數據保存成功!', status: 'success' });
				}
				else
					alert(response.data.Msg);
            },
            (response) => {
                alert(response.status);
            }
            ).catch(function (response) {
               alert(response);
            });
        },
        cancelEvent() {
            if(this.formData.State==='2')
            {
                this.$XModal.alert({ content: '注銷狀態,當前操作無效！',status: 'warning' , mask: false });
                return;
            }
            let mo_id ="";
            let ver ="";
            if(this.formData){
                mo_id = this.formData.ProductMo;
                ver = this.formData.Ver;
            }  
            if(this.$utils.getSize(mo_id)===0){
                return;
            }
            this.$XModal.confirm('确定要注銷當前頁數計劃?').then(type => {
                if (type === "confirm") {  
                    axios.post("CancelPlan", { ProductMo: mo_id,Ver:ver}).then( (response) => {
                        if(response.data.Status==="0"){
                	        this.searchByProductMo(response.data.ReturnValue);					        
                	        this.$XModal.message({ content: '注銷成功!', status: 'success' });
                        }else{
                            alert(response.data.Msg);
                        }
                    }).catch(function (response){
                        alert(response);
                    });
                }
            })
        },
        validData() {            
            for (let i in this.formData) {
                if (this.formData[i] != this.prevForm[i]) {
                    this.formData.EditFlag = 1;
                    break;
                }
            }           
        },
        validDetails() {//明細資料的有效性檢查
            result = true;            
            var arrDetails = this.tablePlanDetails;
            if(arrDetails.length>0){
                for(var i=0; i<arrDetails.length;i++) {
                    if(this.$utils.isEmpty(arrDetails[i].GoodsID) || this.$utils.isEmpty(arrDetails[i].GoodsCname) ||
                        this.$utils.isEmpty(arrDetails[i].WipID) || this.$utils.isEmpty(arrDetails[i].NextWipID) ) {
                        result = false;
                        break;
                     }                         
                }
            }else{
                result = false;
            }
            return result;
        },
        async deleteEvent() {
            if(this.formData.State==='2')
            {
                this.$XModal.alert({ content: '注銷狀態,當前操作無效！',status: 'warning' , mask: false });
                return;
            }
            let $table = this.$refs.xTable1; 
            let selectRecords = $table.getCheckboxRecords();             
            if (selectRecords.length) {               
              await this.$XModal.confirm('确定要刪除當前選中的行?').then(type => {
                   if (type == "confirm") {  
                       this.tablePlanDetailsDel = [];               
                       selectRecords.forEach((item,i) => {                   
                           //因在勾選事件中已有判斷,這里選中的全都是完成數量是0的記錄
                           this.tablePlanDetailsDel.push(item); //將刪除的行對象加入數組 
                       })
                       $table.removeCheckboxRow();//移除選中的所有行對象 
                       this.formData.EditFlag = 1; //allen add 2024/05/23

                       //將數組中某一行對象刪除               
                       let arrPlan = this.tablePlanDetails;
                       let new_set = new Set(arrPlan);
                       let arr_del = this.tablePlanDetailsDel;
                       let new_arr = [];
                       for (let i = 0; i < arr_del.length; i++) {
                           new_set.delete(arr_del[i]);      
                       }
                       this.tablePlanDetails = [...new_set];
                   }
               })               
            } else {
                await this.$XModal.alert({ content: '請至少選擇一條數據！',status: 'warning' , mask: false });               
            }            
        },
        /*單選*/
        checkboxChange({ row }){            
            if(row.CompletedQty>0){
                this.$XModal.alert({ content: '已有完成數量,不可以刪除！',status: 'warning' , mask: false });
                let $table = this.$refs.xTable1;                
                $table.setCheckboxRow(row,false);//清除勾選               
            }
        },
        /*全選*/
        selectAllCheckboxChange(){            
            let $table = this.$refs.xTable1;
            let ary = $table.data;
            ary.forEach((rw,i) => {
                //已有完成數量,不可以勾選
                if(rw.CompletedQty>0){
                    $table.setCheckboxRow(rw,false);//清除勾選                    
                }                   
            })            
        },        
		printEvent(){                
            var url= "Print?ProductMo=" + this.formData.ProductMo;
            showMessageDialog(url,'Print',900,600,true);
        },
		copyMo(){
			if(this.copyData.SourceType=='1')
			{
				this.edit_mode = 0,
				this.loading3 = true;
				setTimeout(() => {
					this.getPlanHead('U',this.copyData.ProductMo);
					this.getPlanDetails('U',this.copyData.ProductMo);
					this.loading3 = false;
				}, 500);
			}

		},        
        setUpperCase(value){           
            value = COMM.stringToUppercase(value);
            //this.$set(this.selectRow, strField, value );
            return value;
		},
        /*OC轉生產計劃*/
        async convertToPlanEvent() {
            //if(this.formData.State==='2')
            //{
            //    this.$XModal.alert({ content: '注銷狀態,當前操作無效！',status: 'warning' , mask: false });
            //    return;
            //}
            let $table = this.$refs.xTableOc;
            let selectRecords = $table.getCheckboxRecords();
            if (selectRecords.length) {
                if(selectRecords.length>1){
                    this.$XModal.alert({ content: 'Only one piece of data can be selected at a time.\r\n(一次只能選擇一條數據!)', status: 'warning' });
                    return;
                }
                await this.$XModal.confirm('Are you sure you want to convert it to a planned order?\r\n(确定要轉換成計劃單?)').then(type => {
                    if (type == "confirm") {  
                        this.tableOcDetaDel = [];               
                        selectRecords.forEach((item,i) => {
                            //因在勾選事件中已有判斷,這里選中的全都是完成數量是0的記錄
                            this.tableOcDetaDel.push(item); //將刪除的行對象加入數組
                            this.generateOcData(item);
                        })
                        $table.removeCheckboxRow();//移除選中的所有行對象 
                        //this.formData.EditFlag = 1; //allen add 2024/05/23
                        ////將數組中某一行對象刪除               
                        let arrOc = this.tableOcHeadList;
                        let new_set = new Set(arrOc);//Set對象會自動去掉重復                       
                        let arr_del = this.tableOcDetaDel;  
                        let new_arr = [];
                        for (let i = 0; i < arr_del.length; i++) {
                            new_set.delete(arr_del[i]);      
                        }                        
                        this.tableOcHeadList = [...new_set];//set對象轉數組
                        this.showSearchOc = false;
                    }
                })               
            } else {
                await this.$XModal.alert({ content: 'Please select a piece of data.\r\n(請選擇一條數據!)',status: 'warning' , mask: false });               
            }            
        },
        generateOcData(item){
            //插入主檔
            this.addNew();
            this.formData.ProductMo = item.ProductMo;
            this.formData.OrderQty = item.OrderQty;
            this.formData.OrderUnit = item.OrderUnit;//是否是要轉成PCS?
            this.formData.CustomerID = item.CustomerID;
            this.formData.RequestDate = item.PlanCompleteDate;
            this.formData.DeliveryDate = item.ArriveDate;
            this.formData.GoodsID = item.ProductID;
            this.formData.GoodsCname = item.ProductCdesc;
            this.formData.ProductRemark = item.ProductRemark;
            this.formData.MoRemark = item.Remark;
            this.formData.CreateUser = "";
            this.formData.AmendUser = "";
            this.formData.ApprovedTime = null;

            //插入明細
            let unit = item.OrderUnit;
            let order_qty = 0;
            switch(unit){
                case (unit==='PCS' || unit==='SET'):
                    order_qty = item.OrderQty;
                    break;
                case unit==='GRS':
                    order_qty = item.OrderQty*144;
                    break;
                case unit==='DZ':
                    order_qty = item.OrderQty*12;
                    break               
                case unit==='K':
                    order_qty = item.OrderQty*1000;
                    break;
                case unit==='H':
                    order_qty = item.OrderQty*100;
                    break;
                case unit==='YDS':
                    order_qty = item.OrderQty;
                    break;
                case unit==='Litre':
                    order_qty = item.OrderQty;
                    break;
                default:
                    order_qty = item.OrderQty;
                    break;
            }
            var $table = this.$refs.xTable1;
            var rowEndIndex = -1;
            var record = {
                ProductMo: item.ProductMo,
                Ver: '0',
                GoodsID: item.ProductID,
                GoodsCname: '',
                RequestQty: order_qty,
                RequestDate: item.PlanCompleteDate,
                WipID: '',
                NextWipID: '',
                EditFlag: 1, //allen add 2024/05/21
            }
            this.tablePlanDetails.push(record);
            this.$set(this.formData, "EditFlag",1);//明細有插入,需設置主表更新標識
            $table.insertAt(record,rowEndIndex).then(({ row }) => {                  
                $table.setCurrentRow(row);//當前行高亮
                $table.setActiveCell(rowEndIndex, 'GoodsID');//設置焦點單元格
            })
        },
    },

    watch: {
        //// watch监听 判断是否修改        
        formData: {
           handler (val, oldVal) {
               // for (let i in this.formData) {
                   // if (val[i] != this.prevForm[i]) {
                       // this.editFormChanged = true;
                       // break;
                   // } else {
                       // this.editFormChanged = false;
                   // }
               // }
               // console.log(this.editFormChanged);
               let customer_id = this.formData.CustomerID;
               customer_id = COMM.stringToUppercase(customer_id)
               this.formData.CustomerID = customer_id;//this.formData.CustomerID.toUpperCase();
             
               let mo_id = this.formData.ProductMo;
               mo_id = COMM.stringToUppercase(mo_id)
               let good_id = this.formData.GoodsID;
               good_id = COMM.stringToUppercase(good_id);
               //this.formData.GoodsID = this.formData.GoodsID.toUpperCase(); //cancel 2024/06/07
               this.formData.ProductMo = mo_id;
               this.formData.GoodsID = good_id;
           },
           deep: true
        },
		editPlanDetails: {
		    handler (val, oldVal) {
		        let goodsid = this.editPlanDetails.GoodsID;
		        goodsid = COMM.stringToUppercase(goodsid);
		        this.editPlanDetails.GoodsID = goodsid;// this.editPlanDetails.GoodsID.toUpperCase();
           },
           deep: true
        }
    }
}

var app = new Vue(Main).$mount('#app');
Vue.prototype.$XModal = VXETable.modal;
Vue.prototype.$utils = XEUtils;