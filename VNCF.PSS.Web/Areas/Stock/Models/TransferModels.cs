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
    public class QueryTransferParas
    {
        public string IDFrom { get; set; }
        public string IDTo { get; set; }
        public string TransferDateFrom { get; set; }
        public string TransferDateTo { get; set; }
        public string LocID { get; set; }
        public string NextLocID { get; set; }
        public string GoodsIDFrom { get; set; }
        public string GoodsIDTo { get; set; }
        public string ProductMoFrom { get; set; }
        public string ProductMoTo { get; set; }
    }
    public class ViewTransfer: TransferDetails
    {
        public string FlagName { get; set; }
        public string TransferFlag { get; set; }
        public string LocIDFrom { get; set; }
        public string UseItem { get; set; }
        public string UseItemName { get; set; }
        public decimal WmQty { get; set; }
        public decimal WmWeg { get; set; }

    }
}