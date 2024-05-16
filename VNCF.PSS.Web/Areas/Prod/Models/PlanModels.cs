using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace VNCF.PSS.Web.Areas.Prod.Models
{
    public class PlanModels : PlanModelBase
    {
        //public string ID { get; set; }
        public string PlanDate { get; set; }

        [Required(ErrorMessage = "请选择")]
        public string OrderDate { get; set; }
        public decimal OrderQty { get; set; }
        public string OrderUnit { get; set; }
        public string CustomerID { get; set; }
        public string RequestDate { get; set; }
        public string DeliveryDate { get; set; }
        public string ProductRemark { get; set; }
        public string MoRemark { get; set; }
        public string PlanRemark { get; set; }
        public string Seq { get; set; }
        public string GoodsIDDetails { get; set; }
        public string GoodsCnameDetails { get; set; }
        public decimal RequestDepQty { get; set; }
        public string RequestDepDate { get; set; }
        public string WipID { get; set; }
        public string NextWipID { get; set; }
        public string WipIDName { get; set; }
        public string NextWipIDName { get; set; }
        public string DepGoodsID { get; set; }
        public string DepGoodsCname { get; set; }
        public string DepGoodsEname { get; set; }
        public string BarCode { get; set; }

    }
    public class PlanHead : PlanModelBase
    {

        //public string ID { get; set; }
        public string PlanDate { get; set; }

        [Required(ErrorMessage = "请选择")]
        public string OrderDate { get; set; }
        public decimal OrderQty { get; set; }
        public string OrderUnit { get; set; }
        public string CustomerID { get; set; }
        public string RequestDate { get; set; }
        public string DeliveryDate { get; set; }
        public string ProductRemark { get; set; }
        public string MoRemark { get; set; }
        public string PlanRemark { get; set; }
    }
    public class PlanDetails : PlanModelBase
    {
        public string Seq { get; set; }
        public decimal RequestQty { get; set; }
        public string RequestDate { get; set; }
        public string WipID { get; set; }
        public string NextWipID { get; set; }
        
    }
}