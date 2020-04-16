using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VNCF.PSS.Web.Areas.Sales.DAL
{
    public class Factory
    {
        public static GenWebFormElement GenWebFormElement()
        {
            return new GenWebFormElement();
        }
    }
}