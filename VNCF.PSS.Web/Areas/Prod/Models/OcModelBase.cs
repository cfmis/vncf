using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using VNCF.PSS.Web.Common;

namespace VNCF.PSS.Web.Areas.Prod.Models
{
    public class OcModelBase
    {
        public OcModelBase()
        {
            CreateTime = DBUtility.ConvertDateTimeFormat(DateTime.Now);
            AmendTime = DBUtility.ConvertDateTimeFormat(DateTime.Now);
        }

        public virtual string Seq { get; set; }
        public virtual string ProductMo { get; set; }
        public virtual string ProductID { get; set; }
        public virtual string ProductCdesc { get; set; }
        public virtual string ProductVdesc { get; set; }
        public virtual int OrderQty { get; set; }
        public virtual string OrderUnit { get; set; }
        public virtual string CustProductID { get; set; }
        public virtual string PlanCompleteDate { get; set; }
        public virtual string ArriveDate { get; set; }
        public virtual string Remarks { get; set; }
        public virtual string ProductRemark { get; set; }
        public virtual string CreateTime { get; set; }
        public virtual string AmendTime { get; set; }

    }
    
}