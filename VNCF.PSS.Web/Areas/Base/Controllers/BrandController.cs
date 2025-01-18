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
    public class BrandController : Controller
    {
        // GET: Base/Brand
        public ActionResult Index()
        {
            //ViewData存儲標簽翻譯數據
            //頁面標簽翻譯與牌子共用
            ViewData = Factory.GenWebFormElement().getViewData("Base.Brand.Index");
            return View();
        }

        [HttpPost]
        //public ActionResult GetDeptReturnList(Brand model)
        public ActionResult GetBrandtReturnList(Brand model)
        {
            //int pageindex = int.Parse(Request.Form["page"].ToString());
            //int pagesize = int.Parse(Request.Form["rows"].ToString());
            
            var list = DeptDAL.GetBrandReturnList(model);
            //var oBrand = list.Where(t => t.row_number >= pageindex && t.row_number <= pagesize).ToList();
            //var result = new { rows = list, total = list.Count };
            //return Json(result, JsonRequestBehavior.AllowGet);            
            //构造成Json的格式传递
            //var result = new { iTotalRecords = list.Count, iTotalDisplayRecords = 10, data = list };
            //var result = new { total = list.Count, rows = 10, data = list };
            int rows_total = 0;
            if (list.Count > 0)
            {
                Brand item = new Brand();
                item = list[0];
                rows_total = item.rows_total;
            }            
            var result = new { total = rows_total, rows = list };

            return Json(result, JsonRequestBehavior.AllowGet);

        }

    }    
}