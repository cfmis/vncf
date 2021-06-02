using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using VNCF.PSS.Web.Areas.Purchase.DAL;
using VNCF.PSS.Web.Areas.Sales.DAL;
using VNCF.PSS.Web.Common;

namespace VNCF.PSS.Web.Areas.Purchase
{
    public class PurchaseController : AdminControllerBase
    {
        // GET: Purchase/Purchase
        public ActionResult Index()
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

    }
}