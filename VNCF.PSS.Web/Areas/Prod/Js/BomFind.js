var Main = {
    data() {
        return {
            headerCellStyle:{background:'#F5F7FA',color:'#606266',height:'25px',padding:'2px'},
            curRowBom:null,
            curRow:null,         
            searchData:{ goods_id:'',goods_id_search:'',},
            formData: { type: '0001', blueprint_id: '', goods_id: '', goods_name: '', modality: '0', big_class: '', base_class: '', small_class: '', datum: '', size_id: '', results:1000 },
            tableResult: [],
            typeList: [{ label: '產品編碼規則 (0001)', value: '0001' }, { label: 'F0成品編碼 (0002)', value: '0002' }, { label: '採購雜項分類 (0003)', value: '0003' }],
            deptList: [{ label: '', value: '' }],
            bigClassList: [{ label: '', value: '' }],
            baseClassList: [{ label: '', value: '' }],
            smallClassList: [{ label: '', value: '' }],
            datumList:[{ label: '', value: '' }],           
            tableData:[],
			searchGoodsList:[],
            showPopup:false,
			showSearch:false,
			loadingStatusSearch:false,
            bomMostlyData: {
                id: '', goods_id: '', goods_name: '', goods_name_vn: '', spec: '', unit_code: '', do_color: '', dept_id: '', plate_effect: '', color_effect: '', remark: '',
                create_by:'',create_date:'',update_by:'',update_date:'',sanction_by:'',sanction_date:'',check_by:'',check_date:'',update_count:'',state:''},
            bomDetailData:[],
            tableHeight:350,
            heightTree:350,           

       } //return data
    },
    created: function () {
        this.getComboxList("DeptList");//部門
        //this.getComboxList("BigClass");//大類
        //this.getComboxList("BaseClass");//中類
        //this.getComboxList("SmallClass");//小類
        //this.getComboxList("Datum");//材質
    },
    methods: {
        //初始化下拉列表框
        getComboxList(SourceType) {
            axios.get("/Base/DataComboxList/GetComboxList?SourceType=" + SourceType).then(
                (response) => {
                    switch (SourceType) {
                        case "DeptList":
                            this.deptList = response.data;
                            break;
                        case "BigClass":
                            this.bigClassList = response.data;
                            break;
                        case "BaseClass":
                            this.baseClassList = response.data;
                            break;
                        case "SmallClass":
                            this.smallClassList = response.data;
                            break;
                        case "Datum":
                            this.datumList = response.data;
                            break;                        
                        default:
                            break
                    }
                },
                (response) => {
                    alert(response.status);
                }
            ).catch(function (response) {
                alert(response);
            });
        },
        findBomEvent(){       
            if(this.searchData.goods_id ===""){
                return;
            }
            if(this.searchData.goods_id.length<18){
                return;
            }
            let bom_id = this.searchData.goods_id + '001';            
            this.tableData=[]; 
            this.bomMostlyData={};
            this.bomDetailData=[];
            axios.get("GetBomStructure", { params: { BomId: bom_id } }).then(
              (response) => {
                  this.tableData = response.data ; //JSON.parse(JSON.stringify(response.data));
                  $table = this.$refs.bomTree;
                  this.$nextTick(() => $table.setAllTreeExpand(true));//展開所有節點
                  //this.$nextTick(() => $table.clearTreeExpand());//关闭所有树展开的節點setCurrentRow
              })
        },
        cellClickTreeEvent(row){           
            this.curRowBom = row.data[row.$rowIndex];
            let goods_id = this.curRowBom.goods_id;           
            if(goods_id){
                if(goods_id.substring(1,2) !='ML'){
                    let bomId = this.curRowBom.goods_id+'001';
                    this.getBomMostly(bomId);
                    this.getBomDetails(bomId);
                }
            }
        },
        cellClickEvent(row){
            this.curRow = row.data[row.$rowIndex];//row.$rowIndex是行索引
            let bom_id = this.curRow.goods_id + '001';            
            this.tableData =[];
            axios.get("GetBomStructure", { params: { BomId: bom_id } }).then(
              (response) => {
                  this.tableData = response.data ; //JSON.parse(JSON.stringify(response.data));
                  $table = this.$refs.bomTree;
                  this.$nextTick(() => $table.setAllTreeExpand(true));//展開所有節點
                  //this.$nextTick(() => $table.clearTreeExpand());//关闭所有树展开的節點
            })
        },
        getBomMostly(bom_id){
            axios.get("GetBomMostly", { params: { BomId: bom_id } }).then(
              (res) => { 
                  this.bomMostlyData = {
                      id: res.data.id,
                      goods_id: res.data.goods_id,
                      goods_name: res.data.goods_name,
                      goods_name_vn: res.data.goods_name_vn,
                      spec: res.data.spec,
                      unit_code: res.data.unit_code,
                      do_color: res.data.do_color,
                      dept_id: res.data.dept_id,
                      plate_effect: res.data.plate_effect,
                      color_effect: res.data.color_effect,
                      remark: res.data.remark,
                      create_by: res.data.create_by,
                      update_by: res.data.update_by,
                      sanction_by: res.data.sanction_by,
                      check_by: res.data.check_by,
                      update_count: res.data.update_count,
                      create_date: res.data.create_date,
                      update_date: res.data.update_date,
                      check_date: res.data.check_date,
                      sanction_date:res.data.sanction_date,
                      state: res.data.state
                  }
              })
        },
        getBomDetails(bom_id){
             axios.get("GetBomDetails", { params: { BomId: bom_id } }).then(
              (response) => {
                  this.bomDetailData = [];
                  this.bomDetailData = response.data ;
              })
        },
		showSearchEvent(){
			this.showSearch=true;
		},
		searchGoodsEvent(){
			this.loadingStatusSearch = true;
			var searchGoodsParams={
                            goods_id:this.searchData.goods_id_search,
                            pageSize:50,
                            status:[1,3]
                        };
                    var _self = this;
                    _self.searchGoodsList = [];

            axios.get("SearchGoods", { params: searchGoodsParams }).then(
                        (response) => {
                            _self.searchGoodsList=response.data;
                            this.loadingStatusSearch = false;
                            //debugger;
                            //_self.fillData();
                        },
                        (response) => {
                            alert(response.status);
                        }
                    ).catch(function (response) {
                        alert(response);
                    });
		},
		searchCellDBLClickEvent ({ row }) {
			this.searchData.goods_id=row.goods_id;
			this.findBomEvent();
			this.$refs.xModalSearch.close();
        },
    },

    watch: {
        //watch监听 判断是否修改
        searchData: {
            handler (val, oldVal) {              
                this.searchData.goods_id = this.searchData.goods_id.toUpperCase();                
            },
            deep: true
        },		
        formData: {
           handler (val, oldVal) {              
               this.formData.goods_id = this.formData.goods_id.toUpperCase();
               this.formData.blueprint_id = this.formData.blueprint_id.toUpperCase();
           },
           deep: true
        },		
    },
    mounted() {   
          let that = this;          
          let whead = $('#divHeader').width();
          $('#divHeader').width(whead)
          $('#divGrid').width(whead);          
          let heightUp = $('#divUp').height();
          this.heightTree = $(parent.window).height() - heightUp - 100;
          let heightHead = $('#divHeader').height();
          this.tableHeight = $(parent.window).height() - heightUp - heightHead - 100;
          window.onresize = () => {
              return (() => {                  
                  $('#divGrid').width(whead);                 
                  this.tableHeight = $(parent.window).height() - heightUp - heightHead - 100;
                  this.heightTree = $(parent.window).height() - heightUp - 100;
              })()
          };
      }
}


var app = new Vue(Main).$mount('#app');
Vue.prototype.$XModal = VXETable.modal;
Vue.prototype.$utils = XEUtils;
