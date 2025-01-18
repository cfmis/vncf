using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VNCF.PSS.Web.Areas.Prod.Models
{
    public class BomModel
    {
        public string goods_id { get; set; }
        public string goods_name { get; set; }
        public string unit_code { get; set; }
        public string do_color { get; set; }
        public string plate_effect { get; set; }
        public string color_effect { get; set; }
        public string remark { get; set; }
    }

    public class ModelBomQuery
    {        
        public string id { get; set; }
        public string parent_id { get; set; }
        public string goods_id { get; set; }
        public string goods_name { get; set; }
        public string goods_name_en { get; set; }
        public string goods_name_vn { get; set; }
    }

    public class BomHead: BomModel
    {        
        public string id { get; set; }        
        public string state { get; set; }
        public string dept_id { get; set; }
        public string spec { get; set; }        
        public string create_by { get; set; }
        public string create_date { get; set; }
        public string update_by { get; set; }
        public string update_date { get; set; }
        public string check_by { get; set; }
        public string check_date { get; set; }
        public string sanction_by { get; set; }
        public string sanction_date { get; set; }
        public string update_count { get; set; }
    }
    public class BomDetail: BomModel
    {
        public string process { get; set; }       
        public string goods_name_vn { get; set; }
        public decimal dosage { get; set; }
        public decimal base_qty { get; set; }  
        public string goods_bom { get; set; }
        public decimal bom_nwt { get; set; }
    }

   
}