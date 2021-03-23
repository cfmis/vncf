using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using VNCF.PSS.Web.Areas.Base.DAL;

namespace VNCF.PSS.Web.Areas.Base.Controllers
{
    public class BaseDataController : Controller
    {
        // GET: Base/BaseData
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult GetUnit()
        {
            var result = BaseDataDAL.GetUnit();
            //var result = new { rows = list };
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        public ActionResult GetLoc()
        {
            var result = BaseDataDAL.GetLoc();
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