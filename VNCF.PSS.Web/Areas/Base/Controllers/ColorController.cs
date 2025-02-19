using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using VNCF.PSS.Web.Areas.Base.DAL;

namespace VNCF.PSS.Web.Areas.Base.Controllers
{
    public class ColorController : Controller
    {
        // GET: Base/Color
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult SearchColor(string color_id, string color_name, string color_vname,string do_color)
        {
            NewBaseDAL nbd = new NewBaseDAL();
            //var goodsList = BaseDataDAL.GetGoods("");
            var colorList = nbd.SearchColor(color_id, color_name, color_vname, do_color);
            return Json(colorList, JsonRequestBehavior.AllowGet);
        }
    }
}