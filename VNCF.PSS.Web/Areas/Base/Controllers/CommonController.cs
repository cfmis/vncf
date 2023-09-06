using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using VNCF.PSS.Web.Common;
using VNCF.Base.DAL;


namespace VNCF.PSS.Web.Areas.Base.Controllers
{
    public class CommonController : Controller
    {
        //密碼確認
        public ActionResult PasswordConfirm(string user_id)
        {
            ViewData["user_id"] = user_id;
            return View();
        }

        //檢查當前用戶模塊某按鈕的權限  
        /// <summary>
        /// 
        /// </summary>
        /// <param name="user_id"></param>
        /// <param name="menu_id">菜單功能模塊ID</param>
        /// <param name="func_name">按鈕功能等</param>
        /// <returns></returns>
        
        public JsonResult CheckAuthority(string user_id, string menu_id,string func_name)
        {
            var result = CommonDAL.CheckAuthority(user_id, menu_id, func_name);
            return Json(result, JsonRequestBehavior.AllowGet);
        }



        //public JsonResult GetUserName(string user_id)
        //{
        //    var result = CommonDAL.GetUserName(user_id);
        //    return Json(result, JsonRequestBehavior.AllowGet);
        //}

        //public JsonResult GetUserInfo(string user_id, string password)
        //{
        //    var result = CommonDAL.GetUserInfo(user_id, password);
        //    return Json(result, JsonRequestBehavior.AllowGet);
        //}
    }
}