using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using VNCF.PSS.Web.Areas.Sales.Models;
using VNCF.PSS.Web.Areas.Sales.DAL;
using VNCF.PSS.Web.Common;

namespace VNCF.PSS.Web.Areas.Sales.Controllers
{
    public class OCController : Controller
    {
        // GET: Sales/OC
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Create()
        {
            return View();
        }
        public ActionResult GetProduct(string ProductID)
        {
            var result = OrderDAL.GetOcHeadByID(ProductID);
            //var result = new { rows = list };
            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}