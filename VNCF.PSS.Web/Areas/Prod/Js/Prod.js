var Main = {
    data() {
        return {
            selectTab: 'tab1',
            edit_mode: 0,
            showEdit: false,
            showCopy: false,
            selectRow: null,
            tablePlanDetails: [],
            editPlanDetails: {},
            prevEditPlanDetails: {},
            searchGoodsDetails: { GoodsID: '', },
            searchProductMo: '',
            loading3: false,
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
            formData: {},
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
        showCopyModal() {
            this.showCopy = true;
        },
        addNew() {
            this.edit_mode = 1;
            nowDateTime = comm.getCurrentDateTime();
            this.formData = {
                EditFlag: 1,
                ProductMo: '',
                PlanDate: comm.getCurrentDate(),
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
                ArtImageUrl: '/Images/photo.png',
            };
            //深度複製一個對象，用來判斷數據是否有修改
            this.prevForm = JSON.parse(JSON.stringify(this.formData));
        },
        productMoBlurEvent() {
            if (this.formData.ProductMo == "")
                return;
            if (this.edit_mode == 1)
                this.getPlanFromOrder();
        },
        searchByProductMo(_ProductMo) {
            this.edit_mode = 0,
            this.loading3 = true;
            setTimeout(() => {
                this.getPlanHead('S',_ProductMo);
                this.getPlanDetails('S',_ProductMo);
                this.loading3 = false;
            }, 500);

        },
        async getPlanHead(IsUpdate,_ProductMo) {
            var _self = this;
            //axios.get("GetGoodsDetails", { params: { goods_id: _id, } })//也可以將參數寫在這裡
            await axios.get("GetPlanHeadByMo", { params: { ProductMo: _ProductMo } }).then(
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
                }
				if(IsUpdate=='S')
                //深度複製一個對象，用來判斷數據是否有修改
                this.prevForm = JSON.parse(JSON.stringify(this.formData));
                //var ImagePath = "/art/artwork/" + "AAAA/A888020.bmp";
                //this.ArtImageUrl = ImagePath;
				else
				{
					this.formData.EditFlag=1;
					this.formData.ProductMo='';
					this.formData.Ver=0;
					var nowDateTime = comm.getCurrentDateTime();
					this.PlanDate = comm.getCurrentDate();
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
            var _self = this;
            //axios.get("GetGoodsDetails", { params: { goods_id: _id, } })//也可以將參數寫在這裡
            axios.get("GetOrderByMo", { params: { ProductMo: _self.formData.ProductMo } }).then(
            (response) => {
				var rpData=response.data[0];
                this.formData.ProductMo = rpData.ProductMo,
                this.formData.CustomerID = rpData.CustomerID,
                this.formData.GoodsID = rpData.GoodsID,
                this.formData.OrderQty = rpData.OrderQty,
                this.formData.OrderUnit = rpData.OrderUnit,
                this.formData.ProductRemark = rpData.ProductRemark,
                this.formData.ArtImageUrl = rpData.ArtImageUrl,
                this.tablePlanDetails = response.data
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
		async insertEvent (row) {
              const $table = this.$refs.xTable
              const record = {
				ProductMo: this.formData.ProductMo,
				Ver: this.formData.Ver,
                GoodsID: '',
				GoodsCname: '',
                RequestQty: '',
                RequestDate: '',
                WipID: '',
                NextWipID: '',
              }
              //const { row: newRow } = await $table.insertAt(record, row)
              this.tablePlanDetails.push(record);
              await $table.setActiveCell(row, 'GoodsID')
            },
        showInsertEvent () {
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
            //this.showEdit = false
            //this.$XModal.message({ content: '保存成功', status: 'success' })
            //Object.assign(this.selectRow, this.tablePlanDetails)
            //return;
            if (this.selectRow) {
                this.showEdit = false
                //this.$XModal.message({ content: '保存成功', status: 'success' })
                for (let i in this.editPlanDetails) {
                    if (this.editPlanDetails[i] != this.prevEditPlanDetails[i]) {
                        this.editPlanDetails.EditFlag = 1;
                        break;
                    }
                }
                Object.assign(this.selectRow, this.editPlanDetails)
            } else {
                this.editPlanDetails.EditFlag = 1;
                this.tablePlanDetails.push(this.editPlanDetails);
                //this.editPlanDetails = {};
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
			row.GoodsID=row.GoodsID.toUpperCase();
		},
		tableGoodsIDBlurEvent(row){
			if(row.GoodsID!="")
				this.getGoodsByID(row,row.GoodsID);
		},
		modalGoodsIDBlurEvent(){
			if(this.editPlanDetails.GoodsID!="")
				this.getGoodsByID('modal',this.editPlanDetails.GoodsID);
		},
		formDataGoodsIDBlurEvent(){
			if(this.formData.GoodsID!="")
				this.getGoodsByID('formData',this.formData.GoodsID);
		},
        getGoodsByID(row,val) {
			var GoodsCname="";
            if (this.editPlanDetails.GoodsID != "") {
                axios.get("GetGoodsByID", { params: { GoodsID: val } }).then(
                (response) => {
                    GoodsCname = response.data.goods_cname
					if(GoodsCname=="")
					{
						if(row=='modal')
							this.editPlanDetails.GoodsCname='';
						else if(row=='formData')
							this.formData.GoodsCname='';
						else
							row.GoodsCname='';
						alert("物料編號不存在!");
					}
					else
					{
						if(row=='modal')
							this.editPlanDetails.GoodsCname=GoodsCname;
						else if(row=='formData')
							this.formData.GoodsCname=GoodsCname;
						else
							row.GoodsCname=GoodsCname;
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
        editRowEvent (row) {
            this.editPlanDetails = {
                EditFlag: 0,
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
            this.validData();
            var PlanHead = this.formData;
            var PlanDetails = this.tablePlanDetails;
            axios.post("SavePlan", { PlanHead, PlanDetails }).then(
            (response) => {
				if(response.data.Status=="0")
				{
					this.searchByProductMo(response.data.ReturnValue);
					this.SavePlan = {
						ProductMo: "",
					};
					alert("更新成功!");
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
        validData() {
            for (let i in this.formData) {
                if (this.formData[i] != this.prevForm[i]) {
                    this.formData.EditFlag = 1;
                    break;
                }
            }
        },
        deleteEvent() {
            let selectRecords = this.$refs.xTable.getCheckboxRecords()
            if (selectRecords.length) {
                this.$refs.xTable.removeCheckboxRow()
            } else {
                alert('请至少选择一条数据！')
                //this.$xDetails.message({ content: 'warning 提示框', status: 'warning' })
            }
        },
		printEvent(){
                //TODO
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

		}
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
			   this.formData.CustomerID=this.formData.CustomerID.toUpperCase();
			   this.formData.GoodsID=this.formData.GoodsID.toUpperCase();
           },
           deep: true
        },
		editPlanDetails: {
           handler (val, oldVal) {
			   this.editPlanDetails.GoodsID=this.editPlanDetails.GoodsID.toUpperCase();
           },
           deep: true
        }
    }
}

var app = new Vue(Main).$mount('#app');
