using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using CF.Framework.Contract;

namespace VNCF.PSS.Web.Areas.Stock.Models
{
    public class TransferModels
    {
    }

    public class TransferHead : StockModelBase
    {

        //public string ID { get; set; }
        public string TransferDate { get; set; }

        [Required(ErrorMessage = "请选择")]
        public string FlagID { get; set; }
        public string DepID { get; set; }
        public string LocID { get; set; }
        public string NextLocID { get; set; }
    }
    public class TransferDetails :TransferHead//: StockModelBase
    {

        //public string ID { get; set; }
        public string Seq { get; set; }
        public string GoodsID { get; set; }
        public decimal TransferQty { get; set; }
        public decimal TransferWeg { get; set; }
        public string QtyUnit { get; set; }
        public string WegUnit { get; set; }
        //public string LocID { get; set; }
        public string LotNo { get; set; }
        public string ProductMo { get; set; }
        public string GoodsName { get; set; }
        //public string NextLocID { get; set; }
        //public string FlagID { get; set; }
    }
}