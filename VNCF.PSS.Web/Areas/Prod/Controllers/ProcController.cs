using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using VNCF.PSS.Web.Areas.Base.DAL;
using VNCF.PSS.Web.Areas.Prod.DAL;
using VNCF.PSS.Web.Areas.Prod.Models;

namespace VNCF.PSS.Web.Areas.Prod.Controllers
{
    public class ProcController : Controller
    {
        private ProcDAL clsProcDAL = new ProcDAL();
        // GET: Prod/Proc
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult List()
        {
            return View("Index");
        }
        public JsonResult GetWipID()
        {
            NewBaseDAL nbdal = new NewBaseDAL();
            var result = nbdal.GetLoc();
            //var result = new { rows = list };
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetWorkType()
        {
            NewBaseDAL nbdal = new NewBaseDAL();
            var result = nbdal.GetWorkType();
            //var result = new { rows = list };
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetGoodsFromPlan(string ProductMo)
        {
            //PlanDAL clsPlanDAL = new PlanDAL();
            var PlanHead = clsProcDAL.GetGoodsFromPlan(ProductMo);
            return Json(PlanHead, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetGoodsByID(string GoodsID)
        {
            NewBaseDAL nbdal = new NewBaseDAL();
            var result = nbdal.GetGoodsByID(GoodsID);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}