using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using VNCF.PSS.Web.Areas.Base.DAL;

namespace VNCF.PSS.Web.Areas.Base.Controllers
{
    public class PrdTypeController : Controller
    {
        // GET: Base/PrdType
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult SearchPrdType(string prd_type_id, string prd_type_name, string prd_type_vname)
        {
            NewBaseDAL nbd = new NewBaseDAL();
            //var goodsList = BaseDataDAL.GetGoods("");
            var queryList = nbd.SearchPrdType(prd_type_id, prd_type_name, prd_type_vname);
            return Json(queryList, JsonRequestBehavior.AllowGet);
        }
    }
}