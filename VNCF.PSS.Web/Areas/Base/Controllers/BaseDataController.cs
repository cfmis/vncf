using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using VNCF.PSS.Web.Areas.Base.DAL;
using VNCF.PSS.Web.Common;

namespace VNCF.PSS.Web.Areas.Base.Controllers
{
    public class BaseDataController : AdminControllerBase
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

        //下拉列表框基礎信息,返回ID,Name
        public ActionResult GetBaseInfo(string strTableName)
        {            
            var result = BaseDataDAL.GetBaseInfoReturnList(strTableName);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        //下拉列表框基礎信息,返回Name
        public ActionResult GetBaseInfoByName(string strTableName)
        {
            var list = BaseDataDAL.GetBaseInfoByNameReturnList(strTableName);
            return Json(list);
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
    }
}