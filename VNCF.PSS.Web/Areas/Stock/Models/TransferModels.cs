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
    }
    public class TransferDetails : StockModelBase
    {

        //public string ID { get; set; }
        public float TransferQty { get; set; }
        public float TransferWeg { get; set; }
        public string QtyUnitID { get; set; }
        public string WegUnitID { get; set; }
        public string LocID { get; set; }
        public string LotNo { get; set; }
        public string ProductMo { get; set; }
    }
}