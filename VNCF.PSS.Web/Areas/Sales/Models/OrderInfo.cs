using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace VNCF.PSS.Web.Areas.Sales.Models
{
    public class OrderHead
    {
        [Required]
        public string OcID { get; set; }
        public int Ver { get; set; }
        public string OrderDate { get; set; }

        [Required(ErrorMessage = "请选择")]
        public string CustomerID { get; set; }
    }
    public class OrderDetails
    {
        public string OcID { get; set; }
        public string Seq { get; set; }
        public string ProductMo { get; set; }
        public string Status { get; set; }
        public string ProductID { get; set; }
        public string ProductDescription { get; set; }
        public int OrderQty { get; set; }
        public string OrderUnit { get; set; }
        public decimal Price { get; set; }
        public string PriceUnit { get; set; }
        public float Amount { get; set; }
        public float DiscountRate { get; set; }
        public float Discount { get; set; }
        public float AmountAfterDiscount { get; set; }
    }
}