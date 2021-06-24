using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace VNCF.PSS.Web
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }

            //name: "Default",
            //url: "{controller}/{action}/{id}",
            //defaults: new {controller = "Goods", action = "Index", id = UrlParameter.Optional }
            //namespaces: new[] { "MvcApplication1.Controllers" }

            ////defaults: new { controller = "/Areas/Base/Goods", action = "Index", id = UrlParameter.Optional },
            ////namespaces: new[] { "MvcApplication1.Controllers" }
            //name: "Default",
            //url: "{controller}/{action}/{id}",
            //defaults:  new {Area="Base", controller = "Goods", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
