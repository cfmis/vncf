using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using VNCF.PSS.Web.Areas.Sales.Models;
using VNCF.PSS.Web.Areas.Sales.DAL;
using VNCF.PSS.Web.Common;
//using Microsoft.Reporting.WebForms;
using FastReport.Web;


namespace VNCF.PSS.Web.Areas.Sales.Controllers
{
    public class SalesOrderController : AdminControllerBase //Controller
    {
        // GET: Sales/SalesOrder
        public ActionResult Index()
        {
            //ViewData存儲標簽翻譯數據
            //ViewData = Factory.GenWebFormElement().getViewData("Sales.Order.Index");
            ViewData["user_id"] = AdminUserContext.Current.LoginInfo.LoginName;
            return View();
        }

        //返回明細資料
        public JsonResult List(Order_Head model)
        {
            ////构造成Json的格式传递
            ////var result = new { iTotalRecords = 100, iTotalDisplayRecords = 10, data = list };
            //if (!string.IsNullOrEmpty(model.OcID))
            //{
            //    var list = SalesOrderDAL.GetOcDetailsByID(model.OcID);
            //    var result = new { total = list.Count, rows = list };
            //    return Json(result, JsonRequestBehavior.AllowGet);
            //}
            //else
            //{
            //    return Json(null, JsonRequestBehavior.AllowGet);
            //}

            var list = SalesOrderDAL.GetOcDetailsByID(model.OcID);
            return Json(list, JsonRequestBehavior.AllowGet);


        }

        //返回SalesBom明細資料
        public JsonResult SalesBomList(SalesBom model)
        {
            //构造成Json的格式传递

            //if (!string.IsNullOrEmpty(model.OcID))
            //{
            //    //var list = SalesOrderDAL.GetSalesBomByID(model.OcID,model.Ver,model.UpperSeq);
            //    //2021/03/12參數改為數據模型傳值
            //    var list = SalesOrderDAL.GetSalesBomByID(model);
            //    var result = new { total = list.Count, rows = list };
            //    return Json(result, JsonRequestBehavior.AllowGet);
            //}
            //else
            //{
            //    return Json(null, JsonRequestBehavior.AllowGet);
            //}

            var list = SalesOrderDAL.GetSalesBomByID(model);
            return Json(list, JsonRequestBehavior.AllowGet);
        }


        public ActionResult Create()
        {
            return View("Edit");
        }
        public ActionResult Find()
        {
            return View();
        }

        public ActionResult EditSalesBom()
        {
            return View();
        }

        public ActionResult FindItem()
        {
            return View();
        }

