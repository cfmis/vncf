using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using VNCF.PSS.Web.Common;
using VNCF.PSS.Web.Areas.Base.Models;

namespace VNCF.PSS.Web.Areas.Base.Controllers
{
    public class DepController : AdminControllerBase//: Controller
    {
        // GET: Base/Dep
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Info()
        {
            return View();
        }
        [HttpPost]
        public JsonResult List(DepInfo filter)
        {
            List<DepInfo> list = new List<DepInfo>();
            for (int i = 0; i < 100; i++)
            {
                list.Add(new DepInfo
                {
                    ID = 1,
                    ChannelCode = "Dep" + i,
                    ChannelStyle = "部門代號" + i,
                    CnName = "中文描述" + i,
                    EnName = "E-Decription" + i,
                    Status = "1"
                });
            }
            if (!string.IsNullOrEmpty(filter.ChannelCode))
            {
                list = list.Where(x => x.ChannelCode == filter.ChannelCode.Trim()).ToList();
            }
            if (!string.IsNullOrEmpty(filter.CnName))
            {
                list = list.Where(x => x.CnName == filter.CnName.Trim()).ToList();
            }
            if (!string.IsNullOrEmpty(filter.EnName))
            {
                list = list.Where(x => x.EnName == filter.EnName.Trim()).ToList();
            }

            //构造成Json的格式传递
            var result = new { iTotalRecords = 1100, iTotalDisplayRecords = 10, data = list };
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        public ActionResult AddDep()
        {
            return View();
        }
    }
}