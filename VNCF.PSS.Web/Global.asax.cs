using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace VNCF.PSS.Web
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }

        //protected void Application_BeginRequest(object sender, EventArgs e)
        //{
        //    HttpCookie cookie = HttpContext.Current.Request.Cookies["LanguageID"];
        //    string langName = "zh-tw";// "";// "zh-CN";
        //    if (cookie != null && cookie.Value != null)
        //    {
        //        string LanguageID = cookie.Value.ToString().Trim();
        //        if (LanguageID == "0")
        //            langName = "zh-tw";
        //        else if (LanguageID == "1")
        //            langName = "zh-cn";
        //        else
        //            langName = "en";
        //    }
        //    System.Threading.Thread.CurrentThread.CurrentCulture = new System.Globalization.CultureInfo(langName);
        //    System.Threading.Thread.CurrentThread.CurrentUICulture = new System.Globalization.CultureInfo(langName);
        //}

    }
}
