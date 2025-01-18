using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using VNCF.PSS.Web.Areas.Prod.DAL;
using VNCF.PSS.Web.Common;

namespace VNCF.PSS.Web.Areas.Prod.Controllers
{
    public class ProcDGController : AdminControllerBase//Controller
    {
        private QueryDG clsQueryDG = new QueryDG();
        // GET: Prod/ProcDG
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult LoadWipData(string mo_id)
        {
            var PlanDetails = clsQueryDG.GetPlanDetailsByMo(mo_id);
            return Json(PlanDetails, JsonRequestBehavior.AllowGet);
        }
        public JsonResult LoadWipDataPart(string ID,string sequence_id)
        {
            var PlanDetailsPart = clsQueryDG.GetPlanDetailsByMoPart(ID, sequence_id);
            return Json(PlanDetailsPart, JsonRequestBehavior.AllowGet);
        }
    }
}