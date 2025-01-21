using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using VNCF.Base.Contract;
using VNCF.Base.DAL;
using VNCF.PSS.Web.Areas.Prod.DAL;
using VNCF.PSS.Web.Areas.Base.DAL;
using VNCF.PSS.Web.Areas.Base.Models;
using VNCF.PSS.Web.Common;

namespace VNCF.PSS.Web.Areas.Prod.Controllers
{
    public class BomFindController : Controller
    {
        private BomDAL clsBomDAL = new BomDAL();
        // GET: Prod/BomFind
        public ActionResult Index()
        {
            return View();
        }

        //返回貨品編碼基本資料數據
        public JsonResult Query(ModelItemQuery SearchAry)
        {
            var result = CommonDAL.ItemQueryList(SearchAry);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetBomStructure(string BomId)
        {
            var loginInfo = AdminUserContext.Current.LoginInfo;
            string language_id = loginInfo != null ? AdminUserContext.Current.LoginInfo.LanguageID : "0";
            var result = clsBomDAL.GetBomList(BomId);
            return Json(result, JsonRequestBehavior.AllowGet); 
        }
        public JsonResult GetBomMostly(string BomId)
        {
            var result = clsBomDAL.GetBomMostlyList(BomId);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetBomDetails(string BomId)
        {           
            var result = clsBomDAL.GetBomDetailList(BomId);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        public JsonResult SearchGoods(Goods searchParams)
        {
            NewBaseDAL nbd = new NewBaseDAL();
            //var goodsList = BaseDataDAL.GetGoods("");
            var goodsList = nbd.SearchGoods(searchParams);
            return Json(goodsList, JsonRequestBehavior.AllowGet);
        }
    }
}