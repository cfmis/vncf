using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using VNCF.PSS.Web.Areas.Base.Models;
using VNCF.PSS.Web.Common;
using VNCF.PSS.Web.Areas.Base.DAL;

namespace VNCF.PSS.Web.Areas.Base.Controllers
{
    public class SizeController : Controller
    {
        // GET: Base/Size
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult SearchSize(string size_id,string size_name, string size_vname)
        {
            NewBaseDAL nbd = new NewBaseDAL();
            //var goodsList = BaseDataDAL.GetGoods("");
            var sizeList = nbd.SearchSize(size_id,size_name,size_vname);
            return Json(sizeList, JsonRequestBehavior.AllowGet);
        }
    }
}