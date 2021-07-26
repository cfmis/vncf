using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace VNCF.PSS.Web.Areas.Prod.Models
{
    public class PlanModelBase
    {
        public PlanModelBase()
        {
            CreateTime = DateTime.Now;
            AmendTime = DateTime.Now;
        }

 
        public virtual string ProductMo { get; set; }
        public virtual int Ver { get; set; }
        public virtual string CreateUser { get; set; }
        public virtual DateTime CreateTime { get; set; }
        public virtual string AmendUser { get; set; }
        public virtual DateTime AmendTime { get; set; }
        public virtual DateTime ApprovedDate { get; set; }
        public virtual string ApprovedUser { get; set; }
    }
}