using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using VNCF.PSS.Web.Areas.Base.DAL;
using VNCF.PSS.Web.Areas.Base.Models;
using VNCF.PSS.Web.Areas.Sales.DAL;

namespace VNCF.PSS.Web.Areas.Base.Controllers
{
    public class VendorController : Controller
    {
        // GET: Base/Vendor
        public ActionResult Index()
        {
            //ViewData存儲標簽翻譯數據
            ViewData = Factory.GenWebFormElement().getViewData("Base.Vendor.Index");
            return View();
        }

        
        public ActionResult GetVendorReturnList(Vendor model)
        {
            var list = DeptDAL.GetVendorReturnList(model);
            int rows_total = 0;
            if (list.Count > 0)
            {
                Vendor item = new Vendor();
                item = list[0];//取出list中第一筆記錄即可,目的是取到總記錄數
                rows_total = item.rows_total;
            }
            var result = new { rows = list, total = rows_total };

            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}