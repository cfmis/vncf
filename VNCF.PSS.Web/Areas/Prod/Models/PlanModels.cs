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
        public string State { get; set; }
    }
    public class PlanDetails : PlanModelBase
    {
        public string ID { get; set; }
        public string flag { get; set; }
        public string Seq { get; set; }
        public decimal RequestQty { get; set; }
        public string RequestDate { get; set; }
        public string WipID { get; set; }
        public string WipDesc { get; set; }
        public string NextWipID { get; set; }
        public string NextWipDesc { get; set; }
        public decimal CompletedQty { get; set; }
        public string CompletedDate { get; set; }
        public string do_color { get; set; }

    }
    public class OcDetaFind : OcModelBase
    {
        public string OcID { get; set; }
        public string OrderDate { get; set; }
        public string CustomerID { get; set; }
    }

    public class OrderDataDg
    {
        public string ID { get; set; }
        public int Ver { get; set; }
        public string order_date { get; set; }
        public string it_customer { get; set; }
        public string mo_id { get; set; }
        public string sequence_id { get; set; }
        public string goods_id { get; set; }
        public string goods_cname { get; set; }
        public string brand_id { get; set; }
        public string do_color { get; set; }
        public string part_flag { get; set; }
    }



}