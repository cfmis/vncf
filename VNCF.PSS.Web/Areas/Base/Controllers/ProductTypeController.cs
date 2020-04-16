using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using VNCF.PSS.Web.Common;

namespace VNCF.PSS.Web.Areas.Base.Controllers
{
    public class ProductTypeController : AdminControllerBase//: Controller
    {
        // GET: Base/ProductType
        public ActionResult Index()
        {
            return View();
        }
    }
}