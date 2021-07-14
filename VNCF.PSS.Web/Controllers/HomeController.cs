using CF.Framework.Web;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace VNCF.PSS.Web.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return RedirectToAction("Index", "Auth", new { Area = "Account" });
            //return RedirectToAction("List", "Goods", new { Area = "Base" });
            //return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        //[AuthorizeIgnore]
        public ActionResult Top()
        {
            return View();
        }
    }
}