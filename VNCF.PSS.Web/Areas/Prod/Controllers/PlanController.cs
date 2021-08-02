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
    public class PlanController : Controller
    {
        private PlanDAL clsPlanDAL = new PlanDAL();
        // GET: Prod/Plan
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult List()
        {
            return View("Index");
        }
        public JsonResult GetOrderByMo(string ProductMo)
        {
            //PlanDAL clsPlanDAL = new PlanDAL();
            var PlanHead = clsPlanDAL.GetPlanFromOrderByMo(ProductMo);
            return Json(PlanHead, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetGoodsByID(string GoodsID)
        {
            NewBaseDAL nbdal = new NewBaseDAL();
            var GoodsList = nbdal.GetGoodsByID(GoodsID);
            return Json(GoodsList, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetWipID()
        {
            NewBaseDAL nbdal = new NewBaseDAL();
            var result = nbdal.GetLoc();
            //var result = new { rows = list };
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult SavePlan(PlanHead PlanHead,List<PlanDetails> PlanDetails)
        {
            //PlanDAL clsPlanDAL = new PlanDAL();
            var result = clsPlanDAL.UpdatePlan(PlanHead, PlanDetails);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetPlanHeadByMo(string ProductMo)
        {
            //PlanDAL clsPlanDAL = new PlanDAL();
            var PlanHead = clsPlanDAL.GetPlanHeadByMo(ProductMo);
            return Json(PlanHead, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetPlanDetailsByMo(string ProductMo)
        {
            //PlanDAL clsPlanDAL = new PlanDAL();
            var PlanDetails = clsPlanDAL.GetPlanDetailsByMo(ProductMo);
            return Json(PlanDetails, JsonRequestBehavior.AllowGet);
        }
        //
    }
}