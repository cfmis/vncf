using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace VNCF.PSS.Web.Areas.Sales.Controllers
{
    public class OCController : Controller
    {
        // GET: Sales/OC
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Create()
        {
            return View();
        }
    }
}