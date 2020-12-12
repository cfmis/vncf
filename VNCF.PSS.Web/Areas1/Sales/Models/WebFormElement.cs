using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VNCF.PSS.Web.Areas.Sales.Models
{
    public class WebFormElement
    {
    }

    public class CreateOrderIndexModel
    {
        public string OcID { get; set; }
        public string Ver { get; set; }
        public string OrderDate { get; set; }
        public string CustomerID { get; set; }
    }
}