        public ActionResult FindItemReturnList(string ProductID, string type)
        {
            var list = SalesOrderDAL.FindItemReturnList(ProductID, type);
            //var result = new { rows = list };
            //return Json(result, JsonRequestBehavior.AllowGet);//2021.09.27 CANCEL
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public ActionResult ImportOrder()
        {
            return View();
        }
        //查詢GEO採購數據
        public ActionResult ImportOrderReturnList(PurchaseInfo model)
        {
            var list = SalesOrderDAL.ImportOrderFromGeo(model);
            var result = new { rows = list };
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //后臺生成OC數據
        public ActionResult BuildOrder(PurchaseInfo model)
        {
            var result = SalesOrderDAL.GetBuildOCID(model);
            return Json(result, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        public ActionResult EditHead(Order_Head model)
        {
            //string result = OrderDAL.UpdateOcHead(model);
            return View("Index");
        }
        public ActionResult DeleteList(string OcID, int Ver, string Seq)
        {
            string result = SalesOrderDAL.DeleteOcDetails(OcID, Ver, Seq);
            //return Json("OK");
            if (result == "")
                return Json("OK");
            else
                return Json("Error");
        }


        //注銷頁數
        [HttpPost]
        public ActionResult CancelItem(string OcID, int Ver, string Seq)
        {
            string result = SalesOrderDAL.CancelOcDetails(OcID, Ver, Seq);
            if (result == "")
                return Json("OK");
            else
                return Json("Error");
        }
        //更新主表
        [HttpPost]
        public ActionResult AddHead(Order_Head model)
        {
            string result = SalesOrderDAL.UpdateOcHead(model);
            return Json(result);
        }
        //更新主表金額2021.10.19新增
        [HttpPost]
        public ActionResult UpdateHeadAmount(Order_Head model)
        {
            string result = SalesOrderDAL.UpdateHeadAmountByID(model);
            return Json(result);
        }

        //更新明細
        [HttpPost]
        public ActionResult AddList(Order_Details model)
        {
            //listOrderInfo.Add(model);
            //var result = new { total = 100, rows = listOrderInfo };
            //return Json(result, JsonRequestBehavior.AllowGet);

            //===CANCEL old Code 2021.10.20
            //string OcID = (Request["OcID"] == null) ? "" : Request["OcID"].ToString();
            //model.OcID = OcID;           
            string result = SalesOrderDAL.UpdateOcDetails(model);
            if (result == "")
                return Json("OK");
            else
                return Json("Error");
        }

        //更新SalesBOM
        [HttpPost]
        public ActionResult AddSalesBom(SalesBom model)
        {
            //listOrderInfo.Add(model);
            //var result = new { total = 100, rows = listOrderInfo };
            //return Json(result, JsonRequestBehavior.AllowGet);
            //string OcID = Request["OcID"] == null ? "" : Request["OcID"].ToString();
            //model.OcID = OcID;
            string result = SalesOrderDAL.UpdateSalesBom(model);
            if (result == "")
                return Json("OK");
            else
                return Json("Error");
        }

        public ActionResult DeleteListSalesBom(string OcID, int Ver, string UpperSeq, string Seq)
        {
            string result = SalesOrderDAL.DeleteSalesBomByID(OcID, Ver, UpperSeq, Seq);
            if (result == "")
                return Json("OK");
            else
                return Json("Error");
        }

        public ActionResult GetOcHead(string OcID)
        {
            var list = SalesOrderDAL.GetOcHeadByID(OcID);
            //var result = new { rows = list };//2021/09/12 cancel
            //return Json(result, JsonRequestBehavior.AllowGet);//2021/09/12 cancel
            return Json(list, JsonRequestBehavior.AllowGet);
        }
      
        public ActionResult GetOcHeadReturnList(Order_Head model)
        {
            var list = SalesOrderDAL.GetOcHeadReturnList(model);
            //var result = new { rows = list };
            //return Json(result, JsonRequestBehavior.AllowGet);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetQtyUnit()//數量單位
        {
            var list = SalesOrderDAL.GetQtyUnitReturnList();
            return Json(list);
        }

        //綁定值測試代碼
        public ActionResult GetClass()//數量單位
        {
            var list = SalesOrderDAL.GetQtyUnitReturnList();
            return Json(list);
        }

        //取最大單號
        public ActionResult GetMaxOcID(string strArea)
        {
            var result = SalesOrderDAL.GetMaxOcID(strArea);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //返回匯率(返回字串,單個值也要轉JSON)
        public ActionResult GetCurrencyRate(string strCurrencyID)
        {
            var list = SalesOrderDAL.GetCurrencyRateByID(strCurrencyID);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        //返回客戶中英文描述(返回單行兩列)
        public ActionResult GetCustomer(string strCustomerID)
        {
            //var result = SalesOrderDAL.GetCustomerByID(strCustomerID);//2021/10/12 cancel
            var result = SalesOrderDAL.GetCustomerInfoByID(strCustomerID);//2021/10/12 add
            return Json(result, JsonRequestBehavior.AllowGet);
        }


        //返回產品編號描述(返回單行兩列)
        public ActionResult GetProductID(string strProductID)
        {
            var result = SalesOrderDAL.GetProductByID(strProductID);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //前端以Json格式傳多個參數,控制器可以用model或與之對應的參數列表接收.
        public ActionResult GetMoSerialNo(string strMoType, string strMoDept, string strMoGroup)
        {
            var list = SalesOrderDAL.GetMoSerialNo(strMoType, strMoDept, strMoGroup);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        //public ActionResult Print()//(string ID)
        //{
        //    //SoPrintHeadWithDetails model = new SoPrintHeadWithDetails();
        //    //model = SoDAL.PrintSo(ID);
        //    //if(model==null)
        //    //    return Content("No Order To Print~~");
        //    //return View(model);
        //    string ID = "731031556";
        //    string aspx = "/Areas/Sales/AspNetReports/Order.aspx?ID=" + ID;
        //    using (var sw = new StringWriter())
        //    {
        //        System.Web.HttpContext.Current.Server.Execute(aspx, sw, true);
        //        return Content(sw.ToString());
        //    }
        //    //return View();
        //}


        //返回數量轉換率(返回字串,單個值也要轉JSON)
        public ActionResult GetQuantityUnitRate(string strID)
        {
            var list = SalesOrderDAL.GetQuantityUnitRateByID(strID);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        //返回明細表總金額
        public ActionResult GetTotalAmount(string strOcID, int Ver, string strSeq)
        {
            var list = SalesOrderDAL.GetTotalAmountByID(strOcID, Ver, strSeq);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        //返回BOM資料
        public JsonResult SalesBom(string OcID, int Ver)
        {
            ////构造成Json的格式传递           
            //if (!string.IsNullOrEmpty(OcID))
            //{
            //    var list = SalesOrderDAL.GetSalesBomByID(OcID,Ver);
            //    var result = new { total = list.Count, rows = list };
            //    return Json(result, JsonRequestBehavior.AllowGet);
            //}
            //else
            //{
            //    return Json(null, JsonRequestBehavior.AllowGet);
            //}

            var list = SalesOrderDAL.GetSalesBomByID(OcID, Ver);           
            return Json(list, JsonRequestBehavior.AllowGet);


        }

        ////Print
        //public ActionResult Report(string ID)
        //{
        //    //ReportViewerMVC方式

        //    var list = SalesOrderDAL.GetReportReturnList("ECO210413003");

        //    var list = SalesOrderDAL.GetReportReturnList("ECO210413003");            
        //    ReportViewer rpv = new ReportViewer();//建立ReportViewer物建           
        //    rpv.ProcessingMode = ProcessingMode.Local; //設定處理模式
        //    rpv.SizeToReportContent = true;
        //    //rpv.ZoomMode = FullPage;//rpv.AsyncRendering = false//rpvZoomMode = FullPage
        //    //設定RDLC實體位置
        //    rpv.LocalReport.ReportPath = $"{Request.MapPath(Request.ApplicationPath)}Areas\\Sales\\RDLCReports\\So.rdlc";
        //    //設定報表資料來源

        //    rpv.LocalReport.DataSources.Add(new ReportDataSource("ReportDataSource1", list));

        //    return View(rpv);
        //}

        private WebReport webReport = new WebReport();
        public ActionResult PrintFastReport(string ID)
        {
            //var report_path = Server.MapPath("/Reports/so.frx");
            //return Json(report_path, JsonRequestBehavior.AllowGet);

            //SetReport();
            //webReport.Width = 1024;
            //webReport.Height = 800;
            //webReport.ToolbarIconsStyle = ToolbarIconsStyle.Black;
            //ViewBag.WebReport = webReport;
            return View();
        }

        private void SetReport()
        {
            var list = SalesOrderDAL.GetReportReturnList("ECO210413003");
            //string report_path = AppDomain.CurrentDomain.BaseDirectory;
            //webReport.ReportFile = this.Server.MapPath("~/App_Data/report.frx"); //从文件中加载报表
            //string report_path = $"{Request.MapPath(Request.ApplicationPath)}Reports\\so.frx";//"~/Reports/so.frx";// 
            string report_path = Server.MapPath("/Reports/so.frx");
            //传递数据
            webReport.Report.RegisterData(list, "SoData");
            //调用模板
            webReport.Report.Load(report_path);
        }      

        //    rpv.LocalReport.DataSources.Add(new ReportDataSource("ReportDataSource1", list)); 
        //    return View(rpv);
        //}
      
        public ActionResult Print(string ID)
        {            
            //string report_path = AppDomain.CurrentDomain.BaseDirectory;
            //webReport.ReportFile = this.Server.MapPath("~/App_Data/so.frx"); //从文件中加载报表
            string report_path = $"{Request.MapPath(Request.ApplicationPath)}Reports\\so.frx";
            var list = SalesOrderDAL.GetReportReturnList(ID);
            WebReport webReport = new WebReport();
            webReport.Report.RegisterData(list, "SoData");//注冊數據
            webReport.Report.Load(report_path);//調用報表模板
            webReport.Width = 1024;
            webReport.Height = 800;
            webReport.ToolbarIconsStyle = ToolbarIconsStyle.Black;
            ViewBag.WebReport = webReport;
            return View();
        }


    }


}

        
