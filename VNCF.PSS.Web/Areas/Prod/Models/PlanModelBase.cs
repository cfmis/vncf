using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using VNCF.PSS.Web.Common;

namespace VNCF.PSS.Web.Areas.Prod.Models
{
    public class PlanModelBase
    {
        public PlanModelBase()
        {
            CreateTime = DBUtility.ConvertDateTimeFormat(DateTime.Now);
            AmendTime = DBUtility.ConvertDateTimeFormat(DateTime.Now);
        }

 
        public virtual string ProductMo { get; set; }
        public virtual int Ver { get; set; }
        public virtual string CreateUser { get; set; }
        public virtual string GoodsID { get; set; }
        public virtual string GoodsCname { get; set; }
        public virtual string CreateTime { get; set; }
        public virtual string AmendUser { get; set; }
        public virtual string AmendTime { get; set; }
        public virtual string ApprovedDate { get; set; }
        public virtual string ApprovedUser { get; set; }
        public virtual int EditFlag { get; set; }
        public virtual string ArtImageUrl { get; set; }
    }
}