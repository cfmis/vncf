using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using VNCF.PSS.Web.Areas.Sales.Models;
using VNCF.PSS.Web.Areas.Sales.DAL;
using VNCF.PSS.Web.Common;
using System.IO;

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
            //构造成Json的格式传递
            //var result = new { iTotalRecords = 100, iTotalDisplayRecords = 10, data = list };
            if (!string.IsNullOrEmpty(model.OcID))
            {
                var list = SalesOrderDAL.GetOcDetailsByID(model.OcID);
                var result = new { total = list.Count, rows = list };
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        //返回SalesBom明細資料
        public JsonResult SalesBomList(SalesBom model)
        {
            //构造成Json的格式传递           
            if (!string.IsNullOrEmpty(model.OcID))
            {

                //var list = SalesOrderDAL.GetSalesBomByID(model.OcID,model.Ver,model.UpperSeq);
                //2021/03/12參數改為數據模型傳值
                var list = SalesOrderDAL.GetSalesBomByID(model);
                var result = new { total = list.Count, rows = list };
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(null, JsonRequestBehavior.AllowGet);
            }
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
            var result = new { rows = list };
            return Json(result, JsonRequestBehavior.AllowGet);
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
            var result = SalesOrderDAL.GetBuilOCID(model);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult EditHead(Order_Head model)
        {
            //string result = OrderDAL.UpdateOcHead(model);
            return View("Index");
        }
        public ActionResult DeleteList(string OcID, string Seq)
        {
            SalesOrderDAL.DeleteOcDetails(OcID, Seq);
            return Json("OK");
        }

        //更新主表
        [HttpPost]
        public ActionResult AddHead(Order_Head model)
        {
            string result = SalesOrderDAL.UpdateOcHead(model);
            return Json(result);
        }

        //更新明細
        [HttpPost]
        public ActionResult AddList(Order_Details model)
        {
            //listOrderInfo.Add(model);
            //var result = new { total = 100, rows = listOrderInfo };
            //return Json(result, JsonRequestBehavior.AllowGet);
            string OcID = Request["OcID"] == null ? "" : Request["OcID"].ToString();
            model.OcID = OcID;
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

       
        public ActionResult DeleteListSalesBom(string OcID,int Ver,string UpperSeq, string Seq)
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
            var result = new { rows = list };
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        public ActionResult GetOcHeadReturnList(Order_Head model)
        {
            var list = SalesOrderDAL.GetOcHeadReturnList(model);
            var result = new { rows = list };
            return Json(result, JsonRequestBehavior.AllowGet);
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

        //下拉列表框基礎信息,返回ID,Name
        public ActionResult GetBaseInfo(string strTableName)
        {
            //登入語言
            string lang = AdminUserContext.Current.LoginInfo.LanguageID;
            var result = SalesOrderDAL.GetBaseInfoReturnList(lang, strTableName);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //下拉列表框基礎信息,返回Name
        public ActionResult GetBaseInfoByName(string strTableName)
        {
            //登入語言
            string lang = AdminUserContext.Current.LoginInfo.LanguageID;
            var list = SalesOrderDAL.GetBaseInfoByNameReturnList(lang, strTableName);
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
            var result = SalesOrderDAL.GetCustomerByID(strCustomerID);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //返回當前服務器日期,時間
        public ActionResult GetDBDate()
        {
            var list = SalesOrderDAL.GetCurrentDateList();
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        //返回產品編號描述(返回單行兩列)
        public ActionResult GetProductID(string strProductID)
        {
            var result = SalesOrderDAL.GetProductByID(strProductID);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //前端以Json格式傳多個參數,控制器可以用model或與之對應的參數列表接收.
        public ActionResult GetMoSerialNo(string strMoType,string strMoDept,string strMoGroup)
        {
            var list = SalesOrderDAL.GetMoSerialNo(strMoType, strMoDept, strMoGroup);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Print()//(string ID)
        {
            //SoPrintHeadWithDetails model = new SoPrintHeadWithDetails();
            //model = SoDAL.PrintSo(ID);
            //if(model==null)
            //    return Content("No Order To Print~~");
            //return View(model);
            string ID = "731031556";
            string aspx = "/Areas/Sales/AspNetReports/Order.aspx?ID=" + ID;
            using (var sw = new StringWriter())
            {
                System.Web.HttpContext.Current.Server.Execute(aspx, sw, true);
                return Content(sw.ToString());
            }
            //return View();
        }

        
        //返回數量轉換率(返回字串,單個值也要轉JSON)
        public ActionResult GetQuantityUnitRate(string strID)
        {
            var list = SalesOrderDAL.GetQuantityUnitRateByID(strID);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        //返回明細表總金額
        public ActionResult GetTotalAmount(string strOcID,int Ver, string strSeq)
        {
            var list = SalesOrderDAL.GetTotalAmountByID(strOcID,Ver, strSeq);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        //返回BOM資料
        public JsonResult SalesBom(string OcID, int Ver)
        {
            //构造成Json的格式传递           
            if (!string.IsNullOrEmpty(OcID))
            {
                var list = SalesOrderDAL.GetSalesBomByID(OcID,Ver);
                var result = new { total = list.Count, rows = list };
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }



    }
}