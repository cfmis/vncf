using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using VNCF.PSS.Web.Areas.Sales.DAL;

namespace VNCF.PSS.Web.Areas.Purchase
{
    public class PurchaseController : Controller
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
    }
}