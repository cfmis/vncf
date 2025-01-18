using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using VNCF.PSS.Web.Areas.Prod.DAL;
using VNCF.PSS.Web.Common;

namespace VNCF.PSS.Web.Areas.Prod.Controllers
{
    public class OrderDGController : AdminControllerBase//Controller
    {
        private QueryDG clsQueryDG = new QueryDG();
        // GET: Prod/OrderDG
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult LoadOcData(string mo_id,string goods_id,string brand_id,string top_rec)
        {
            var PlanDetails = clsQueryDG.GetOrderData(mo_id, goods_id, brand_id, top_rec);
            return Json(PlanDetails, JsonRequestBehavior.AllowGet);
        }
        public JsonResult LoadOcDataPart(string ID,string Ver, string sequence_id)
        {
            var PlanDetailsPart = clsQueryDG.GetOrderDataPart(ID, Ver, sequence_id);
            return Json(PlanDetailsPart, JsonRequestBehavior.AllowGet);
        }
    }
}