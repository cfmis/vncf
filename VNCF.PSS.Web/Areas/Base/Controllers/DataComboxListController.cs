using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using VNCF.Base.DAL;
using VNCF.PSS.Web.Common;

namespace VNCF.PSS.Web.Areas.Base.Controllers
{
    public class DataComboxListController : AdminControllerBase
    {
        // GET: Base/DataComboxList
        //public ActionResult Index()
        //{
        //    return View();
        //}
        public JsonResult GetComboxList(string SourceType)
        {
            var loginInfo = AdminUserContext.Current.LoginInfo;
            string language_id = loginInfo != null ? AdminUserContext.Current.LoginInfo.LanguageID : "0";
            var result = DataComboxList.GetComboxList(SourceType, language_id);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
       
    }
}