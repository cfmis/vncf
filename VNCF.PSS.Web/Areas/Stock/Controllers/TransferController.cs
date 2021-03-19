using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using VNCF.PSS.Web.Common;
using VNCF.PSS.Web.Areas.Base.DAL;

namespace VNCF.PSS.Web.Areas.Stock.Controllers
{
    public class TransferController : AdminControllerBase//Controller
    {
        // GET: Stock/Transfer
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Create()
        {
            return View();
        }

        public ActionResult GetUnit()
        {
            var result = BaseDataDAL.GetUnit();
            //var result = new { rows = list };
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        public ActionResult GetDocFlag()
        {
            var result = BaseDataDAL.GetDocFlag("wh_transfer");
            //var result = new { rows = list };
            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}