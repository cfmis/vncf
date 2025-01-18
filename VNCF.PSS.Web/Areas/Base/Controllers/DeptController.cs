using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using VNCF.PSS.Web.Areas.Base.DAL;
using VNCF.PSS.Web.Areas.Base.Models;
using VNCF.PSS.Web.Areas.Sales.DAL;
using VNCF.PSS.Web.Common;

namespace VNCF.PSS.Web.Areas.Base.Controllers
{
    public class DeptController : AdminControllerBase//: Controller
    {
        // GET: Base/Dept
        public ActionResult Index()
        {
            //ViewData存儲標簽翻譯數據
            ViewData = Factory.GenWebFormElement().getViewData("Base.Brand.Index");
            return View();
        }

        public ActionResult GetDeptReturnList(Dept model)
        {
            var list = DeptDAL.GetDeptReturnList(model);
            int rows_total = 0;
            if (list.Count > 0)
            {
                Dept item = new Dept();
                item = list[0];
                rows_total = item.rows_total;
            }
            var result = new { rows = list, total = rows_total};
                      
            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}