using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VNCF.File.Contract
{
    public class file_upload
    {
        public string key_id { get; set; }
        public string file_name { get; set; }
        public string file_type { get; set; }
        public string file_desc { get; set; }
        public string file_desc_vn { get; set; }
        public string parent_key_id { get; set; }
        public string file_name_full_path { get; set; }
        public string create_by { get; set; }
        public string update_by { get; set; }       
        public string create_date { get; set; }
        public string update_date { get; set; }
        public string head_status { get; set; }
    }

    public class UpdateDesc
    {
        public string key_id { get; set; }       
        public string file_desc { get; set; }
        public string file_desc_vn { get; set; }
        
    }

}
