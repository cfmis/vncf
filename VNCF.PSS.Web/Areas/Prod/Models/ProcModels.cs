using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VNCF.PSS.Web.Areas.Prod.Models
{
    public class ProcModels
    {
        public int ID { get; set; }
        public int EditFlag { get; set; }
        public string PrdDep { get; set; }
        public string ProductMo { get; set; }
        public string PrdDate { get; set; }
        public string GoodsID { get; set; }
        public string GoodsCname { get; set; }
        public int PrdQty { get; set; }
        public float PrdWeg { get; set; }
        public int StartRunQty { get; set; }
        public int EndRunQty { get; set; }
        public int RunQty { get; set; }
        public string MachineID { get; set; }
        public string WorkType { get; set; }
        public string WorkerID { get; set; }
        public string PrdClass { get; set; }
        public string PrdGroup { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public float WorkHours { get; set; }
        public float OtHours { get; set; }
        public int LineNum { get; set; }
        public int HourRunNum { get; set; }
        public int HourStdQty { get; set; }
        public string RequestTime { get; set; }
        public int PerKgPcs { get; set; }
        public string QcFlag { get; set; }
        public string MatGoodsID { get; set; }
        public string MatGoodsLot { get; set; }
        public string NextDepID { get; set; }
        public string DifficultyLevel { get; set; }
        public string WorkCode { get; set; }
        public string JobType { get; set; }
        public string CreateUser { get; set; }
        public string CreateTime { get; set; }
        public string AmendUser { get; set; }
        public string AmendTime { get; set; }
    }
}