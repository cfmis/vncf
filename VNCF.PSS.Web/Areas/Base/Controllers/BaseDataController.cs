using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using VNCF.PSS.Web.Areas.Base.DAL;
using VNCF.PSS.Web.Common;

namespace VNCF.PSS.Web.Areas.Base.Controllers
{
    public class BaseDataController : Controller
    {
        // GET: Base/BaseData
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult GetUnit()
        {
            var result = BaseDataDAL.GetUnit();
            //var result = new { rows = list };
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        public ActionResult GetLoc()
        {
            var result = BaseDataDAL.GetLoc();
            //var result = new { rows = list };
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        public ActionResult GetDocFlag()
        {
            var result = BaseDataDAL.GetDocFlag("wh_transfer");
            //var result = new { rows = list };
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //登入語言
        string lang = AdminUserContext.Current.LoginInfo.LanguageID;
        //下拉列表框基礎信息,返回ID,Name
        public ActionResult GetBaseInfo(string strTableName)
        {            
            var result = BaseDataDAL.GetBaseInfoReturnList(lang, strTableName);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        //下拉列表框基礎信息,返回Name
        public ActionResult GetBaseInfoByName(string strTableName)
        {
            var list = BaseDataDAL.GetBaseInfoByNameReturnList(lang, strTableName);
            return Json(list);
        }
    }
}