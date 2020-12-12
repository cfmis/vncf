using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VNCF.PSS.Web.Areas.Account.DAL
{
    public class Factory
    {
        public static GenAdminiMenu GenAdminiMenu()
        {
            return new GenAdminiMenu();
        }
    }
}