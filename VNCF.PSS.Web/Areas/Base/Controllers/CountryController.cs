using CF.Framework.Contract;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using VNCF.PSS.Web.Areas.Base.DAL;
using VNCF.PSS.Web.Areas.Base.Models;
using VNCF.PSS.Web.Areas.Sales.DAL;
using VNCF.PSS.Web.Common;

namespace VNCF.PSS.Web.Areas.Base.Controllers
{
    public class CountryController : Controller
    {
        // 國家代碼
        public ActionResult Index()
        {
            //ViewData存儲標簽翻譯數據
            //頁面標簽翻譯與牌子共用
            ViewData = Factory.GenWebFormElement().getViewData("Base.Brand.Index");
            return View();
        }


        //查詢
        [HttpPost]
        public ActionResult GetCountryReturnList(Country model)
        {
            var list = BaseDAL.GetCountryList(model);
            int rows_total = 0;
            if (list.Count > 0)
            {
                Country item = new Country();
                item = list[0];
                rows_total = item.rows_total;//取總的頁數
            }
            var result = new { total = rows_total, rows = list };
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //新增/修改保存
        [HttpPost]
        public ActionResult SaveRecord(Country model)
        {
            var user_id = AdminUserContext.Current.LoginInfo.LoginName;
            model.create_by = user_id;
            string result = BaseDAL.UpdateCountry(model);
            if (string.IsNullOrEmpty(result))
            {
                result = "OK";
            }
            else
            {
                result = "";
            }
            return Json(result);
        }


        [HttpPost]
        public ActionResult DelRecord(string id)
        {
            bool result = false;
            string error = "";
            if (!string.IsNullOrEmpty(id))
            {
                string del_flag = BaseDAL.DelCountry(id);
                if (string.IsNullOrEmpty(del_flag))
                {
                    result = true;
                }
                else
                {
                    result = false;
                    error = del_flag;
                }
            }
            var json = new { success = result, errorMsg = error };
            return Json(json);
        }


    }
}