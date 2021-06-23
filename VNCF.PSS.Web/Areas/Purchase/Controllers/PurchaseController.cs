using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using VNCF.PSS.Web.Areas.Purchase.DAL;
using VNCF.PSS.Web.Areas.Purchase.Models;
using VNCF.PSS.Web.Areas.Sales.DAL;
using VNCF.PSS.Web.Common;

namespace VNCF.PSS.Web.Areas.Purchase
{
    public class PurchaseController : AdminControllerBase
    {
        // GET: Purchase/Purchase
        public ActionResult Index()
        {
            ViewData["user_id"] = AdminUserContext.Current.LoginInfo.LoginName;
            return View();
        }

        public ActionResult FindItem()
        {
            return View();
        }

        public ActionResult FindOtherFareItem()
        {
            return View();
        }

        //返回明細資料
        public JsonResult List(BuyHead model)
        {          
            var list = PurchaseDAL.GetBuyDetailsByID(model.ID);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetBuyHead(string ID)
        {
            var list = PurchaseDAL.GetBuyHeadByID(ID);
            //var result = new { rows = list };
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Find()
        {
            return View();
        }

        public ActionResult DeleteList(string ID, int Ver, string Seq)
        {
            PurchaseDAL.DeleteBuyDetails(ID, Ver, Seq);
            return Json("OK");
        }

        //返回附加費明細資料
        public JsonResult GetOtherFareList(BuyFare model)
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
            //    return Json(null, JsonRequestBehavior.AllowGet);L
            //}
            var list = PurchaseDAL.GetOtherFareByID(model);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public ActionResult EditOtherFare()
        {
            return View();
        }

        //返回匯率(返回字串,單個值也要轉JSON)
        public ActionResult GetCurrencyRate(string strCurrencyID)
        {
            var list = SalesOrderDAL.GetCurrencyRateByID(strCurrencyID);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetVendorData(string strVendorID)
        {
            var result = PurchaseDAL.GetVendorByID(strVendorID);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetBuyerName(string strBuyerID)
        {
            var list = PurchaseDAL.GetBuyerByID(strBuyerID);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        //返回明細表總金額,總折扣額
        public ActionResult GetTotalAmt(string strID, int Ver, string strSeq)
        {
            var list = PurchaseDAL.GetTotalAmtByID(strID, Ver, strSeq);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        //返回其他費用總金額
        public ActionResult GetTotalAmtOther(string strID, int Ver, string strFareID)
        {
            var list = PurchaseDAL.GetTotalAmtOtherByID(strID, Ver, strFareID);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        //取最大單號
        public ActionResult GetMaxID()
        {
            var result = PurchaseDAL.GetMaxByID();
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //更新主表
        [HttpPost]
        public ActionResult AddHead(BuyHead model)
        {
            string result = PurchaseDAL.UpdateBuyHead(model);
            return Json(result);
        }

        //更新明細
        [HttpPost]
        public ActionResult AddList(BuyDetails model)
        {
            //listOrderInfo.Add(model);
            //var result = new { total = 100, rows = listOrderInfo };
            //return Json(result, JsonRequestBehavior.AllowGet);
            //因明細頁沒有ID控件,所以用此方法重新賦值
            string ID = Request["ID"] == null ? "" : Request["ID"].ToString();
            int Ver = string.IsNullOrEmpty(Request["Ver"]) ? 0 : int.Parse(Request["Ver"].ToString());
            model.ID = ID;
            model.Ver = Ver;
            string result = PurchaseDAL.UpdateBuyDetails(model);
            if (result == "")
                return Json("OK");
            else
                return Json("Error");
        }

        //更新Other Fare
        [HttpPost]
        public ActionResult AddOtherFare(BuyFare model)
        {
            //listOrderInfo.Add(model);
            //var result = new { total = 100, rows = listOrderInfo };
            //return Json(result, JsonRequestBehavior.AllowGet);
            //string OcID = Request["OcID"] == null ? "" : Request["OcID"].ToString();
            //model.OcID = OcID;
            string result = PurchaseDAL.UpdateOtherFare(model);
            if (result == "")
                return Json("OK");
            else
                return Json("Error");
        }

        public ActionResult DeleteListOtherFare(string ID, int Ver, string FareID)
        {
            string result = PurchaseDAL.DeleteOtherFareByID(ID, Ver, FareID);
            if (result == "")
                return Json("OK");
            else
                return Json("Error");
        }

        public ActionResult FindOtherFareReturnList(string ProductID)
        {
            var list = PurchaseDAL.FindOtherFareReturnList(ProductID);
            //var result = new { rows = list };
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public ActionResult FindList(string ID,string VendorID,string OrderDate1,string OrderDate2, string DepartMentID, string ProductMo, string ProductID)
        {
            var list = PurchaseDAL.FindReturnList(ID,VendorID,OrderDate1,OrderDate2,DepartMentID,ProductMo, ProductID);            
            return Json(list, JsonRequestBehavior.AllowGet);
        }


        //返回附加費編號描述(返回單行兩列)
        public ActionResult GetFareID(string strFareID)
        {
            var result = PurchaseDAL.GetOtherFareByID(strFareID);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

       


        //public ActionResult test()
        //{

        //    return View("~/Sales/Views/SalesOrder/FindItem.cshtml");
        //}

    }
}