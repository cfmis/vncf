using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using VNCF.PSS.Web.Areas.Base.DAL;
using VNCF.PSS.Web.Common;

namespace VNCF.PSS.Web.Areas.Base.Controllers
{
    public class BaseDataController  : AdminControllerBase//: Controller//
    {
        // GET: Base/BaseData
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult GetUnit(string kind)
        {
            var result = BaseDataDAL.GetUnit(kind);
            //var result = new { rows = list };
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult GetLoc()
        {
            var result = BaseDataDAL.GetLoc();
            //var result = new { rows = list };
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult GetDocFlag(string DocType)
        {
            var result = BaseDataDAL.GetDocFlag(DocType);
            //var result = new { rows = list };
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetWipID()
        {
            NewBaseDAL nbdal = new NewBaseDAL();
            var result = nbdal.GetLoc();
            //var result = new { rows = list };
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        //下拉列表框基礎信息,返回ID,Name
        public ActionResult GetBaseInfo(string strTableName)
        {            
            var result = BaseDataDAL.GetBaseInfoReturnList(strTableName);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        //下拉列表框基礎信息,返回Name
        public ActionResult GetBaseInfoByName(string strTableName)
        {
            var lst = BaseDataDAL.GetBaseInfoByNameReturnList(strTableName);
            //return Json(lst);//2021/09/21 cancal
            return Json(lst, JsonRequestBehavior.AllowGet);
        }
                
        public ActionResult GetGoodsInfo(string GoodsID)
        {
            var result = BaseDataDAL.GetGoodsByID(GoodsID);
            //var result = new { rows = list };
            return Json(result.ProductCdesc, JsonRequestBehavior.AllowGet);
        }

        //獲取系統信息
        public ActionResult GetSystemMessage(string ID)
        {
            var result = BaseDataDAL.GetSystemMessage(ID);
            //var result = new { rows = list };
            return Json(result, JsonRequestBehavior.AllowGet);
        }


        //返回當前服務器日期,時間
        public ActionResult GetDBDate()
        {
            var list = BaseDataDAL.GetCurrentDateList();
            return Json(list, JsonRequestBehavior.AllowGet);
        }


        public ActionResult LoadFormLanguage(string WebFormName)
        {
            var result = BaseDataDAL.LoadFormLanguage(WebFormName);
            var json=Json(result, JsonRequestBehavior.AllowGet);
            //var result = new { rows = list };
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetPermissions(string AuthorityID)
        {
            var PermissionList = BaseDataDAL.GetPermission(AuthorityID);
            return Json(PermissionList, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetBasePermission(string TableName)
        {
            var lst = BaseDataDAL.GetBasePermissionList(TableName);
            return Json(lst, JsonRequestBehavior.AllowGet);
        }
        
    }
}