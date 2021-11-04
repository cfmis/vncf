using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using VNCF.PSS.Web.Areas.Base.DAL;
using VNCF.PSS.Web.Areas.Base.Models;

namespace VNCF.PSS.Web.Areas.Base.Controllers
{
    public class RoleAuthorityPowersController : Controller
    {
        // GET: Base/RoleAuthorityPowers
        public ActionResult Index2()
        {
            return View();
        }

        public JsonResult SearchRoleAuthorityPowers(RoleAuthorityPowersModels searchParams)
        {
            NewBaseDAL nbd = new NewBaseDAL();
            var powerList = nbd.GetRoleAuthorityPowers(searchParams);
            return Json(powerList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult AddRoleAuthorityPowers(RoleAuthorityPowersModels updateParams)
        {
            NewBaseDAL nbd = new NewBaseDAL();           
            var lst = nbd.UpdateRoleAuthorityPowers(updateParams);
            return Json(lst, JsonRequestBehavior.AllowGet);
        }
        
        [HttpPost]
        public JsonResult DelRoleAuthorityPowers(int ID)
        {
            NewBaseDAL nbd = new NewBaseDAL();
            var lst = nbd.DelRoleAuthorityPowersByID(ID);
            return Json(lst, JsonRequestBehavior.AllowGet);
        }
    
        //public JsonResult GetRole()
        //{
        //    var lst = BaseDataDAL.GetRoleList();
        //    return Json(lst, JsonRequestBehavior.AllowGet);
        //}
    }
}