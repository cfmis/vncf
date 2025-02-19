using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using VNCF.PSS.Web.Areas.Base.DAL;

namespace VNCF.PSS.Web.Areas.Base.Controllers
{
    public class MatTypeController : Controller
    {
        // GET: Base/MatType
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult SearchMat(string mat_id, string mat_name, string mat_vname)
        {
            NewBaseDAL nbd = new NewBaseDAL();
            //var goodsList = BaseDataDAL.GetGoods("");
            var queryList = nbd.SearchMat(mat_id, mat_name, mat_vname);
            return Json(queryList, JsonRequestBehavior.AllowGet);
        }
    }
}