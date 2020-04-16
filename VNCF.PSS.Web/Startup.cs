using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(VNCF.PSS.Web.Startup))]
namespace VNCF.PSS.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
